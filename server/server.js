const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs')
const PORT = 5000
const bodyParser = require("body-parser");

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))





app.listen(PORT, () => {
    console.log('server runinig http://localhost:5000');
})
