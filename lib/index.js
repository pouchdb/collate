'use strict';

exports.collate = function (a, b) {
  a = exports.normalizeKey(a);
  b = exports.normalizeKey(b);
  var ai = collationIndex(a);
  var bi = collationIndex(b);
  if ((ai - bi) !== 0) {
    return ai - bi;
  }
  if (a === null) {
    return 0;
  }
  if (typeof a === 'number') {
    return a - b;
  }
  if (typeof a === 'boolean') {
    return a === b ? 0 : (a < b ? -1 : 1);
  }
  if (typeof a === 'string') {
    return stringCollate(a, b);
  }
  if (Array.isArray(a)) {
    return arrayCollate(a, b);
  }
  return objectCollate(a, b);
};

// couch considers null/NaN/Infinity/-Infinity === undefined,
// for the purposes of mapreduce indexes. also, dates get stringified.
exports.normalizeKey = function (key) {
  if (typeof key === 'undefined') {
    return null;
  } else if (typeof key === 'number') {
    if (key === Infinity || key === -Infinity || isNaN(key)) {
      return null;
    }
  } else if (key instanceof Date) {
    return key.toJSON();
  }
  return key;
};

function arrayCollate(a, b) {
  var len = Math.min(a.length, b.length);
  for (var i = 0; i < len; i++) {
    var sort = exports.collate(a[i], b[i]);
    if (sort !== 0) {
      return sort;
    }
  }
  return (a.length === b.length) ? 0 :
    (a.length > b.length) ? 1 : -1;
}
function stringCollate(a, b) {
  // See: https://github.com/daleharvey/pouchdb/issues/40
  // This is incompatible with the CouchDB implementation, but its the
  // best we can do for now
  return (a === b) ? 0 : ((a > b) ? 1 : -1);
}
function objectCollate(a, b) {
  var ak = Object.keys(a), bk = Object.keys(b);
  var len = Math.min(ak.length, bk.length);
  for (var i = 0; i < len; i++) {
    // First sort the keys
    var sort = exports.collate(ak[i], bk[i]);
    if (sort !== 0) {
      return sort;
    }
    // if the keys are equal sort the values
    sort = exports.collate(a[ak[i]], b[bk[i]]);
    if (sort !== 0) {
      return sort;
    }

  }
  return (ak.length === bk.length) ? 0 :
    (ak.length > bk.length) ? 1 : -1;
}
// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
// null/undefined/NaN/Infinity/-Infinity are all considered null
function collationIndex(x) {
  if (x === null) {
    return 1;
  }
  var type = ['boolean', 'number', 'string', 'object'].indexOf(typeof x);
  //false if -1 otherwise true, but fast!!!!1
  if (~type) {
    return Array.isArray(x) ? 4.5 : (type + 2);
  }
}
