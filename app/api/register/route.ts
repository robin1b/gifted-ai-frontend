import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password, password_confirmation } = await request.json();

  const res = await fetch(
    "https://powderblue-turtle-512586.hostingersite.com/api/register",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation,
      }),
    }
  );

  // Laravel validation error (422)
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

  // Laravel success: 204 No content
  if (res.status === 204) {
    // 🎉 Auto-login direct na registratie
    // Gebruik exact dezelfde login call als je login route

    const loginRes = await fetch(
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

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      return NextResponse.json(
        { message: "Registered but login failed." },
        { status: 500 }
      );
    }

    // Set token cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set("token", loginData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  }

  return NextResponse.json(
    { message: "Unexpected error from API." },
    { status: 500 }
  );
}
