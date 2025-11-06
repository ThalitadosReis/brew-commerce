import { redirect } from "next/navigation";

export default function LegacyHomepageRedirect() {
  redirect("/");
}
