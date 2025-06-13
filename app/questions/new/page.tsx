"use client";

import { LoadingSection } from "@/components/loading-section";
import { NotificationsEnableForm } from "@/components/notifications/notifications-enable-form";
import { PageCover } from "@/components/page-cover";
import { PageFooter } from "@/components/page-footer";
import { QuestionAskForm } from "@/components/questions/question-ask-form";
import { Separator } from "@/components/ui/separator";
import { useUpProvider } from "@/hooks/use-up-provider";
import { useState } from "react";
import Confetti from "react-confetti";

export default function AppNewQuestionPage() {
  const { contextAccounts } = useUpProvider();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  if (contextAccounts.length === 0) {
    return <LoadingSection />;
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <PageCover
        answererAddress={contextAccounts[0]}
        actionTitle="Questions"
        actionLink="/questions"
      />
      {txHash ? (
        <>
          <p className="text-xl font-semibold tracking-tight mt-8">
            QUESTION POSTED 🎉
          </p>
          <Separator className="mt-2" />
          <p className="mt-2">
            Provide your email to receive a notification when an answer is
            posted
          </p>
          <NotificationsEnableForm className="mt-4" />
          <Confetti
            width={document.body.clientWidth}
            height={document.body.scrollHeight}
            recycle={false}
          />
        </>
      ) : (
        <>
          <p className="text-xl font-semibold tracking-tight mt-8">
            NEW QUESTION
          </p>
          <Separator className="mt-2" />
          <QuestionAskForm
            answererAddress={contextAccounts[0]}
            onAsk={(txHash) => setTxHash(txHash)}
            className="mt-4"
          />
        </>
      )}
      <PageFooter />
    </main>
  );
}
