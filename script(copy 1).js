const somPlim = document.getElementById('som-plim')
const app = document.getElementById('app')
const body = document.getElementById('body')
let avaliacoes = 0
let saldo = 50
let rodada = 1
let tipoChave = 'cpf'

const produtosBase = [
  [
    { nome: 'Bolsa Carmen Steffens', imagem: 'assets/1.png', valor: 8.05 },
    { nome: 'Tênis Adidas', imagem: 'assets/2.png', valor: 7.24 },
    { nome: 'Relógio Smart', imagem: 'assets/3.png', valor: 9.60 }
  ],
  [
    { nome: 'Produto Extra 1', imagem: 'assets/4.png', valor: 10.25 },
    { nome: 'Produto Extra 2', imagem: 'assets/5.png', valor: 6.75 },
    { nome: 'Produto Extra 3', imagem: 'assets/6.png', valor: 8.10 }
  ]
]

function getProdutos() {
  return produtosBase[rodada - 1]
}

function renderHeader() {
  return `
    <div class="w-full bg-[#fffbe9] p-4 mb-4">
      <div class="max-w-md mx-auto">
        <div class="flex justify-between items-start">
          <img src="assets/logo.png" alt="PixMyDollar Logo" class="h-10">
          <div class="text-right">
            <p class="text-red-600 font-bold text-lg">R$ ${saldo.toFixed(2)}</p>
            <p class="text-sm text-[#14486a] font-semibold">US$ ${(saldo / 6.17).toFixed(2)}</p>
          </div>
        </div>
        <div class="w-full h-2 bg-[#fdf1c7] rounded-full overflow-hidden mt-2">
          <div id="progresso" class="h-full bg-red-600 transition-all duration-500" style="width: ${(avaliacoes / 3) * 100}%"></div>
        </div>
        <p class="text-[#14486a] text-sm mt-1 font-semibold text-left">Seu progresso</p>
      </div>
    </div>
  `
}

