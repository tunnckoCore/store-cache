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
// var put = lazy('put-values')
var del = lazy('del-values')
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
 * @param {Object} `[cache]`
 * @api public
 */
function StoreCache (cache) {
  if (!(this instanceof StoreCache)) {
    return new StoreCache(cache)
  }
  this.cache = cache || {}
}

/**
 * > Get value or the full store. Set value only if not exist.
 * Extend the store, without overwrite existing.
 *
 * **Example**
 *
 * ```js
 * app.store()          //=> get clone of `this.cache` object
 * app.store('a')       //=> get `a`
 * app.store('a.b.c')   //=> get `a.b.c`
 *
 * app.store({a: {b: 'c'}})   //=> extend `this.cache` without overwrite existing
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
    return clone()(this.cache)
  }
  var type = kind()(key)
  if (type !== 'string' && type !== 'object') {
    return this
  }
  if (type === 'object') {
    this.cache = defaults()(this.cache, key)
    return this
  }
  if (key.indexOf('.') === -1) {
    if (arguments.length > 1) {
      if (!this.cache.hasOwnProperty(key)) {
        this.cache[key] = value
      }
      return this
    }
    return this.cache[key]
  }
  if (arguments.length > 1) {
    set()(this.cache, key, value)
    return this
  }
  return get()(this.cache, key)
}

/**
 * > Set value to `this.cache` only if not exist,
 * or extend without overwrite existing
 *
 * **Example**
 *
 * ```js
 * app.set({a: {b: 'c'}})   //=> extend `this.cache` without overwrite existing
 * app.set('a', 'foo')      //=> set `a`, not update if exist
 * app.set('a.b.c', 'foo')  //=> set `a.b.c`, not update if exist
 * ```
 *
 * @param {*} `[key]`
 * @param {*} `[value]`
 * @return {StoreCache}
 * @api public
 */
StoreCache.prototype.set = function set (key, value) {
  return this.store(key, value)
}

/**
 * > Get value or clone of `this.cache`.
 *
 * **Example**
 *
 * ```js
 * app.get()          //=> get clone of `this.cache` object
 * app.get('a')       //=> get `a`
 * app.get('a.b.c')   //=> get `a.b.c`
 * ```
 *
 * @param {*} `[key]`
 * @param {*} `[value]`
 * @return {Object}
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
 * app.has()
 * //=> true if `this.cache` is not empty, false otherwise
 *
 * app.has(123) //=> false
 * app.has('a') //=> false
 * app.has('a.b.c') //=> false
 * ```
 *
 * @param  {String}  `[key]`
 * @return {Boolean}
 * @api public
 */
StoreCache.prototype.has = function has (key) {
  var len = arguments.length
  if (len === 0) {
    return Object.keys(this.cache).length > 0
  }
  if (kind()(key) !== 'string') {
    return false
  }
  if (key.indexOf('.') === -1) {
    return this.cache.hasOwnProperty(key)
  }
  return has()(this.cache, key)
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
StoreCache.prototype.put = function put (key, value) {  // @todo use `put-values`
  var type = kind()(key)
  if (type !== 'string' && type !== 'object') {
    return this
  }
  if (type === 'object') {
    this.cache = assign()(this.cache, key)
    return this
  }
  if (key.indexOf('.') === -1) {
    if (this.cache.hasOwnProperty(key)) {
      this.cache[key] = value
    }
    return this
  }
  if (has()(this.cache, key)) {
    set()(this.cache, key)
  }
  return this
}

StoreCache.prototype.del = function del (key, esc) { // @todo use `del-values`
  if (arguments.length === 0) {
    this.cache = {}
    return this
  }
  var type = kind()(key)
  if (type !== 'array' && type !== 'string') {
    return this
  }
  if (type === 'array') {
    del()(this.cache, key, esc)
    return this
  }
  if (key.indexOf('.') === -1) {
    if (this.cache.hasOwnProperty(key)) {
      delete this.cache[key]
    }
    return this
  }
  if (has()(this.cache, key)) {
    del()(this.cache, key, esc)
  }
  return this
}

StoreCache.prototype.size = function size () {
  return Object.keys(this.cache).length
}

/**
 * > Shortcut for setting value to `true`.
 *
 * @param {String} `<key>`
 * @return {StoreCache}
 * @api public
 */

StoreCache.prototype.enable = function enable (key) {
  var method = this.has(key) ? this.put : this.set

  method(key, true)
  return this
}

/**
 * > Shortcut for setting value to `false`.
 *
 * @param {String} `<key>`
 * @return {StoreCache}
 * @api public
 */

StoreCache.prototype.disable = function disable (key) {
  var method = this.has(key) ? this.put : this.set

  method(key, false)
  return this
}

/**
 * > Check if `key` is truthy value.
 *
 * @param {String} `[key]`
 * @return {Boolean}
 * @api public
 */

StoreCache.prototype.truthy = function truthy (key) {
  return Boolean(this.get(key))
}

/**
 * > Check if `key` is falsey value.
 *
 * @param {String} `[key]`
 * @return {Boolean}
 * @api public
 */

StoreCache.prototype.falsey = function falsey (key) {
  return !Boolean(this.get(key))
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
