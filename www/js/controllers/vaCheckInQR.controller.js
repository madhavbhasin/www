  /**
 * WelfareCase New Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('vaCheckInQRCtrl', vaCheckInQRCtrl);

  vaCheckInQRCtrl.$inject = ['$scope', '$ionicModal','Camera','$cordovaBarcodeScanner', '$window', '$ionicLoading', 'vaCheckInService', '$rootScope'];

  function vaCheckInQRCtrl($scope, $ionicModal, Camera, $cordovaBarcodeScanner, $window, $ionicLoading, vaCheckInService, $rootScope) {


	  $scope.currentDateTime = new Date();


	  $scope.initHome = function() {
			console.log('in initHome' + $rootScope);
		  $rootScope.childAuthCode = '';
		  $rootScope.confMsg = '';
		  $rootScope.pin = '';
		  $rootScope.listOfChildren1 = [];
		  $rootScope.listOfChildren2 = [];
		  $rootScope.listOfChildren3 = [];
		  $rootScope.PastCheckIn = false;

		  console.log('in initHome' + $rootScope);
	  };

	$scope.currentDateTime = new Date();
	  /*$scope.photoImageData = null;

	  $scope.capturePhoto = function() {
	    Camera.getPicture().then(function(imageData) {
	      //console.log('capturePhoto success');
	      $scope.photoImageData = imageData;
	    }, function(err) {
	      console.error(err);
	    });
	  };*/

	  $scope.scanImageData = null;

	  $scope.scanBarcodePastVisit = function() {
		$rootScope.PastCheckIn = true;
		$scope.scanBarcode();
	  };

	  $scope.scanBarcode = function() {
	    if (cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
	      $cordovaBarcodeScanner.scan().then(function(imageData) {
	        //console.log("Cancelled -> " + imageData.cancelled);
	        if (!imageData.cancelled) {
	          /* */
			  //$scope.scanImageData = imageData.text;
			  $rootScope.childAuthCode = imageData.text;

				setTimeout(function(){
					$rootScope.childAuthCode = imageData.text;
				}, 2000);

			   // Start a loading spinner, this will be closed once the data has been
			   // returned from our service
			   $ionicLoading.show({
				 template: '<h2>Identifying child...</h2><p class="item-icon-center"> &nbsp; <ion-spinner/></p>',
				 animation: 'fade-in',
				 showBackdrop: true,
				 maxWidth: 600,
				 duration: 20000,
				  delay : 400
			   });

			   // Request data from our vaCheckInService
			   vaCheckInService.getHHChildrenBasedOnQR($rootScope.refreshFlag, localLoadOfChildren).then( function(localLoadOfChildren) {
					// update our scope with the list of localLoadOfChildren that was returned

					setTimeout(function(){
						$ionicLoading.hide();
						console.log("navigating it to -> vaConfirmation.html " );
						if($rootScope.PastCheckIn === true) {
							$window.location.href = '#/tab/vaChildSelection';
						} else {
							$window.location.href = '#/tab/vaConfirmation';
						}
					}, 2000);

			   }, function(e) {

				 console.error('error in fetching children', e);
			   });
	        }
	      }, function(error) {
	        console.error('error in scanning code' + err);
	      });
	    } else {
			console.log("navigating from else to -> vaConfirmation.html " );

			$rootScope.childAuthCode = '311000000';

			// Start a loading spinner, this will be closed once the data has been
			   // returned from our service
			   $ionicLoading.show({
				 template: '<h2>Identifying child...</h2><p class="item-icon-center"> &nbsp; <ion-spinner/></p>',
				 animation: 'fade-in',
				 showBackdrop: true,
				 maxWidth: 600,
				 duration: 30000,
				  delay : 400
			   });

			   // Request data from our vaCheckInService
			   vaCheckInService.getHHChildrenBasedOnQR($rootScope.refreshFlag, localLoadOfChildren).then( function(localLoadOfChildren) {
					// update our scope with the list of localLoadOfChildren that was returned

					setTimeout(function(){
						$ionicLoading.hide();
						console.log("navigating it to -> vaConfirmation.html " );

						if($rootScope.PastCheckIn === true) {
							$window.location.href = '#/tab/vaChildSelection';
						} else {
							$window.location.href = '#/tab/vaConfirmation';
						}
					}, 2000);
				}, function(e) {

				 console.error('error in fetching children', e);
			   });
			//$window.location.href = '#/tab/vaConfirmation';
	      //$scope.scanImageData = "9999092920299";
	    }
	  };

	  var localLoadOfChildren = function(localLoadOfChildren) {

	   };


	  $scope.navigateToPastCheckInUsingPin = function() {
		console.log("navigating from navigateTo PastCheckIn UsingPin " );
		//vaCheckInService.set('PastCheckIn');
		$rootScope.PastCheckIn = true;
		$window.location.href = '#/tab/vaCheckInPin';
	  };

	  $scope.navigateToCheckInUsingPin = function() {
		console.log("navigating from navigateTo CheckIn UsingPin " );
		//vaCheckInService.set('PinCheckIn');
		$rootScope.PastCheckIn = false;
		$window.location.href = '#/tab/vaCheckInPin';
	  };

 }

})();
