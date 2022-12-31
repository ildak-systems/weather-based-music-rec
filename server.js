const express = require('express')
const app = express();
const bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json())

// Open server on port 3000
app.listen(3000, () => console.log("listen at 3000"));
app.use(express.static('public')); // anything in this directory is public

// List of API requests and response handling
app.post('/api', function (req, res) {
    console.log(req.body);
})

