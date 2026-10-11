import { NextResponse } from "next/server";
import { authFailure, cookieOptions, guardOrigin, login, SESSION_COOKIE } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    guardOrigin(request);
    const { email, password } = await request.json();
    const session = await login(email, password);
    const response = NextResponse.json({ email: session.email }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, session.token, cookieOptions);
    return response;
  } catch (error) { return authFailure(error); }
}
export async function DELETE(request: Request) {
  try {
    guardOrigin(request);
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (error) { return authFailure(error); }
}
