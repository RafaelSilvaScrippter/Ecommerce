import { RouterError } from "../utils/routerError.mjs";

export async function CustomRequest(req) {
  const url = new URL(req.url || "/", "http://localhost");
  req.pathname = url.pathname;
  req.query = url.searchParams;
  req.session;
  const chunks = [];

  for await (const chunk of req) {
    let totalChunk = chunk.length + chunk.length;
    console.log(totalChunk);
    if (totalChunk > 200000) {
      try {
        throw new RouterError(500, "corpo da requisção muito grande");
      } catch (err) {
        console.log(err);
        return;
      }
    }
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");

  if (req.headers["content-type"] === "application/json") {
    req.body = JSON.parse(body);
  } else {
    req.body = body;
  }
  return req;
}
