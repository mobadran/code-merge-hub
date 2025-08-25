import NewPostButton from "./new-post-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="p-4">
      <div className="flex justify-between items-center">
        <Link href={"/users/" + session?.user?.username || notFound()}>
          <Avatar>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.[0] || session?.user?.username?.[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        {session && <NewPostButton />}
      </div>
    </header>
  );
}
