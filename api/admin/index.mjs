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

    const reversalProducts = this.query.selectProducReversal();
    res.end(JSON.stringify(reversalProducts));
  };

  routes() {
    this.gerenciarRotas.get("/products/reversal", this.getProductsReversal);
  }
}
