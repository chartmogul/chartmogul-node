'use strict';

const UriTemplate = require('uri-templates');

exports.expandPath = function (path, arr) {
  const template = new UriTemplate(path);
  return template.fill(function () {
    return arr.shift();
  });
};
