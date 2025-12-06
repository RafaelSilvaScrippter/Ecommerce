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
  getProduct({ key, value }) {
    return this.db
      .prepare(
        /*sql */ `
      
      SELECT * FROM "products"
      WHERE ${key} = ?
    `
      )
      .get(value);
  }

  getUserForComment(user_id) {
    return user_id.map((dados) => {
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

  insertProductCart({ product_id, quantity }) {
    return this.db
      .prepare(
        /*sql */ `
    
      INSERT INTO "product_cart"
      ("product_id","quantity")
      VALUES(?,?)
      ON CONFLICT("product_id")
      DO UPDATE SET
      "quantity" = excluded."quantity"
    `
      )
      .run(product_id, quantity);
  }
  getProductCart({ product_id }) {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT  * FROM "product_cart"
      WHERE "product_id" = ?
      
    `
      )
      .get(product_id);
  }

  getProductCartAll() {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT "pc".*,  "p"."price" FROM "product_cart" AS "pc"
      INNER JOIN "products" AS "p" ON "pc"."product_id" = "p"."id"
      
    `
      )
      .all();
  }

  deleteProductCart({ product_id }) {
    return this.db
      .prepare(
        /*sql */ `
    
      DELETE  FROM "product_cart" WHERE "product_id" = ?
    `
      )
      .run(product_id);
  }

  deleteAllProductsCart() {
    return this.db
      .prepare(
        /*sql */ `
    
      DELETE FROM "product_cart"
      
    `
      )
      .run();
  }

  getProductsBuyVerify({ products }) {
    return products.map((product) => {
      return this.db
        .prepare(
          /*sql */ `
      
        SELECT "id" FROM "buyProducts"
        WHERE "product_buy" = ?
      `
        )
        .get(product.product_id);
    });
  }

  postProductsBuy({ user_id: user_id, products_id }) {
    for (const products of products_id) {
      return this.db
        .prepare(
          /*sql */ `
            INSERT INTO "buyProducts"
            ("user_id","product_buy","quantity","price")
            VALUES
            (?,?,?,?)
            ON CONFLICT ("product_buy") DO UPDATE SET "product_buy" = excluded."product_buy";
            `
        )
        .run(user_id, products.product_id, products.quantity, products.price);
    }
  }

  getAllProductsBuy() {
    return this.db
      .prepare(
        /*sql */ `
      
    SELECT * FROM "buyProducts"
      
    `
      )
      .all();
  }

  productReversal({ product_id, user_id, reason }) {
    console.log(user_id);
    return this.db
      .prepare(
        /*sql */ `
      INSERT OR IGNORE INTO "reversal" 
      ("product_id","user_id","reason")
      VALUES (?,?,?)
    `
      )
      .run(product_id, user_id, reason);
  }
}
