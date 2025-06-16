import useError from "@/hooks/use-error";
import { getProfile } from "@/lib/profile";
import { Profile } from "@/types/profile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function PageCover(props: {
  answererAddress: `0x${string}`;
  actionIcon?: React.ReactNode;
  actionTitle: string;
  actionLink: string;
}) {
  const { handleError } = useError();
  const [answererProfile, setAnswererProfile] = useState<Profile | undefined>();

  useEffect(() => {
    if (props.answererAddress) {
      getProfile(props.answererAddress)
        .then((profile) => setAnswererProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load answerer profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.answererAddress]);

  if (!answererProfile) {
    return <Skeleton className="h-8" />;
  }

  return (
    <div className="bg-primary flex flex-col items-center p-8 rounded-2xl">
      <div className="size-32 rounded-full overflow-hidden">
        <Image
          src={answererProfile.image || "/images/user.png"}
          alt={`${answererProfile.name}'s profile picture`}
          width={96}
          height={96}
          className="w-full h-full"
        />
      </div>
      <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-center text-primary-foreground mt-4">
        ASK ME ANYTHING
      </h1>
      <p className="text-center text-primary-foreground mt-1">
        Higher reward → Higher visibility and motivation to answer
      </p>
      <div className="flex flex-row items-center gap-2 mt-8">
        <Link href={props.actionLink}>
          <Button variant="outline">
            {props.actionIcon}
            {props.actionTitle}
          </Button>
        </Link>
      </div>
    </div>
  );
}
