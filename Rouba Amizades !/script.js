//const canvas = document.getElementById ('meuCanvas')


const TelaInicial = document.getElementById ('Tela-Inicial')
const BtnJogar = document.getElementById ('iniciarJogo')
const CorPersonagem = document.getElementById ("corPersonagem")
const NomePersonagem = document.getElementById ("nomePersonagem")

let raio = 40
let x = 500
let y = 500
let quadradox= 500
let quadradoy= 100
let perderx = 500
let perdery = 500
let speedx = 0
let speedy = 6
let lado = 30
let lado2 = 30
let nomeJogador = ""
let corPersonagem = "white";
let canvas 
let ctx
const perigosos = []



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

    canvas.addEventListener("mousemove",function(event){
    const rect = canvas.getBoundingClientRect()
    x = event.clientX-rect.left
    y = event.clientY-rect.top

})
})


function resizeCanvas () {
    canvas.width=window.innerWidth
    canvas.height=window.innerHeight

    x=Math.min(Math.max(x,raio), canvas.width-raio)
    y=Math.min(Math.max(y,raio), canvas.height-raio)
   
}


function desenhandoPlayer() {
    ctx.beginPath()
    ctx.arc(x,y,raio,0,Math.PI*2)
    ctx.fillStyle=corPersonagem;
    ctx.fill()
    ctx.closePath()

}

function desenharTeste () {
    ctx.fillStyle="yellow";
    for (let inimigo of perigosos){
        ctx.fillRect(inimigo.x,inimigo.y, inimigo.lado, inimigo.lado)
    }
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
}



function animar () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenhandoPlayer()
    desenharTeste()
    atualizarPosicao()
    verificarColisao()
   

    requestAnimationFrame(animar);

    
    for (let inimigo of perigosos) {
        if (verificarColisaoComPerigoso(inimigo)){  
        inimigo.x = Math.random() * (canvas.width -inimigo.lado)
        inimigo.y = Math.random() * (canvas.height -inimigo.lado)
        }
    }

    const disX = Math.abs(x - (quadradox + lado / 2));
    const disY = Math.abs(y - (quadradoy + lado / 2));

    const colidiuVerde = disX < raio + lado / 2 && disY < raio + lado / 2;

}


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

}

function verificarColisaoComPerigoso (obj) {
    const distX = Math.abs (x-(obj.x+lado/2))
    const distY = Math.abs (y-(obj.y+lado/2))

    return distX <raio +obj.lado/2 && distY <raio +obj.lado/2
}