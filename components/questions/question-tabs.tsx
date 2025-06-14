import { questionAbi } from "@/abi/question";
import { questionManagerAbi } from "@/abi/question-manager";
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { processingStatusToType } from "@/lib/converters";
import { getProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import EntityList from "../entity-list";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { QuestionCard } from "./question-card";

// TODO: Sort questions by value
export function QuestionsTabs(props: {
  answererAddress: `0x${string}`;
  className?: ClassValue;
}) {
  const { handleError } = useError();
  const [answererProfile, setAnswererProfile] = useState<Profile | undefined>();
  const [questions, setQuestions] = useState<Question[] | undefined>();
  const unansweredQuestions = questions?.filter(
    (question) => question.processingStatus !== "AnswerValidRewardSent"
  );
  const answeredQuestions = questions?.filter(
    (question) => question.processingStatus === "AnswerValidRewardSent"
  );

  async function loadQuestions() {
    try {
      // Load tokens
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const tokens = await publicClient.readContract({
        address: chainConfig.contracts.question,
        abi: questionAbi,
        functionName: "tokenIdsOf",
        args: [props.answererAddress],
      });

      // Load token rewards and create question array
      const questions: Question[] = [];
      for (const token of tokens) {
        const reward = await publicClient.readContract({
          address: chainConfig.contracts.questionManager,
          abi: questionManagerAbi,
          functionName: "getReward",
          args: [token],
        });
        const processingStatus = await publicClient.readContract({
          address: chainConfig.contracts.questionManager,
          abi: questionManagerAbi,
          functionName: "getProcessingStatus",
          args: [token],
        });
        questions.push({
          id: token,
          reward: reward,
          processingStatus: processingStatusToType(processingStatus),
        });
      }

      console.log("Loaded questions:", questions);

      setQuestions(questions);
    } catch (error) {
      handleError(error, "Failed to load questions, try again later");
    }
  }

  useEffect(() => {
    if (props.answererAddress) {
      getProfile(props.answererAddress)
        .then((profile) => setAnswererProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.answererAddress]);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.answererAddress]);

  if (
    !answererProfile ||
    !questions ||
    !unansweredQuestions ||
    !answeredQuestions
  ) {
    return <Skeleton className="h-8" />;
  }

  return (
    <Tabs defaultValue="all" className={cn(props.className)}>
      <TabsList>
        <TabsTrigger value="all">All ({questions.length})</TabsTrigger>
        <TabsTrigger value="unanswered">
          Unanswered ({unansweredQuestions.length})
        </TabsTrigger>
        <TabsTrigger value="answered">
          Answered ({answeredQuestions.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <EntityList<Question>
          entities={questions}
          renderEntityCard={(question, i) => (
            <QuestionCard
              key={i}
              answererProfile={answererProfile}
              question={question}
              onQuestionUpdate={() => loadQuestions()}
            />
          )}
          noEntitiesText="No questions yet..."
        />
      </TabsContent>
      <TabsContent value="unanswered">
        <EntityList<Question>
          entities={unansweredQuestions}
          renderEntityCard={(question, i) => (
            <QuestionCard
              key={i}
              answererProfile={answererProfile}
              question={question}
              onQuestionUpdate={() => loadQuestions()}
            />
          )}
          noEntitiesText="No questions yet..."
        />
      </TabsContent>
      <TabsContent value="answered">
        <EntityList<Question>
          entities={answeredQuestions}
          renderEntityCard={(question, i) => (
            <QuestionCard
              key={i}
              answererProfile={answererProfile}
              question={question}
              onQuestionUpdate={() => loadQuestions()}
            />
          )}
          noEntitiesText="No questions yet..."
        />
      </TabsContent>
    </Tabs>
  );
}
