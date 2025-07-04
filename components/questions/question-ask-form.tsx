import { questionManagerAbi } from "@/abi/question-manager";
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { rewardToBadge } from "@/lib/converters";
import {
  createQuestionMetadata,
  getEncodedMetadataValue,
} from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ClassValue } from "clsx";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPublicClient, http, parseEther } from "viem";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function QuestionAskForm(props: {
  answererAddress: `0x${string}`;
  onAsk: (txHash: `0x${string}`) => void;
  className?: ClassValue;
}) {
  const posthog = usePostHog();
  const { client, accounts, walletConnected } = useUpProvider();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    question: z.string().min(1),
    reward: z.coerce.number().min(0),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      reward: 1.0,
    },
  });

  const rewardBadge = rewardToBadge(
    parseEther(form.watch("reward").toString())
  );

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
      const metadata = createQuestionMetadata(
        accounts[0],
        values.question,
        parseEther(values.reward.toString()).toString(),
        props.answererAddress
      );

      // Upload metadata to IPFS and get the URL
      const { data } = await axios.post("/api/ipfs", {
        data: JSON.stringify(metadata),
      });
      const url = data.data;

      // Encode metadata to get the metadata value
      const encodedMetadataValue = getEncodedMetadataValue(metadata, url);

      // Ask the question by calling the smart contract
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const { request } = await publicClient.simulateContract({
        account: accounts[0],
        address: chainConfig.contracts.questionManager,
        abi: questionManagerAbi,
        functionName: "ask",
        args: [props.answererAddress, encodedMetadataValue],
        value: parseEther(values.reward.toString()),
      });
      const txHash = await client.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      // Capture the event in PostHog
      if (posthog) {
        posthog.capture("question_asked");
      }

      // Reset the form and call the onAsk callback
      form.reset();
      props.onAsk(txHash);
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-4", props.className)}
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's your question?"
                  disabled={isProsessing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Reward ({chainConfig.chain.nativeCurrency.symbol}) *
              </FormLabel>
              <div className="flex flex-row gap-2 items-center">
                {/* Input */}
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.01"
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                {/* Reward badge */}
                <div
                  className={cn(
                    "h-full w-12 flex items-center justify-center bg-muted rounded-md"
                  )}
                >
                  <p className="text-xl">{rewardBadge.emoji}</p>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" disabled={isProsessing}>
          {isProsessing ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <PencilIcon />
          )}
          Ask
        </Button>
      </form>
    </Form>
  );
}
