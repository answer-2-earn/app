import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ClassValue } from "clsx";
import { BellIcon, Loader2Icon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function NotificationsEnableForm(props: {
  answererAddress: `0x${string}`;
  className?: ClassValue;
}) {
  const posthog = usePostHog();
  const { accounts, walletConnected } = useUpProvider();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);

      // Check if the user is connected the wallet
      if (!accounts[0] || !walletConnected) {
        toast.warning("Please connect your wallet first");
        return;
      }

      // Send the subscription request to the server
      await axios.post("/api/subscription", {
        answererAddress: props.answererAddress,
        subscriberAddress: accounts[0],
        subscriberEmail: values.email,
      });

      // Capture the event in PostHog
      posthog.capture("notifications_enabled", {
        answererAddress: props.answererAddress,
        subscriberAddress: accounts[0],
      });

      // Reset the form and call the onAsk callback
      form.reset();
      toast("Notifications enabled 🎉");
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-4", props.className)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="alice@example.com"
                  disabled={isProsessing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" disabled={isProsessing}>
          {isProsessing ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <BellIcon />
          )}
          Enable notifications
        </Button>
      </form>
    </Form>
  );
}
