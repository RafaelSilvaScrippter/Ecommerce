export class Query {
  constructor(db) {
    this.db = db;
  }
  getLogin({ email }) {
    return this.db
      .prepare(
        /*sql */ `
      SELECT * FROM "users" WHERE "email" = ?

    `
      )
      .get(email);
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
}
