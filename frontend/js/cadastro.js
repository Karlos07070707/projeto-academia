const loginForm =
    document.getElementById("loginForm");

const cadastroForm =
    document.getElementById("cadastroForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            const email =
                document.getElementById(
                    "email"
                ).value;

            const senha =
                document.getElementById(
                    "senha"
                ).value;

            const mensagem =
                document.getElementById(
                    "mensagem"
                );

            try {

                const resultado =
                    await requisicao(
                        "/usuarios/login",
                        "POST",
                        {
                            email,
                            senha
                        }
                    );

                localStorage.setItem(
                    "fitmaxUsuario",
                    JSON.stringify(
                        resultado.usuario
                    )
                );

                window.location.href =
                    "pages/dashboard.html";

            } catch (erro) {

                mensagem.textContent =
                    erro.message;

                mensagem.className =
                    "erro";
            }
        }
    );
}

if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            const nome =
                document.getElementById(
                    "nome"
                ).value;

            const email =
                document.getElementById(
                    "email"
                ).value;

            const senha =
                document.getElementById(
                    "senha"
                ).value;

            const mensagem =
                document.getElementById(
                    "mensagem"
                );

            try {

                await requisicao(
                    "/usuarios/cadastro",
                    "POST",
                    {
                        nome,
                        email,
                        senha
                    }
                );

                mensagem.textContent =
                    "Cadastro realizado! Redirecionando...";

                mensagem.className =
                    "sucesso";

                setTimeout(() => {

                    window.location.href =
                        "../index.html";

                }, 1500);

            } catch (erro) {

                mensagem.textContent =
                    erro.message;

                mensagem.className =
                    "erro";
            }
        }
    );
}
// ======================================
// RECUPERAÇÃO DE SENHA
// ======================================

const esqueciSenhaLink =
    document.getElementById("esqueciSenhaLink");

const recuperacaoBox =
    document.getElementById("recuperacaoBox");

const voltarLogin =
    document.getElementById("voltarLogin");

const loginFormRecuperacao =
    document.getElementById("loginForm");

const recuperacaoForm =
    document.getElementById("recuperacaoForm");

const novaSenhaForm =
    document.getElementById("novaSenhaForm");

const mensagemRecuperacao =
    document.getElementById("mensagemRecuperacao");

if (esqueciSenhaLink) {

    esqueciSenhaLink.addEventListener("click", function(evento) {

        evento.preventDefault();

        loginFormRecuperacao.hidden = true;
        recuperacaoBox.hidden = false;

    });

}

if (voltarLogin) {

    voltarLogin.addEventListener("click", function(evento) {

        evento.preventDefault();

        recuperacaoBox.hidden = true;
        loginFormRecuperacao.hidden = false;

        recuperacaoForm.hidden = false;
        novaSenhaForm.hidden = true;

        mensagemRecuperacao.textContent = "";

    });

}

// ENVIAR CÓDIGO

if (recuperacaoForm) {

    recuperacaoForm.addEventListener("submit", async function(evento) {

        evento.preventDefault();

        const email = document.getElementById(
            "emailRecuperacao"
        ).value.trim();

        try {

            const resultado = await requisicao(
                "/usuarios/recuperar-senha",
                "POST",
                { email }
            );

            mensagemRecuperacao.textContent =
                resultado.mensagem;

            mensagemRecuperacao.className = "sucesso";

            recuperacaoForm.hidden = true;
            novaSenhaForm.hidden = false;

        } catch (erro) {

            mensagemRecuperacao.textContent = erro.message;
            mensagemRecuperacao.className = "erro";

        }

    });

}

// ALTERAR SENHA

if (novaSenhaForm) {

    novaSenhaForm.addEventListener("submit", async function(evento) {

        evento.preventDefault();

        const email = document.getElementById(
            "emailRecuperacao"
        ).value.trim();

        const codigo = document.getElementById(
            "codigoRecuperacao"
        ).value.trim();

        const novaSenha = document.getElementById(
            "novaSenha"
        ).value;

        try {

            const resultado = await requisicao(
                "/usuarios/redefinir-senha",
                "POST",
                {
                    email,
                    codigo,
                    novaSenha
                }
            );

            mensagemRecuperacao.textContent =
                resultado.mensagem;

            mensagemRecuperacao.className = "sucesso";

            novaSenhaForm.hidden = true;

            setTimeout(() => {

                recuperacaoBox.hidden = true;
                loginFormRecuperacao.hidden = false;

                recuperacaoForm.hidden = false;

                document.getElementById("senha").value = "";

                mensagemRecuperacao.textContent = "";

            }, 2500);

        } catch (erro) {

            mensagemRecuperacao.textContent = erro.message;
            mensagemRecuperacao.className = "erro";

        }

    });

}
document.getElementById("esqueciSenhaLink")
    ?.addEventListener("click", function () {
        alert("Botão de recuperação funcionando!");
    });