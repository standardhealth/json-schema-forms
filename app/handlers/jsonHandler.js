'use strict';

const fs = require('fs');

module.exports = {
   readFile : readFile,
}

function readFile(param) {
  let file = fs.readFileSync(`app/json_schema/${param}.schema.json`, 'utf-8');
  return file;
}
