import { getLive } from "@/lib/live";

export const revalidate = 60;

export async function GET() {
  const live = await getLive();
  return Response.json(live, {
    status: live ? 200 : 503,
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
