import { createServer } from "node:http";
import { Routes } from "./cors/routes.mjs";
import { Auth } from "./api/auth.mjs";

const server = createServer((req, res) => {
  new Auth().init(req, res);
  const url = new URL(req.url || "/", "http://localhost");
});

server.listen(3000, () => {
  console.log("servidor rodando na porta 3000");
});
