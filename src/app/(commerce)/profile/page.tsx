import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileClient from "@/app/(commerce)/profile/profile-client";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/profile");
  }

  return (
    <ProfileClient
      firstName={user.firstName ?? "Friend"}
      email={user.emailAddresses[0]?.emailAddress ?? ""}
      imageUrl={user.imageUrl}
    />
  );
}
