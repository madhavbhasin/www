(function() {
  'use strict';
 
  angular
    .module('starter.services')
    .factory('WelfareCaseService', WelfareCaseService);
 
  // inject our dependencies
  WelfareCaseService.$inject = ['$rootScope', 'devUtils'];
 
  function WelfareCaseService($rootScope, devUtils) {
 
   return {
     all: getWelfareCases,

	    get: function(wfCaseId){
      return new Promise(function(resolve, reject) {
        devUtils.readRecords('Welfare_Case__ap', []).then(function(resObject) {
          var welfarecase = _.findWhere(resObject.records, {'Id': wfCaseId });
          resolve(welfarecase);
        }).catch(function(resObject){
          reject(resObject);
        });
      });
    }


   };
 
/*
   function getWelfareCases() {
     return new Promise(function(resolve, reject) {
       devUtils.syncMobileTable('Welfare_Case__ap').then(function(resObject){
         return getWelfareServicesFromSmartStore();
       }).then(function(welfarecases){
         resolve(welfarecases);
       }).catch(function(resObject){
           reject(resObject);
       });
     });
   }*/

 /**
 * @description Gets a list of welfarecases.
 * @param {boolean} refreshFlag Tells us whether the function has been called
 *   from a "pull to refresh"
 * @param {Function} callback A callback function that we can use to pass
 *   back local data before we receive an update from SFDC
 * @return {promise}
 */

function getWelfareCases(refreshFlag, callback) {
 // is this the first time we've been called after a start up?
  var firstStartUp = (typeof $rootScope.firstStartUp == 'undefined' || $rootScope.firstStartUp === true);
  return new Promise(function(resolve, reject) {
    if (refreshFlag || firstStartUp) {
      $rootScope.firstStartUp = false;
      if (typeof(callback) != "undefined") {
        // get local welfarecases return through callback
        // this will mean our local welfarecases will be shown intially to improve the UI
        getWelfareServicesFromSmartStore()
          .then(function(welfarecases) {
            callback(welfarecases);
        });
      }
      // now make a sync call through the MobileCaddy libraries to sync
      // our Account__ap table
      devUtils.syncMobileTable('Welfare_Case__ap').then(function(resObject){
       // once the sync is complete we want to re-read the updates from
       // the smartstore
        return getWelfareServicesFromSmartStore();
      }).then(function(welfarecases){
       // we now have our updated welfarecases from SFDC and the smartstore
       // so send back in the promise resolution.
        resolve(welfarecases);
      }).catch(function(resObject){
          reject(resObject);
      });
    } else {
     // not first start or refresh so just get our data from the local
      getWelfareServicesFromSmartStore().then(function(welfarecases) {
        resolve(welfarecases);
      }).catch(function(resObject) {
        reject(resObject);
      });
    }
  });
}
 
 
   function getWelfareServicesFromSmartStore() {
     return new Promise(function(resolve, reject) {
       devUtils.readRecords('Welfare_Case__ap', []).then(function(resObject) {
         $rootScope.$broadcast('scroll.refreshComplete');
         resolve(resObject.records);
       }).catch(function(resObject){
         reject(resObject);
       });
     });
   }
 
  }

  

 
})();