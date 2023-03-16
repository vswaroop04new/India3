const express = require('express');
const app = express();
const port = 3000;
const { Polybase } =  require("@polybase/client");

const db = new Polybase({
  defaultNamespace: "your-namespace",
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



