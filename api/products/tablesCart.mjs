export const TableCart = /*sql */ `

  CREATE TABLE IF NOT EXISTS "product_cart"
  ("id" INTEGER PRIMARY KEY,
  "product_id" UNIQUE NOT NULL,
  "quantity" INTEGER NOT NULL,
  FOREIGN KEY ("product_id") REFERENCES "products" ("id")
  )

`;
