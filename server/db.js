const { Polybase } =  require("@polybase/client");
const express = require('express');
const router = express.Router();
require('dotenv').config();
const db = new Polybase({
    defaultNamespace: process.env.PolybaseNamespace,
  });
console.log(process.env.PolybaseNamespace);
 const crypto = require('crypto');


async function addAndHash(adhaarNum, pin) {
  // Add the two numbers together
  const result = adhaarNum + pin;
  
  // Convert the result to a string and encode it in UTF-8
  const encoder = new TextEncoder();
  const resultEncoded = encoder.encode(result.toString());
  
  // Generate the SHA256 hash of the result string
  const sha256Hash = crypto.createHash('sha256').update(resultEncoded).digest('hex');
  
  // Return the hash
  return sha256Hash;

}

async function concatenateAndHash(name, city, dob) {
    // Concatenate the strings together
    const concatenatedString = name + city + dob;
    
    // Encode the concatenated string in UTF-8
    const concatenatedStrEncoded = Buffer.from(concatenatedString, 'utf-8');
    
    // Generate the SHA256 hash of the encoded string
    const sha256Hash = crypto.createHash('sha256').update(concatenatedStrEncoded).digest('hex');
    
    // Return the hash
    return sha256Hash;
  }


const addTodb = async (req, res) => {

    try {
        const { adhaarNum, pin, name, city,dob } = req.body;
        const idhash = await addAndHash(adhaarNum, pin);
        const demohash = await concatenateAndHash(name, city, dob);
    
    
        const response = await db.collection("User").create([idhash, demohash]);
        res.status(201).json({
            success:true,
            response:response,
            idhash:idhash,
            demohash:demohash
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message})
    }


   
    }

    router.route('/upload').post(addTodb);
    module.exports = router;





