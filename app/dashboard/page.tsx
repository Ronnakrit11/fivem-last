import { auth } from "@/lib/auth";
import DashboardClientPage from "./dashboard-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClientPage session={session} />
    </Suspense>
  );
}
