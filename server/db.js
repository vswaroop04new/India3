const { Polybase } = require('@polybase/client')
const express = require('express')
const router = express.Router()
require('dotenv').config()

const db = new Polybase({
  defaultNamespace:
    'pk/0x7d09fb8805bc1cf2287b0b3c8c4eb450c2d395a316b59a0780f11ce92549420481644df992bc403b406e0946753e00ff7a05c15cb35b8378006f986942726101/Second',
})

const crypto = require('crypto')

const collectionReference = db.collection('User')

const listRecords = async (req, res) => {
  try {
    const records = await collectionReference.get()
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

async function addAndHash(adhaarNum, pin) {
  // Add the two numbers together
  const result = adhaarNum + pin

  // Convert the result to a string and encode it in UTF-8
  const encoder = new TextEncoder()
  const resultEncoded = encoder.encode(result.toString())

  // Generate the SHA256 hash of the result string
  const sha256Hash = crypto
    .createHash('sha256')
    .update(resultEncoded)
    .digest('hex')

  // Return the hash
  return sha256Hash
}

async function concatenateAndHash(name, city, dob) {
  // Concatenate the strings together
  const concatenatedString = name + city + dob

  // Encode the concatenated string in UTF-8
  const concatenatedStrEncoded = Buffer.from(concatenatedString, 'utf-8')

  // Generate the SHA256 hash of the encoded string
  const sha256Hash = crypto
    .createHash('sha256')
    .update(concatenatedStrEncoded)
    .digest('hex')

  // Return the hash
  return sha256Hash
}

const addTodb = async (req, res) => {
  try {
    const { adhaarNum, pin, name, city, dob } = req.body
    console.log(adhaarNum, pin, name, city, dob)
    const idhash = await addAndHash(adhaarNum, pin)
    const demohash = await concatenateAndHash(name, city, dob)
    console.log(idhash, demohash)

    const response = await db.collection('User').create([idhash, demohash])
    res.status(201).json({
      success: true,
      response: response,
      idhash: idhash,
      demohash: demohash,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

router.route('/upload').post(addTodb)
router.route('/getdetails').get(listRecords)

module.exports = router
