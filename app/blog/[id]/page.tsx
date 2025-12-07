import { notFound } from "next/navigation";

export const revalidate = 60; // ISR elke 60s

// 🚀 Fetch helper
async function getPost(id: string) {
  const res = await fetch(
    `https://powderblue-turtle-512586.hostingersite.com/api/v1/public-posts/${id}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

// 🚀 Build-time static generation voor ALLE bestaande blogs
export async function generateStaticParams() {
  const res = await fetch(
    "https://powderblue-turtle-512586.hostingersite.com/api/v1/public-posts",
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data.data.map((post: any) => ({
    id: post.id.toString(), // MUST BE STRING
  }));
}

// 🚀 Dynamische SEO per blog
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  // Als blog niet bestaat of content null is → veilige metadata
  if (!post || !post.content) {
    return {
      title: "Blog niet gevonden",
      description: "Deze blog bestaat niet of heeft geen inhoud.",
    };
  }

  const excerpt = post.content.slice(0, 150);

  return {
    title: post.title ?? "Blog",
    description: excerpt,

    openGraph: {
      title: post.title,
      description: excerpt,
      type: "article",
      images: post.image ? [post.image] : [],
      url: `/blog/${id}`,
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

// 🚀 De detailpagina zelf
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // NEXT 16 FIX

  const post = await getPost(id);

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-8"
        />
      )}

      <article className="prose prose-lg">{post.content}</article>
    </main>
  );
}
