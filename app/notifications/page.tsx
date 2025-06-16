"use client";

import { LoadingSection } from "@/components/loading-section";
import { NotificationsEnableForm } from "@/components/notifications/notifications-enable-form";
import { PageCover } from "@/components/page-cover";
import { Separator } from "@/components/ui/separator";
import { useUpProvider } from "@/hooks/use-up-provider";
import { AlignLeftIcon } from "lucide-react";

export default function NotificationsPage() {
  const { contextAccounts } = useUpProvider();

  if (contextAccounts.length === 0) {
    return <LoadingSection />;
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <PageCover
        answererAddress={contextAccounts[0]}
        actionIcon={<AlignLeftIcon />}
        actionTitle="Questions"
        actionLink="/questions"
      />
      <p className="text-xl font-semibold tracking-tight mt-8">NOTIFICATIONS</p>
      <Separator className="mt-2" />
      <p className="mt-2">
        Provide your email to receive notifications when new questions are
        posted or when an answer is verified
      </p>
      <NotificationsEnableForm
        answererAddress={contextAccounts[0]}
        className="mt-4"
      />
    </main>
  );
}
