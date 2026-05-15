import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SessionPayload {
  email: string;
  role: string;
  token?: string;
  expires: number;
}

export async function verifySession(requireAuth = true): Promise<SessionPayload | null> {
  // NEXT.JS 15 CONTENTION: Must await cookies()
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("imagesnap_session");

  if (!sessionCookie) {
    if (requireAuth) redirect('/?auth=required');
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf8'));
    
    if (payload.expires < Date.now()) {
      if (requireAuth) redirect('/?auth=expired');
      return null;
    }

    return payload;
  } catch (error) {
    if (requireAuth) redirect('/?auth=invalid');
    return null;
  }
}
