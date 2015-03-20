var test = require("tape");
var _ = require( "lodash" );
var sinon = require("sinon"); 
var Helper = require( "../../index" );

test( "Helper should be initialized with no refinments", function( t ){
  var helper = Helper( {}, "index", {} );
  t.ok( _.isEmpty( helper.refinements ), "helper.refinments should be an empty object");
  t.ok( _.isEmpty( helper.disjunctiveRefinements ), "helper.disjunctiveRefinements should be an empty object");
  t.ok( _.isEmpty( helper.excludes ), "helper.excludes should be an empty object");
  t.end();
} );

test( "Adding refinments should add an entry to the refinments attribute", function( t ) {
  var helper = Helper( {}, "index", {} );
  t.ok( _.isEmpty( helper.refinements ), "should be empty at first");
  helper.addRefine( "facet1", "42" );
  t.ok( _.size( helper.refinements ) === 1 &&
          helper.refinements["facet1:42"] === true,
        "when adding a refinment, should have one");
  helper.addRefine( "facet1", "42" );
  t.ok( _.size( helper.refinements ) === 1, "when adding the same, should still be one");
  helper.removeRefine( "facet1", "42" );
  t.ok( _.size( helper.refinements ) === 1 &&
          helper.refinements["facet1:42"] === false,
        "when removed, should be still one with the value of the key to false");
  t.end();
} );

