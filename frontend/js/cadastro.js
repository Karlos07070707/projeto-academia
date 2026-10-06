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