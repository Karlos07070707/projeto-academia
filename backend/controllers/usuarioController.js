const crypto = require("crypto");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});
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
async function solicitarRecuperacao(req, res) {

    try {

        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                erro: "Informe seu e-mail."
            });
        }

        db.get(
            "SELECT id, nome FROM usuarios WHERE email = ?",
            [email],
            async (erro, usuario) => {

                if (erro) {
                    return res.status(500).json({
                        erro: "Erro ao consultar usuário."
                    });
                }

                // Não revelar se o e-mail está cadastrado.
                if (!usuario) {
                    return res.json({
                        sucesso: true,
                        mensagem: "Se o e-mail estiver cadastrado, você receberá um código."
                    });
                }

                const codigo = crypto
                    .randomInt(100000, 1000000)
                    .toString();

                const codigoHash = crypto
                    .createHash("sha256")
                    .update(codigo)
                    .digest("hex");

                const expiraEm = Date.now() + 10 * 60 * 1000;

                db.run(
                    `INSERT OR REPLACE INTO recuperacao_senha
                    (usuario_id, codigo_hash, expira_em, tentativas)
                    VALUES (?, ?, ?, 0)`,
                    [usuario.id, codigoHash, expiraEm],
                    async function (erro) {

                        if (erro) {
                            console.error(erro);

                            return res.status(500).json({
                                erro: "Erro ao gerar código."
                            });
                        }

                        try {

                            await transporter.sendMail({

                                from: `"FitMax Academy" <${process.env.EMAIL_USER}>`,

                                to: email,

                                subject: "Recuperação de senha - FitMax Academy",

                                html: `
                                    <div style="font-family:Arial;padding:20px">
                                        <h2>FitMax Academy</h2>

                                        <p>Olá, ${usuario.nome}!</p>

                                        <p>Seu código de recuperação é:</p>

                                        <h1 style="color:#d4a900">
                                            ${codigo}
                                        </h1>

                                        <p>Este código expira em 10 minutos.</p>

                                        <p>Se você não solicitou esta alteração,
                                        ignore este e-mail.</p>
                                    </div>
                                `
                            });

                            return res.json({
                                sucesso: true,
                                mensagem: "Se o e-mail estiver cadastrado, você receberá um código."
                            });

                        } catch (erroEmail) {

                            console.error(erroEmail);

                            db.run(
                                "DELETE FROM recuperacao_senha WHERE usuario_id = ?",
                                [usuario.id]
                            );

                            return res.status(500).json({
                                erro: "Não foi possível enviar o e-mail."
                            });
                        }
                    }
                );
            }
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}
async function redefinirSenha(req, res) {

    try {

        const email = req.body.email?.trim().toLowerCase();
        const codigo = req.body.codigo?.trim();
        const novaSenha = req.body.novaSenha;

        if (!email || !codigo || !novaSenha) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        if (!/^\d{6}$/.test(codigo)) {
            return res.status(400).json({
                erro: "O código deve possuir 6 dígitos."
            });
        }

        if (novaSenha.length < 8) {
            return res.status(400).json({
                erro: "A nova senha deve ter pelo menos 8 caracteres."
            });
        }

        db.get(
            `SELECT r.*, u.id AS usuario_id
             FROM recuperacao_senha r
             INNER JOIN usuarios u ON u.id = r.usuario_id
             WHERE u.email = ?`,
            [email],
            async (erro, registro) => {

                if (erro) {
                    return res.status(500).json({
                        erro: "Erro ao validar código."
                    });
                }

                if (!registro || registro.expira_em < Date.now()) {

                    if (registro) {
                        db.run(
                            "DELETE FROM recuperacao_senha WHERE usuario_id = ?",
                            [registro.usuario_id]
                        );
                    }

                    return res.status(400).json({
                        erro: "Código inválido ou expirado."
                    });
                }

                if (registro.tentativas >= 5) {

                    db.run(
                        "DELETE FROM recuperacao_senha WHERE usuario_id = ?",
                        [registro.usuario_id]
                    );

                    return res.status(400).json({
                        erro: "Limite de tentativas atingido. Solicite outro código."
                    });
                }

                const codigoHash = crypto
                    .createHash("sha256")
                    .update(codigo)
                    .digest("hex");

                if (codigoHash !== registro.codigo_hash) {

                    db.run(
                        `UPDATE recuperacao_senha
                         SET tentativas = tentativas + 1
                         WHERE usuario_id = ?`,
                        [registro.usuario_id]
                    );

                    return res.status(400).json({
                        erro: "Código incorreto."
                    });
                }

                const senhaHash = await bcrypt.hash(novaSenha, 10);

                db.run(
                    "UPDATE usuarios SET senha = ? WHERE id = ?",
                    [senhaHash, registro.usuario_id],
                    function (erro) {

                        if (erro) {
                            return res.status(500).json({
                                erro: "Erro ao atualizar senha."
                            });
                        }

                        db.run(
                            "DELETE FROM recuperacao_senha WHERE usuario_id = ?",
                            [registro.usuario_id]
                        );

                        return res.json({
                            sucesso: true,
                            mensagem: "Senha alterada com sucesso!"
                        });
                    }
                );
            }
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}

// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {
    cadastrar,
    login,
    solicitarRecuperacao,
    redefinirSenha
};