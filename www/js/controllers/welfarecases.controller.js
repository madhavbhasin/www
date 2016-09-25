(function() {
  'use strict';
 
  angular
    .module('starter.controllers')
    .controller('WelfareCasesCtrl', WelfareCasesCtrl);
 
  // Inject dependencies that we need
  WelfareCasesCtrl.$inject = ['$scope', '$rootScope', '$ionicLoading', 'WelfareCaseService'];
 
  function WelfareCasesCtrl($scope, $rootScope, $ionicLoading, WelfareCaseService) {
 
 // unhide our nav bar (element defined in index.html)
   var e = document.getElementById('my-nav-bar');
   angular.element(e).removeClass( "mc-hide" );
 
   // Start a loading spinner, this will be closed once the data has been
   // returned from our service
   $ionicLoading.show({
     template: '<h1>Loading...</h1><p class="item-icon-left">Fetching cases...<ion-spinner/></p>',
     animation: 'fade-in',
     showBackdrop: true,
     maxWidth: 600,
     duration: 30000,
      delay : 400
   });
 
   // Request data from our AccountService
   WelfareCaseService.all($rootScope.refreshFlag, localWelfareCasesCB).then(function(welfarecases) {
    // update our scope with the list of welfarecases that was returned
     $scope.welfarecases = welfarecases;
     console.log('WelfareCaseService, got cases');
     $ionicLoading.hide();
   }, function(e) {
     console.error('error', e);
   });
   $rootScope.refreshFlag = false;
 
 
   /**
    * @description A callback function that is called when a set of localstorage details are
    * returned.
    * This is used so that we can unlock the UI (from the loading spinner)
    * whilst remote data might be being sync'd.
    * @param  {[Cases Objects]} localAccounts
    */
   var localWelfareCasesCB = function(localWelfareCases) {
     $rootScope.welfarecases = localWelfareCases;
     console.log('Angular: localWelfareCasesCB, got cases with arr len', localWelfareCases.length);
     if (localWelfareCases.length > 0){
       $ionicLoading.hide();
     }
   };
 



   /**
   * Called upon "Pull to Refresh"
   */
  $scope.doRefreshFromPulldown = function() {
	  console.log('Welfarecasecontroller : doRefreshFromPulldown - start');
    WelfareCaseService.all(true).then(function(welfarecases) {
    //WelfareCaseService.all($rootScope.refreshFlag, localWelfareCasesCB).then(function(welfarecases) {
      $scope.welfarecases = welfarecases;
	   console.log('Welfarecasecontroller : doRefreshFromPulldown - end');
    }).catch(function(e) {
      console.error('error', angular.toJson(e));
    });
  };



  $scope.search = {};
  /**
   * Called when clearing the Search input
   */
  $scope.clearSearch = function() {
    $scope.search.query = "";
  };

 }
 
})();





 
