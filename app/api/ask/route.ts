export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question: body.message }),
  });

  const data = await res.json();

  return Response.json(data);
}