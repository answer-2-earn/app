import { chainConfig } from "@/config/chain";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function PageFooter() {
  return (
    <div className="mt-8">
      <Separator />
      <p className="text-sm text-center text-muted-foreground mt-4">
        <Link href="/" target="_blank">
          <span className="text-primary">Answer 2 Earn</span>
        </Link>{" "}
        © 2025 · {chainConfig.chain.name}
      </p>
    </div>
  );
}
