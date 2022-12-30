const express = require('express')
const app = express();
// do not do the {}, does not work

app.listen(3000, () => console.log("listen at 3000"));
app.use(express.static('public')); // anything in this directory is public