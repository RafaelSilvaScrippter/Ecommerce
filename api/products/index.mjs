import { DatabaseSync } from "node:sqlite";
import { DbConnect } from "../../cors/connectDatabase.mjs";
import { ProductsTables } from "./tables.mjs";
import { tablesBuy } from "./tablesBuy.mjs";

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

  getProductsBuy(req, res) {
    res.end("produtos comprados");
  }

  postProductsBuy(req, res) {
    res.end("produtos comprados");
  }

  Db() {
    this.database.exec(ProductsTables);
    this.database.exec(tablesBuy);
  }

  routes() {
    this.gerenciarRotas.get("/products", this.productsGet);
    this.gerenciarRotas.get("/product/comments", this.getProductsComments);
    this.gerenciarRotas.post("/product/comments", this.postProductsComments);
    this.gerenciarRotas.get("/products/cart", this.postProductsCart);
    this.gerenciarRotas.get("/products/buy", this.getProductsBuy);
    this.gerenciarRotas.post("/products/buy", this.postProductsBuy);
  }
}
