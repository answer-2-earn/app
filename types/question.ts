import { Hex } from "viem";

export type Question = {
  id: Hex;
  reward: bigint;
  processingStatus: QuestionProcessingStatus;
};

export type QuestionProcessingStatus =
  | "None"
  | "AnswerInvalid"
  | "AnswerValidRewardSent";
