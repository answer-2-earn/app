import { QuestionProcessingStatus } from "@/types/question";
import { AxiosError } from "axios";
import { ClassValue } from "clsx";
import { parseEther } from "viem";

export function errorToString(error: unknown): string {
  let message = JSON.stringify(error, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  if (error instanceof Error) {
    message = error.message;
  }
  if (error instanceof AxiosError) {
    message = JSON.stringify({
      status: error.response?.status,
      data: error.response?.data,
    });
  }
  return message;
}

export function rewardToBadge(reward: bigint): {
  emoji: string;
  className: ClassValue;
} {
  if (reward === BigInt(0)) {
    return { emoji: "🙏", className: "bg-blue-500" };
  } else if (reward <= parseEther("1")) {
    return { emoji: "🪙", className: "bg-purple-500" };
  } else if (reward <= parseEther("10")) {
    return { emoji: "💰", className: "bg-yellow-500" };
  } else {
    return { emoji: "💎", className: "bg-orange-500" };
  }
}

export function processingStatusToBadge(status: QuestionProcessingStatus): {
  emoji: string;
  title: string;
  divClassName: ClassValue;
  pClassName: ClassValue;
} {
  switch (status) {
    case "AnswerValidRewardSent":
      return {
        emoji: "✅",
        title: "Answer verification by AI failed, reward not sent",
        divClassName: "bg-green-100",
        pClassName: "text-green-500",
      };
    case "AnswerInvalid":
      return {
        emoji: "❌",
        title: "Verification by AI failed",
        divClassName: "bg-red-100",
        pClassName: "text-red-500",
      };
    default:
      return {
        emoji: "⌛",
        title: "Reward will be sent after the answer is verified by AI",
        divClassName: "bg-yellow-100",
        pClassName: "text-yellow-500",
      };
  }
}

export function processingStatusToType(
  status: number
): QuestionProcessingStatus {
  switch (status) {
    case 1:
      return "AnswerInvalid";
    case 2:
      return "AnswerValidRewardSent";
    default:
      return "None";
  }
}
