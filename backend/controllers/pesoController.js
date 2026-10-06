const db = require("../database/conexao");

exports.listar = (req, res) => {

    const { usuario_id } = req.params;

    db.all(
        `
        SELECT *
        FROM pesos
        WHERE usuario_id = ?
        ORDER BY registrado_em DESC
        `,
        [usuario_id],
        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar histórico."
                });
            }

            res.json(resultados);
        }
    );
};

exports.adicionar = (req, res) => {

    const {
        usuario_id,
        peso
    } = req.body;

    if (!usuario_id || !peso || peso <= 0) {
        return res.status(400).json({
            erro: "Informe um peso válido."
        });
    }

    db.run(
        `
        INSERT INTO pesos
        (usuario_id, peso)
        VALUES (?, ?)
        `,
        [usuario_id, peso],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao registrar peso."
                });
            }

            res.json({
                sucesso: true,
                id: this.lastID
            });
        }
    );
};