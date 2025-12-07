// components/HeaderWrapper.tsx
import { cookies } from "next/headers";
import { HeroHeader } from "./header"; // your client component

export default async function HeaderWrapper() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return <HeroHeader isLoggedIn={!!token} />;
}
