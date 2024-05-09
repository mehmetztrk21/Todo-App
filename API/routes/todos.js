import { Router } from "express";
import { getAll, create, update, remove } from "../controllers/todos.js";
export const router = Router();

router.get("/",getAll);
router.post("/",create);
router.put("/",update);
router.delete("/:id",remove);