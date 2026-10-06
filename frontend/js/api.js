const API = "/api";

async function requisicao(
    endpoint,
    metodo = "GET",
    dados = null
) {

    const opcoes = {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (dados) {
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(
        API + endpoint,
        opcoes
    );

    const resultado =
        await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.erro ||
            "Erro na requisição."
        );
    }

    return resultado;
}