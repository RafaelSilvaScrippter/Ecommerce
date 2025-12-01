import { createServer } from "node:http";
import { Routes } from "./cors/routes.mjs";
import { Auth } from "./api/auth.mjs";

const router = new Routes();
const { postUser } = new Auth();

router.get("/usuarios", (req, res) => {
  postUser(req, res);
});

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const handler = router.routes[req.method][req.url];
  if (handler) {
    handler(req, res);
  } else {
    res.end("Nenhuma rota encontrada");
  }
});

server.listen(3000, () => {
  console.log("servidor rodando na porta 3000");
});
