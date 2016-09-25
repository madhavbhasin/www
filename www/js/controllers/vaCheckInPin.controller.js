  /**
 * WelfareCase New Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('vaCheckInPinCtrl', vaCheckInPinCtrl);

  vaCheckInPinCtrl.$inject = ['$scope', '$window', '$rootScope', 'vaCheckInService', '$ionicLoading'];

  function vaCheckInPinCtrl($scope, $window, $rootScope, vaCheckInService, $ionicLoading) {
   
	  var signaturePad;
	  var canvas;

	 $scope.initPin = function() {	
		  $rootScope.childAuthCode = '';
		  $rootScope.confMsg = '';
		  $rootScope.pin = '';
		  $scope.pin = '';
	 };
	  
	  $scope.currentDateTime = new Date();

	  $scope.validatePin = function(pin) {
		  var iPin = pin;
		  $rootScope.pin = iPin;
		  if(iPin.length == 4) {

			// Start a loading spinner, this will be closed once the data has been
		   // returned from our service
		   $ionicLoading.show({
			 template: '<h2>Retrieving children...</h2><p class="item-icon-center"><ion-spinner/></p>',
			 animation: 'fade-in',
			 showBackdrop: true,
			 maxWidth: 600,
			 duration: 30000,
			  delay : 400
		   });

			// Request data from our AccountService
		   vaCheckInService.getHousehold($rootScope.refreshFlag, localLoadOfHousehold).then( function(household) {
			// update our scope with the list of household that was returned
			 console.log('vaCheckInPinCtrl, got the household' + household.Id);
			 $rootScope.hhId = household.Id;
			 $rootScope.hhName = household.HH_Name__c;
			 //$ionicLoading.hide();
				  
			//console.log('vaCheckInService, going to get the list of Children, $rootScope.hhId=' + $rootScope.hhId);
				// Request data from our vaCheckInService getHHChildren
			  vaCheckInService.getHHChildren($rootScope.refreshFlag, localLoadOfChildren).then(function(listOfChildren) {
				
			  }, function(e) {
				 console.error('error', e);
			   });
			
			setTimeout(function(){
				$ionicLoading.hide();
				$window.location.href = '#/tab/vaChildSelection';
			}, 2000);
			
				   
				  
		   }, function(e) {
			 console.error('error', e);
		   });
			
		  }
	  };



	  

	  var localLoadOfChildren = function(localListOfChildren) {
		 //$rootScope.listOfChildren = localListOfChildren;
		 /*console.log('Angular: localWelfareCasesCB, got cases with arr len', localListOfChildren.length);
		 if (localListOfChildren.length > 0){
		   //$ionicLoading.hide();
		 }*/
	   };

		 var localLoadOfHousehold = function(localLoadOfHousehold) {
		 $rootScope.household = localLoadOfHousehold;
		 console.log('Angular: localWelfareCasesCB, got cases with arr len', localLoadOfHousehold.length);
		 if (localLoadOfHousehold.length > 0){
		   //$ionicLoading.hide();
		 }
	   };

 }

})();
  
  
  
 