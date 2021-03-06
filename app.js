const discovergyLib = require("./lib/discovergy.js");
const fs = require("fs");
const express = require('express');
let port = 3000;

const storage = {
  memstorage:{},
  get:function(key) {
    return this.memstorage[key];
  },
  set:function(key,value) {
    this.memstorage[key] = value;
  }
}
const fileExists = async path => !!(await fs.promises.stat(path).catch(e => false));

const main = async function(config) {
  let app = express();

  let msg = {
    payload: {},
    topic: 'statistics'
  }

  app.get('/msg', async function (req, res) {
      delete msg.payload.latest;
      res.send(await discovergyLib(msg,config,storage));
  });

  app.use(express.static('public', {}));
  console.log("Serving http://localhost:"+port +"/");
  app.listen(port);
}

const boot = async function() {
  let config = {};
  if(typeof process.env.PORT !== 'undefined') {
    port = process.env.PORT;
  }
  if((process.argv.length == 3)&&(await fileExists(process.argv[2]))) {
    config = JSON.parse(fs.readFileSync(process.argv[2]));
  } else
  if(await fileExists("./config.json")) {
    config = JSON.parse(fs.readFileSync("./config.json"));
  } else
  if(await fileExists("./sample_config.json")) {
    config = JSON.parse(fs.readFileSync("./sample_config.json"));
  }
  main(config);
}


boot();
