import { questionManagerAbi } from "@/abi/question-manager";
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { getEncodedMetadataValue } from "@/lib/metadata";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { QuestionAnswerMetadata } from "@/types/question-answer-metadata";
import { QuestionMetadata } from "@/types/question-metadata";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPublicClient, http } from "viem";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export function QuestionCardAnswerForm(props: {
  answererProfile: Profile;
  question: Question;
  questionMetadata: QuestionMetadata;
  onAnswer: () => void;
}) {
  const posthog = usePostHog();
  const { client, accounts, walletConnected } = useUpProvider();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    answer: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);

      // Check if the user is connected the wallet and the network is correct
      if (!client || !walletConnected) {
        toast.warning("Please connect your wallet first");
        return;
      }
      if (client.chain?.id !== chainConfig.chain.id) {
        toast.warning(
          `Please switch to ${chainConfig.chain.name} network first`
        );
        return;
      }

      // Create metadata
      const metadata: QuestionAnswerMetadata = {
        answer: values.answer,
        answerDate: new Date().getTime(),
      };

      // Upload metadata to IPFS and get the URL
      const { data } = await axios.post("/api/ipfs", {
        data: JSON.stringify(metadata),
      });
      const updatedUrl = data.data;

      // Encode metadata to get the metadata value
      const encodedUpdatedMetadataValue = getEncodedMetadataValue(
        metadata,
        updatedUrl
      );

      // Answer the question by calling the smart contract
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const { request } = await publicClient.simulateContract({
        account: accounts[0],
        address: chainConfig.contracts.questionManager,
        abi: questionManagerAbi,
        functionName: "answer",
        args: [props.question.id, encodedUpdatedMetadataValue],
      });
      const hash = await client.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      // Capture the event in PostHog
      if (posthog) {
        posthog.capture("question_answered");
      }

      // Reset the form and notify the user
      form.reset();
      props.onAnswer();
      toast("Answer posted 🎉");
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  // Don't show the form if answer is already valid and reward is sent
  if (props.question.processingStatus === "AnswerValidRewardSent") {
    return <></>;
  }

  // Don't show the form if the connected account is now the answerer
  if (accounts[0] !== props.answererProfile.address) {
    return <></>;
  }

  return (
    <div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-2 mt-4"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="My dream is..."
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" disabled={isProsessing}>
            {isProsessing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
            {props.question.processingStatus === "AnswerInvalid"
              ? "Update answer"
              : "Answer"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
