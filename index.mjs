import { createServer } from "node:http";
import { Routes } from "./cors/routes.mjs";
import { Auth } from "./api/auth.mjs";
import { Products } from "./api/products/index.mjs";
import { CustomRequest } from "./cors/http/customRequest.mjs";

const routes = new Routes();
new Auth(routes);
new Products(routes);

const server = createServer(async (request, res) => {
  res.setHeader("Content-Type", "application/json");
  const req = await CustomRequest(request);
  const handler = routes.routes[req.method][req.url];
  if (handler) {
    handler(req, res);
  } else {
    res.end("nenhuma rota encontrada");
  }
});

server.listen(3000, () => {
  console.log("servidor rodando na porta 3000");
});
