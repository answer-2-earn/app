"use client";

import { PageCover } from "@/components/page-cover";
import { PageFooter } from "@/components/page-footer";
import { LoadingSection } from "@/components/loading-section";
import { QuestionsTabs } from "@/components/questions/question-tabs";
import { Separator } from "@/components/ui/separator";
import { useUpProvider } from "@/hooks/use-up-provider";

export default function AppQuestionsPage() {
  const { accounts, contextAccounts } = useUpProvider();

  if (contextAccounts.length === 0) {
    return <LoadingSection />;
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <PageCover
        answererAddress={contextAccounts[0]}
        actionTitle={
          accounts[0] === contextAccounts[0] ? "Notifications" : "Ask question"
        }
        actionLink={
          accounts[0] === contextAccounts[0]
            ? "/notifications"
            : "/questions/new"
        }
      />
      <p className="text-xl font-semibold tracking-tight mt-8">QUESTIONS</p>
      <Separator className="mt-2" />
      <QuestionsTabs answererAddress={contextAccounts[0]} className="mt-4" />
      <PageFooter />
    </main>
  );
}
