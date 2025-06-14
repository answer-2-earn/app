import useError from "@/hooks/use-error";
import { getQuestionAnswerMetadata, getQuestionMetadata } from "@/lib/metadata";
import { getProfile } from "@/lib/profile";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { QuestionAnswerMetadata } from "@/types/question-answer-metadata";
import { QuestionMetadata } from "@/types/question-metadata";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { Skeleton } from "../ui/skeleton";
import { QuestionCardAnswer } from "./question-card-answer";
import { QuestionCardAnswerForm } from "./question-card-answer-form";
import { QuestionCardQuestion } from "./question-card-question";

export function QuestionCard(props: {
  answererProfile: Profile;
  question: Question;
  onQuestionUpdate: () => void;
}) {
  const { handleError } = useError();
  const [questionMetadata, setQuestionMetadata] = useState<
    QuestionMetadata | undefined
  >();
  const [questionAnswerMetadata, setQuestionAnswerMetadata] = useState<
    QuestionAnswerMetadata | undefined
  >();
  const [askerProfile, setAskerProfile] = useState<Profile | undefined>();

  // Load question metadata
  useEffect(() => {
    getQuestionMetadata(props.question.id)
      .then((metadata) => {
        setQuestionMetadata(metadata);
      })
      .catch((error) => {
        handleError(error, "Failed to load question metadata, try again later");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.question]);

  // Load question answer metadata
  useEffect(() => {
    getQuestionAnswerMetadata(props.question.id)
      .then((metadata) => {
        setQuestionAnswerMetadata(metadata);
      })
      .catch((error) =>
        handleError(
          error,
          "Failed to load question answer metadata, try again later"
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.question]);

  // Load asker profile
  useEffect(() => {
    const askerAddress = questionMetadata?.LSP4Metadata?.attributes?.find(
      (attr) => attr.key === "Asker"
    )?.value;
    if (askerAddress) {
      getProfile(askerAddress as Address)
        .then((profile) => setAskerProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load asker profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionMetadata]);

  if (!questionMetadata || !questionAnswerMetadata || !askerProfile) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <div className="w-full flex flex-col gap-4 border rounded-2xl p-4">
      <QuestionCardQuestion
        question={props.question}
        questionMetadata={questionMetadata}
        askerProfile={askerProfile}
        onCancel={props.onQuestionUpdate}
      />
      <QuestionCardAnswer
        answererProfile={props.answererProfile}
        question={props.question}
        questionAnswerMetadata={questionAnswerMetadata}
      />
      <QuestionCardAnswerForm
        answererProfile={props.answererProfile}
        question={props.question}
        questionMetadata={questionMetadata}
        onAnswer={props.onQuestionUpdate}
      />
    </div>
  );
}
