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

// TODO: Sort questions by value
export function QuestionsTabs(props: {
  contextAccount: `0x${string}`;
  className?: ClassValue;
}) {
  const { handleError } = useError();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [questions, setQuestions] = useState<Question[] | undefined>();

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
        const verification = await publicClient.readContract({
          address: chainConfig.contracts.questionManager,
          abi: questionManagerAbi,
          functionName: "getVerification",
          args: [token],
        });
        questions.push({
          id: token,
          reward: {
            value: reward.value,
            sent: reward.sent,
          },
          verification: {
            verified: verification.verified,
            status: verification.status,
          },
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

  if (!profile || !questions) {
    return <Skeleton className="h-8" />;
  }

  return (
    <Tabs defaultValue="all" className={cn(props.className)}>
      <TabsList>
        <TabsTrigger value="all">All ({questions.length})</TabsTrigger>
        <TabsTrigger value="unanswered">
          Unanswered (
          {questions.filter((question) => !question.reward.sent).length})
        </TabsTrigger>
        <TabsTrigger value="answered">
          Answered (
          {questions.filter((question) => question.reward.sent).length})
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
          entities={questions.filter((question) => !question.reward.sent)}
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
          entities={questions.filter((question) => question.reward.sent)}
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
