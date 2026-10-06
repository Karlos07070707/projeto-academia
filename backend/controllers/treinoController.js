const db = require("../database/conexao");

exports.listar = (req, res) => {

    const { usuario_id } = req.params;

    db.all(
        `
        SELECT *
        FROM treinos
        WHERE usuario_id = ?
        ORDER BY id DESC
        `,
        [usuario_id],
        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar treinos."
                });
            }

            res.json(resultados);
        }
    );
};

exports.adicionar = (req, res) => {

    const { usuario_id, dia, treino } = req.body;

    if (!usuario_id || !dia || !treino) {
        return res.status(400).json({
            erro: "Preencha todos os campos."
        });
    }

    db.run(
        `
        INSERT INTO treinos
        (usuario_id, dia, treino)
        VALUES (?, ?, ?)
        `,
        [usuario_id, dia, treino],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao adicionar treino."
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
        "DELETE FROM treinos WHERE id = ?",
        [id],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao excluir treino."
                });
            }

            res.json({
                sucesso: true
            });
        }
    );
};