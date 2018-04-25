const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/'));
const port=process.env.PORT || 8080;
app.listen(port);

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('Express listening on port '+ port);