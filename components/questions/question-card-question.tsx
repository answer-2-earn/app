import { questionManagerAbi } from "@/abi/question-manager";
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { rewardToBadge } from "@/lib/converters";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { QuestionMetadata } from "@/types/question-metadata";
import { Loader2Icon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { createPublicClient, formatEther, http } from "viem";
import { Button } from "../ui/button";

export function QuestionCardQuestion(props: {
  question: Question;
  questionMetadata: QuestionMetadata;
  askerProfile: Profile;
  onCancel: () => void;
}) {
  const { client, accounts, walletConnected } = useUpProvider();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const questionText = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Question"
  )?.value;
  const questionDate = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Question Date"
  )?.value;

  const rewardBadge = rewardToBadge(BigInt(props.question.reward));

  async function handleCancel() {
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

      // Cancel the question by calling the smart contract
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const { request } = await publicClient.simulateContract({
        account: accounts[0],
        address: chainConfig.contracts.questionManager,
        abi: questionManagerAbi,
        functionName: "cancel",
        args: [props.question.id],
      });
      const hash = await client.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      // Notify the user
      props.onCancel();
      toast("Question cancelled, reward sent back 👌");
    } catch (error) {
      handleError(error, "Failed to cancel the question, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <div className="flex flex-row gap-4">
      {/* Left part */}
      <div className="size-16 rounded-full overflow-hidden">
        <Image
          src={props.askerProfile.image || "/images/user.png"}
          alt={`${props.askerProfile.name}'s profile picture`}
          width={96}
          height={96}
          className="w-full h-full"
        />
      </div>
      {/* Right part */}
      <div className="flex-1 flex flex-col items-start">
        {/* Asker link */}
        <Link
          href={`https://universaleverything.io/${props.askerProfile.address}`}
          target="_blank"
        >
          <p className="text-primary font-semibold text-sm text">
            @{props.askerProfile.name}
          </p>
        </Link>
        {/* Date */}
        <p className="text-muted-foreground text-sm">
          {new Date(questionDate as string).toLocaleString()}
        </p>
        {/* Question */}
        <h4 className="text-xl font-semibold tracking-tight mt-1">
          {questionText}
        </h4>
        <div className="flex flex-row items-center gap-2 mt-2">
          {/* Reward badge */}
          <div
            className={cn(
              "flex items-center justify-center px-2 rounded-md h-full",
              rewardBadge.className
            )}
          >
            <p className="text-white font-semibold text-sm">
              {rewardBadge.emoji} {formatEther(BigInt(props.question.reward))}{" "}
              {chainConfig.chain.nativeCurrency.symbol}
            </p>
          </div>
          {/* Cancel button */}
          {props.question.processingStatus !== "AnswerValidRewardSent" &&
            accounts[0] === props.askerProfile.address && (
              <Button
                variant="outline"
                size="sm"
                disabled={isProsessing}
                onClick={handleCancel}
              >
                {isProsessing ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <TrashIcon />
                )}
                Cancel
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
