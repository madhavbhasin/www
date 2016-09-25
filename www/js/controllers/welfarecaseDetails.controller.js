/**
 * WelfareCase Detail Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('WelfareCaseDetailsCtrl', WelfareCaseDetailsCtrl);

  WelfareCaseDetailsCtrl.$inject = ['$scope', '$stateParams','$ionicPopup', '$ionicLoading', '$location', 'WelfareCaseService' ];

  function WelfareCaseDetailsCtrl($scope, $stateParams, $ionicPopup, $ionicLoading, $location, WelfareCaseService) {

		WelfareCaseService.get($stateParams.wfCaseId).then(function(welfarecase) {
	    $scope.welfarecase = welfarecase;
	  }, function(e) {
	    console.error('error', e);
	  });


  }

})();