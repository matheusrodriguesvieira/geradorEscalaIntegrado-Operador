var listaEscalas;
var DADOS_USUARIO;
var idLista;
var btnMostrarTela1 = document.querySelector('[voltar]');
var btnTela4Voltar = document.querySelector('[tela4Voltar]');


function renderizarEscala(escala, operadoresForaEscala) {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    escala.sort((a, b) => {
        return a.tagequipamento < b.tagequipamento ? -1 : a.tagequipamento > b.tagequipamento ? 1 : 0;
    })

    // COR ESPECIAL DE ACORDO COM O ESTADO DO EQUIPAMENTO
    escala.forEach((element, index) => {
        let className;

        if (element.nome == "falta de operador") {
            className = 'semOperador';
        } else if (element.nome == 'manutenção') {
            className = 'manutencao';
        } else if (element.nome == "indisponível") {
            className = 'indisponivel';
        } else if (element.nome == "infraestrutura") {
            className = 'infraestrutura';
        } else if (element.nome == "treinamento") {
            className = 'treinamento';
        } else {
            className = "";
        }

        let novaLinha = `
                            <tr id=${index}>
                                <td col1 class="${className}"><label for="col1${index}">${element.tagequipamento}</label></td>
                                <td col2 class="${className}"><label for="col2${index}">${element.nome}</label></td>
                                <td col3 class="${className}"><label for="col3${index}">${element.localtrabalho}</label></td>
                                <td col4 class="${className}"><label for="col4${index}">${element.tagtransporte}</label></td>
                                <td col5 class="${className}"><label for="col5${index}">${element.atividade}</label></td>
                            </tr>
            
            `;
        tbody.innerHTML += novaLinha;
    });

    let ulOperadoresForaEscala = document.querySelector('.operadoresForaEscalaContainer > ul');
    ulOperadoresForaEscala.innerHTML = '';
    if (operadoresForaEscala.length > 0) {
        operadoresForaEscala.forEach(operador => {
            let li = `
            <li>${operador.nome}</li>
        `;

            ulOperadoresForaEscala.innerHTML += li;
        });
    }
}

async function carregarAplicacao() {

    listaEscalas = {};

    idLista = JSON.parse(sessionStorage.getItem("idLista"));
    const URI = `https://backend-gerador-integrado.vercel.app/listaEscalas/show/${idLista}?login=${DADOS_USUARIO.matricula}`;
    const configuracao = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': DADOS_USUARIO.token
        },
    };

    await fetch(URI, configuracao)
        .then(resposta => resposta.json()) // Converte a resposta para JSON
        .then(dados => {
            if (dados.error) {
                Toastify({
                    text: dados.message,
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "rgba(192, 57, 43,1.0)",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.replace('../login/index.html');
                }, 3000);
            } else {
                listaEscalas = dados;
            }
        })
        .catch(erro => console.error('Erro:', erro));

    renderizarEscala(listaEscalas.escala, listaEscalas.operadoresForaEscala);
    atribuirEventos();
}

function atribuirEventos() {
    // // BOTAO VOLTAR DA TELA 2
    // console.log(btnMostrarTela1);
    btnMostrarTela1.addEventListener('click', () => {
        window.location.replace('../main/index.html');
    });
}





window.addEventListener('load', async () => {
    if (sessionStorage.getItem('data') == null || sessionStorage.getItem('idLista') == null) {
        window.location.replace('../login/index.html');
    } else {
        let loading = document.querySelector('.screen-loading-container');
        let data = JSON.parse(sessionStorage.getItem('data'));
        DADOS_USUARIO = { ...data };


        const URI = `https://backend-gerador-integrado.vercel.app/validate-token/operador?login=${DADOS_USUARIO.matricula}`;
        const CONFIGURAÇÃO = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': DADOS_USUARIO.token
            },
        }

        await fetch(URI, CONFIGURAÇÃO)
            .then(response => {
                return response.json();
            })
            .then(async dados => {
                if (dados.error) {
                    Toastify({
                        text: dados.message,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "rgba(192, 57, 43,1.0)",
                        }
                    }).showToast();

                    setTimeout(() => {
                        window.location.replace('../login/index.html');
                    }, 3000);
                } else {
                    await carregarAplicacao();
                }
            })
            .catch(error => error.response);

        loading.classList.toggle('mostrar');
    }
});