function renderInicio() {
  body.className = 'bg-[#0d3d61] text-center text-white'
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full">
        <h1 class="text-3xl font-bold mb-4">Parabéns!</h1>
        <p class="mb-3">Você acaba de ganhar 1 licença gratuita para avaliar produtos em nosso app!</p>
        <p class="mb-3 font-bold">Aproveite, você já ganhou <span class="text-red-600">R$ 50,00!</span></p>
        <p class="mb-6">Avalie 3 produtos e realize seu primeiro saque!</p>
        <button onclick="renderProduto()" class="bg-[#0d3d61] text-white px-6 py-3 rounded-full font-bold w-full">Começar!</button>
      </div>
    </div>
  `
}

function renderProduto() {
  body.className = 'bg-[#fffbe9] text-[#0d3d61]'
  const produto = getProdutos()[avaliacoes % 3]
  app.innerHTML = `
    ${renderHeader()}
    <div class="p-4 rounded-lg max-w-md w-full mx-auto">
      <div class="relative">
        <img src="${produto.imagem}" alt="Produto" class="rounded-lg mb-4 w-full">
        <div class="absolute top-2 right-2 bg-[#0d3d61] text-white text-sm font-bold px-3 py-1 rounded-md shadow">+US$ ${produto.valor.toFixed(2)}</div>
      </div>
      <p class="text-black font-bold mb-2 text-lg">Você compraria esse produto?</p>
      <div class="space-y-4">
        <button onclick="responder(${produto.valor})" class="bg-[#14486a] w-full py-3 rounded-full font-bold text-white shadow-md">Com certeza! 👍</button>
        <button onclick="responder(${produto.valor})" class="bg-[#dc2626] w-full py-3 rounded-full font-bold text-white shadow-md">Não sei ao certo...</button>
        <button onclick="responder(${produto.valor})" class="bg-[#0a0a0a] w-full py-3 rounded-full font-bold text-white shadow-md">👎 Jamais!</button>
      </div>
    </div>
  `
}


function responder(valor) {
  somPlim.currentTime = 0
  somPlim.play()
  saldo += valor * 6.17
  avaliacoes++

  if (avaliacoes === 3 && rodada === 1) {
    setTimeout(() => mostrarPopupIntermediarioRodada1(), 500)
    return
  }

  if (avaliacoes === 3 && rodada === 2) {
    setTimeout(() => mostrarPopupFinal(), 500)
    return
  }

  document.querySelectorAll('p.text-red-600')[0].innerText = `R$ ${saldo.toFixed(2)}`
  document.getElementById('progresso').style.width = `${(avaliacoes % 3 / 3) * 100}%`
  mostrarPopup(valor)
}





function fecharPopupFinal() {
  const popup = document.querySelector('.fixed.inset-0')
  if (popup) popup.remove()
  mostrarVideoFinal()
}



function mostrarPopup(valor) {
  if (avaliacoes >= 6) return

  const popup = document.createElement('div')
  popup.className = "fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50"
  popup.innerHTML = `
<div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
  <dotlottie-player src="https://lottie.host/6305a14f-505f-4fdc-8582-fe1b1c654979/gvHefJi2yG.lottie" background="transparent" speed="1" style="width: 180px; height: 180px; margin: 0 auto" autoplay></dotlottie-player>
  <h2 class="text-2xl font-bold mb-2">Saldo atualizado!</h2>
  <p class="mb-2 font-semibold">Você recebeu:</p>
  <p class="text-red-600 text-3xl font-extrabold mb-6">R$ ${(valor * 6.17).toFixed(2)}</p>
</div>
`
  document.body.appendChild(popup)
  document.getElementById('som-plim')?.play()

  setTimeout(() => {
    popup.remove()
    mostrarProcurandoAvaliacoes()
  }, 2000)
}


function mostrarProcurandoAvaliacoes() {
  app.innerHTML = `
${renderHeader()}
<div class="bg-[#fffbe9] text-[#0d3d61] flex flex-col items-center justify-center pt-12 pb-6 px-4">
  <dotlottie-player src="https://lottie.host/cd92bcc5-d6d5-4249-a4c3-1df077f19c4f/nAu1U1ammt.lottie" background="transparent" speed="1" style="width: 180px; height: 180px;" loop autoplay></dotlottie-player>
  <p class="text-[#14486a] font-bold text-lg mt-4 tracking-widest">PROCURANDO NOVA AVALIAÇÃO...</p>
</div>
`

  setTimeout(() => {
    buscarProxima()
  }, 2000)
}





function buscarProxima() {
  if (avaliacoes < 3 || (avaliacoes < 6 && rodada === 2)) renderProduto()
}


function renderFinal() {
  app.innerHTML = `
    ${renderHeader()}
    <div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto">
      <h1 class="text-3xl font-bold mb-4">Parabéns!</h1>
      <p class="mb-3">Você acaba de ganhar <span class="text-red-600">R$ ${saldo.toFixed(2)}</span>!</p>
      <p class="mb-6">Assista um curto vídeo explicando como cadastrar sua chave PIX e realizar o seu primeiro SAQUE.</p>
      <button onclick="mostrarVideo()" class="bg-[#0d3d61] text-white px-6 py-3 rounded-full font-bold w-full">Assistir vídeo</button>
    </div>
  `
}

function mostrarVideo() {
  app.innerHTML = `
    ${renderHeader()}
    <div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto">
      <h2 class="text-xl font-bold mb-2 text-red-600">⚠️ Assista esse vídeo com atenção!</h2>
      <video autoplay muted loop playsinline> <source src="assets/v1.mp4" type="video/mp4"> </video>
      <div id="liberarBtn" class="mt-4 hidden">
        <button onclick="mostrarPopupDeposito()" class="bg-[#0d3d61] text-white px-6 py-3 rounded-full font-bold w-full">Liberar acesso</button>
      </div>
    </div>
  `

  setTimeout(() => {
    document.getElementById('liberarBtn').classList.remove('hidden')
  }, 533000)
}


function mostrarPopupDeposito() {
  app.innerHTML = `
    <div class="fixed inset-0 bg-[#0d3d61] text-white flex items-center justify-center px-4">
      <div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h2 class="text-xl font-bold text-red-600 mb-2">Atenção</h2>
        <p class="text-base font-medium mb-2">Como forma de pré-validação, precisamos verificar sua chave Pix para recebimento dos valores.</p>
        <p class="text-base font-medium mb-6">Certifique-se de inserir corretamente a chave PIX, pois é por meio dela que você receberá o valor acumulado e os futuros pagamentos do PixMyDollar.</p>
        <button onclick="mostrarFormularioPix()" class="mt-4 bg-[#0d3d61] text-white font-bold py-3 px-6 rounded-full w-full shadow-md">Ok!</button>
      </div>
    </div>
  `
}
function mostrarFormularioPix() {
  app.innerHTML = `
${renderHeader()}
<div class="p-6 max-w-md mx-auto">
  <h2 class="text-lg font-bold text-[#0d3d61] mb-2">Seu saldo</h2>
  <div class="text-4xl text-red-600 font-bold mb-1">R$ ${saldo.toFixed(2)}</div>
  <div class="text-xl font-semibold text-[#0d3d61] mb-4">US$ ${(saldo / 6.17).toFixed(2)}</div>
  <p class="text-[#0d3d61] font-semibold mb-2">Selecione seu tipo de chave PIX</p>
  <div class="flex gap-4 justify-center mb-4">
    <button onclick="selecionarTipo('cpf')" id="btn-cpf" class="${tipoChave === 'cpf' ? 'bg-[#0d3d61] text-white' : 'bg-[#fef3c7] text-[#0d3d61]'} font-bold py-4 px-5 rounded-xl flex flex-col items-center gap-1 w-28">
      <svg width="28" height="28" fill="${tipoChave === 'cpf' ? 'white' : '#0d3d61'}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M-21.5,3H-26V.5a.5.5,0,0,0-.5-.5h-5a.5.5,0,0,0-.5.5V3h-4.5a.5.5,0,0,0-.5.5v12a.5.5,0,0,0,.5.5h15a.5.5,0,0,0,.5-.5V3.5A.5.5,0,0,0-21.5,3ZM-31,3V1h4V3a2,2,0,0,1-2,2A2,2,0,0,1-31,3Zm9,12H-36V4h4.184A3,3,0,0,0-29,6a3,3,0,0,0,2.816-2H-22Zm-7.5-7a2,2,0,0,0-2-2,2,2,0,0,0-2,2,2,2,0,0,0,2,2A2,2,0,0,0-29.5,8Zm-2,1a1,1,0,0,1-1-1,1,1,0,0,1,1-1,1,1,0,0,1,1,1A1,1,0,0,1-31.5,9Zm1,1h-2A2.5,2.5,0,0,0-35,12.5,1.5,1.5,0,0,0-33.5,14h4A1.5,1.5,0,0,0-28,12.5,2.5,2.5,0,0,0-30.5,10Zm1,3h-4a.5.5,0,0,1-.5-.5A1.5,1.5,0,0,1-32.5,11h2A1.5,1.5,0,0,1-29,12.5.5.5,0,0,1-29.5,13Zm6-6a.5.5,0,0,1,.5.5.5.5,0,0,1-.5.5h-4a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5Zm.5,3.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5h3A.5.5,0,0,1-23,10.5Zm0,3a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5h3A.5.5,0,0,1-23,13.5Z" transform="translate(37)"/>
      </svg>
      <span>CPF</span>
    </button>
    <button onclick="selecionarTipo('telefone')" id="btn-telefone" class="${tipoChave === 'telefone' ? 'bg-[#0d3d61] text-white' : 'bg-[#fef3c7] text-[#0d3d61]'} font-bold py-4 px-5 rounded-xl flex flex-col items-center gap-1 w-28">
      <svg width="28" height="28" fill="${tipoChave === 'telefone' ? 'white' : '#0d3d61'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="5.32" y="1.5" width="13.36" height="21" rx="1.91" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="5.32" y1="18.68" x2="18.68" y2="18.68" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Telefone</span>
    </button>
  </div>
  <input id="input-chave" type="text" placeholder="Digite sua chave PIX..." class="border-b-2 w-full py-2 text-[#0d3d61] mb-6 focus:outline-none focus:border-[#0d3d61]">
  <button onclick="validarChave()" class="bg-red-600 text-white font-bold py-3 px-6 rounded-full w-full shadow-md">Cadastrar PIX</button>
</div>
`
  aplicarMascaraInput(document.getElementById('input-chave'))
}


function selecionarTipo(tipo) {
  tipoChave = tipo
  mostrarFormularioPix()
}




function validarChave() {
  const input = document.getElementById('input-chave')
  const valor = input.value.trim()
  if (tipoChave === 'cpf' && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valor)) {
    alert('Digite um CPF válido. Ex: 123.456.789-00')
    return
  }
  if (tipoChave === 'telefone' && !/^\(\d{2}\) \d{5}-\d{4}$/.test(valor)) {
    alert('Digite um telefone válido. Ex: (11) 91234-5678')
    return
  }
  mostrarAvisoPixTeste()
}

function aplicarMascaraInput(input) {
  if (input.dataset.masked) return
  input.dataset.masked = "true"
  input.addEventListener('input', () => {
    let valor = input.value.replace(/\D/g, '')
    if (tipoChave === 'cpf') {
      if (valor.length > 11) valor = valor.slice(0, 11)
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else {
      if (valor.length > 11) valor = valor.slice(0, 11)
      valor = valor.replace(/(\d{2})(\d)/, '($1) $2')
      valor = valor.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    }
    input.value = valor
  })
}



function mostrarAvisoPixTeste() {
  app.innerHTML = `
    <div class="fixed inset-0 bg-[#0d3d61] text-white flex items-center justify-center px-4">
      <div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
        <p class="text-lg font-bold mb-2 text-bold">Chave Pix verificada com sucesso</p>
        <p class="text-base font-medium mb-6">Agora basta realizar mais 3 avaliações para realizar seu primeiro saque completo.</p>
        <button onclick="iniciarSegundaRodada()" class="mt-4 bg-[#0d3d61] text-white font-bold py-3 px-6 rounded-full w-full shadow-md">Ok!</button>
      </div>
    </div>
  `
}

function iniciarSegundaRodada() {
  avaliacoes = 0
  rodada = 2
  renderProduto()
}


function mostrarPopupFinal() {
  const popup = document.createElement('div')
  popup.className = "fixed inset-0 bg-[#0d3d61] bg-opacity-95 flex items-center justify-center z-50 px-4"
  popup.innerHTML = `
<div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
  <dotlottie-player src="https://lottie.host/a8557bca-3d1a-4ae1-8ffb-c205f725d1a5/f79HSUD6Ht.lottie" background="transparent" speed="1" style="width: 200px; height: 200px; margin: 0 auto" autoplay loop></dotlottie-player>
  <h2 class="text-2xl font-extrabold mt-4 mb-2">Parabéns!</h2>
  <p class="text-lg font-semibold mb-1">Você acumulou <span class="text-red-600">R$ ${saldo.toFixed(2)}</span>!</p>
  <p class="text-sm text-red-600 font-bold mt-3">Atenção:</p>
  <p class="text-sm font-medium text-[#0d3d61] mb-4">Assista um aviso importante de 30 segundos para criar sua conta e finalizar seu saque!</p>
  <button onclick="mostrarVideoFinalCompleto()" class="bg-[#0d3d61] text-white font-bold py-3 px-6 rounded-full w-full shadow-md">Assistir vídeo</button>
</div>
`
  document.body.appendChild(popup)
}
function mostrarVideoFinalCompleto() {
  const popup = document.querySelector('.fixed.inset-0')
  if (popup) popup.remove()

  app.innerHTML = `
    ${renderHeader()}
    <div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto">
      <h2 class="text-xl font-bold mb-2 text-red-600">⚠️ Assista esse vídeo com atenção!</h2>
      <video autoplay muted loop playsinline> <source src="assets/v2.mp4" type="video/mp4"> </video>
      <div id="liberarFinal" class="mt-4 hidden">
        <button onclick="redirecionarFinal()" class="bg-[#0d3d61] text-white px-6 py-3 rounded-full font-bold w-full">Garantir acesso</button>
      </div>
    </div>
  `

  setTimeout(() => {
    document.getElementById('liberarFinal').classList.remove('hidden')
  }, 260000)
}

function redirecionarFinal() {
  var currentUrlParams = window.location.search;
  window.location.href = "Pagamento Seguro - Checkout.html" + currentUrlParams;
  
}

function mostrarPopupIntermediarioRodada1() {
  const popup = document.createElement('div')
  popup.className = "fixed inset-0 bg-[#0d3d61] flex items-center justify-center z-50 px-4"
  popup.innerHTML = `
<div class="bg-[#fffbe9] text-[#0d3d61] p-6 rounded-3xl shadow-xl max-w-md w-full text-center">
  <h2 class="text-3xl font-extrabold mb-3">Parabéns!</h2>
  <p class="text-lg font-semibold mb-3">Você acaba de ganhar <span class="text-red-600 font-bold">R$ ${saldo.toFixed(2)}</span>!</p>
  <p class="text-base leading-relaxed font-medium mb-6">
    Assista um curto vídeo com um passo a passo explicativo para você aprender a cadastrar sua chave 
    <span class="font-bold">PIX</span> e realizar o seu primeiro <span class="font-bold">SAQUE</span>.
  </p>
  <button onclick="fecharPopupIntermediario()" class="bg-[#0d3d61] text-white font-bold py-3 px-6 rounded-full w-full shadow-md text-lg">Assistir vídeo</button>
</div>
`
  document.body.appendChild(popup)
}

function fecharPopupIntermediario() {
  const popup = document.querySelector('.fixed.inset-0')
  if (popup) popup.remove()
  mostrarVideo()
}



renderInicio()