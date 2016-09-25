/**
 * Deploy Factory
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('VendorService', VendorService);

  VendorService.$inject = ['$rootScope', 'devUtils', 'logger','$scope'];

  function VendorService($rootScope, devUtils, logger,$scope) {


    return {
         authentiacteUser: authentiacteUser
    };

function authentiacteUser() {
  var isAuthentiacted=false;
  childAuthCode="Burlington Textiles Corp of America";
  alert(childAuthCode);
  if(childAuthCode=="undefined"){
    alert("blllaaaa");
  }
  else{
    devUtils.readRecords('Account__ap', []).then(function(resObject) {
        //records = resObject.records;
        console.log('resObject.records = ' + resObject.records);
        if(resObject.records.length > 0) {
var child = resObject.records[i];
if(child.Name === childAuthCode) {
  isAuthentiacted=true;
}


        }
    });
 }
 alert(isAuthentiacted);
 return isAuthentiacted;
}





  }

})();
