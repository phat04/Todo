import { Router } from "express";
import { getAllUser, sign_in, sign_up } from "../controllers/user";
import { checkJwtToken } from "../middleware/checkJwtToken";

const router = Router();

router.route("/").post(sign_up).get(sign_in);
router.route("/getAll").get(checkJwtToken, getAllUser);

export default router;
