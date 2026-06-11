// Variáveis de Estado
let estado = "INTRO_1"; // INTRO_1, INTRO_2, PERGUNTA_1, PERGUNTA_2, PERGUNTA_3, JOGO, FIM
let dinheiro = 100; 
let saudeSolo = 50; 

// Elementos do Jogo
let paineisSolares = [];
let nuvensPoluicao = [];
let tempoRestante = 25; 
let timerFim = 0;

function setup() {
  createCanvas(600, 450);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  // Fundo degradê suave simulando o horizonte do campo
  background(225, 238, 225); 
  
  if (estado === "INTRO_1") {
    telaNarrativa("O DESPERTAR DA TERRA", "O ano é 2050. A população mundial atingiu seu ápice e a demanda por alimentos nunca foi tão alta. Mas o velho modelo de agricultura esgotou os recursos do planeta.", "AVANÇAR", "INTRO_2");
  } else if (estado === "INTRO_2") {
    telaNarrativa("A SUA MISSÃO", "Você foi escolhido para liderar a transição ecológica de uma grande fazenda. Através da ciência, dados e respeito à natureza, sua missão é alimentar o mundo sem destruir o solo.", "INICIAR DESAFIO", "PERGUNTA_1");
  } else if (estado === "PERGUNTA_1") {
    telaQuiz("1) O SEGREDO DO SOLO", "Para regenerar a terra e capturar carbono da atmosfera,\nqual estratégia de ponta sua fazenda deve adotar?", "A) Plantio Direto e Integração Lavoura-Pecuária-Floresta (ILPF)", "B) Monocultura intensiva com aração profunda do terreno", 'A');
  } else if (estado === "PERGUNTA_2") {
    telaQuiz("2) A REVOLUÇÃO INVISÍVEL", "Os defensivos químicos tradicionais estão degradando o ecossistema.\nQual alternativa biológica substitui esses produtos com segurança?", "A) Fertilizantes sintéticos de alta solubilidade química", "B) Bioinsumos baseados em microrganismos e fungos benéficos", 'B');
  } else if (estado === "PERGUNTA_3") {
    telaQuiz("3) OLHOS NO CÉU, PÉS NA TERRA", "Sua fazenda quer zerar as emissões de carbono e monitorar a saúde das plantas em tempo real. Qual tecnologia viabiliza isso?", "A) Inteligência Artificial aliada a sensores IoT e imagens de satélite", "B) Tratores maiores movidos a combustíveis fósseis comuns", 'A');
  } else if (estado === "JOGO") {
    executarSimulador();
  } else if (estado === "FIM") {
    telaResultado();
  }
}

// --- DESIGN DAS TELAS FLUIDAS E NARRATIVAS ---

function telaNarrativa(titulo, texto, textoBotao, proximoEstado) {
  // Detalhe visual de folhas ao fundo
  noStroke();
  fill(46, 139, 87, 30);
  ellipse(50, 80, 200, 200);
  ellipse(550, 380, 250, 250);

  // Título Elegante
  fill(34, 110, 34);
  textSize(24);
  textStyle(BOLD);
  text(titulo, width / 2, 100);
  
  // Texto Centralizado com espaçamento correto
  textStyle(NORMAL);
  fill(70);
  textSize(15);
  text(texto, width / 2, 200, 460, 150); // Caixa de texto centralizada para quebra automática
  
  // Botão estilizado
  desenharBotaoElegante(width / 2, 350, 220, 45, textoBotao, color(46, 139, 87));
}

