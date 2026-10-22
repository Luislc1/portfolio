# Portfólio · Luis Carlos

Site pessoal de Luis Carlos de Queiroz Silva, engenheiro de software e desenvolvedor Flutter em Rio Verde (GO).

O site mostra os apps que eu publiquei e mantenho, com as telas recriadas em HTML e funcionando como no celular: leituras chegando em tempo real no app da Comber, a compra de um ingresso no Atléticas e a geração de um link no LinkURL.

## Projetos apresentados

| Projeto | O que é | Situação |
| --- | --- | --- |
| **Telemetria industrial (Comber Indústria)** | App que acompanha em tempo real as máquinas da Comber, com alertas e pedidos de serviço. Flutter, MQTT, Node-RED e InfluxDB. | Em produção |
| **Atléticas** | Marketplace de ingressos para festas universitárias, com Pix e cartão via Mercado Pago. Mais de 450 usuários. | App Store e Google Play |
| **LinkURL** | Gera link do WhatsApp com a mensagem já escrita e o QR Code dele. | App Store, código aberto |
| **Mux-Metrics** | TCC: plataforma de pesquisa longitudinal de experiência do usuário (AttrakDiff, UEQ e NASA-TLX). | Teste fechado |

## Como foi feito

- HTML, CSS e JavaScript puros, sem framework e sem etapa de build.
- As telas dos apps são HTML desenhado no tamanho real de um iPhone e reduzido com CSS. Logos e fotos são recortes das capturas originais.
- Cada aparelho só anima enquanto está visível na tela.
- Tema claro e escuro: segue o sistema na primeira visita e guarda a escolha no navegador.
- As animações são desligadas para quem ativou a opção de reduzir movimento no sistema.
- Fontes: [Archivo](https://fonts.google.com/specimen/Archivo) no site e [Inter](https://fonts.google.com/specimen/Inter) nas telas dos apps.

## Estrutura

```
index.html
assets/
  css/style.css   layout, tipografia e temas do site
  css/telas.css   réplicas das telas dos apps
  js/main.js      animações, carrossel e troca de tema
  img/            recortes das capturas dos apps
```

## Rodando localmente

Basta abrir o `index.html` no navegador. Se preferir um servidor local:

```bash
python3 -m http.server 8000
```

e acesse `http://localhost:8000`.

## Contato

- E-mail: [luiscqueiroz4@gmail.com](mailto:luiscqueiroz4@gmail.com)
- LinkedIn: [luis-carlosqs1](https://linkedin.com/in/luis-carlosqs1)
- GitHub: [Luislc1](https://github.com/Luislc1)
