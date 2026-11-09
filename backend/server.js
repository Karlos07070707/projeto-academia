require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const db = require("./database/conexao");

const usuarioRoutes =
    require("./routes/usuarioRoutes");

const treinoRoutes =
    require("./routes/treinoRoutes");

const refeicaoRoutes =
    require("./routes/refeicaoRoutes");

const pesoRoutes =
    require("./routes/pesoRoutes");


const app = express();

const PORT = 3000;


// ======================================
// CONFIGURAÇÕES
// ======================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================
// BANCO DE DADOS
// ======================================

const schemaPath = path.join(
    __dirname,
    "../database/schema.sql"
);

const schema = fs.readFileSync(
    schemaPath,
    "utf8"
);


// Criar as tabelas quando o servidor iniciar

db.exec(schema, function (erro) {

    if (erro) {

        console.error(
            "❌ Erro ao criar tabelas:",
            erro.message
        );

    } else {

        console.log(
            "✅ Tabelas do banco verificadas!"
        );
    }
});


// ======================================
// ROTAS DA API
// ======================================

console.log("usuarioRoutes:", typeof usuarioRoutes);
console.log("treinoRoutes:", typeof treinoRoutes);
console.log("refeicaoRoutes:", typeof refeicaoRoutes);
console.log("pesoRoutes:", typeof pesoRoutes);

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/treinos", treinoRoutes);
app.use("/api/refeicoes", refeicaoRoutes);
app.use("/api/pesos", pesoRoutes);
// ======================================
// FRONTEND
// ======================================

const frontendPath = path.join(
    __dirname,
    "../frontend"
);

app.use(
    express.static(frontendPath)
);


app.get("/", function (req, res) {

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );
});

app.get("/pages/cadastro.html", function (req, res) {

    res.sendFile(
        path.join(
            frontendPath,
            "pages",
            "cadastro.html"
        )
    );
});


app.get("/pages/dashboard.html", function (req, res) {

    res.sendFile(
        path.join(
            frontendPath,
            "pages",
            "dashboard.html"
        )
    );
});

// ======================================
// SERVIDOR
// ======================================

app.listen(
    PORT,
    function () {

        console.log("");
        console.log(
            "================================"
        );

        console.log(
            "   FITMAX ACADEMY ONLINE"
        );

        console.log(
            "================================"
        );

        console.log(
            `🌐 http://localhost:${PORT}`
        );

        console.log("");
    }
);