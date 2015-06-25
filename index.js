/*!
 * store-cache <https://github.com/tunnckoCore/store-cache>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var lazy = require('lazy-cache')(require)
var toFlags = lazy('to-flags')
var defaults = lazy('defaults-deep')
var assign = lazy('assign-deep')
var clone = lazy('clone-deep')
var kind = lazy('kind-of')
var set = lazy('set-value')
var get = lazy('get-value')
var del = lazy('del-value')
var has = lazy('has-own-deep')

module.exports = StoreCache

/**
 * Initialize `StoreCache` instance with initial `store`
 *
 * **Example**
 *
 * ```js
 * var StoreCache = require('store-cache')
 * var app = new StoreCache()
 * ```
 *
 * @param {Object} `[store]`
 * @api public
 */
function StoreCache (store) {
  if (!(this instanceof StoreCache)) {
    return new StoreCache(store)
  }
  this.store = store || {}
}

/**
 * > Get value or the full store. Set value only if not exist.
 * Extend the store, without overwrite existing.
 *
 * **Example**
 *
 * ```js
 * app.store()          //=> get clone of `this.store` object
 * app.store('a')       //=> get `a`
 * app.store('a.b.c')   //=> get `a.b.c`
 *
 * app.store({a: {b: 'c'}})   //=> extend `this.store` without overwrite existing
 * app.store('a', 'foo')      //=> set `a`, not update if exist
 * app.store('a.b.c', 'foo')  //=> set `a.b.c`, not update if exist
 * ```
 *
 * @param  {*} `[key]`
 * @param  {*} `[value]`
 * @return {Mixed} return self or some value when works as get
 * @api public
 */
StoreCache.prototype.store = function store (key, value) {
  if (arguments.length === 0) {
    return clone()(this.store)
  }
  var type = kind()(key)
  if (type !== 'string' && type !== 'object') {
    return this
  }
  if (type === 'object') {
    this.store = defaults()(this.store, key)
    return this
  }
  if (key.indexOf('.') === -1) {
    if (arguments.length > 1) {
      if (!this.store.hasOwnProperty(key)) {
        this.store[key] = value
      }
      return this
    }
    return this.store[key]
  }
  if (arguments.length > 1) {
    set()(this.store, key, value)
    return this
  }
  return get()(this.store, key)
}

/**
 * > Set value to `this.store` only if not exist,
 * or extend without overwrite existing
 *
 * **Example**
 *
 * ```js
 * app.set({a: {b: 'c'}})   //=> extend `this.store` without overwrite existing
 * app.set('a', 'foo')      //=> set `a`, not update if exist
 * app.set('a.b.c', 'foo')  //=> set `a.b.c`, not update if exist
 * ```
 *
 * @param {*} `<key>`
 * @param {*} `[value]`
 * @return {StoreCache}
 * @api public
 */
StoreCache.prototype.set = function set (key, value) {
  return this.store(key, value)
}

/**
 * > Get value or clone of `this.store`.
 *
 * **Example**
 *
 * ```js
 * app.get()          //=> get clone of `this.store` object
 * app.get('a')       //=> get `a`
 * app.get('a.b.c')   //=> get `a.b.c`
 * ```
 *
 * @param {*} `<key>`
 * @param {*} `[value]`
 * @return {StoreCache}
 * @api public
 */
StoreCache.prototype.get = function get (key) {
  return this.store(key)
}

/**
 * > Check that given `key` exist in the object,
 * works for any value, even if value falsey or empty value.
 *
 * **Example**
 *
 * ```js
 * app.has() //=> false
 * app.has('a') //=> false
 * app.has('a.b.c') //=> false
 * ```
 *
 * @param  {String}  `<key>`
 * @return {Boolean}
 * @api public
 */
StoreCache.prototype.has = function has (key) {
  var len = arguments.length
  if (len === 0) {
    return
  }
  if (kind()(key) !== 'string') {
    return false
  }
  if (key.indexOf('.') === -1) {
    return this.store.hasOwnProperty(key)
  }
  return has()(this.store, key)
}

/**
 * > Update only existing values of the `store` object.
 *
 * **Example**
 *
 * ```js
 * app.put({a: {foo: 'bar'}})
 * app.put('a', {bar: 123})
 * app.put('a.foo', {baz: 'aaa'})
 * ```
 *
 * @param  {String|Object} `<key>`
 * @param  {*} `[value]`
 * @return {StoreCache}
 * @api public
 */
StoreCache.prototype.put = function put (key, value) {
  var type = kind()(key)
  if (type !== 'string' && type !== 'object') {
    return this
  }
  if (type === 'object') {
    this.store = assign()(this.store, key)
    return this
  }
  if (key.indexOf('.') === -1) {
    if (this.store.hasOwnProperty(key)) {
      this.store[key] = value
    }
    return this
  }
  if (has()(this.store, key)) {
    set()(this.store, key)
  }
  return this
}

// @todo
StoreCache.prototype.del = function (key) {
  if (arguments.length === 0) {
    this.store = {}
    return this
  }
  if (kind()(key) !== 'string') {
    return this
  }
  if (key.indexOf('.') === -1) {
    if (this.store.hasOwnProperty(key)) {
      delete this.store[key]
    }
    return this
  }
  if (has()(this.store, key)) {
    del()(this.store, key)
  }
  return this
}

/**
 * > Shortcut for setting value to `true`.
 *
 * @param {String} `<key>`
 * @return {StoreCache}
 * @api public
 */

StoreCache.prototype.enable = function enable (key) {
  return this.option(key, true)
}

/**
 * > Shortcut for setting value to `false`.
 *
 * @param {String} `<key>`
 * @return {StoreCache}
 * @api public
 */

StoreCache.prototype.disable = function disable (key) {
  return this.option(key, false)
}

/**
 * > Check if `key` is truthy value.
 *
 * @param {String} `[key]`
 * @return {Boolean}
 * @api public
 */

StoreCache.prototype.truthy = function truthy (key) {
  return Boolean(this.store(key))
}

/**
 * > Check if `key` is falsey value.
 *
 * @param {String} `[key]`
 * @return {Boolean}
 * @api public
 */

StoreCache.prototype.falsey = function falsey (key) {
  return !Boolean(this.store(key))
}

/**
 * > Generate an array of command line args from
 * the given `keys` or all options.
 *
 * @param  {Array} `[keys]`
 * @return {Array} array of args
 * @api public
 */

StoreCache.prototype.flags = function flags (keys) {
  keys = keys || Object.keys(this.store())
  return toFlags()(this.store(), keys)
}
