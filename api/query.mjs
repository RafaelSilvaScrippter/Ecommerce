export class Query {
  constructor(db) {
    this.db = db;
  }
  getLogin({ key, value }) {
    console.log(key, value);
    return this.db
      .prepare(
        /*sql */ `
      SELECT * FROM "users" WHERE ${key} = ?

    `
      )
      .get(value);
  }
  queryPostUser({ name, second_name, email, password, cpf, salt }) {
    return this.db
      .prepare(
        /*SQL */ `
      INSERT INTO "users"
      ("name","second_name","email","password","cpf",'salt')
      VALUES 
      (?,?,?,?,?,?)
      `
      )
      .run(name, second_name, email, password, cpf, salt);
  }
  insertSession({ user_id, sid_hash }) {
    return this.db
      .prepare(
        /*sql */ `
      
      INSERT INTO  "sessions"
      ("user_id","session_hash")
      VALUES 
      (?,?)
    `
      )
      .run(user_id, sid_hash);
  }
  getSession({ sid_hash }) {
    try {
      return this.db
        .prepare(
          /*sql */ `
        
        SELECT "user_id" FROM "sessions" WHERE "session_hash" = ?
        `
        )
        .get(sid_hash);
    } catch (err) {
      console.log("erro no get session auth");
    }
  }

  updateUser({ user_id, name, second_name, email }) {
    return this.db
      .prepare(
        /*sql */ `
      UPDATE "users" SET
      "name" = ?,
      "second_name" = ?,
      "email" = ?
      WHERE "user_id" = ${user_id}
    `
      )
      .run(name, second_name, email);
  }

  resetPassword({ user_id, token }) {
    return this.db
      .prepare(
        /*sql */ `
      INSERT INTO "reset_password"
       ("user_id","token")
       VALUES
       (?,?)
    `
      )
      .run(user_id, token);
  }

  deleteTokenOld({ user_id }) {
    return this.db
      .prepare(
        /*sql */ `
      DELETE  FROM "reset_password"
      WHERE "user_id" == ?  
    `
      )
      .run(user_id);
  }

  compareToken({ token }) {
    return this.db
      .prepare(
        /*sql */ `
      SELECT * FROM "reset_password"
      WHERE "token" = ?  
    `
      )
      .run(token);
  }
  getToken({ user_id, token }) {
    return this.db
      .prepare(
        /*sql */ `
      SELECT * FROM "reset_password"
      WHERE "user_id" = ? 
      AND   "token" = ?
    `
      )
      .run(user_id, token);
  }
  updatePassword({ user_id, password, salt }) {
    return this.db
      .prepare(
        /*sql */ `
    
      UPDATE "users"
      SET "password" = ?,
      "SALT" = ?
      WHERE "user_id" = ${user_id}
    `
      )
      .run(password, salt);
  }
}
