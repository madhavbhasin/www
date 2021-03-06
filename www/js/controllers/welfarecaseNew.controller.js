  /**
 * WelfareCase New Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('WelfareCaseNewCtrl', WelfareCaseNewCtrl);

  WelfareCaseNewCtrl.$inject = ['$scope', '$ionicModal','Camera','$cordovaBarcodeScanner'];

  function WelfareCaseNewCtrl($scope, $ionicModal, Camera,$cordovaBarcodeScanner) {
   
  var signaturePad;
  var canvas;

  $scope.clearCanvas = function() {
      signaturePad.clear();
  };

  $scope.saveCanvas = function() {
      $scope.signature = signaturePad.toDataURL();
      $scope.closeSignatureModal();
  };

  $scope.resizeCanvas = function() {
    var ratio = 1.0;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
  };


  $scope.showSignatureModal = function() {
   	console.log('WelfareCaseNewCtrl showSignatureModal - start');
    $ionicModal.fromTemplateUrl("signature.html", {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {

      console.log(modal);
	  $scope.signatureModal = modal;	  
	 
       $scope.signatureModal.show();

       canvas = angular.element($scope.signatureModal.modalEl).find('canvas')[0];	   
	   console.log(canvas);

       $scope.resizeCanvas();
       signaturePad = new SignaturePad(canvas, { minWidth: 1, maxWidth: 1.5 });
    });

    
	console.log('WelfareCaseNewCtrl showSignatureModal - end');

  }; 


$scope.closeSignatureModal = function() {
    $scope.signatureModal.hide();
    $scope.signatureModal.remove();
    signaturePad = canvas = $scope.signatureModal = null;
  };

 
  $scope.photoImageData = null;

  $scope.capturePhoto = function() {
	Camera.getPicture().then(function(imageData) {
	  //console.log('capturePhoto success');
	  $scope.photoImageData = imageData;
	}, function(err) {
	  console.error(err);
	});
  };

 


  $scope.scanImageData = null;

  $scope.scanBarcode = function() {
	if (cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
	  $cordovaBarcodeScanner.scan().then(function(imageData) {
		//console.log("Cancelled -> " + imageData.cancelled);
		if (!imageData.cancelled) {
		  $scope.scanImageData = imageData;
		  //console.log("Barcode Format -> " + imageData.format);
		}
	  }, function(error) {
		console.error(err);
	  });
	} else {
	  $scope.scanImageData = "9999092920299";
	}
  };
  

 
 }

})();
  
  
  
 