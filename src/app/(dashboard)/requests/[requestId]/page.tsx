import { redirect } from "next/navigation";

// Redirect bare /requests/[requestId] to the plan page
export default async function RequestRootPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  redirect(`/requests/${requestId}/plan`);
}
