export async function GET() {
  return Response.json(
    {
      data: {
        status: "ok",
      },
    },
    { status: 200 },
  );
}
