import { DbConnect } from "../../core/connectDatabase.mjs";
import { logged } from "../../core/midleware/logded.mjs";
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

  routes() {
    this.gerenciarRotas.get("/products/reversal", this.getProductsReversal);
    this.gerenciarRotas.get("/product/reversal/:id", this.getProductReversal);
  }
}
