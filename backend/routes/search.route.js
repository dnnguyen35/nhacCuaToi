import express from "express";
import searchController from "../controllers/search.controller.js";

const router = express.Router();

router.get("/search-all", searchController.searchAllTypes);

export default router;
