import { DbConnect } from "../../core/connectDatabase.mjs";
import { RouterError } from "../../core/utils/routerError.mjs";
import { Query } from "./query.mjs";
import { ProductsTables } from "./tables.mjs";
import { tablesBuy } from "./tablesBuy.mjs";

export class Products {
  constructor(routes) {
    this.gerenciarRotas = routes;
    this.database = new DbConnect().dbInit();
    this.Db();
    this.routes();
    this.query = new Query(this.database);
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

  deleteProducCart(req, res) {
    res.end("delete products cart");
  }

  getProductsBuy(req, res) {
    res.end("produtos comprados");
  }

  postProductsBuy(req, res) {
    res.end("produtos comprados");
  }

  postProducts = async (req, res) => {
    const { name, price, description, photo, slug } = req.body;
    console.log(name, price, description, photo, slug);
    const existSlug = this.query.verifySlugExists({ slug });
    if (existSlug) {
      res.statusCode = 409;
      res.end(JSON.stringify({ message: "slug já existe" }));
      throw new RouterError(409, "slug já definido");
    }
    const postProduto = this.query.postProducts({
      name,
      price,
      description,
      photo,
      slug,
    });
    if (postProduto.changes === 0) {
      throw new RouterError(500, "erro ao postar produto");
    }

    res.statusCode = 201;
    res.end(
      JSON.stringify({ status: 201, message: "produto postado com sucesso" })
    );
  };

  Db() {
    this.database.exec(ProductsTables);
    this.database.exec(tablesBuy);
  }

  routes() {
    this.gerenciarRotas.get("/products", this.productsGet);
    this.gerenciarRotas.get("/product/comments", this.getProductsComments);
    this.gerenciarRotas.post("/product/comments", this.postProductsComments);
    this.gerenciarRotas.post("/products/cart", this.postProductsCart);
    this.gerenciarRotas.delete("/products/cart", this.deleteProducCart);
    this.gerenciarRotas.get("/products/buy", this.getProductsBuy);
    this.gerenciarRotas.post("/products/buy", this.postProductsBuy);
    this.gerenciarRotas.post("/products", this.postProducts);
  }
}
