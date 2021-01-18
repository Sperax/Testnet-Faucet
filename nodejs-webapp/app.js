const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express()
const port = 3000

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/01d5d39c9b47480c929bbf0ba8796713'))


var abi = [
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "get_eth",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "access_time",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

var contract_address = "0xa9d9C472DB38fcf7354F1D7ffcDd1499994dDdaf"
var wallet_address = "0xfA3354A4660aCE44C94aE5D030Db98374F41a763"
var wallet_private_key = "b99a87ba06dcbc2f6a6e6b267f249db30f65234a666519bfb76a4d4fd16420fa"
var contract =  new web3.eth.Contract(abi, contract_address)

app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.post('/address', (req, res) => {
  var test_address = req.body.address

  console.log(`Address is: ${req.body.address}`)

  const tx = {
    // this could be provider.addresses[0] if it exists
    from: wallet_address, 
    // target address, this could be a smart contract address
    to: contract_address,
    // Gas limit
    gas: 2100000,  
    // this encodes the ABI of the method and the arguements
    data: contract.methods.get_eth(test_address).encodeABI() 
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, wallet_private_key);

  signPromise.then((signedTx) => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    
    sentTx.on("receipt", receipt => {
      console.log(receipt)
      // do something when receipt comes back
    });
    sentTx.on("error", err => {
      console.log(err)
      // do something on transaction error
    });
  }).catch((err) => {
    console.log(err)
    // do something when promise fails
  });

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})