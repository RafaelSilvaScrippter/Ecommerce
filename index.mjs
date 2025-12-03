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
  try {
    const handler = routes.routes[req.method][req.url];
    if (handler) {
      handler(req, res);
    } else {
      res.end("nenhuma rota encontrada");
    }
  } catch (err) {
    console.log(err);
  }
});

server.listen(3000, () => {
  console.log("servidor rodando na porta 3000");
});
