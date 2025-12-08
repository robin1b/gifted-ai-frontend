import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Articles from "./articles";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Author {
  id: string;
  name: string;
  email: string;
}
export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: Author;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(
    "https://powderblue-turtle-512586.hostingersite.com/api/v1/posts",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-600 text-lg mb-4">
          Kon de artikelen niet laden.
        </p>
        <form action="/api/logout" method="post">
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            className="font-semibold shadow-sm hover:opacity-90"
          >
            Log out
          </Button>
        </form>

        <Link
          href="/create"
          className="px-5 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
        >
          Maak een artikel
        </Link>
      </div>
    );
  }
  const { data } = (await res.json()) as { data: Post[] };
  return (
    <div className="pt-36 px-6">
      <form action="/api/logout" method="post">
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="
    text-red-600 
    hover:bg-red-50 
    font-semibold
    cursor-pointer
    px-3 py-1.5
    focus-visible:ring-0 
    focus-visible:outline-none
    mb-6
  "
        >
          Log out
        </Button>
        <Button
          asChild
          className="bg-blue-600 text-white hover:bg-blue-700 ml-4"
        >
          <Link href="/dashboard/create"> Nieuwe Post</Link>
        </Button>
      </form>

      <Articles posts={data} />
    </div>
  );
}
