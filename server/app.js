const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')

const roters = require('./db.js')
app.use(cors())

const router = express.Router()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // this is for parsing the data from the form

app.use('/admin', roters)

app.listen(port, () => console.log(` app listening on port ${port}!`))
