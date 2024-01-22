const fs = require('fs');
const path = require('node:path');
let data = ''

const read = fs.createReadStream((path.join(__dirname, 'text.txt')));

read.on('error', error => console.log('Error', error.message))

read.on('data', (chunk) => {
    data = chunk.toString()
})
read.on('end', () => console.log(data))