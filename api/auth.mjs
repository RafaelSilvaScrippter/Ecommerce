import { createHash, pbkdf2Sync, randomBytes } from "crypto";
import { DbConnect } from "../core/connectDatabase.mjs";
import { Query } from "./query.mjs";
import { tableUsers } from "./tables.mjs";
import { RouterError } from "../core/utils/routerError.mjs";
import { SetCookie } from "../core/utils/set-cookies.mjs";

export class Auth {
  constructor(routes) {
    this.rotacionar = routes;
    this.dataBase = new DbConnect().dbInit();
    this.db();
    this.gerenciarRota();
    this.queryDb = new Query(this.dataBase);
  }
  postLogin = (req, res) => {
    const { email, password } = req.body;
    const login = this.queryDb.getLogin({ key: "email", value: email });

    if (!login) {
      res.end(JSON.stringify({ status: 404, message: "Email não cadastrado" }));
      throw new RouterError(404, "Email ou senha incorretos");
    }

    const hashToCompare = pbkdf2Sync(
      password,
      login?.SALT,
      100000,
      64,
      "sha512"
    ).toString("hex");

    if (hashToCompare !== login.password) {
      res.end(
        JSON.stringify({ status: 404, message: "Usuário ou senha incorretos" })
      );
      throw new RouterError(404, "Usuário ou senha incorretos");
    }

    const hash_session = randomBytes(32).toString("base64url");
    const cookie = `__Secure-uid=${hash_session}; Path=/; Secure; HttpOnly;SameSite=Lax`;

    const { changes } = this.queryDb.insertSession({
      user_id: login.user_id,
      sid_hash: hash_session,
    });

    SetCookie(res, cookie);
    if (changes > 0) {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 200, message: "logado" }));
    }
  };
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

  getUser = (req, res) => {
    const indice = req.headers.cookie?.indexOf("=");
    const getCookieHash = req.headers.cookie?.substring(indice + 1);
    console.log(getCookieHash);
    if (!getCookieHash) {
      res.statusCode = 404;
      throw new RouterError(404, "Cookie inválido");
    }
    try {
      const { user_id } = this.queryDb.getSession({ sid_hash: getCookieHash });
      if (!user_id) {
        res.statusCode = 404;
        throw new RouterError(404, "Não autenticado");
      }
      const login = this.queryDb.getLogin({ key: "user_id", value: user_id });
      console.log(login);
      res.statusCode = 200;
      res.end(JSON.stringify("usuário get"));
    } catch (err) {
      console.log(err);
    }
  };

  updateUser(req, res) {
    res.setHeader("Set-Cookie", "hello=world");
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
    this.rotacionar.get("/auth/user", this.getUser);
    this.rotacionar.post("/auth/create", this.postUserCreate);
    this.rotacionar.get("/auth/update", this.updateUser);
    this.rotacionar.get("/auth/delete/user", this.deleteUser);
    this.rotacionar.get("/auth/reset/password", this.resetPassword);
  }
}
