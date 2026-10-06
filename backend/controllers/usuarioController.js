const db = require("../database/conexao");
const bcrypt = require("bcryptjs");

// ==========================================
// CADASTRAR USUÁRIO
// ==========================================

async function cadastrar(req, res) {

    try {

        const {
            nome,
            email,
            senha
        } = req.body;

        if (!nome || !email || !senha) {

            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        const senhaCriptografada =
            await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        db.run(
            sql,
            [
                nome,
                email,
                senhaCriptografada
            ],
            function (erro) {

                if (erro) {

                    console.error(
                        "Erro ao cadastrar:",
                        erro.message
                    );

                    if (
                        erro.message.includes("UNIQUE")
                    ) {

                        return res.status(400).json({
                            erro:
                                "Este e-mail já está cadastrado."
                        });
                    }

                    return res.status(500).json({
                        erro:
                            "Erro ao cadastrar usuário."
                    });
                }

                return res.status(201).json({

                    sucesso: true,

                    mensagem:
                        "Cadastro realizado com sucesso!",

                    id: this.lastID
                });
            }
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro interno do servidor."
        });
    }
}


// ==========================================
// LOGIN
// ==========================================

async function login(req, res) {

    try {

        const {
            email,
            senha
        } = req.body;

        if (!email || !senha) {

            return res.status(400).json({
                erro:
                    "Informe o e-mail e a senha."
            });
        }

        db.get(
            `
            SELECT *
            FROM usuarios
            WHERE email = ?
            `,
            [email],
            async function (erro, usuario) {

                if (erro) {

                    console.error(
                        "Erro no login:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao consultar o banco."
                    });
                }

                if (!usuario) {

                    return res.status(401).json({
                        erro:
                            "E-mail ou senha incorretos."
                    });
                }

                const senhaValida =
                    await bcrypt.compare(
                        senha,
                        usuario.senha
                    );

                if (!senhaValida) {

                    return res.status(401).json({
                        erro:
                            "E-mail ou senha incorretos."
                    });
                }

                return res.json({

                    sucesso: true,

                    mensagem:
                        "Login realizado!",

                    usuario: {

                        id: usuario.id,

                        nome: usuario.nome,

                        email: usuario.email
                    }
                });
            }
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro interno do servidor."
        });
    }
}


// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {
    cadastrar,
    login
};