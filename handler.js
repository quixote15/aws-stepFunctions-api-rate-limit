'use strict';
const faker = require('faker');
console.log("Loading function");
var AWS = require("aws-sdk");
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' })
const {
  MaxPriorityQueue
} = require('@datastructures-js/priority-queue');

module.exports.banklyRequest = async function(event, context) {
    var eventText = JSON.stringify(event, null, 2);
    console.log("Received event:", eventText);
    const partnerKeys = ['dev/misc-bankly/keys/gilmarBank', 'dev/misc-bankly/keys/PeuBank']
   
    var sns = new AWS.SNS();
   
    const n = Array.from(Array(10000).keys())
    const promises = [];
    console.log('items: ', n)
    for (let item of n) {
      try {
        console.log("index: ", item)
        const keyIndex = Math.round(Math.random() * 1)
        const messagePayload = {
          type: 'bankSlip',
          service: 'cashIn',
          credentialName: partnerKeys[keyIndex],
          priority: keyIndex,
          data: {
            amount: Math.random() * 1000,
            account: faker.finance.account,
          }
        }
        var params = {
            Message: JSON.stringify(messagePayload), 
            MessageGroupId: partnerKeys[keyIndex],
            MessageDeduplicationId: faker.random.alphaNumeric(20) + Date.now(),
            Subject: "Bankly Request",
            TopicArn: "arn:aws:sns:us-east-1:335006469695:NewApiRequest.fifo"
        };
    
        promises.push(sns.publish(params).promise());
        console.log('enviou, ', item)
      } catch (error) {
        console.error(error);
      }
    }

    await Promise.all(promises).catch(console.log)

    return 'Requisição enviada.'
}
module.exports.pollRequestsAndCheckQuotas = async (event) => {
  const params = {
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/335006469695/ApiRequestsQueue.fifo'
  }

  const messagesConsumed = []
  const requestMap = new Map()
  try {
    const receiveResp = await sqs.receiveMessage({...params, WaitTimeSeconds: 5}).promise()
    console.log('Fila retornou:')
    console.log(receiveResp)
    console.log(receiveResp.Messages)
    receiveResp.Messages.forEach(m => {
      const notificationMessage = JSON.parse(m.Body)
      console.log('notificationMessage: ' + notificationMessage)
      const request = JSON.parse(notificationMessage.Message)
      console.log('request',request)
      const deleteMessageParams = {
        ...params,
        ReceiptHandle: m.ReceiptHandle
      }

      messagesConsumed.push(deleteMessageParams)
      const partnerKey = request.credentialName;

      if(requestMap.has(partnerKey)) {
        const partnerRequestQueue = requestMap.get(partnerKey)
        partnerRequestQueue.enqueue({request, message: m}, request.priority )
        requestMap.set(partnerKey, partnerRequestQueue)
      }else {
        const partnerQueue = new MaxPriorityQueue()
        partnerQueue.enqueue({request, message: m}, request.priority)
        requestMap.set(partnerKey, partnerQueue)
      }
    })
  } catch (error) {
    console.error('error queue: ', error)
  }


 const messageDeletePromises = messagesConsumed.map(m => sqs.deleteMessage(m).promise())

 await Promise.all(messageDeletePromises)

 const requests = []

 for(let [key, queue] of requestMap.entries()) {
   console.log(key)
   requests.push(queue.toArray())
 }

  
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
