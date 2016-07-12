'use strict';

const UriTemplate = require('uri-templates');

exports.expandPath = function (path, data) {
  const template = new UriTemplate(path);
  if (Array.isArray(data)) {
    return template.fill(function () {
      return data.shift();
    });
  }

  return template.fill(data);
};
