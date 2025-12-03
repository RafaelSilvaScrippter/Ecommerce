export class Query {
  constructor(db) {
    this.db = db;
  }
  getLogin({ key, value }) {
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
}
