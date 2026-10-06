const db = require("../database/conexao");

exports.listar = (req, res) => {

    const { usuario_id } = req.params;

    db.all(
        `
        SELECT *
        FROM refeicoes
        WHERE usuario_id = ?
        ORDER BY horario ASC
        `,
        [usuario_id],
        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar refeições."
                });
            }

            res.json(resultados);
        }
    );
};

exports.adicionar = (req, res) => {

    const {
        usuario_id,
        horario,
        refeicao
    } = req.body;

    if (!usuario_id || !horario || !refeicao) {
        return res.status(400).json({
            erro: "Preencha todos os campos."
        });
    }

    db.run(
        `
        INSERT INTO refeicoes
        (usuario_id, horario, refeicao)
        VALUES (?, ?, ?)
        `,
        [usuario_id, horario, refeicao],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao adicionar refeição."
                });
            }

            res.json({
                sucesso: true,
                id: this.lastID
            });
        }
    );
};

exports.excluir = (req, res) => {

    const { id } = req.params;

    db.run(
        "DELETE FROM refeicoes WHERE id = ?",
        [id],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao excluir refeição."
                });
            }

            res.json({
                sucesso: true
            });
        }
    );
};