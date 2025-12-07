import Image from "next/image";

export const revalidate = 60; // 5 min caching (ISR)

async function getPublicPosts() {
  const res = await fetch(
    "https://powderblue-turtle-512586.hostingersite.com/api/v1/public-posts",
    {
      next: { revalidate: 60 }, // dubbele veiligheid voor caching
    }
  );

  if (!res.ok) {
    throw new Error("Kon publieke posts niet ophalen");
  }

  const data = await res.json();
  return data;
}

export default async function BlogPage() {
  const posts = await getPublicPosts();

  return (
    <div className="max-w-5xl mx-auto py-36 px-4">
      <h1 className="text-4xl font-bold mb-10"> Publieke Blogposts</h1>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.data.map((post: any) => (
          <article
            key={post.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
          >
            {/* IMAGE */}
            {post.image ? (
              <div className="relative w-full h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                Geen afbeelding
              </div>
            )}

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 line-clamp-3">{post.content}</p>

              <a
                href={`/blog/${post.id}`}
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                Lees meer →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
