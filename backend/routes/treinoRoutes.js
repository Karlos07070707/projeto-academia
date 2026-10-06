const express = require("express");

const router = express.Router();

const treinoController = require("../controllers/treinoController");

router.get("/:usuario_id", treinoController.listar);

router.post("/", treinoController.adicionar);

router.delete("/:id", treinoController.excluir);

module.exports = router;