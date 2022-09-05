# SISTEMA VALEX

## Introdução
---
O projeto consiste em um serviço de emissão de cartões (vales) para empresas. O sistema permite as seguintes funcionalidades para empresas e funcionários, separadamente:
1. As empresas podem gerar cartões de crédito de diversas categorias de compras para seus funcionários. As categorias cadastradas são:
  - educação (education)
  - compras (groceries)
  - restaurantes (restaurant)
  - transporte (transport)
  - saúde (health)
2. Apenas um tipo de cartão pode ser gerado para cada funcionário, assim, um mesmo indivíduo é incapaz de possuir dois cartões físicos de saúde, restaurantes, etc.
3. Cada cartão possui seu próprio limite de crédito estabelecido pela empresa e pode ser utilizado apenas no mesmo tipo de estabelecimento, ou seja, um cartão de saúde não pode efetuar compras num restaurante, etc.
4. Funcionários precisam ativar seus cartões pelo sistema antes deste poder ser utilizado. Apenas cartões ativos podem receber recargas de saldo.
5. Funcionários também podem optar por bloquear o cartão conforme necessidade. Cartões bloqueados são incapazes de receber recargas de créditos e também não podem efetuar compras.
6. Funcionários também podem optar por cadastrar um cartão virtual, o qual utiliza dos fundos do cartão original. Este cartão pode ser deletado a qualquer momento e não precisa ser ativado, pois utiliza da mesma senha do cartão original.

# ROTAS DE SERVIÇO

### EMPRESAS

- Para cadastro de um novo cartão de funcionário, empresas devem:

1. Enviar uma requisição do tipo `POST` na rota `/cards/new` informando a chave `x-api-key` no cabeçalho (*header*) da requisição.
2. A requisição de novo cartão possui dois parâmetros:
> - `workerId` uma string numérica referente ao usuário o qual receberá o cartão.
> - `type` uma string referente às categorias disponíveis de cartão. Novamente, são elas:
> 1. education
> 1. groceries
> 1. restaurant
> 1. transport
> 1. health
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "workerId": string, 
>    "type": string 
>  } 
>  ```

3. A resposta da requisição é o idenficador do cartão, o do funcionário cujo cartão foi cadastrado e o código de verificação do cartão, a ser transferido para o mesmo para uso conforme necessário.

``` 
{ 
  "workerId": string, 
  "CVV": string, 
  "cardId": integer
} 
```

- Para recarga de um cartão ativo, empresas devem:

1. Enviar uma requisição do tipo `POST` na rota `/company/load` informando a chave `x-api-key` no cabeçalho (*header*) da requisição.
2. A requisição de novo cartão possui dois parâmetros:
> - `cardId` uma string numérica referente ao cartão que receberá a recarga.
> - `amount` um número inteiro positivo referente ao valor da recarga, em centavos. (ex.: 100 é R$ 1,00, 10000 é R$ 100,00)
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "amount": integer 
>  } 
>  ```

### FUNCIONÁRIOS

- Para a ativação de um cartão, funcionários devem:

1. Enviar uma requisição do tipo `POST` na rota `workers/:id/enable`, aonde `:id` é uma string numérica referente ao identificador do funcionário no banco de dados.
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser ativado
> - O código de verificação (*CVV*)
> - A senha com repetição.
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "CVV": string,
>    "password": string,
>    "repeatPassword": string
>  } 
>  ```
> - Cartões já ativos não podem ser ativados novamente, e assim ficam permitidos receber recargas e efetuar compras.

- Para o bloqueio/desbloqueio de um cartão físico, funcionários devem: 
1. Enviar uma requisição do tipo `POST` na rota `workers/:id/security`, aonde `:id` é uma string numérica referente ao identificador do funcionário no banco de dados.
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser ativado
> - A senha.
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "password": string 
>  } 
>  ```
3. Uma vez que o cartão está bloqueado, este não pode mais receber recargas ou efetuar compras. Para desbloqueá-lo novamente, basta efetuar esta mesma requisição novamente.

- Para a criação de um novo cartão virtual, funcionários devem:
  1. Enviar uma requisição do tipo `POST` na rota `workers/:id/virtual`, aonde `:id` é uma string numérica referente ao identificador do funcionário no banco de dados.
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser ativado
> - A senha.
> - Resumidameefetuada a compra
- A senha está correta
- O cartão não está vencidonte, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "password": string
>  } 
>  ```
3. A resposta da requisição é o código de verificação (*CVV*) e o número identificador do novo cartão virtual. Este deve ser utilizado ao invés do código do cartão original para compras realizadas com este novo cartão.
``` 
{ 
  "CVV": string, 
  "cardId": integer
} 
```

- Para a remoção de um cartão virtual já existente, funcionários devem:
1. Enviar uma requisição do tipo `DELETE` na rota `workers/:id/virtual`, aonde `:id` é uma string numérica referente ao identificador do funcionário no banco de dados.
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser ativado
> - A senha.
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "password": string 
>  } 
>  ```

- Para a visualização do histórico dos gastos de um determinado cartão, funcionários devem:
1. Enviar uma requisição do tipo `GET` na rota `workers/:id/history`, aonde `:id` é uma string numérica referente ao identificador do funcionário no banco de dados.
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser ativado
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string
>  } 
>  ```
3. Compras efetuadas com cartões virtuais são atrelados ao cartão original. E um cartão sem compras retorna um `array` vazio.

## PAGAMENTOS

- Para a realização de um novo pagamento com cartão físico, funcionários devem:

1. Enviar uma requisição do tipo `POST` na rota `payments/new`
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser utilizado
> - A senha
> - O identificador do tipo de estabelecimento (*"businessId"*)
> - O valor da transação, em centavos
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "password": string,
>    "businessId": string,
>    "amount": integer
>  } 
>  ```
3. Transações podem ser realizadas sob `6` condições:
> - Há saldo o suficiente para realizar a transação
> - O tipo do cartão condiz com o estabelecimento aonde vai ser efetuada a compra
> - A senha está correta
> - O cartão está ativo
> - O cartão não está bloqueado
> - O cartão não está vencido

- Para a Realização de um novo pagamento online com cartão virtual ou físico, funcionários devem:

1. Enviar uma requisição do tipo `POST` na rota `payments/online/new`
2. O corpo (*body*) da requisição deve ser composto pelos seguintes parâmetros:
> - O identificador (*id*) do cartão a ser utilizado
> - O número do cartão a ser utilizado, utilizando `4` dígitos separado por `-` (ex.: *`1122-3344-5566-7788`*)
> - O nome do portador do cartão, conforme o formato:
> - - Todas as letras em maiúsculo
> - - Primeiro e ultimo nomes com apenas a inicial do nome do meio
> - - Ou apenas primeiro em último nomes em caso de não existir um nome do meio.
> - O código de verificação (*CVV*)
> - A senha
> - O identificador do tipo de estabelecimento (*"businessId"*)
> - O valor da transação, em centavos
> - Resumidamente, a requisição fica no seguinte formato:
>
>  ``` 
>  { 
>    "cardId": string, 
>    "number": string,
>    "cardholderName": string,
>    "CVV": string,
>    "password": string,
>    "businessId": string,
>    "amount": integer
>  } 
>  ```
3. Transações podem ser realizadas sob `6` condições:
> - Há saldo o suficiente para realizar a transação
> - O tipo do cartão condiz com o estabelecimento aonde vai ser efetuada a compra
> - A senha está correta
> - O cartão está ativo
> - O cartão não está bloqueado
> - O cartão não está vencido