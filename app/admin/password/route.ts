import { NextResponse } from "next/server";
import { authFailure, changePassword, cookieOptions, guardOrigin, SESSION_COOKIE } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    guardOrigin(request);
    const { currentPassword, newPassword } = await request.json();
    await changePassword(request, currentPassword, newPassword);
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (error) { return authFailure(error); }
}
