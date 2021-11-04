'use strict';

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
