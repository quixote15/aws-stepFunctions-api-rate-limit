'use strict';
const faker = require('faker');
console.log("Loading function");
var AWS = require("aws-sdk");

module.exports.banklyRequest = async function(event, context) {
    var eventText = JSON.stringify(event, null, 2);
    console.log("Received event:", eventText);
    const partnerKeys = ['dev/misc-bankly/keys/gilmarBank', 'dev/misc-bankly/keys/PeuBank']
    const keyIndex = Math.round(Math.random() * 1)
    var sns = new AWS.SNS();
    const messagePayload = {
      type: 'bankSlip',
      service: 'cashIn',
      data: {
        amount: 100,
        account: faker.finance.account,
      }
    }
    var params = {
        Message: JSON.stringify(messagePayload), 
        MessageGroupId: partnerKeys[keyIndex],
        MessageDeduplicationId: faker.random.alphaNumeric(20),
        Subject: "Bankly Request",
        TopicArn: "arn:aws:sns:us-east-1:335006469695:NewApiRequest.fifo"
    };
    try {
      const data = await sns.publish(params, context.done).promise();
      console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
      console.log("MessageID is " + data.MessageId);
    } catch (error) {
      console.error(err, err.stack);
    }
    return 'Requisição enviada.'
}
module.exports.pollRequestsAndCheckQuotas = async (event) => {
 
 const requests = [{
   type: 'bankSlip',
   service: 'cashIn',
   data: {
     amount: 10,
     account: 1
   }
 }, {
  type: 'bankSlip',
  service: 'cashIn',
  data: {
    amount: 100,
    account: 2
  }
}]

return requests
};


module.exports.requestIterator = async ({requests}) => {
  

  if(requests.length > 0) {
    // take a chunk list and make requests
    const currentRequesChunk = requests.pop()
    await setTimeout(() => {
      console.log('realizou requests', currentRequesChunk)
    }, 1000)
  }


  return requests
};


module.exports.checkNextRequestIteration = async ({requests}) => {

  return requests.length > 0
};
