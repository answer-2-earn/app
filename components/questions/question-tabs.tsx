import { questionAbi } from "@/abi/question";
import { questionManagerAbi } from "@/abi/question-manager";
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
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
import { processingStatusToType } from "@/lib/converters";

// TODO: Sort questions by value
export function QuestionsTabs(props: {
  contextAccount: `0x${string}`;
  className?: ClassValue;
}) {
  const { handleError } = useError();
  const [profile, setProfile] = useState<Profile | undefined>();
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
        args: [props.contextAccount],
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

      setQuestions(questions);
    } catch (error) {
      handleError(error, "Failed to load questions, try again later");
    }
  }

  useEffect(() => {
    if (props.contextAccount) {
      getProfile(props.contextAccount)
        .then((profile) => setProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contextAccount]);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contextAccount]);

  if (!profile || !questions || !unansweredQuestions || !answeredQuestions) {
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
              profile={profile}
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
              profile={profile}
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
              profile={profile}
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
