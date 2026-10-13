import type { Metadata } from "next";
import { ChatsView } from "@/components/app/views/ChatsView";

export const metadata: Metadata = { title: "Chats" };

export default function Page() {
  return <ChatsView />;
}
