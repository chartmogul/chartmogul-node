'use strict';

const UriTemplate = require('uri-templates');

exports.getDataFromArgument = function (args) {
  if (typeof args[args.length - 1] === 'object') {
    return args.pop();
  }
};

exports.expandPath = function (path, arr) {
  const template = new UriTemplate(path);
  return template.fill(function () {
    return arr.shift();
  });
};
