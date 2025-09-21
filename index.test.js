"use strict";
// Copyright ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under VLA:14884873469176472158 LICENSE.md

// Treasury Deva test file

const {expect} = require('chai')
const treasury = require('./index.js');

describe(treasury.me.name, () => {
  beforeEach(() => {
    return treasury.init()
  });
  it('Check the DEVA Object', () => {
    expect(treasury).to.be.an('object');
    expect(treasury).to.have.property('agent');
    expect(treasury).to.have.property('vars');
    expect(treasury).to.have.property('listeners');
    expect(treasury).to.have.property('methods');
    expect(treasury).to.have.property('modules');
  });
})
