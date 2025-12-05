import { Query } from "../../api/query.mjs";
import { DbConnect } from "../connectDatabase.mjs";
import { RouterError } from "../utils/routerError.mjs";
export const logged = async (req, res) => {
  const indice = req.headers.cookie.indexOf("=");
  const token_sid = req.headers.cookie.substring(indice + 1);
  const db = new DbConnect().dbInit();
  const query = new Query(db);
  const session_hash = query.getSession({ sid_hash: token_sid });
  console.log(session_hash);
  if (!session_hash) {
    try {
      throw new RouterError(404, "sidhash não encontrado no middleware logged");
    } catch (err) {
      console.log(err);
      return;
    }
  }
  const getUser = query.getLogin({
    key: "user_id",
    value: session_hash.user_id,
  });
  return getUser;
};
