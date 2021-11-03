<h1 align="center">
  <img alt="GoStack" src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/masterclass.png" width="120px" />
</h1>

<h3 align="center">
  Caso de uso: Throttling & Rate limiting Third-Party API calls <br\>
  
  Problema: Em aplicações serveless, geralmente temos a impressão de que nossos aplicativos podem ser escaladas/escaláveis sem limites. Com o design certo (e dinheiro suficiente), isso é teoricamente possível. Mas, na realidade, muitos componentes de nossos aplicativos serverless TÊM limites. Sejam esses limites físicos, como taxa de transferência de rede ou capacidade de CPU, ou limites flexíveis, como limites de conta da AWS ou cotas de API de terceiros, nossos aplicativos serveless ainda precisam ser capazes de lidar com períodos de alta carga. E o mais importante, nossos usuários finais devem experimentar efeitos negativos mínimos, se houver, quando atingirmos esses limites.

  Além disso, muitas vezes utilizamos API's de terceiros como Twilio, Github, Gateways de pagamentos e etc. Todas essas API's externas possuem suas limitações de uso da aplicação e até limite por usuário.

  Step Functions facilitam a coordenação de componentes aplicações serverless e microserviços utilizando workflows visuais. Isso facilita a construção e o monitoramento de aplicações que escalam. 
</h3>



## Motivação

A arquitetura utilizada neste projeto requer o uso de invocações assíncronas. Isso significa que estamos invocando funções usando eventos e aguardando apenas a confirmação de que o evento foi recebido. NÃO estamos esperando que as funções sejam executadas e respondidas. Sempre que possível, você deve tentar minimizar (ou eliminar) chamadas síncronas para outros componentes, especialmente se os usuários finais estiverem esperando por uma resposta.

Para que o cliente receba o resultado iremos utilizar o padrão de callback. Ou seja, toda requisição deve passar quais será a ação de callback deve ser executada quando a requisição resolver.


Criamos uma máquina de estado que usa uma função Lambda para buscar as mensagens em nossa fila SQS (com as requisições) e, em seguida, usar uma série de tarefas paralelas para orquestrar outras funções Lambda para realizar nossas chamadas API limitadas.


<h1 align="center">
  <img alt="storeCheckout" src="https://github.com/quixote15/aws-stepFunctions-api-rate-limit/blob/main/assets/orquestrador.jpeg" width="600px" height="600px" />
</h1>

## ✋🏻 Pré-requisitos

- [Node.js](https://nodejs.org/en/)
- [AWS CLI](https://aws.amazon.com/pt/cli/)
- [Serverless](https://www.serverless.com/)
- [serverless-step-functions](https://www.serverless.com/plugins/serverless-step-functions)

## 🔥 Instalação e execução

1. Faça um clone desse repositório;
2. Entre na pasta `cd aws-stepFunctions-api-rate-limit`;
3. Rode `npm install` para instalar as dependências ;
4. Com sua conta Aws configurada execute `sls deploy`;


## ⚡️ Como contribuir

- Faça um fork desse repositório;
- Cria uma branch com a sua feature: `git checkout -b minha-feature`;
- Faça commit das suas alterações: `git commit -m 'feat: Minha nova feature'`;
- Faça push para a sua branch: `git push origin minha-feature`.

Depois que o merge da sua pull request for feito, você pode deletar a sua branch.

## Vantagens De Usar StepFunctions

1. Observabilidade e monitoramento de ponta a ponta no processo. 
2. Facilidade de implementar timeout e reagir a isso. 
3. A lógica de negócio fica em um unico lugar portanto fica facil de entender e dar manutenço.
2. Possibilita Auditoria de cada task que entrou no workflow
3. Funciona como um Orquestrador de microserviços, tira a necessidade de implementar do zero o padrão SAGA


## Desvantagens

1. Single point of Failure (único ponto de falha). Se StepFunctions cair nada funciona, porém a infra serveless da aws faz com que isso seja virtualmente improvável
2. Alto custo (USD 60 por milhão de transações)

## 📝 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

