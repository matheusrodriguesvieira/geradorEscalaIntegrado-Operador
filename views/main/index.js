var DADOS_USUARIO;
var listaEscalaDaTurma;
var turma;

var listaEscalas = [];

var tituloEscalas = document.querySelector('[tituloEscalas]');
let select = document.querySelector('[name = selectTurmas]');
var btnLogout = document.querySelector('[logout]');
var btnRecarregar = document.querySelector('[refresh]');
var ulListaEscalas = document.querySelector('.listaContainer > ul');

async function resetarParametros() {
    const listaEscalaUrl = `https://backend-gerador-integrado.vercel.app/listaEscalas/index?login=${DADOS_USUARIO.matricula}&&turma=${turma}&&gerencia=${DADOS_USUARIO.gerencia}`;
    const CONFIGURACAO = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: DADOS_USUARIO.token
        }
    };


    await fetch(listaEscalaUrl, CONFIGURACAO)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            return response.json();
        })
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
                listaEscalaDaTurma = dados;
            }
        })
        .catch(error => {
            // Lida com erros durante a requisição
            console.error(error);
            console.error('Erro na requisição:', error);
            console.error('Resposta do servidor:', error.response);
        });
}



// ATUALIZA O TÍTULO E O PARAMETRO DA TURMA
function atualizarTituloEscalas() {
    turma = select.value;
    tituloEscalas.innerHTML = '';
    tituloEscalas.innerHTML = `Escalas ${DADOS_USUARIO.gerencia.toUpperCase()} - Turma ${turma.toUpperCase()}`;
}

function atualizarTelaEscalas() {
    ulListaEscalas.innerHTML = '';

    if (listaEscalaDaTurma.message != null) {
        ulListaEscalas.innerHTML += `
        <li>
            ${listaEscalaDaTurma.message}
        </li>
        `;
    } else {
        listaEscalaDaTurma.forEach((escala, index) => {
            ulListaEscalas.innerHTML += `
            <li id="${escala.idlista}">
                <div class="liContainer">
                    <div id="nome-lista-${index}">${escala.nome}</div>
                    <div>${escala.horariocriacao}</div>
                    <div class="controlesContainer">
                        <a class="icon" infoEscala${index}>
                            <img src="../../assets/images/info.svg" alt="" srcset="">
                        </a>
                    </div>
                </div>
            </li>
            `;
        });

        let lis = document.querySelectorAll(`.listaContainer > ul > li`);
        lis.forEach((li, index) => {
            let btnInfoEscala = document.querySelector(`[infoEscala${index}]`);
            let nomeLista = document.querySelector(`#nome-lista-${index}`);


            btnInfoEscala.addEventListener('click', () => {
                let idLista = listaEscalaDaTurma[index].idlista;
                sessionStorage.setItem('idLista', JSON.stringify(idLista));
                mostrarTela2();
            });


            nomeLista.addEventListener('click', () => {
                let idLista = listaEscalaDaTurma[index].idlista;
                sessionStorage.setItem('idLista', JSON.stringify(idLista));
                mostrarTela2();
            });

        });
    }




}

// FUNÇÃO RESPONSÁVEL POR CARREGAR TODOS OS EVENTOS E FUNCIONALIDADES DA APLICAÇÃO
async function carregarAplicacao() {
    atualizarTituloEscalas();
    await resetarParametros();
    atribuirEventos();
    atualizarTelaEscalas();
}

function mostrarTela2() {

    window.location.href = '../table/index.html';
    sessionStorage.setItem('turma', turma);
}

function logout() {
    if (confirm('Já está de saída?')) {
        sessionStorage.clear();
        window.location.replace('../login/index.html');
    }
}

async function recarregarPagina() {
    let componentLoading = document.querySelector('.component-loading-container');
    componentLoading.classList.toggle('mostrar');
    await resetarParametros();
    atualizarTelaEscalas();
    componentLoading.classList.toggle('mostrar');
}

function atribuirEventos() {
    select.addEventListener('change', async () => {
        let componentLoading = document.querySelector('.component-loading-container');
        componentLoading.classList.toggle('mostrar');
        atualizarTituloEscalas();
        await resetarParametros();
        atualizarTelaEscalas();
        componentLoading.classList.toggle('mostrar');
    })

    btnLogout.addEventListener('click', logout);

    btnRecarregar.addEventListener('click', recarregarPagina);

}


window.addEventListener('load', async () => {
    console.log('carregando');
    if (sessionStorage.getItem('data') == null) {

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
                    Toastify({
                        text: `Bem vindo ${DADOS_USUARIO.usuario.toUpperCase()}`,
                        duration: 10000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        close: true,
                        style: {
                            background: 'linear-gradient(45deg, rgba(22,160,133,1) 3%, rgba(46,204,113,1) 35%, rgba(39,174,96,1) 97%)',
                            color: 'rgba(255, 255, 255, 1)',
                            fontWeight: 'bold',
                            borderBottom: '5px solid rgba(185, 89, 70, 1.0)',
                            // heght: '1500px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'


                        },
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                    }).showToast();
                    await carregarAplicacao();
                }
            })
            .catch(error => error.response);

        loading.classList.toggle('mostrar');
    }
});
