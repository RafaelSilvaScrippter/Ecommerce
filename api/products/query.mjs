export class Query {
  constructor(db) {
    this.db = db;
  }

  postProducts({ slug, price, name, photo, description }) {
    return this.db
      .prepare(
        /*sql */ `
      INSERT INTO "products"
      ("slug","price","name","photo","description")
      VALUES (?,?,?,?,?)
    `
      )
      .run(slug, price, name, photo, description);
  }
  verifySlugExists({ slug }) {
    return this.db
      .prepare(
        /*sql */ `
      SELECT "slug" FROM "products"
      WHERE "slug" = ?
     
    `
      )
      .get(slug);
  }
}
