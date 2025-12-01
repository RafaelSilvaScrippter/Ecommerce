import { createServer } from "node:http";
import { Routes } from "./cors/routes.mjs";
import { Auth } from "./api/auth.mjs";

const routes = new Routes();
new Auth(routes);

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
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
