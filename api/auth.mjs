import { pbkdf2Sync, randomBytes } from "crypto";
import { DbConnect } from "../core/connectDatabase.mjs";
import { Query } from "./query.mjs";
import { tableUsers } from "./tables.mjs";
import { RouterError } from "../core/utils/routerError.mjs";
import { SetCookie } from "../core/utils/set-cookies.mjs";
import { logged } from "../core/midleware/logded.mjs";

export class Auth {
  constructor(routes) {
    this.rotacionar = routes;
    this.dataBase = new DbConnect().dbInit();
    this.gerenciarRota();
    this.queryDb = new Query(this.dataBase);
    console.log(this.middleware);
    this.db();
  }
  postLogin = (req, res) => {
    const { email, password } = req.body;
    const login = this.queryDb.getLogin({ key: "email", value: email });

    if (!login) {
      res.statusCode = 404;
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
      res.statusCode = 404;
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
    res.statusCode = 201;
    res.end(JSON.stringify(req.body));
  };

  getUser = async (req, res) => {
    const session = await logged(req, res);
    res.end(JSON.stringify({ session }));
  };

  updateUser = async (req, res) => {
    const { name, second_name, email } = req.body;
    const session = await logged(req, res);
    if (!session.user_id) {
      throw new RouterError(404, "não autorizado");
    }

    console.log(name, second_name, email);

    const { changes } = this.queryDb.updateUser({
      user_id: session.user_id,
      name,
      second_name,
      email,
    });
    if (changes === 0) {
      throw new RouterError(404, "usuário não atualizado");
    }

    res.end(JSON.stringify({ message: "Usuário atualzizado" }));
  };

  deleteUser(req, res) {
    res.end("usuário deletado");
  }
  envEmailReset = (req, res) => {
    const { email } = req.body;

    const login = this.queryDb.getLogin({ key: "email", value: email });
    if (!login) {
      res.end(JSON.stringify({ message: "Email não cadastrado" }));
      throw new RouterError(404, "email não cadastrado");
    }

    const deletetTokenOld = this.queryDb.deleteTokenOld({
      user_id: login.user_id,
    });

    const hashToken = randomBytes(16).toString("base64url");
    const setTokenReset = this.queryDb.resetPassword({
      user_id: login.user_id,
      token: hashToken,
    });

    const corpoEmail = {
      email: email,
      token: hashToken,
    };
    res.end(JSON.stringify({ corpoEmail }));
  };

  resetPassword = (req, res) => {
    const { email, token, password } = req.body;
    const login = this.queryDb.getLogin({ key: "email", value: email });

    const { changes } = this.queryDb.getToken({
      user_id: login.user_id,
      token: token,
    });

    if (changes) {
      throw new RouterError(500, "Algo deu errado");
    }

    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString(
      "hex"
    );
    const updatedPassword = this.queryDb.updatePassword({
      user_id: login.user_id,
      password: hash,
      salt: salt,
    });

    if (updatedPassword === 0) {
      throw new RouterError(500, "erro ao atualizar senha");
    }

    const deleteAllResetPassword = this.queryDb.deleteTokenOld({
      user_id: login.user_id,
    });

    console.log(deleteAllResetPassword);

    res.end(JSON.stringify({ message: "Usuário atualizado" }));
  };

  db() {
    this.dataBase.exec(tableUsers);
  }

  gerenciarRota(req, res) {
    this.rotacionar.post("/auth/login", this.postLogin);
    this.rotacionar.get("/auth/user", this.getUser);
    this.rotacionar.post("/auth/create", this.postUserCreate);
    this.rotacionar.put("/auth/update", this.updateUser);
    this.rotacionar.get("/auth/delete/user", this.deleteUser);
    this.rotacionar.post("/auth/email/reset/password", this.envEmailReset);
    this.rotacionar.post("/auth/reset/password", this.resetPassword);
  }
}
