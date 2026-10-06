const express = require("express");

const router = express.Router();

const refeicaoController = require("../controllers/refeicaoController");

router.get("/:usuario_id", refeicaoController.listar);

router.post("/", refeicaoController.adicionar);

router.delete("/:id", refeicaoController.excluir);

module.exports = router;