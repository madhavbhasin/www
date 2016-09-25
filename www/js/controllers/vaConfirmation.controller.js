  /**
 * WelfareCase New Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('vaConfirmationCtrl', vaConfirmationCtrl);

  vaConfirmationCtrl.$inject = ['$scope', '$window', '$timeout', '$rootScope','vaCheckInService'];

  function vaConfirmationCtrl($scope, $window, $timeout, $rootScope, vaCheckInService) {

	  $scope.currentDateTime = new Date();

	  $scope.confMsg =  $rootScope.confmsg;

		$scope.pastCheckIn = $rootScope.PastCheckIn;

		$scope.pastCheckInDate = $rootScope.pastCheckInDate;
		$scope.pastCheckInTime = $rootScope.pastCheckInTime;
		$scope.pastCheckOutDate = $rootScope.pastCheckOutDate;
		$scope.pastCheckOutTime = $rootScope.pastCheckOutTime;

		console.log('$scope.currentDateTime' + $scope.currentDateTime);
		console.log('$scope.pastCheckIn' + $scope.pastCheckIn);



		 var selInsertChildObjList = [];
		 var selUpdateChildObjList = [];

     var selChildIdList = $rootScope.enrlChkList;
      if(selChildIdList.length > 0 && $rootScope.qrCode === true) {
        alert('selChildIdList.length ' +selChildIdList.length);
        for(var j=0; j < selChildIdList.length; j++){



           if( selChildIdList[j].status === 'NOT CHECKED IN') {

             alert('inserting value !!');
             var childIns = [{'Care_Date__c' : '24/09/2016','holiday__c' : false,'Enrollment__c': selChildIdList[j].childId,'Name' : selChildIdList[j].childname,
             'absent__c': false, 'Checked_In__c' : $scope.currentDateTime}];


             vaCheckInService.addAttendance(childIns);


           }else if( selChildIdList[j].status === 'CHECKED IN'){
             var childIns1 = [{'Care_Date__c' : $scope.currentDateTime,'holiday__c' : false,'Enrollment__c': selChildIdList[j].childId,'Name' : selChildIdList[j].childname,
                             'absent__c': false, 'Checked_Out__c' : $scope.currentDateTime}];


             vaCheckInService.updateChildren(childIns1);
           }


        }


     }



	    $timeout(function() {

			 $rootScope.childAuthCode = '';
			 $rootScope.confMsg = '';
			 $rootScope.pin = '';
			 $rootScope.PastCheckIn = 'false';
			 $rootScope.listOfChildren1 = [];
			 $rootScope.listOfChildren2 = [];
			 $rootScope.listOfChildren3 = [];

			/*for (var prop in $rootScope) {
				if (prop.substring(0,1) !== '$') {
				console.log('in $rootScope[prop]' + $rootScope[prop]);
				delete $rootScope[prop];
				}
			}*/
			 console.log('in vaConfirmationCtrl' + $rootScope);
			$window.location.href = '#/tab/vaHome';
		}, 6000);
  }

})();
