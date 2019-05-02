'use strict';

var utils = require('../integration-utils.js');
var setup = utils.setupSimple;

var algoliasearchHelper = require('../../');

var random = require('lodash/random');

var indexName = '_circle-algoliasearch-helper-js-' +
  (process.env.CIRCLE_BUILD_NUM || 'DEV') +
  'helper_searchonce' + random(0, 5000);

var dataset = [
  {objectID: '1', _geoloc: {lat: 1, lng: 1}},
  {objectID: '2', _geoloc: {lat: 1, lng: 2}},
  {objectID: '3', _geoloc: {lat: 2, lng: 1}},
  {objectID: '4', _geoloc: {lat: 2, lng: 2}}
];

var config = {};

test(
  '[INT][GEO-SEARCH] search inside a single polygon with a string',
  function(done) {
    setup(indexName, dataset, config).
    then(function(client) {
      var helper = algoliasearchHelper(client, indexName, {});
      helper.on('result', function(content) {
        expect(content.hits.length).toBe(1);
        expect(content.hits[0].objectID).toBe('1');
        done();
      });

      helper.setQueryParameter('insidePolygon', '0,0,1.1,0,1.1,1.1,0,1.1').search();
    });
  }
);

test(
  '[INT][GEO-SEARCH] search inside a single polygon with an array',
  function(done) {
    setup(indexName, dataset, config).
    then(function(client) {
      var helper = algoliasearchHelper(client, indexName, {});
      helper.on('result', function(content) {
        expect(content.hits.length).toBe(1);
        expect(content.hits[0].objectID).toBe('1');
        done();
      });

      helper.setQueryParameter('insidePolygon', [[0, 0, 1.1, 0, 1.1, 1.1, 0, 1.1]]).search();
    });
  }
);

test(
  '[INT][GEO-SEARCH] search inside two polygons with an array',
  function(done) {
    setup(indexName, dataset, config).
    then(function(client) {
      var helper = algoliasearchHelper(client, indexName, {});

      helper.on('result', function(content) {
        expect(content.hits.length).toBe(2);
        var sortedHits = content.hits.sort(function(a, b) { return a.objectID.localeCompare(b.objectID); });
        expect(sortedHits[0].objectID).toBe('1');
        expect(sortedHits[1].objectID).toBe('4');
        done();
      });

      helper.setQueryParameter(
        'insidePolygon',
        [[0, 0, 1.1, 0, 1.1, 1.1, 0, 1.1], [1.5, 1.5, 2.1, 1.5, 2.1, 2.1, 1.5, 2.1]]).search();
    });
  }
);
