import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingCover() {
  return (
    <div className="min-h-[80vh] container mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-4 py-4">
      <div className="w-full md:max-w-xl">
        <Image
          src="/images/cover.png"
          alt="Cover"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-xl"
        />
      </div>
      <div className="w-full md:max-w-md">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
          Answer fan questions and earn LYX rewards
        </h1>
        <p className="font-medium tracking-tight text-muted-foreground mt-2">
          A LUKSO Mini-App with AI verification
        </p>
        <div className="flex flex-row gap-2 mt-4">
          <Link
            href="https://universaleverything.io/0x4018737e0D777b3d4C72B411a3BeEC286Ec5F5eF?assetGroup=grid"
            target="_blank"
          >
            <Button>
              <ExternalLinkIcon /> Open demo profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
