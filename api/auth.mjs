import { createHash, pbkdf2Sync, randomBytes } from "crypto";
import { DbConnect } from "../cors/connectDatabase.mjs";
import { Query } from "./query.mjs";
import { tableUsers } from "./tables.mjs";

export class Auth {
  constructor(routes) {
    this.rotacionar = routes;
    this.dataBase = new DbConnect().dbInit();
    this.db();
    this.gerenciarRota();
    this.queryDb = new Query(this.dataBase);
  }
  postLogin(req, res) {
    res.end(JSON.stringify(req.body));
  }
  postUserCreate = (req, res) => {
    const { name, second_name, email, password, cpf } = req.body;
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString(
      "hex"
    );
    this.queryDb.queryPostUser({
      name,
      second_name,
      email,
      password: hash,
      cpf,
      salt,
    });
    res.end(JSON.stringify(req.body));
  };

  updateUser(req, res) {
    res.end("usuário update");
  }

  deleteUser(req, res) {
    res.end("usuário deletado");
  }
  resetPassword(req, res) {
    res.end("password resetado");
  }

  db() {
    this.dataBase.exec(tableUsers);
  }

  gerenciarRota(req, res) {
    this.rotacionar.post("/auth/login", this.postLogin);
    this.rotacionar.post("/auth/create", this.postUserCreate);
    this.rotacionar.get("/auth/update", this.updateUser);
    this.rotacionar.get("/auth/delete/user", this.deleteUser);
    this.rotacionar.get("/auth/reset/password", this.resetPassword);
  }
}