function telaQuiz(titulo, pergunta, optA, optB, correta) {
  // Cabeçalho da pergunta
  fill(34, 110, 34);
  textSize(20);
  textStyle(BOLD);
  text(titulo, width / 2, 60);
  
  // Pergunta contextualizada
  textStyle(NORMAL);
  fill(80);
  textSize(14);
  text(pergunta, width / 2, 120);
  
  // Opções de resposta em caixas elegantes
  desenharBotaoElegante(width / 2, 210, 480, 55, optA, color(255), color(46, 139, 87));
  desenharBotaoElegante(width / 2, 285, 480, 55, optB, color(255), color(46, 139, 87));
  
  // Indicador de fundos lá embaixo
  fill(110);
  textSize(13);
  text("Verba de Investimento Atual: $" + dinheiro, width / 2, 385);
}

// --- GAMEPLAY DO SIMULADOR ---

function iniciarSimulador() {
  estado = "JOGO";
  timerFim = millis() + tempoRestante * 1000;
  paineisSolares = [];
  nuvensPoluicao = [];
}

function executarSimulador() {
  let segundos = ceil((timerFim - millis()) / 1000);
  if (segundos <= 0 || saudeSolo <= 0) estado = "FIM";

  if (frameCount % 30 === 0) saudeSolo -= 2; 

  // Terreno muda dinamicamente de cor baseado na saúde
  noStroke();
  fill(145 - saudeSolo * 0.9, 85 + saudeSolo * 1.1, 30); 
  rect(width / 2, height - 100, width, 200); 

  // Interface Superior Limpa
  fill(60);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT);
  text("Verba: $" + dinheiro, 30, 35);
  text("Saúde do Solo: " + max(0, floor(saudeSolo)) + "%", 150, 35);
  textAlign(RIGHT);
  text("Tempo Restante: " + segundos + "s", width - 30, 35);
  textAlign(CENTER);
  textStyle(NORMAL);

  // Ações da Fazenda do Futuro
  desenharBotaoElegante(160, 85, 250, 40, "Tratamento Bioinsumo (-$50)", color(34, 139, 34));
  desenharBotaoElegante(440, 85, 250, 40, "Instalar Painel Solar (-$80)", color(70, 130, 180));

  // Renderizar Painéis Solares comprados
  for (let p of paineisSolares) {
    fill(40, 70, 140);
    rect(p.x, p.y, 35, 20, 3);
    fill(255, 230, 100);
    ellipse(p.x, p.y - 12, 6, 6);
    if (frameCount % 60 === 0) dinheiro += 10; 
  }

  // Nuvens de degradação ambiental
  if (random(1) < 0.02) nuvensPoluicao.push({ x: width, y: random(280, 340), v: random(1.5, 3) });

  for (let i = nuvensPoluicao.length - 1; i >= 0; i--) {
    nuvensPoluicao[i].x -= nuvensPoluicao[i].v;
    fill(120, 110, 100, 180);
    ellipse(nuvensPoluicao[i].x, nuvensPoluicao[i].y, 40, 22);
    
    if (nuvensPoluicao[i].x < 0) {
      saudeSolo -= 6;
      nuvensPoluicao.splice(i, 1);
    }
  }
}

function telaResultado() {
  textSize(24);
  textStyle(BOLD);
  
  if (saudeSolo >= 72) {
    fill(34, 139, 34);
    text("FAZENDA MODELO SUSTENTÁVEL", width / 2, 120);
    textSize(15);
    textStyle(NORMAL);
    fill(70);
    text("Parabéns! Você provou que tecnologia e ecologia andam juntas.\nO solo está fértil e sua produção está protegida para as próximas gerações.", width / 2, 180);
  } else if (saudeSolo > 0) {
    fill(218, 165, 32);
    text("FAZENDA TRADICIONAL", width / 2, 120);
    textSize(15);
    textStyle(NORMAL);
    fill(70);
    text("A fazenda sobreviveu ao tempo, mas o solo ficou desgastado.\nFalta investir mais em créditos de carbono e bioinsumos.", width / 2, 180);
  } else {
    fill(178, 34, 34);
    text("FAZENDA INSUBISTENTÁVEL", width / 2, 120);
    textSize(15);
    textStyle(NORMAL);
    fill(70);
    text("O ecossistema faliu. A erosão e a falta de nutrientes mataram o solo.\nO futuro exige práticas puramente regenerativas.", width / 2, 180);
  }

  textSize(15);
  fill(0);
  text("Recursos Finais: $" + dinheiro + "  |  Nutrição do Solo: " + floor(max(0, saudeSolo)) + "%", width / 2, 270);

  desenharBotaoElegante(width / 2, 360, 220, 45, "RECOMEÇAR JORNADA", color(90));
}

