const usuario =
    JSON.parse(
        localStorage.getItem("fitmaxUsuario")
    );

if (!usuario) {

    window.location.href =
        "../index.html";
}

const nomeUsuario =
    document.getElementById(
        "nomeUsuario"
    );

const usuarioNome =
    document.getElementById(
        "usuarioNome"
    );

if (usuario) {

    nomeUsuario.textContent =
        usuario.nome;

    usuarioNome.textContent =
        usuario.nome;
}


// ===========================
// SAIR
// ===========================

function sair() {

    localStorage.removeItem(
        "fitmaxUsuario"
    );

    window.location.href =
        "../index.html";
}


// ===========================
// TREINOS
// ===========================

async function carregarTreinos() {

    try {

        const treinos =
            await requisicao(
                `/treinos/${usuario.id}`
            );

        const lista =
            document.getElementById(
                "listaTreino"
            );

        lista.innerHTML = "";

        treinos.forEach(treino => {

            const item =
                document.createElement("div");

            item.className =
                "item";

            item.innerHTML = `
                <div>
                    <strong>${treino.dia}</strong>
                    <p>${treino.treino}</p>
                </div>

                <button
                    class="delete"
                    onclick="excluirTreino(${treino.id})"
                >
                    🗑️
                </button>
            `;

            lista.appendChild(item);

        });

    } catch (erro) {

        console.error(erro);
    }
}


async function adicionarTreino() {

    const dia =
        document.getElementById(
            "diaTreino"
        ).value;

    const treino =
        document.getElementById(
            "treino"
        ).value.trim();

    if (!treino) {

        alert(
            "Digite o nome do treino."
        );

        return;
    }

    try {

        await requisicao(
            "/treinos",
            "POST",
            {
                usuario_id: usuario.id,
                dia,
                treino
            }
        );

        document.getElementById(
            "treino"
        ).value = "";

        carregarTreinos();

    } catch (erro) {

        alert(erro.message);
    }
}


async function excluirTreino(id) {

    if (!confirm(
        "Deseja excluir este treino?"
    )) {
        return;
    }

    try {

        await requisicao(
            `/treinos/${id}`,
            "DELETE"
        );

        carregarTreinos();

    } catch (erro) {

        alert(erro.message);
    }
}


// ===========================
// REFEIÇÕES
// ===========================

async function carregarRefeicoes() {

    try {

        const refeicoes =
            await requisicao(
                `/refeicoes/${usuario.id}`
            );

        const lista =
            document.getElementById(
                "listaRefeicao"
            );

        lista.innerHTML = "";

        refeicoes.forEach(item => {

            const elemento =
                document.createElement("div");

            elemento.className =
                "item";

            elemento.innerHTML = `
                <div>
                    <strong>
                        🕒 ${item.horario}
                    </strong>

                    <p>
                        🍽️ ${item.refeicao}
                    </p>
                </div>

                <button
                    class="delete"
                    onclick="excluirRefeicao(${item.id})"
                >
                    🗑️
                </button>
            `;

            lista.appendChild(
                elemento
            );

        });

    } catch (erro) {

        console.error(erro);
    }
}


async function adicionarRefeicao() {

    const horario =
        document.getElementById(
            "horaRefeicao"
        ).value;

    const refeicao =
        document.getElementById(
            "refeicao"
        ).value.trim();

    if (!horario || !refeicao) {

        alert(
            "Preencha horário e refeição."
        );

        return;
    }

    try {

        await requisicao(
            "/refeicoes",
            "POST",
            {
                usuario_id: usuario.id,
                horario,
                refeicao
            }
        );

        document.getElementById(
            "horaRefeicao"
        ).value = "";

        document.getElementById(
            "refeicao"
        ).value = "";

        carregarRefeicoes();

    } catch (erro) {

        alert(erro.message);
    }
}


async function excluirRefeicao(id) {

    if (!confirm(
        "Deseja excluir esta refeição?"
    )) {
        return;
    }

    try {

        await requisicao(
            `/refeicoes/${id}`,
            "DELETE"
        );

        carregarRefeicoes();

    } catch (erro) {

        alert(erro.message);
    }
}


// ===========================
// PESOS
// ===========================

async function carregarPesos() {

    try {

        const pesos =
            await requisicao(
                `/pesos/${usuario.id}`
            );

        const lista =
            document.getElementById(
                "historicoPeso"
            );

        const pesoAtual =
            document.getElementById(
                "pesoAtual"
            );

        lista.innerHTML = "";

        if (pesos.length > 0) {

            pesoAtual.innerHTML =
                `Último registro: <strong>${pesos[0].peso} kg</strong>`;

        } else {

            pesoAtual.innerHTML =
                "Nenhum registro ainda.";
        }

        pesos.forEach(item => {

            const elemento =
                document.createElement("div");

            elemento.className =
                "item";

            const data =
                new Date(
                    item.registrado_em
                );

            elemento.innerHTML = `
                <div>
                    <strong>
                        ${item.peso} kg
                    </strong>

                    <p>
                        ${data.toLocaleDateString(
                            "pt-BR"
                        )}
                    </p>
                </div>
            `;

            lista.appendChild(
                elemento
            );

        });

    } catch (erro) {

        console.error(erro);
    }
}


async function adicionarPeso() {

    const peso =
        parseFloat(
            document.getElementById(
                "peso"
            ).value
        );

    if (
        isNaN(peso) ||
        peso <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        return;
    }

    try {

        await requisicao(
            "/pesos",
            "POST",
            {
                usuario_id: usuario.id,
                peso
            }
        );

        document.getElementById(
            "peso"
        ).value = "";

        carregarPesos();

    } catch (erro) {

        alert(erro.message);
    }
}


// ===========================
// IMC
// ===========================

function calcularIMC() {

    const peso =
        parseFloat(
            document.getElementById(
                "pesoImc"
            ).value
        );

    let altura =
        parseFloat(
            document.getElementById(
                "alturaImc"
            ).value
        );

    const resultado =
        document.getElementById(
            "resultadoImc"
        );

    if (
        isNaN(peso) ||
        isNaN(altura) ||
        peso <= 0 ||
        altura <= 0
    ) {

        resultado.textContent =
            "Preencha os dados corretamente.";

        return;
    }

    if (altura > 3) {

        altura =
            altura / 100;
    }

    const imc =
        peso /
        (altura * altura);

    resultado.innerHTML = `
        IMC calculado:
        <strong>${imc.toFixed(1)}</strong>
        <br><br>
        O IMC é apenas um indicador geral e,
        especialmente na adolescência, deve ser
        interpretado por um profissional de saúde.
    `;
}


// ===========================
// INICIALIZAÇÃO
// ===========================

carregarTreinos();
carregarRefeicoes();
carregarPesos();