import { createServer } from "node:http";
import { Routes } from "./core/routes.mjs";
import { Auth } from "./api/auth.mjs";
import { Products } from "./api/products/index.mjs";
import { CustomRequest } from "./core/http/customRequest.mjs";
import { readFile } from "node:fs/promises";

const routes = new Routes();
new Auth(routes);
new Products(routes);

routes.get("/", async (req, res) => {
  const index = await readFile("./frontend/index.html");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(index);
});

const server = createServer(async (request, res) => {
  res.setHeader("Content-Type", "application/json");
  const req = await CustomRequest(request);
  const result = routes.findHandler(req.method, req.url);
  if (!result) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  req.params = result.params;
  result.handler(req, res);
});

server.listen(3000, () => {
  console.log("servidor rodando na porta 3000");
});
