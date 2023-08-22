
# Google Flights Scraper

Este projeto é um web scraper para coletar informações de voos do Google Flights. Ele oferece uma API para buscar passagens aéreas com base em determinados critérios de busca.

## Instalação

1. Clone o repositório:

```shell
git clone https://github.com/alvarogomes/google-flights-api.git
```

2. Acesse o diretório do projeto:

```shell
cd google-flights-api
```

3. Instale as dependências usando Yarn:

```shell
yarn install
```

## Como Executar

1. Execute o projeto:

```shell
yarn start
```

A API estará disponível em http://localhost:3000.

## Chamada de API

Endpoint: `POST /buscar-passagens`

Exemplo de Payload:
```json
{
  "numeroPassagens": 2,
  "tipoPassagem": "ida",
  "aeroportoOrigem": "GRU",
  "aeroportoDestino": "JFK",
  "dataInicio": "2023-09-01",
  "dataFim": "2023-09-10"
}
```

Exemplo de Resposta:
```json
{
  "flights": [
    {
      "thumbnail": "...",
      "companyName": "...",
      "description": "...",
      "duration": "...",
      "airportLeave": "...",
      "airportArrive": "...",
      "layover": "Nonstop",
      "emissions": "...",
      "price": "...",
      "priceDescription": "..."
    },
    ...
  ]
}
```

## Executando os Testes

1. Execute os testes:

```shell
yarn test
```

Isso executará os testes unitários para a classe `GoogleFlightScraper` e para a API.
