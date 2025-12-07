export class Query {
  constructor(db) {
    this.db = db;
  }

  selectProductsReversal() {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT "rv".*,"u"."name" FROM "reversal" AS "rv"
      INNER JOIN "users" AS "u" ON "rv"."user_id" = "u"."user_id" 
    `
      )
      .all();
  }

  selectProductReversal({ id }) {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT "rv".*,"u"."name","p"."price","p"."name","p"."photo" FROM "reversal" AS "rv"
      INNER JOIN "users" AS "u" ON "rv"."user_id" = "u"."user_id" 
      INNER JOIN "products" AS "p" ON "rv"."product_id" = "p"."id"
      WHERE "p"."id" = ?
    `
      )
      .get(id);
  }
  selectBuyProducts({ id }) {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT * FROM "buyProducts"
      WHERE "product_buy" = ?
      
    `
      )
      .get(id);
  }
  reversalUpdateBuyProduct({ id }) {
    return this.db
      .prepare(
        /*sql */ `
      UPDATE "buyProducts" 
      SET "status" = 'cancelado'
      WHERE "product_buy" = ?
    `
      )
      .run(id);
  }
}
