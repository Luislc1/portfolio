# Portfólio · Luis Carlos

Site pessoal de Luis Carlos de Queiroz Silva, engenheiro de software e desenvolvedor Flutter em Rio Verde (GO).

Página única em tema escuro com o nome em destaque e dois mascotes, o Dash (Flutter) e o robô do Android. Eles acompanham a rolagem, podem ser arrastados e comentam o que aparece na tela. O site também tem demonstrações que funcionam no navegador: uma simulação de telemetria com alarme de temperatura, uma comparação entre requisições em paralelo e uma por vez, e as telas dos apps recriadas em HTML.

O app de telemetria da Comber Indústria é da empresa e não é público. Por isso ele aparece só descrito, e a demonstração usa dados simulados.

## Projetos apresentados

| Projeto | O que é | Situação |
| --- | --- | --- |
| **Telemetria industrial (Comber Indústria)** | App que acompanha máquinas industriais em tempo real e avisa sobre alarmes. Flutter, MQTT, Node-RED e InfluxDB. Sem telas, por ser da empresa. | Em produção |
| **Atléticas** | Marketplace de ingressos para festas universitárias, com Pix e cartão via Mercado Pago. Mais de 450 usuários. | App Store e Google Play |
| **LinkURL** | Gera link do WhatsApp com a mensagem já escrita e o QR Code dele. | App Store, código aberto |
| **Mux-Metrics** | TCC: plataforma de pesquisa longitudinal de experiência do usuário (AttrakDiff, UEQ e NASA-TLX). | Teste fechado |

## Como foi feito

- HTML, CSS e JavaScript puros, num único arquivo, sem framework e sem etapa de build.
- Os mascotes são SVG desenhados à mão, com física simples: caem, quicam, pulam entre as letras e os títulos e dormem quando ninguém mexe na página. O botão "Mascotes" no topo esconde os dois, e a escolha fica guardada no navegador.
- As animações são desligadas para quem ativou a opção de reduzir movimento no sistema.
- Fontes: [Inter](https://fonts.google.com/specimen/Inter) e [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono).
- O Dash é a mascote do Flutter, do Google. O robô do Android é reproduzido a partir de obra criada e compartilhada pelo Google, nos termos da licença Creative Commons 3.0 Attribution.

## Estrutura

```
index.html        página, estilos, mascotes e demonstrações
assets/
  css/telas.css   réplicas das telas dos apps
  img/            imagens das telas do Atléticas
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
