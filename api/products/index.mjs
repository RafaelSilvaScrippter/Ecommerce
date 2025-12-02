import { DatabaseSync } from "node:sqlite";
import { DbConnect } from "../../cors/connectDatabase.mjs";
import { ProductsTables } from "./tables.mjs";

export class Products {
  constructor(routes) {
    this.gerenciarRotas = routes;
    this.database = new DbConnect().dbInit();
    this.Db();
    this.routes();
  }

  productsGet(req, res) {
    res.end("products get");
  }

  getProductsComments(req, res) {
    res.end("products get comments");
  }

  postProductsComments(req, res) {
    res.end("products comments post");
  }

  postProductsCart(req, res) {
    res.end("post products cart");
  }

  Db() {
    this.database.exec(ProductsTables);
  }

  routes() {
    this.gerenciarRotas.get("/products", this.productsGet);
    this.gerenciarRotas.get("/product/comments", this.getProductsComments);
    this.gerenciarRotas.post("/product/comments", this.postProductsComments);
    this.gerenciarRotas.get("/products/cart", this.postProductsCart);
  }
}
