const { Polybase } = require('@polybase/client')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const crypto = require('crypto')

const axios = require('axios')

const { ethers } = require('ethers')

const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
    ],
    name: 'addRegMan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'rm_check',
        type: 'address',
      },
    ],
    name: 'getManagerStatus',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
const contractAddress = '0x228cff58a93607d12afecc61e18353a17674f9ce'
console.log(process.env.PRIVATE_KEY)
const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-goerli.g.alchemy.com/v2/VETlCJVRsg0x1fuFN8xeJnW_uT9BY2iu',
) // or use your own Ethereum node
const privateKey = process.env.PRIVATE_KEY // the private key of the account to use
const wallet = new ethers.Wallet(privateKey, provider)
const contract = new ethers.Contract(contractAddress, abi, wallet)

const db = new Polybase({
  defaultNamespace:
    'pk/0x41b5b5b941be1a0090db22319afda206d9f6ecb06a1e3de2187588f276ac097c7d6c5cce5bb5f69c61254ca82a712c4428b03efc6d48c99aa99d2afbe1371258/India-3',
})

const collectionReference = db.collection('User')

const listRecords = async (req, res) => {
  try {
    const records = await collectionReference.get()

    records.data.forEach(function (obj) {
      console.log(obj.data.demohash)
      console.log(obj.data.id)
    })
    res.status(201).json({
      success: true,
      response: records,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

const listRecords2 = async (req, res) => {
  try {
    const records = await collectionReference.get()

    return records
  } catch (error) {
    console.log(error)
  }
}

async function addAndHash(adhaarNum, pin) {
  // Add the two numbers together
  const result = parseInt(adhaarNum) + parseInt(pin)
  console.log(typeof adhaarNum, typeof pin, typeof result)
  // Convert the result to a string and encode it in UTF-8

  // Generate the SHA256 hash of the result string
  console.log(result.toString())
  const sha256Hash = crypto
    .createHash('sha256')
    .update(result.toString())
    .digest('hex')
  const bytes32Hash = Buffer.from(sha256Hash, 'hex')

  return '0x' + bytes32Hash.toString('hex')

  // Return the hash
}

async function concatenateAndHash(name, city, dob) {
  // Concatenate the strings together
  const concatenatedString = name + city + dob

  // Encode the concatenated string in UTF-8

  const sha256Hash = crypto
    .createHash('sha256')
    .update(concatenatedString)
    .digest('hex')
  const bytes32Hash = Buffer.from(sha256Hash, 'hex')

  return '0x' + bytes32Hash.toString('hex')
}

const addTodb = async (req, res) => {
  const { address } = req.body
  contract
    .getManagerStatus(address)
    .then(async (isManager) => {
      if (isManager) {
        const { adhaarNum, pin, name, city, dob } = req.body
        const id = await addAndHash(adhaarNum, pin)
        const demohash = await concatenateAndHash(name, city, dob)

        const response = await db.collection('User').create([id, demohash])
        res.status(201).json({
          success: true,
          response: response,
          id: id,
          demohash: demohash,
        })
      } else {
        res.status(401).json({
          success: false,
          error: 'You are not a registered manager',
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'May be You are not a registered manager',
      })
    })
}

const Verify = async (req, res) => {
  try {
    console.log(req.body)
    const idtocheck = await addAndHash(req.body.adhaarNum, req.body.pin)
    const demohashtocheck = await concatenateAndHash(
      req.body.name,
      req.body.city,
      req.body.dob,
    )
    const query = `
{uidVerifies(first: 10) {sender Upin hash }}
`

    const apiUrl =
      'https://api.thegraph.com/subgraphs/name/r4j4t-singh/india3-v4'

    axios
      .post(apiUrl, {
        query,
      })
      .then((response) => {
        const data = response.data.data.uidVerifies
        let found = false
        data.forEach(async (item) => {
          console.log(item.sender, item.hash, item.Upin)
          if (
            item.sender === req.body.sender &&
            !found &&
            item.hash === demohashtocheck &&
            item.Upin === idtocheck
          ) {
            console.log('sender matched')
            found = true

            const records = await collectionReference.get()
            console.log(records)

            records.data.forEach(function (obj) {
              if (
                obj.data.id === idtocheck &&
                obj.data.demohash === demohashtocheck
              ) {
                console.log('found')
                res.json({
                  success: true,
                  data: 'Verified',
                })
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

router.route('/upload').post(addTodb)
router.route('/verify').post(Verify)

router.route('/getdetails').get(listRecords)

module.exports = router
