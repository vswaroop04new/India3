const express = require('express');
const app = express();
const port = 3000;
const { Polybase } =  require("@polybase/client");

const roters = require('./db.js');

const router = express.Router();
app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended: true }));// this is for parsing the data from the form

const db = new Polybase({
    defaultNamespace: "pk/0x7d09fb8805bc1cf2287b0b3c8c4eb450c2d395a316b59a0780f11ce92549420481644df992bc403b406e0946753e00ff7a05c15cb35b8378006f986942726101/Second",
  });

  app.use('/admin', roters);

app.listen(port, () => console.log(` app listening on port ${port}!`));



