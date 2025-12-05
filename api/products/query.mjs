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

  getProducts() {
    return this.db
      .prepare(
        /*sql */ `
      
      SELECT * FROM "products"
    `
      )
      .all();
  }
  getProduct({ slug }) {
    console.log(slug);
    return this.db
      .prepare(
        /*sql */ `
      
      SELECT * FROM "products"
      WHERE "slug" = ?
    `
      )
      .get(slug);
  }

  getUserForComment(user_id) {
    return user_id.map((dados) => {
      console.log(dados);
      return this.db
        .prepare(
          /*sql */ `
        
        SELECT "name","second_name" FROM "users"
        WHERE "user_id" = ?
        
        `
        )
        .all(dados.user_id);
    });
  }

  getProductsWithComments({ product_id }) {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT "user_id","comment" FROM "comments"
      WHERE "product_id" = ?
    `
      )
      .all(product_id);
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
