import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { QuestionMetadata } from "@/types/question-metadata";
import Image from "next/image";
import { Separator } from "../ui/separator";

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
          {/* Verified badge */}
          {props.question.processingStatus === "AnswerValidRewardSent" && (
            <div className="bg-green-100 rounded-md px-2 py-1 mt-2">
              <p className="text-sm text-green-500">✅ Verified by AI</p>
            </div>
          )}
          {/* Verification failed badge */}
          {props.question.processingStatus === "AnswerInvalid" && (
            <div className="bg-red-100 rounded-md px-2 py-1 mt-2">
              <p className="text-sm text-red-500">
                ❌ Verification by AI failed
              </p>
            </div>
          )}
          {/* Verification in progress badge */}
          {props.question.processingStatus === "None" && (
            <div className="bg-yellow-100 rounded-md px-2 py-1 mt-2">
              <p className="text-sm text-yellow-500">
                ⌛ Verification by AI in progress
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
