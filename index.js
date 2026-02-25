"use strict";
// Treasury Deva
// Copyright ©2000-2026 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under VLA:18479325762624811149 LICENSE.md
// Thursday, January 8, 2026 - 11:00:34 AM

import Deva from '@indra.ai/deva';
import pkg from './package.json' with {type:'json'};
const {agent,vars} = pkg.data;

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

import money from '@indra.ai/deva.money';
// import money from '/Users/quinnmichaels/Dev/deva.space/devas/deva.money/index.js';

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
  VLA: pkg.VLA,
  copyright: pkg.copyright
};

const TreasuryDeva = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();},
  },
  listeners: {},
  modules: {},
  devas: {
    money,
  },
  func: {
    //! calculate interest payment function
    CUMIPMT(rate, periods, value, start, end, type) {
      // migrated from the legacy CUMIMPT algorithm
      rate = rate;
      periods = periods;
    
      // Return error if either rate, periods, or value are lower than or equal to zero
      if (rate <= 0 || periods <= 0 || value <= 0) return '#NUM!';
    
      // Return error if start < 1, end < 1, or start > end
      if (start < 1 || end < 1 || start > end) return '#NUM!';
    
      // Return error if type is neither 0 nor 1
      if (type !== 0 && type !== 1) return '#NUM!';
    
      // Compute cumulative interest
      const payment = this.func.PMT(rate, periods, value, 0, type);
      let interest = 0;

      if(start === 1) {
        if(type === 0) {
          interest = -value;
          start++;
        }
      }
      for (var i = start; i <= end; i++) {
        if (type === 1) {
          interest += this.func.FV(rate, i - 2, payment, value, 1 ) - payment;
        } else {
          interest += this.func.FV(rate, i - 1, payment, value, 0 );
        }
      }
      interest *= rate;
      return interest;
    },
  
    FV(rate, periods, payment, value, type) {
      // Credits: algorithm inspired by Apache OpenOffice
          // Initialize type
      type = (typeof type === 'undefined') ? 0 : type;
        
      // Return future value
      let result;
      if (rate === 0) {
        result = value + payment * periods;
      } else {
        var term = Math.pow(1 + rate, periods);
        if (type === 1) {
          result = value * term + payment * (1 + rate) * (term - 1.0) / rate;
        } else {
          result = value * term + payment * (term - 1) / rate;
        }
      }
      return -result;
    },
      
    PMT(rate, periods, present, future, type) {
      // Credits: algorithm inspired by Apache OpenOffice
    
      // Initialize type
      type = (typeof type === 'undefined') ? 0 : type;
    
      // Return payment
      let result;
      if (rate === 0) {
        result = (present + future) / periods;
      } else {
        const term = Math.pow(1 + rate, periods);
        if (type === 1) {
          result = (future * rate / (term - 1) + present * rate / (1 - 1 / term)) / (1 + rate);
        } else {
          result = future * rate / (term - 1) + present * rate / (1 - 1 / term);
        }
      }
      return -result;
    }    
  },
  methods: {
    fine(packet) {
      const {id, q} = packet;
      const {text, meta} = q;
      const {key, method, params} = meta;
      const amercement = params[1];
      
      this.context(method, id.uid);
      this.action('method', `${method}:${id.uid}`);
      this.state('pending', `${method}:${id.uid}`);

      const {fines} = this.vars;
      const fine = fines.scale[amercement] || fines.scale.high;
      
      console.log('fine', fines, fine);
      
      return new Promise((resolve, reject) => {
        let res = false // return object
        this.state('try', `${method}:${id.uid}`);
        try {
          res = {
            text: "test fine text",
            html: "text.fine.",
            data: false,
          }
        } 
        catch (err) {
          this.action('reject', `${method}:${id.uid}`);
          this.state('catch', `${method}:${id.uid}`);
          this.intent('bad', `${method}:${id.uid}`);
          return this.err(err, packet, reject);
        }
        finally {
          this.action('resolve', `${method}:${id.uid}`);
          this.state('finally', `${method}:${id.uid}`);
          this.intent('good', `${method}:${id.uid}`);
          return resolve(res);
        }
      });
    },
  },
  onInit(data, resolve) {
    const {personal} = this.license(); // get the license config
    const agent_license = this.info().VLA; // get agent license
    const license_check = this.license_check(personal, agent_license); // check license
    // return this.start if license_check passes otherwise stop.
    return license_check ? this.start(data, resolve) : this.stop(data, resolve);
  }, 
  onReady(data, resolve) {
    const {VLA} = this.info();
    this.prompt(`${this.vars.messages.ready} > VLA:${VLA.uid}`);
    return resolve(data);
  },
  onError(data, err, reject) {
    this.prompt(this.vars.messages.error);
    console.log(err);
    return reject(err);
  },
});
export default TreasuryDeva

