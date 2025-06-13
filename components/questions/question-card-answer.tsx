import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { QuestionMetadata } from "@/types/question-metadata";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { processingStatusToBadge } from "@/lib/converters";
import { cn } from "@/lib/utils";

export function QuestionCardAnswer(props: {
  answererProfile: Profile;
  question: Question;
  questionMetadata: QuestionMetadata;
}) {
  const answerText = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Answer"
  )?.value;
  const answerDate = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Answer Date"
  )?.value;
  const processingStatusBadge = processingStatusToBadge(
    props.question.processingStatus
  );

  if (!answerText || !answerDate) {
    return <></>;
  }

  return (
    <div>
      <Separator />
      <div className="flex flex-row gap-4 mt-4">
        {/* Left part */}
        <div className="size-10 rounded-full overflow-hidden">
          <Image
            src={props.answererProfile.image || "/images/user.png"}
            alt={`${props.answererProfile.name}'s profile picture`}
            width={96}
            height={96}
            className="w-full h-full"
          />
        </div>
        {/* Right part */}
        <div className="flex-1 flex flex-col items-start">
          {/* Date */}
          <p className="text-muted-foreground text-sm">
            {new Date(answerDate as string).toLocaleString()}
          </p>
          {/* Answer */}
          <h4 className="text-xl mt-1">{answerText}</h4>
          {/* Processing status badge */}
          <div
            className={cn(
              "rounded-md px-2 py-1 mt-2",
              processingStatusBadge.divClassName
            )}
          >
            <p className={cn("text-sm", processingStatusBadge.pClassName)}>
              {processingStatusBadge.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
