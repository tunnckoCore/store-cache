/*!
 * store-cache <https://github.com/tunnckoCore/store-cache>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var StoreCache = require('./index')
var app = new StoreCache()

test('store-cache:', function (done) {
  app.set('a', 'b')
  console.log(app.store()) // {a: 'b'}
  done()
})
