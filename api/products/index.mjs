export class Products {
  constructor(routes) {
    this.gerenciarRotas = routes;
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

  routes() {
    this.gerenciarRotas.get("/products", this.productsGet);
    this.gerenciarRotas.get("/product/comments", this.getProductsComments);
    this.gerenciarRotas.post("/product/comments", this.postProductsComments);
    this.gerenciarRotas.get("/products/cart", this.postProductsCart);
  }
}
