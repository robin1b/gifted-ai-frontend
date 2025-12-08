import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// DELETE /api/posts/[id]
export async function POST(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Niet ingelogd" }, { status: 401 });
  }

  const formData = await req.formData();
  const method = formData.get("_method");

  // 🧨 CHECK: is dit een DELETE?
  if (method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  // stuur DELETE naar backend
  const backendRes = await fetch(
    `https://powderblue-turtle-512586.hostingersite.com/api/v1/posts/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const data = await backendRes.json();

  // na success → redirect naar dashboard
  if (backendRes.ok) {
    return NextResponse.redirect("http://localhost:3000/dashboard");
  }

  return NextResponse.json(data, { status: backendRes.status });
}
