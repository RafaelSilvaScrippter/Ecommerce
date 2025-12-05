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

  getProducts({ id }) {
    return this.db
      .prepare(
        /*sql */ `
      
      SELECT * FROM "products"
      WHERE "id" = ?
    `
      )
      .get(id);
  }

  postCommentsProducts({ product_id, user_id, comment }) {
    return this.db
      .prepare(
        /*sql */ `
    
      INSERT INTO "comments"
      ("product_id","comment","user_id")
      VALUES
      (?,?,?)
      
    `
      )
      .run(product_id, comment, user_id);
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
