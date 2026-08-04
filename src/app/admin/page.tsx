import { AdminPanel } from "@/components/admin-panel";

export default function Admin() {
  return <AdminPanel enabled={Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)} />;
}
