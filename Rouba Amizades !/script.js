//const canvas = document.getElementById ('meuCanvas')


const TelaInicial = document.getElementById ('Tela-Inicial')
const BtnJogar = document.getElementById ('iniciarJogo')
const CorPersonagem = document.getElementById ("corPersonagem")
const NomePersonagem = document.getElementById ("nomePersonagem")

let raio = 20
let x = 500
let y = 500
let quadradox= 500
let quadradoy= 100
let perderx = 500
let perdery = 500
let bandeirax = 0
let bandeiray = 0
let speedx = 0
let speedy = 6
let lado = 30
let lado2 = 30
let ladoB = 20
let ladoB2 = 20
let nomeJogador = ""
let corPersonagem = "white";
let canvas 
let novaX,novaY
let ctx
let jogador
let vel = 5
let pontuacao = 0

let checkpoint = false

const perigosos = []



let setas = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};


function desenharTelaJogo () {
    ctx.clearRect(0,0,canvas.width,canvas.height)
}



BtnJogar.addEventListener('click',() =>{
    if (NomePersonagem.value.trim() !== "") {
        nomeJogador = NomePersonagem.value.trim()
        TelaInicial.classList.add('hidden')
        corPersonagem=document.getElementById("corPersonagem").value
        canvas=document.createElement("canvas")
        canvas.id="meuCanvas"
        document.body.appendChild(canvas)
        ctx = canvas.getContext("2d")
        window.addEventListener('resize',resizeCanvas)
        resizeCanvas()
        animar()
    } else {
        alert("Por favor insira um nome")
    }
    desenharTelaJogo()
    
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



})


function resizeCanvas () {
    canvas.width=window.innerWidth
    canvas.height=window.innerHeight

    x=Math.min(Math.max(x,raio), canvas.width-raio)
    y=Math.min(Math.max(y,raio), canvas.height-raio)
   
} // faz uma leve atualização na tela do canvas


function desenhandoPlayer() {
    ctx.beginPath()
    ctx.arc(x,y,raio,0,Math.PI*2)
    ctx.fillStyle=corPersonagem;
    ctx.fill()
    ctx.closePath()

} //desenha o circulo branco que segue o jogador.

function desenharTeste () {
    ctx.fillStyle="Red";
    for (let inimigo of perigosos){
        ctx.fillRect(inimigo.x,inimigo.y, inimigo.lado, inimigo.lado)
    }
} //desenha os seres vermelhos

function desenharBandeira () {
    ctx.beginPath()
    bandeiray= canvas.height/2
    ctx.rect(bandeirax,bandeiray,ladoB,ladoB)
    ctx.fillStyle = "Purple"
    ctx.fill()
    ctx.closePath()
}

function atualizarPosicao () {
    quadradox +=speedx
    quadradoy +=speedy


    

     if (quadradox+lado>canvas.width || quadradox-lado<0){
        speedx= -speedx
    }
    
    if (quadradoy+lado>canvas.height || quadradoy-lado<0){
        speedy= -speedy
    }

    
     novaY = y
     novaX = x

        
    if (setas.ArrowUp) {
    novaY -=vel;
    }
    if (setas.ArrowDown) {
    novaY   += vel;
     }
    if (setas.ArrowLeft) {
    novaX   -=vel;
    }
    if (setas.ArrowRight) {
    novaX +=vel;
    }

        if (setas.ArrowUp) novaY -=vel;
        if (setas.ArrowDown) novaY +=vel;
        if (setas.ArrowLeft) novaX -=vel;
        if (setas.ArrowRight) novaX +=vel;

        if (novaX - raio< 0) novaX = raio;
        if (novaX + raio > canvas.width) novaX = canvas.width - raio
        if (novaY - raio< 0) novaY = raio;
        if (novaY + raio > canvas.width) novaY = canvas.height - raio

        x=novaX
        y=novaY
    for (let inimigo of perigosos){
        inimigo.x+= inimigo.velX
        inimigo.y+= inimigo.velY

        if (inimigo.x +inimigo.lado>canvas.width||inimigo.x<0){
            inimigo.velX *= -1
        }
        if (inimigo.y +inimigo.lado>canvas.height||inimigo.y<0){
            inimigo.velY *= -1
        }
    }
} //atualiza a posição criando velocidade



function animar () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenhandoPlayer()
    desenharTeste()
    atualizarPosicao()
    verificarColisao()
    DesenharPontuacao()
    desenharBandeira()

    
    
    if (verificarColisaoComBandeira()) {
        console.log ("Funcionou")
        pontuacao++
    } 

    requestAnimationFrame(animar);

    
    for (let inimigo of perigosos) {
        if (verificarColisaoComPerigoso(inimigo)){  
        x = canvas.width/2
        y = canvas.height/2
        inimigo.x = Math.random() * (canvas.width -inimigo.lado)
        inimigo.y = Math.random() * (canvas.height -inimigo.lado)
        }
    }



} //anima e faz com que tudo o que está descrito nas funções funcionar


function verificarColisao() {
    const disX = Math.abs(x - (quadradox + lado / 2));
    const disY = Math.abs(y - (quadradoy + lado / 2));
    const disX2 = Math.abs(x - (perderx + lado2 / 2));
    const disY2 = Math.abs(y - (perdery + lado2 / 2));

    if (disX < raio + lado / 2 && disY < raio + lado / 2) {
        
        return true;
        
    }

    if (disX2 < raio + lado2 / 2 && disY2 < raio + lado2 / 2) {
        return true;
    }
    
    return false;

} //verifica a colisão

function verificarColisaoComPerigoso (obj) {
    
    const distX = Math.abs (x-(obj.x+lado/2))
    const distY = Math.abs (y-(obj.y+lado/2))

    return distX <raio +obj.lado/2 && distY <raio +obj.lado/2


} //verifica a colisão com o vermelho.

function verificarColisaoComBandeira () {
    const DistX= Math.abs (x-(bandeirax+ladoB/2))
    const DistY = Math.abs (y-(bandeiray+ladoB/2))

    if ( DistX <raio +ladoB/2 && DistY <raio + ladoB/2 ) {
        return true
        console.log ("Verificou")
    } 
    return false
}

function DesenharPontuacao () {
    ctx.fillStyle = "Black"
    ctx.font = "30px Arial"
    ctx.fillText ("Pontuação: "+ pontuacao, 100, 40)
}
    
document.addEventListener('keydown', function(e) {
  if (e.key.toLocaleLowerCase() === "w") {
    setas.ArrowUp = true;
  }
  if (e.key.toLocaleLowerCase() === "s") {
    setas.ArrowDown = true;
  }
  if (e.key.toLocaleLowerCase() === "a") {
    setas.ArrowLeft = true;
  }
  if (e.key.toLocaleLowerCase() === "d") {
    setas.ArrowRight = true;
    console.log ("teste")
  }
});

document.addEventListener('keyup', function(e) {
  if (e.key.toLocaleLowerCase()=== "w") {
    setas.ArrowUp = false;
  }
  if (e.key.toLocaleLowerCase() === "s") {
    setas.ArrowDown = false;
  }
  if (e.key.toLocaleLowerCase() === "a") {
    setas.ArrowLeft = false;
  }
  if (e.key.toLocaleLowerCase() === "d") {
    setas.ArrowRight = false;
  }
});
