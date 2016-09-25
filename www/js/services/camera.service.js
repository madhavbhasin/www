/**
 * Camera Factory
 *
 * @description Camera
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('Camera', Camera);


  Camera.$inject = ['$q'];

  function Camera($q) {
	  return {
	    getPicture: function() {
	      var q = $q.defer();

	      navigator.camera.getPicture(function(result) {
	        // Do any magic you need
	        q.resolve(result);
	      }, function(err) {
	        q.reject(err);
	      }, {
	        quality         : 10,
	        targetWidth     : 300,
	        targetHeight    : 300,
	        encodingType    : navigator.camera.EncodingType.JPEG,
	        destinationType : navigator.camera.DestinationType.DATA_URL
	      });
	      return q.promise;
	    }
	  };
  }

})();