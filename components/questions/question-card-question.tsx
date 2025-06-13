import { chainConfig } from "@/config/chain";
import { rewardToBadge } from "@/lib/converters";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { QuestionMetadata } from "@/types/question-metadata";
import Image from "next/image";
import Link from "next/link";
import { formatEther } from "viem";

export function QuestionCardQuestion(props: {
  question: Question;
  questionMetadata: QuestionMetadata;
  askerProfile: Profile;
}) {
  const questionText = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Question"
  )?.value;
  const questionDate = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Question Date"
  )?.value;

  const rewardBadge = rewardToBadge(BigInt(props.question.reward));

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
        {/* Reward badge */}
        <div className={cn("rounded-md px-2 py-1 mt-2", rewardBadge.className)}>
          <p className="text-white font-semibold text-sm">
            {rewardBadge.emoji} {formatEther(BigInt(props.question.reward))}{" "}
            {chainConfig.chain.nativeCurrency.symbol}
          </p>
        </div>
      </div>
    </div>
  );
}
