import { chainConfig } from "@/config/chain";
import { siteConfig } from "@/config/site";

export function LandingFooter() {
  return (
    <footer className="bg-background border-t py-6 md:py-0">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
        <p className="text-balance text-center md:text-left text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            kiv1n
          </a>{" "}
          © 2025 · {chainConfig.chain.name}
        </p>
      </div>
    </footer>
  );
}
