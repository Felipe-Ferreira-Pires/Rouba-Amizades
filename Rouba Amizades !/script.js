const TelaInicial = document.getElementById('Tela-Inicial');
const BtnJogar = document.getElementById('iniciarJogo');
const CorPersonagem = document.getElementById("corPersonagem");
const NomePersonagem = document.getElementById("nomePersonagem");

let raio = 20;
let x = 500;
let y = 500;
let quadradox = 500;
let quadradoy = 100;
let perderx = 500;
let perdery = 500;
let bandeirax = 0;
let bandeiray = 0;
let speedx = 0;
let speedy = 6;
let lado = 30;
let lado2 = 30;
let ladoB = 20;
let ladoB2 = 20;
let nomeJogador = "";
let corPersonagem = "white";
let canvas;
let novaX, novaY;
let ctx;
let jogador;
let vel = 5;
let pontuacao = 0;

let checkpoint = false;
const perigosos = [];

let setas = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};


let tocouPortalEsquerdo = false;
let tocouPortalDireito = false;
let portalEsquerdo = { 
  x: 0,
  y: 0,
  lado: 30,
  ativo: true
};
let portalDireito = { 
  x: 0,
  y: 0,
  lado: 30,
  ativo: true 
};


BtnJogar.addEventListener('click', () => {
  if (NomePersonagem.value.trim() !== "") {
    nomeJogador = NomePersonagem.value.trim();
    TelaInicial.classList.add('hidden');
    corPersonagem = document.getElementById("corPersonagem").value;
    canvas = document.createElement("canvas");
    canvas.id = "meuCanvas";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animar();
  } else {
    alert("Por favor insira um nome");
  }

  let quantidadeMaxima = 20;
  let contador = 0;

  for (let yLinha = 0; yLinha < canvas.height; yLinha += 100) {
    for (let xColuna = 0; xColuna < canvas.width; xColuna += 100) {
      if (contador >= quantidadeMaxima) break;
      perigosos.push({
        x: xColuna,
        y: yLinha,
        lado: 40,
        velX: 0,
        velY: (Math.random() * 2) + 1
      });
      contador++;
    }
    if (contador >= quantidadeMaxima) break;
  }
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  x = Math.min(Math.max(x, raio), canvas.width - raio);
  y = Math.min(Math.max(y, raio), canvas.height - raio);
}

function desenhandoPlayer() {
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, Math.PI * 2);
  ctx.fillStyle = corPersonagem;
  ctx.fill();
  ctx.closePath();
}

function desenharTeste() {
  ctx.fillStyle = "Red";
  for (let inimigo of perigosos) {
    ctx.fillRect(inimigo.x, inimigo.y, inimigo.lado, inimigo.lado);
  }
}


