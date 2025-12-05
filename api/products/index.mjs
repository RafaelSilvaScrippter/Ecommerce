import { DbConnect } from "../../core/connectDatabase.mjs";
import { logged } from "../../core/midleware/logded.mjs";
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

  productsGet = async (req, res) => {
    const productsGet = this.query.getProducts();
    console.log(productsGet);
    if (productsGet.length === 0) {
      res.statusCode = 201;
      res.end(JSON.stringify({ message: "nenhum produto encontrado" }));
    }

    res.end(JSON.stringify(productsGet));
  };

  getProductsComments(req, res) {
    res.end("products get comments");
  }

  postProductsComments = async (req, res) => {
    const { idProduct } = req.params;
    const { comment } = req.body;
    const productExixstId = this.query.getProducts({ id: idProduct });
    if (!productExixstId) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "produto não encontrado" }));
      try {
        throw new RouterError(
          404,
          "Erro get pelo id do produto retorna undefined"
        );
      } catch (erro) {
        console.log(erro);
        return;
      }
    }
    const getUserLogged = await logged(req, res);
    if (!getUserLogged) {
      try {
        res.statusCode = 401;
        res.end(JSON.stringify({ status: 401, message: "login necessário" }));
      } catch (err) {
        console.log(err);
        return;
      }
    }
    const { id } = productExixstId;

    const postCommentInProduct = this.query.postCommentsProducts({
      product_id: id,
      user_id: getUserLogged.user_id,
      comment,
    });

    if (postCommentInProduct.changes === 0) {
      try {
        res.statusCode = 500;
        throw new RouterError(500, "ocorreu um erro ao postar cometário");
      } catch (err) {
        console.log(err);
        return;
      }
    }

    res.statusCode = 201;
    res.end(JSON.stringify({ status: 201, message: "Comentário postado" }));
  };

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
    const session = logged(req, res);
    if (session.role !== "user") {
      res.statusCode = 403;
      res.end(JSON.stringify({ status: 403, mensagem: "Erro de permissão" }));
      try {
        throw new RouterError(403, "Erro de permissão");
      } catch (err) {
        console.log(err);
      }
      return;
    }
    const existSlug = this.query.verifySlugExists({ slug });
    if (existSlug) {
      res.statusCode = 409;
      res.end(JSON.stringify({ message: "slug já existe" }));
      try {
        throw new RouterError(409, "slug já definido");
      } catch (err) {
        console.log(err);
      }
    }
    const postProduto = this.query.postProducts({
      name,
      price,
      description,
      photo,
      slug,
    });
    if (postProduto.changes === 0) {
      try {
        throw new RouterError(500, "erro ao postar produto");
      } catch (err) {
        console.log(err);
      }
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
    this.gerenciarRotas.post(
      "/product/comments/:idProduct",
      this.postProductsComments
    );
    this.gerenciarRotas.post("/products/cart", this.postProductsCart);
    this.gerenciarRotas.delete("/products/cart", this.deleteProducCart);
    this.gerenciarRotas.get("/products/buy", this.getProductsBuy);
    this.gerenciarRotas.post("/products/buy", this.postProductsBuy);
    this.gerenciarRotas.post("/products", this.postProducts);
  }
}
