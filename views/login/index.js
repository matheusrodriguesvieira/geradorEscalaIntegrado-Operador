const INPUT_USERNAME = document.querySelector('#username');
const INPUT_PASSWORD = document.querySelector('#password');
const BTN_ENTRAR = document.querySelector('#btn-entrar');


function init() {
    sessionStorage.clear();

    BTN_ENTRAR.addEventListener('click', async (e) => {
        e.preventDefault();



        const DATA = {
            login: INPUT_USERNAME.value,
            senha: INPUT_PASSWORD.value
        }
        // const URL = 'backend-rotas-alternativas.vercel.app/supervisores/login';
        const URI = 'https://backend-gerador-integrado.vercel.app/operadores/login';
        const CONFIGURACAO = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(DATA)
        };

        let componentLoading = document.querySelector('.component-loading-container');
        componentLoading.classList.toggle('mostrar');

        await fetch(URI, CONFIGURACAO)
            .then(resposta => {
                return resposta.json()
            })
            .then(dadosResposta => {

                if (dadosResposta.error) {
                    Toastify({
                        text: dadosResposta.message,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "rgba(192, 57, 43,1.0)",
                        }
                    }).showToast();
                } else {

                    let data = {
                        token: dadosResposta.token,
                        matricula: dadosResposta.data.matricula,
                        usuario: dadosResposta.data.nome,
                        gerencia: dadosResposta.data.gerencia
                    }

                    sessionStorage.setItem('data', JSON.stringify(data));

                    Toastify({
                        text: "Login feito com sucesso!",
                        duration: 3000,
                        gravity: "top",
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "rgba(39, 174, 96,1.0)",
                        }
                    }).showToast();

                    window.location.href = '../main/index.html';

                }

            })
            .catch(erro => {
                console.error('Erro:', erro);
                console.error('Resposta do servidor:', erro.response);
            });

        componentLoading.classList.toggle('mostrar');


    })
}

window.addEventListener('load', init);