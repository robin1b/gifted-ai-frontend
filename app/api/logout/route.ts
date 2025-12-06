import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL("/", request.url);

  const response = NextResponse.redirect(url);

  // Token cookie verwijderen
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
