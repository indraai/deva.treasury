// Copyright (c)2025 Quinn A Michaels
// Treasury Deva

import Deva from '@indra.ai/deva';
import pkg from './package.json' with {type:'json'};
const {agent,vars} = pkg.data;

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

const info = {
  id: pkg.id,
  name: pkg.name,
  version: pkg.version,
  author: pkg.author,
  describe: pkg.description,
  dir: __dirname,
  url: pkg.homepage,
  git: pkg.repository.url,
  bugs: pkg.bugs.url,
  license: pkg.license,
  copyright: pkg.copyright
};

const TREASURY = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();},
  },
  listeners: {
    'devacore:question'(packet) {
      const echo = this.methods.echo('treasury', 'q', packet);
    },
    'devacore:answer'(packet) {
      const echo = this.methods.echo('treasury', 'a', packet);
    }    
  },
  modules: {},
  devas: {},
  func: {},
  methods: {},
  onReady(data, resolve) {
    this.prompt(this.vars.messages.ready);    
  },
  onError(data, err, reject) {
    this.prompt(this.vars.messages.error);
    console.log(err);
    return reject(err);
  },
});
export default TREASURY

