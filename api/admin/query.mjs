export class Query {
  constructor(db) {
    this.db = db;
  }

  selectProducReversal() {
    return this.db
      .prepare(
        /*sql */ `
    
      SELECT "rv".*,"u"."name" FROM "reversal" AS "rv"
      INNER JOIN "users" AS "u" ON "rv"."user_id" = "u"."user_id" 
    `
      )
      .all();
  }
}
