import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const res = await fetch(
    "https://powderblue-turtle-512586.hostingersite.com/api/login",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  // Als Laravel een validation error stuurt (422)
  if (res.status === 422) {
    const data = await res.json();
    return NextResponse.json(
      {
        message: data.message,
        errors: data.errors,
      },
      { status: 422 }
    );
  }

  const data = await res.json();

  // Als login mislukt (401 of iets anders)
  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || "Login failed" },
      { status: res.status }
    );
  }

  // Login OK → token opslaan
  const response = NextResponse.json({
    success: true,
    user: data.user,
  });

  response.cookies.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
