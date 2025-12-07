import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Articles from "./articles";
import Link from "next/link";

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
      <Articles posts={data} />
    </div>
  );
}
