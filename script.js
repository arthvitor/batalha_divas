// Gráfico de popularidade
async function grafico1(dado) {
  // Lê dados como um array de objetos (lista de dicionários)
  const dados = dado;

  // Blocos de div do gráfico
  let div_geral = document.createElement('div');
  div_geral.classList.add('div-geral-g1');

  let div_coluna1 = document.createElement('div');
  div_coluna1.classList.add('div-coluna1');

  let div_coluna2 = document.createElement('div');
  div_coluna2.classList.add('div-coluna2');

      for (let x of dados) {
        let div_linha = document.createElement('div');
        div_linha.classList.add('div-linha-g1');

        // Definindo o gráfico por linha
        // imagem
        let img_grafico = document.createElement('img');
        img_grafico.classList.add('img-grafico');
        img_grafico.src = x.ArtistImageURL;

        // Texto da faixa
        let texto_faixa = document.createElement('p');
        texto_faixa.classList.add('p-faixa');
        texto_faixa.textContent = x.Track;

        // Espaço entre elementos contextuais e o gráfico
        let span_espaco = document.createElement('span');
        span_espaco.classList.add('span-espaco');
        span_espaco.style.width = '2px';

        // Barra do gráfico
        let div_barra = document.createElement('div');
        div_barra.classList.add('div-barra');
        div_barra.style.width = x.Popularity * 1.2 + 'px';

        if (x.Artist === 'Taylor Swift') {
          div_barra.style.background = '#6597b0';
        };

        if (x.Artist === 'Beyoncé') {
          div_barra.style.background = '#ba7c54';
        };

        // Texto para aparecer ao lado da barra
        let texto_barra = document.createElement('p');
        texto_barra.classList.add('texto-barra');
        texto_barra.textContent = x.Popularity;

        // tooltip
        // Criando espaço para o tocador do spotify
        let tocador = document.createElement('iframe');
        tocador.classList.add('tooltip-spotify');
        let tooltip = document.createElement('div');
        tooltip.classList.add('tooltip-conteudo');

        tocador.innerHTML = `
        style="border-radius:12px" 
        src="" width="100%" 
        height="352" 
        frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; 
        clipboard-write; 
        encrypted-media; 
        fullscreen; 
        picture-in-picture" 
        loading="lazy"
        `;

        div_linha.onmouseover = () => {
            let id = x.Id;
            let url = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`
            tocador.src = url;
        };

        // Adicionando os elementos às divs
        div_linha.append(img_grafico); //imagem do gráfico
        div_linha.append(texto_faixa); //texto da faixa
        div_linha.append(span_espaco); //espaço
        div_linha.append(div_barra); //tamanho da barra
        div_linha.append(texto_barra); //número do gráfico
        // tooltip.append(tocador);
        // div_linha.append(tooltip);
        
        // Adicionando o top de popularidade a coluna certa
        switch (x.Artist) {
          case 'Beyoncé':
            div_coluna1.append(div_linha);
            div_geral.append(div_coluna2);
            break

          case 'Taylor Swift':
            div_coluna2.append(div_linha);
            div_geral.append(div_coluna1);
            break
        };

        // Adicionando a função ao gráfico no scrolly
        let grafico = document.querySelector('#sticky');
        grafico.append(div_geral);
      };
};

// Defina largura e altura como variáveis globais
const largura = 800; // Largura do gráfico
const altura = 400; // Altura do gráfico

// Função para criar gráfico em SVG
async function grafico2(metrica, dado) {
  // Lendo dados
  const dados = dado;

  // Identificar automaticamente a escala com base nos dados
  const valores = dados.map((d) => +d[metrica]);
  const maxValor = d3.max(valores);
  const minValor = d3.min(valores);

  let escalaX;

  // Verificar a escala automaticamente com base nos valores dos dados
  if (minValor >= 0 && maxValor <= 1) {
    escalaX = d3.scaleLinear()
      .domain([0, 1])
      .range([0, largura]);
  } else if (minValor >= -100 && maxValor <= 100) {
    escalaX = d3.scaleLinear()
      .domain([-15, 0])
      .range([0, largura]);
  } else {
    // Use uma escala padrão se não corresponder a nenhuma condição
    escalaX = d3.scaleLinear()
      .domain([minValor, maxValor])
      .range([0, largura]);
  };

  // Criando div para o SVG ser armazenado
  let g_linha = document.createElement('div');
  g_linha.classList.add('grafico-svg');
  g_linha.setAttribute('data-viewbox', `0 0 ${largura} 150`);

  // Criando SVG dentro da DIV
  let g_svg = d3.select(g_linha)
    .append('svg')
    .attr('class', 'svg-linha')
    .attr('viewBox', `0 0 ${largura} 150`); // Use as variáveis largura e altura

  // Criar o tooltip uma vez e ocultá-lo inicialmente
  let tooltip = document.createElement('div');
  tooltip.classList.add('tooltip-conteudo-g2');
  tooltip.style.display = 'none'; // Oculta o tooltip inicialmente
  g_linha.appendChild(tooltip); // Adicione o tooltip à div que contém o gráfico

  // Tamanho do círculo
  const raioCirculo = 10; // Raio do círculo

  // Adicione uma linha horizontal abaixo dos círculos (escala em branco)
  g_svg.append("line")
  .attr("x1", -10)
  .attr("y1", 50)
  .attr("x2", 810)
  .attr("y2", 50)
  .attr("stroke", "white");

  // Adicione texto "0" abaixo da linha
  g_svg.append("text")
    .attr("x", -10)
    .attr("y", 100)
    .attr("fill", "white")
    .text(minValor);

  // Adicione texto do valor máximo abaixo da linha
  const valorMaximo = d3.max(dados, (d) => +d[metrica]);
  g_svg.append("text")
    .attr("x", 850)
    .attr("y", 110)
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .text(valorMaximo);

    g_svg.selectAll("circle")
    .data(dados)
    .enter()
    .append("circle")
    .attr('cx', (d) => escalaX (+d[metrica]))
    .attr('cy', '50')
    .attr('r', raioCirculo)
    .attr('fill', (d) => (d.Artist === 'Taylor Swift' ? '#6597b0' : '#ba7c54'))
    .attr('fill-opacity', '1')
    .each(function(d) {
      // Armazene os dados associados ao elemento em uma variável
      const elementoDados = d;

      d3.select(this)
        .on('mouseover', function () {
          // Use a variável elementoDados para acessar os dados corretos
          let id = elementoDados.Id;
          let url = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;

          // Atualizar o conteúdo do tooltip
          tooltip.innerHTML = `
            <iframe class="tooltip-spotify"
              style="border-radius:12px"
              src="${url}"
              width="300"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy">
            </iframe>
          `;

          // Mostrar o tooltip
          tooltip.style.display = 'inline-block';
        })
        .on('mouseout', function () {
          // Ocultar o tooltip quando o mouse sai
          tooltip.style.display = 'none';
        });
    });
    
  // Criando div para a legenda
  let legenda = document.createElement('div');
  legenda.classList.add('legenda'); // Adicione uma classe à legenda

  // Adicione a legenda ao mesmo contêiner que contém o gráfico (por exemplo, o elemento '#sticky')
  let graficoContainer = document.querySelector('#sticky');
  graficoContainer.appendChild(legenda);

  // Crie a bolinha colorida para Taylor Swift
  let bolinhaTaylorSwift = document.createElement('div');
  bolinhaTaylorSwift.classList.add('bolinha');
  bolinhaTaylorSwift.style.backgroundColor = '#6597b0'; // Defina a cor de fundo

  // Crie o rótulo para Taylor Swift
  let rotuloTaylorSwift = document.createElement('p');
  rotuloTaylorSwift.textContent = 'Taylor Swift';

  // Adicione a bolinha e o rótulo à legenda
  legenda.appendChild(bolinhaTaylorSwift);
  legenda.appendChild(rotuloTaylorSwift);

  // Repita o processo para Beyoncé
  let bolinhaBeyonce = document.createElement('div');
  bolinhaBeyonce.classList.add('bolinha');
  bolinhaBeyonce.style.backgroundColor = '#ba7c54';

  let rotuloBeyonce = document.createElement('p');
  rotuloBeyonce.textContent = 'Beyoncé';

  // Adicione a bolinha e o rótulo à legenda
  legenda.appendChild(bolinhaBeyonce);
  legenda.appendChild(rotuloBeyonce);
  
  // Adicionando g_linha ao elemento #sticky
  let grafico = document.querySelector('#sticky');
  grafico.appendChild(g_linha);
};

// Leitura dos dados - Gráfico 1
async function carregag1() {
  const dados = await d3.csv("data/Top_10_Tours_Bey_Tay.csv");
  grafico1(dados);
}

// Leitura dos dados - Gráfico 2
async function carregag2(metrica) {
  const dados = await d3.csv("data/Top_10_Tours_Bey_Tay.csv");
  grafico2(metrica, dados);
}


// CONFIGURANDO O SCROLLER
const sticky = document.querySelector("#sticky");
const steps = document.querySelectorAll(".step");

const scroller = scrollama();
const options = {
  step: steps, 
  offset: 0.2, 
  debug: false 
};

// Setup uptions and event handlers
scroller.setup(options).onStepEnter(handleStepEnter);

// Define function to run when step changes
function handleStepEnter(current) {

  if (current.element.dataset.step === 'Top 10 Músicas por popularidade'){
    // setTimeout(carregag1, 500);
    carregag1();
  };

  if (current.element.dataset.step === 'Batalha de Loudness'){
    carregag2('Loudness');
  };

  if (current.element.dataset.step === 'Batalha de Dançabilidade'){
    carregag2('danceability');
  };

  if (current.element.dataset.step === 'Batalha de Valência'){
    carregag2('valence');
  };

  if (current.element.dataset.step === 'Batalha de Energia'){
    carregag2('Energia');
  };

  // Update graphic based on step
  sticky.textContent = current.element.dataset.step;

  // Add "active" class to current step
  steps.forEach((step, index) =>
    step.classList.toggle("active", index === current.index)
  );

  const graficoExistente = document.querySelector('.grafico-svg');
  if (graficoExistente) {
    graficoExistente.remove();
  }

};
