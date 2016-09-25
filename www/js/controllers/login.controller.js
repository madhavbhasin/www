/**
 * Deploy Controller
 *
 * @description controller for the Deploy to Salesforce
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$ionicPopup', '$state', '$timeout','$http','$ionicLoading','authenticateService'];

  function loginCtrl($scope, $ionicPopup, $state, $timeout,$http,$ionicLoading,authenticateService) {
  $scope.data = {};

  // $scope.authorizations = [];
  // $http.get('js/data/vendors.json').success(function(data) {
  //   console.log('output ********* '+ data);
  //      $scope.authorizations = data;
  //
  //    userService.setAuthorizations(data);
  //
  // })


$scope.login = function() {
//alert($scope.data.userName);
//alert("ok going.....");
authenticateService.setisauthenticated(false);
//var c=authenticateService.authentiacteUser($scope.data.userName);
// B(address, function(geocodeData) {
//         // use geocode data here
//     });
authenticateService.authentiacteUser($scope.data.userName,function(household) {
  //alert("household...."+household);
  var isauthenticated=authenticateService.getisauthenticated();
  if(isauthenticated===true && isauthenticated!==undefined){
  //  alert("welcome");

    $state.go('tab.vaHome');
  }
  else{
  if(isauthenticated!==undefined){
     var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
    });
    $timeout(function() {
            alertPopup.close();
          }, 2000);
  }
  }
}, function(e) {
console.error('error', e);
var alertPopup = $ionicPopup.alert({
   title: 'Login failed!',
   template: 'Please check your credentials!'
});
$timeout(function() {
       alertPopup.close();
     }, 2000);
});



$scope.data = {};

};

  }

})();
