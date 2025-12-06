import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Articles from "./articles";

interface Author {
  id: string;
  name: string;
  email: string;
}
export interface Post {
  id: string;
  title: string;
  content: string;
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
    return <p className="text-red-600">Kon de artikelen niet laden.</p>;
  }
  const { data } = (await res.json()) as { data: Post[] };
  return (
    <div className="pt-28 px-6">
      <Articles posts={data} />
    </div>
  );
}
