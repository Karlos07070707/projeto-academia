const express = require("express");

const router = express.Router();

const pesoController = require("../controllers/pesoController");

router.get("/:usuario_id", pesoController.listar);

router.post("/", pesoController.adicionar);

module.exports = router;