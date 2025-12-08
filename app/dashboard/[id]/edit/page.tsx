import { notFound } from "next/navigation";
import EditForm from "./EditForm";
import { cookies } from "next/headers";

async function getPost(id: string) {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(
    `https://powderblue-turtle-512586.hostingersite.com/api/v1/posts/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  console.log("STATUS:", res.status);

  let json;
  try {
    json = await res.json();
  } catch (e) {
    console.log("❌ Kon JSON niet parsen");
    return null;
  }

  console.log("RAW JSON RESPONSE:", json);

  if (!res.ok) return null;

  return json; // ⬅️ DIRECTE POST — geen json.data
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getPost(id);

  if (!post) {
    console.log("❌ GEEN post gevonden → notFound()");
    return notFound();
  }

  console.log("✔ POST:", post);

  return (
    <div className="max-w-2xl mx-auto py-24 px-6">
      <h1 className="text-3xl font-bold mb-8">Artikel bewerken</h1>

      <EditForm post={post} />
    </div>
  );
}
