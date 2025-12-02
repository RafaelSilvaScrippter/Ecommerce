export class Query {
  constructor(db) {
    this.db = db;
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
}
