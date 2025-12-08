import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request, { params }: any) {
  console.log("DEBUG PARAMS:", params);
  return new Response(JSON.stringify(params), { status: 200 });
}