function desenharPortais() {
  const centroY = canvas.height / 2;

  portalEsquerdo.y = centroY - portalEsquerdo.lado / 2;
  portalDireito.x = canvas.width - portalDireito.lado;
  portalDireito.y = centroY - portalDireito.lado / 2;

  if (portalEsquerdo.ativo) {
    ctx.beginPath();
    ctx.rect(portalEsquerdo.x, portalEsquerdo.y, portalEsquerdo.lado, portalEsquerdo.lado);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  if (portalDireito.ativo) {
    ctx.beginPath();
    ctx.rect(portalDireito.x, portalDireito.y, portalDireito.lado, portalDireito.lado);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  }
}


function atualizarPosicao() {
  quadradox += speedx;
  quadradoy += speedy;

  if (quadradox + lado > canvas.width || quadradox - lado < 0) speedx = -speedx;
  if (quadradoy + lado > canvas.height || quadradoy - lado < 0) speedy = -speedy;

  novaY = y;
  novaX = x;

  if (setas.ArrowUp) novaY -= vel;
  if (setas.ArrowDown) novaY += vel;
  if (setas.ArrowLeft) novaX -= vel;
  if (setas.ArrowRight) novaX += vel;

  if (novaX - raio < 0) novaX = raio;
  if (novaX + raio > canvas.width) novaX = canvas.width - raio;
  if (novaY - raio < 0) novaY = raio;
  if (novaY + raio > canvas.height) novaY = canvas.height - raio;

  x = novaX;
  y = novaY;

  for (let inimigo of perigosos) {
    inimigo.x += inimigo.velX;
    inimigo.y += inimigo.velY;

    if (inimigo.x + inimigo.lado > canvas.width || inimigo.x < 0) inimigo.velX *= -1;
    if (inimigo.y + inimigo.lado > canvas.height || inimigo.y < 0) inimigo.velY *= -1;
  }
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenhandoPlayer();
  desenharTeste();
  atualizarPosicao();
  verificarColisao();
  DesenharPontuacao();
  desenharPortais();

  if (portalEsquerdo.ativo && verificarColisaoComPortal(portalEsquerdo)) {
  tocouPortalEsquerdo = true;
}
if (portalDireito.ativo && verificarColisaoComPortal(portalDireito)) {
  tocouPortalDireito = true;
}


if (portalEsquerdo.ativo && verificarColisaoComPortal(portalEsquerdo)) {
  tocouPortalEsquerdo = true;
  portalEsquerdo.ativo = false; 
  setTimeout(() => {
    portalEsquerdo.ativo = true;
  }, 3000);
}
if (portalDireito.ativo && verificarColisaoComPortal(portalDireito)) {
  tocouPortalDireito = true;
  portalDireito.ativo = false;
  setTimeout(() => {
    portalDireito.ativo = true;
  }, 3000);
}

if (tocouPortalEsquerdo && x >= canvas.width / 2 - raio && x <= canvas.width / 2 + raio) {
  pontuacao++;
  tocouPortalEsquerdo = false;
}

if (tocouPortalDireito && x >= canvas.width / 2 - raio && x <= canvas.width / 2 + raio) {
  pontuacao++;
  tocouPortalDireito = false;
}



  for (let inimigo of perigosos) {
    if (verificarColisaoComPerigoso(inimigo)) {
      x = canvas.width / 2;
      y = canvas.height / 2;
      inimigo.x = Math.random() * (canvas.width - inimigo.lado);
      inimigo.y = Math.random() * (canvas.height - inimigo.lado);
    }
  }

  requestAnimationFrame(animar);
}

function verificarColisao() {
  const disX = Math.abs(x - (quadradox + lado / 2));
  const disY = Math.abs(y - (quadradoy + lado / 2));
  const disX2 = Math.abs(x - (perderx + lado2 / 2));
  const disY2 = Math.abs(y - (perdery + lado2 / 2));
  return (disX < raio + lado / 2 && disY < raio + lado / 2) || (disX2 < raio + lado2 / 2 && disY2 < raio + lado2 / 2);
}

function verificarColisaoComPerigoso(obj) {
  const distX = Math.abs(x - (obj.x + obj.lado / 2));
  const distY = Math.abs(y - (obj.y + obj.lado / 2));
  return distX < raio + obj.lado / 2 && distY < raio + obj.lado / 2;
}

function verificarColisaoComPortal(portal) {
  const distX = Math.abs(x - (portal.x + portal.lado / 2));
  const distY = Math.abs(y - (portal.y + portal.lado / 2));
  return distX < raio + portal.lado / 2 && distY < raio + portal.lado / 2;
}

function DesenharPontuacao() {
  ctx.fillStyle = "Black";
  ctx.font = "30px Arial";
  ctx.fillText("Pontuação: " + pontuacao, 100, 40);
}

document.addEventListener('keydown', function (e) {
  if (e.key.toLowerCase() === "w") setas.ArrowUp = true;
  if (e.key.toLowerCase() === "s") setas.ArrowDown = true;
  if (e.key.toLowerCase() === "a") setas.ArrowLeft = true;
  if (e.key.toLowerCase() === "d") setas.ArrowRight = true;
});

document.addEventListener('keyup', function (e) {
  if (e.key.toLowerCase() === "w") setas.ArrowUp = false;
  if (e.key.toLowerCase() === "s") setas.ArrowDown = false;
  if (e.key.toLowerCase() === "a") setas.ArrowLeft = false;
  if (e.key.toLowerCase() === "d") setas.ArrowRight = false;
});
