import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Skeleton } from "../ui/skeleton";

// TODO: Implement
export function NotificationsEnableForm(props: { className?: ClassValue }) {
  return <Skeleton className={cn("h-8", props.className)} />;
}