// --- FUNÇÃO AUXILIAR DE COMPONENTES VISUAIS ---

function desenharBotaoElegante(x, y, l, a, txt, corFundo, corBorda) {
  strokeWeight(1.5);
  if (corBorda) {
    stroke(corBorda);
    fill(corFundo);
  } else {
    noStroke();
    fill(corFundo);
  }
  rect(x, y, l, a, 10); // Cantos arredondados modernos
  
  noStroke();
  // Se for botão branco com borda, pinta o texto de escuro
  if (corBorda) fill(40); 
  else fill(255); 
  
  textSize(13);
  text(txt, x, y, l - 10, a - 10);
}

// --- GERENCIADOR DE CLIQUES ---

function mousePressed() {
  if (estado === "INTRO_1") {
    if (mouseX > width/2 - 110 && mouseX < width/2 + 110 && mouseY > 350 - 22 && mouseY < 350 + 22) estado = "INTRO_2";
  } 
  else if (estado === "INTRO_2") {
    if (mouseX > width/2 - 110 && mouseX < width/2 + 110 && mouseY > 350 - 22 && mouseY < 350 + 22) {
      dinheiro = 100;
      saudeSolo = 50;
      estado = "PERGUNTA_1";
    }
  } 
  else if (estado === "PERGUNTA_1") {
    if (mouseX > width/2 - 240 && mouseX < width/2 + 240) {
      if (mouseY > 210 - 27 && mouseY < 210 + 27) { dinheiro += 100; estado = "PERGUNTA_2"; } // Acertou A
      if (mouseY > 285 - 27 && mouseY < 285 + 27) estado = "PERGUNTA_2"; // Errou B
    }
  } 
  else if (estado === "PERGUNTA_2") {
    if (mouseX > width/2 - 240 && mouseX < width/2 + 240) {
      if (mouseY > 210 - 27 && mouseY < 210 + 27) estado = "PERGUNTA_3"; // Errou A
      if (mouseY > 285 - 27 && mouseY < 285 + 27) { dinheiro += 100; estado = "PERGUNTA_3"; } // Acertou B
    }
  } 
  else if (estado === "PERGUNTA_3") {
    if (mouseX > width/2 - 240 && mouseX < width/2 + 240) {
      if (mouseY > 210 - 27 && mouseY < 210 + 27) { dinheiro += 100; iniciarSimulador(); } // Acertou A
      if (mouseY > 285 - 27 && mouseY < 285 + 27) iniciarSimulador(); // Errou B
    }
  } 
  else if (estado === "JOGO") {
    // Botão Bioinsumo
    if (mouseX > 160 - 125 && mouseX < 160 + 125 && mouseY > 85 - 20 && mouseY < 85 + 20) {
      if (dinheiro >= 50) { dinheiro -= 50; saudeSolo = min(100, saudeSolo + 25); }
    }
    // Botão Painel Solar
    if (mouseX > 440 - 125 && mouseX < 440 + 125 && mouseY > 85 - 20 && mouseY < 85 + 20) {
      if (dinheiro >= 80 && paineisSolares.length < 8) {
        dinheiro -= 80;
        paineisSolares.push({ x: random(60, width - 60), y: random(360, 410) });
      }
    }
  } 
  else if (estado === "FIM") {
    if (mouseX > width/2 - 110 && mouseX < width/2 + 110 && mouseY > 360 - 22 && mouseY < 360 + 22) estado = "INTRO_1";
  }
}

