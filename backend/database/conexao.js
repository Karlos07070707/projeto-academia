const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const caminhoBanco = path.resolve(
    __dirname,
    "../../database/fitmax.db"
);

const db = new sqlite3.Database(
    caminhoBanco,
    (erro) => {

        if (erro) {

            console.error(
                "❌ Erro ao conectar ao banco:",
                erro.message
            );

        } else {

            console.log(
                "✅ Banco de dados conectado!"
            );
        }
    }
);

module.exports = db;