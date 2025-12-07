import { DbConnect } from "../../core/connectDatabase.mjs";
import { logged } from "../../core/midleware/logded.mjs";
import { RouterError } from "../../core/utils/routerError.mjs";
import { Query } from "./query.mjs";

export class Admin {
  constructor(routes) {
    this.gerenciarRotas = routes;
    this.db = new DbConnect().dbInit();
    this.query = new Query(this.db);
    this.routes();
  }

  getProductsReversal = async (req, res) => {
    const isLogged = await logged(req, res);

    if (!isLogged || isLogged.role !== "admin") {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "usuário não possui permissão" }));
      return;
    }

    const reversalProducts = this.query.selectProductsReversal();
    res.end(JSON.stringify(reversalProducts));
  };

  getProductReversal = async (req, res) => {
    const isLogged = await logged(req, res);

    if (!isLogged || isLogged.role !== "admin") {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "usuário não possui permissão" }));
      return;
    }
    const { id } = req.params;
    const getProductReversal = this.query.selectProductReversal({ id });
    if (!getProductReversal) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "produto não encontrado" }));
    }

    const getProductBuy = this.query.selectBuyProducts({
      id: getProductReversal.id,
    });
    const reversalProductSet = this.query.reversalUpdateBuyProduct({
      id: getProductBuy.id,
    });

    if (reversalProductSet.changes === 0) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "erro ao cancelar produto" }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Produto cancelado" }));
  };

  updateSatsProductsBuy = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.end(JSON.stringify({ message: "corpo necessário" }));
      return;
    }

    const isLogged = await logged(req, res);
    if (!isLogged || isLogged.role !== "admin") {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "usuário não possui permissão" }));
      return;
    }
    const getProductsBuy = this.query.selectProductBuy({
      user_id: isLogged.user_id,
      product_id: id,
    });

    if (!getProductsBuy) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Produto não existe" }));
    }

    const updateStatusProduct = this.query.updateStatsProductBuy({
      status: status,
      product_id: id,
      user_id: isLogged.user_id,
    });
    console.log(updateStatusProduct);

    if (updateStatusProduct.changes === 0) {
      try {
        throw new RouterError(
          500,
          "erro no servidor ao atualizar status do pedido"
        );
      } catch (err) {
        console.log(err);
        return;
      }
    }
    res.statusCode = 201;

    res.end(JSON.stringify({ message: "status do pedido atualizado" }));
  };

  routes() {
    this.gerenciarRotas.get("/products/reversal", this.getProductsReversal);
    this.gerenciarRotas.post("/product/reversal/:id", this.getProductReversal);
    this.gerenciarRotas.post(
      "/product/buy/stats/:id",
      this.updateSatsProductsBuy
    );
  }
}
