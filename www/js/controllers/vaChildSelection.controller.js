/**
* WelfareCase New Controller
*
* @description description
*/
(function() {
'use strict';

angular
  .module('starter.controllers')
  .controller('vaChildSelectionCtrl', vaChildSelectionCtrl);

vaChildSelectionCtrl.$inject = ['$scope', '$window', 'vaCheckInService', '$rootScope'];

function vaChildSelectionCtrl($scope, $window, vaCheckInService, $rootScope) {

 // console.log('vaCheckInService.get()' + vaCheckInService.get());

  console.log('$rootScope.PastCheckIn' + $rootScope.PastCheckIn );

  $scope.pastCheckIn = $rootScope.PastCheckIn;

  $scope.currentDateTime = new Date();

  $scope.listOfChildren1 = $rootScope.listOfChildren1;
  $scope.listOfChildren2 = $rootScope.listOfChildren2;
    $scope.listOfChildren3 = $rootScope.listOfChildren3;
  $scope.hhName = $rootScope.hhName;

  $scope.proceedCheckIn = function() {
    var confMsg = '';
    var selChildList = [];
    var enrlChkList = [];
   $rootScope.pastCheckInDate = $scope.checkInDate;
   $rootScope.pastCheckInTime = $scope.checkInTime;
   $rootScope.pastCheckOutDate = $scope.checkOutDate;
   $rootScope.pastCheckOutTime = $scope.checkOutTime;

   console.log('--->proceedCheckIn<---');
     if($scope.listOfChildren1 !== null && $scope.listOfChildren1 !== undefined && $scope.listOfChildren1.length > 0 )  {
       for(var i=0; i < $scope.listOfChildren1.length; i++){
         var isChkd = $scope.listOfChildren1[i].isChecked;
         var childName = $scope.listOfChildren1[i].childname;
         if(isChkd===true) {
           console.log('--->Checked<---');
           selChildList.push(childName);
           alert($scope.listOfChildren1[i].childId);
           alert($scope.listOfChildren1[i].status);
           var present = false;
           alert(present);
           if(present === false){
             enrlChkList.push({"childId": $scope.listOfChildren1[i].childId, "status" : $scope.listOfChildren1[i].status, "childname" : $scope.listOfChildren1[i].childname});
           }
         }
       }
     }
     if($scope.listOfChildren2 !== null && $scope.listOfChildren2 !== undefined && $scope.listOfChildren2.length > 0 )  {
       for(var l=0; l < $scope.listOfChildren2.length; l++){
         var isChkd2 = $scope.listOfChildren2[l].isChecked;
         var childName2 = $scope.listOfChildren2[l].childname;
         if(isChkd2===true) {
           console.log('--->Checked<---');
           selChildList.push(childName2);
           enrlChkList.push({"childId": $scope.listOfChildren1[l].childId, "status" : $scope.listOfChildren1[l].status, "childname" : $scope.listOfChildren1[l].childname});
         }
       }
     }
     if($scope.listOfChildren3 !== null && $scope.listOfChildren3 !== undefined && $scope.listOfChildren3.length > 0 )  {
       for(var m=0; m < $scope.listOfChildren3.length; m++){
         var isChkd3 = $scope.listOfChildren3[m].isChecked;
         var childName3 = $scope.listOfChildren3[m].childname;
         if(isChkd3===true) {
           console.log('--->Checked<---');
           selChildList.push(childName3);
           enrlChkList.push({"childId": $scope.listOfChildren1[m].childId, "status" : $scope.listOfChildren1[m].status, "childname" : $scope.listOfChildren1[m].childname});
         }
       }
     }
     if(selChildList !== null && selChildList !== undefined && selChildList.length > 0 ) {
       for(var c=0; c < selChildList.length; c++){
         console.log('--->'+selChildList[c]);
       }
       if(selChildList.length < 2) {
         for(var k=0; k < selChildList.length; k++){
           confMsg +=selChildList[k];
           console.log('--->'+selChildList[k]);
         }
       } else {
         for(var z=0; z < selChildList.length; z++) {
           if(z===0) {
             confMsg += selChildList[z];
           } else if(z===(selChildList.length-1)) {
             confMsg += ' and '+selChildList[z];
           } else {
             confMsg += ', '+selChildList[z];
           }
         }
       }
     }
   $rootScope.enrlChkList = enrlChkList;
   var selChildIdList = $rootScope.enrlChkList;
    if(selChildIdList.length > 0 ) {
      alert('selChildIdList.length ' +selChildIdList.length);
      for(var j=0; j < selChildIdList.length; j++){



         if( selChildIdList[j].status === 'NOT CHECKED IN') {

           alert('inserting value !!');
           var childIns = [{'Care_Date__c' : $scope.currentDateTime,'holiday__c' : false,'Enrollment__c': selChildIdList[j].childId,'Name' : '',
           'absent__c': false, 'Checked_In__c' : $scope.currentDateTime}];


           vaCheckInService.addAttendance(childIns);


         }else if( selChildIdList[j].status === 'CHECKED IN'){
           var childIns1 = [{'Care_Date__c' : $scope.currentDateTime,'holiday__c' : false,'Enrollment__c': selChildIdList[j].childId,'Name' : selChildIdList[j].childname,
                           'absent__c': false, 'Checked_Out__c' : $scope.currentDateTime}];


           vaCheckInService.updateChildren(childIns1);
         }


      }


   }


    $rootScope.confmsg = confMsg;
    $window.location.href = '#/tab/vaConfirmation';
  };

}

})();
