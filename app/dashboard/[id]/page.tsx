import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Post } from "../page";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const res = await fetch(
    `https://powderblue-turtle-512586.hostingersite.com/api/v1/posts/${id}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <p className="text-center mt-20">Artikel niet gevonden.</p>;
  }

  const post: Post = await res.json();

  return (
    <div className="max-w-3xl mx-auto pt-28 px-6 pb-20">
      {/* HEADER + DELETE BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{post.title}</h1>

        {/* DELETE BUTTON → via Next API route */}
        <form action={`/api/posts/${post.id}/delete`} method="POST">
          <button
            type="submit"
            className="
              bg-red-600 text-white px-4 py-2 rounded 
              hover:bg-red-700 transition
            "
          >
            Verwijderen
          </button>
        </form>
      </div>

      <p className="text-muted-foreground mb-8">
        Door <strong>{post.author.name}</strong> —{" "}
        {new Date(post.created_at).toLocaleDateString("nl-BE")}
      </p>

      <article className="prose prose-neutral dark:prose-invert">
        {post.content}
      </article>

      {/* EDIT BUTTON */}
      <div className="mt-10">
        <Link
          href={`/dashboard/${post.id}/edit`}
          className="
            inline-block bg-blue-600 text-white px-4 py-2 rounded
            hover:bg-blue-700 transition
          "
        >
          Bewerken
        </Link>
      </div>
    </div>
  );
}
