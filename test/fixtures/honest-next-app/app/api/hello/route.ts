export async function GET() {
  return Response.json({ hello: process.env.NEXT_PUBLIC_NAME });
}
