import { DbConnect } from "../../core/connectDatabase.mjs";
import { logged } from "../../core/midleware/logded.mjs";
import { RouterError } from "../../core/utils/routerError.mjs";
import { Query } from "./query.mjs";
import { ProductsTables } from "./tables.mjs";
import { tablesBuy } from "./tablesBuy.mjs";
import { TableCart } from "./tablesCart.mjs";
import { createWriteStream, readFileSync } from "fs";
import { pipeline } from "stream/promises";

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
    if (productsGet.length === 0) {
      res.statusCode = 201;
      res.end(JSON.stringify({ message: "nenhum produto encontrado" }));
    }

    res.end(JSON.stringify(productsGet));
  };
  productGet = async (req, res) => {
    const { slug } = req.params;
    const product = this.query.getProduct({ key: "slug", value: slug });

    if (!product) {
      res.statusCode = 404;
      res.end(
        JSON.stringify({ status: 404, message: "nenhum produto encontrado" })
      );
      try {
        throw new RouterError(404, "produto pelo slug não encontrado");
      } catch (err) {
        console.log(err);
        return;
      }
    }

    const getComments = this.query.getProductsWithComments({
      product_id: product.id,
    });
    const getUserDoComment = this.query.getUserForComment(getComments);
    const description = getComments.map((comment, index) => {
      return {
        ...comment,
        user: getUserDoComment[index] || null,
      };
    });

    res.end(
      JSON.stringify({
        product,
        description,
      })
    );
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

  postProductsCart = async (req, res) => {
    const { id } = req.params;
    const getProductForId = this.query.getProduct({ key: "id", value: id });
    if (!getProductForId) {
      try {
        res.statusCode = 404;
        throw new RouterError(404, "Produto não existe");
      } catch (err) {
        console.log(err);
        return;
      }
    }
    const getProductCart = this.query.getProductCart({
      product_id: getProductForId.id,
    });

    if (!getProductCart) {
      try {
        throw new RouterError(404, "produto não existe");
      } catch (err) {
        console.log(err);
      }
    }

    let incrementQuntity;
    if (getProductCart) {
      incrementQuntity = getProductCart.quantity + 1;
    } else {
      incrementQuntity = 1;
    }

    const postProductCart = this.query.insertProductCart({
      product_id: getProductForId.id,
      quantity: incrementQuntity,
    });

    res.statusCode = 201;
    res.end(
      JSON.stringify({ status: 201, message: "Produto adicionado no carrinho" })
    );
  };

  deleteProducCart = async (req, res) => {
    const { id } = req.params;
    const getProducsCarts = this.query.getProductCart({ product_id: id });
    if (!getProducsCarts) {
      try {
        throw new RouterError(404, "Produto cart não encontrado ou não existe");
      } catch (err) {
        res.statusCode = 404;
        console.log(err);
        return;
      }
    }
    const deleteProductInCart = this.query.deleteProductCart({
      product_id: id,
    });
    console.log(deleteProductInCart);
    res.statusCode = 201;
    res.end(JSON.stringify({ satus: 201 }));
  };

  getProductsBuy = async (req, res) => {
    const isLogged = logged(req, res);
    if (!isLogged) {
      try {
        throw new RouterError(403, "Erro de permissão");
      } catch (err) {
        console.log(err);
        return;
      }
    }

    const producstBuy = this.query.getAllProductsBuy();
    if (producstBuy.length === 0) {
      res.end(JSON.stringify({ message: "sem produtos comprados" }));
      return;
    }

    res.end(JSON.stringify({ products: producstBuy }));
  };

  postProductsBuy = async (req, res) => {
    const isLogged = await logged(req, res);

    if (!isLogged) {
      try {
        res.statusCode = 401;
        throw new RouterError(401, "Usuário não possui permissãi");
      } catch (err) {
        console.log(err);
        return;
      }
    }

    const getAllProducstCart = this.query.getProductCartAll();
    if (getAllProducstCart.length == 0) {
      res.end(
        JSON.stringify({ message: "sem produtos no carrinho para comprar" })
      );
      return;
    }

    if (!getAllProducstCart) {
      try {
        throw new RouterError(500, "Erro no getAllProducts buy");
      } catch (err) {
        console.log(err);
        return;
      }
    }

    const verify = this.query.getProductsBuyVerify({
      products: getAllProducstCart,
    });

    if (verify) {
      try {
        throw new RouterError(
          409,
          "Produto já existe continua para adicionar o outro produto"
        );
      } catch (err) {
        console.log(err);
      }
    }

    const postProductsBuy = this.query.postProductsBuy({
      user_id: isLogged.user_id,
      products_id: getAllProducstCart,
    });

    if (!postProductsBuy) {
      try {
        throw new RouterError(500, "erro no servidor");
      } catch (err) {
        console.log(err);
        return;
      }
    }

    if (postProductsBuy.changes > 0) {
      const deleteAllProductsCart = this.query.deleteAllProductsCart();
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Produto comprado aguarde a confirmação no email",
      })
    );
  };

  postProducts = async (req, res) => {
    console.log("oa");
    const { name, price, description, photo, slug } = req.body;
    const session = logged(req, res);
    if (session.role === "user") {
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
        return;
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
        return;
      }
    }

    res.statusCode = 201;
    res.end(
      JSON.stringify({ status: 201, message: "produto postado com sucesso" })
    );
  };
  postProductReversal = async (req, res) => {
    const { reason, product_id } = req.body;
    const isLogged = await logged(req, res);
    if (!isLogged) {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "usuário não possui permissão" }));
      return;
    }
    const verifyProductExists = this.query.getProduct({
      key: "id",
      value: product_id,
    });
    if (!verifyProductExists) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Produto não existe" }));
      return;
    }
    const postReversal = this.query.productReversal({
      product_id: verifyProductExists.id,
      user_id: isLogged.user_id,
      reason: reason,
    });
    if (postReversal.changes === 0) {
      res.end(JSON.stringify({ message: "prduto já está sendo análisado" }));
      return;
    }

    if (postReversal.changes > 0) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "Nossa equipe irá cancelar  á compra do séu produto",
        })
      );
    }
  };

  getSearchProducts = async (req, res) => {
    const { search } = req.body;
    const productsSearch = this.query.getSearch({ search });

    if (productsSearch.length === 0) {
      res.end(JSON.stringify({ message: "nenhum produto encontrado" }));
      return;
    }

    res.end(JSON.stringify(productsSearch));
  };
  filesUpload = async (req, res) => {
    const name = req.headers["x-filename"];
    const writeStream = createWriteStream(`./files/${name}`);
    await pipeline(req, writeStream);
    console.log(name);
  };

  getFile = async (req, res) => {
    res.setHeader("Content-Type", "application/octet-stream");
    const { slug } = req.params;
    const readFile = readFileSync(`./files/${slug}`);
    console.log(readFile);
    res.end(readFile);
  };

  Db() {
    this.database.exec(ProductsTables);
    this.database.exec(tablesBuy);
    this.database.exec(TableCart);
  }

  routes() {
    this.gerenciarRotas.get("/products", this.productsGet);
    this.gerenciarRotas.get("/product/:slug", this.productGet);
    this.gerenciarRotas.get("/product/comments", this.getProductsComments);
    this.gerenciarRotas.post(
      "/product/comments/:idProduct",
      this.postProductsComments
    );
    this.gerenciarRotas.post("/products/cart/:id", this.postProductsCart);
    this.gerenciarRotas.delete("/product/cart/:id", this.deleteProducCart);
    this.gerenciarRotas.get("/products/buy", this.getProductsBuy);
    this.gerenciarRotas.post("/products/buy", this.postProductsBuy);
    this.gerenciarRotas.post("/products", this.postProducts);
    this.gerenciarRotas.post(
      "/products/buy/reversal",
      this.postProductReversal
    );
    this.gerenciarRotas.post("/files", this.filesUpload);
    this.gerenciarRotas.post("/products/search", this.getSearchProducts);
    this.gerenciarRotas.get("/files/:slug", this.getFile);
  }
}
