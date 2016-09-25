(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('vaCheckInService', vaCheckInService);

  // inject our dependencies
  vaCheckInService.$inject = ['$rootScope', 'devUtils', 'logger'];

  function vaCheckInService($rootScope, devUtils, logger) {

	 var savedData = {};
	 function set(data) {
	   savedData = data;
	 }
	 function get() {
	  return savedData;
	 }

	 return {
			  updateChildren: updateChildren,
			  insertChildren: insertChildren,
			  getHHChildrenBasedOnQR: getHHChildrenBasedOnQR,
			  getHousehold: getHousehold,
			  getHHChildren: getHHChildren,
        addAttendance: addAttendance,
			  set: set,
			  get: get
	 };



	function getHousehold(refreshFlag, callback) {
	 // is this the first time we've been called after a start up?
	  //var firstStartUp = (typeof $rootScope.firstStartUp == 'undefined' || $rootScope.firstStartUp === true);
	  var firstStartUp = true;

	  var hhPin = $rootScope.pin;

	  console.log('hhPin' + hhPin);
	  return new Promise(function(resolve, reject) {
		 if (refreshFlag || firstStartUp) {
		  $rootScope.firstStartUp = false;
		  if (typeof(callback) != "undefined") {
			// get local listOfChildren return through callback
			// this will mean our local listOfChildren will be shown intially to improve the UI
			getHouseholdFromPin(hhPin)
			  .then(function(listOfChildren) {
				callback(listOfChildren);
			});
		  }
		  // now make a sync call through the MobileCaddy libraries to sync
		  // our Account__ap table
		  devUtils.syncMobileTable('Household__ap').then(function(resObject){
		   // once the sync is complete we want to re-read the updates from
		   // the smartstore
			return getHouseholdFromPin(hhPin);
		  }).then(function(listOfChildren){
		   // we now have our updated listOfChildren from SFDC and the smartstore
		   // so send back in the promise resolution.
			resolve(listOfChildren);
		  }).catch(function(resObject){
			  reject(resObject);
		  });
		} else {
		 // not first start or refresh so just get our data from the local
		  getHouseholdFromPin(hhPin).then(function(listOfChildren) {
			resolve(listOfChildren);
		  }).catch(function(resObject) {
			reject(resObject);
		  });
		}
	  });
	}




  //Madhav Bhasin

  function addAttendance(childAuthCode,callback) {
    var isAuthentiacted=false;
   // var childAuthCode="Edge Communications";

    alert("childAuthCode......"+childAuthCode);
    if(childAuthCode=="undefined"){
      alert("blllaaaa");
    }
    else{
      alert("In else");
     devUtils.insertRecords('Attendance_new__ap', childAuthCode).then(function(resObject) {
       alert("resObject......"+resObject);
       isAuthentiacted=true;
       syncAttendance();

      });

   }

  }

  function syncAttendance(){
    alert("losttt");
    devUtils.syncMobileTable('Attendance_new__ap').then(function(resObject){
    // Our sync is complete
    //alert()
  //  SyncService.syncAllTables();
    //SyncService.syncAllTablesNow();
    alert("Inside sync....."+resObject);
  });
  }
  //Madhav Code Ends


	   function getHouseholdFromPin(hhPin) {
		console.log('in getHouseholdFromPin' + hhPin);

		 return new Promise(function(resolve, reject) {
		   devUtils.readRecords('Household__ap', []).then(function(resObject) {
			 //$rootScope.$broadcast('scroll.refreshComplete');
			 console.log('resObject.records = ' + resObject.records);

			 if(resObject.records.length > 0) {
				var houseHold =  _.findWhere(resObject.records, {'PIN__c': parseInt(hhPin, 10) });
				resolve(houseHold);
			 }
		   }).catch(function(resObject){
			 reject(resObject);
		   });
		 });
	   }


	function getHHChildren(refreshFlag, callback) {
	 // is this the first time we've been called after a start up?
	  //var firstStartUp = (typeof $rootScope.firstStartUp == 'undefined' || $rootScope.firstStartUp === true);
	  var firstStartUp = true;

	  var hhId = $rootScope.hhId;

	  console.log('hhId' + hhId);
	  return new Promise(function(resolve, reject) {
		 if (refreshFlag || firstStartUp) {
		  $rootScope.firstStartUp = false;
		  if (typeof(callback) != "undefined") {
			// get local listOfChildren return through callback
			// this will mean our local listOfChildren will be shown intially to improve the UI
			getListOfChildren(hhId)
			  .then(function(listOfChildren) {
				callback(listOfChildren);
			});
		  }
		  // now make a sync call through the MobileCaddy libraries to sync
		  // our Account__ap table
		  devUtils.syncMobileTable('Child__ap').then(function(resObject){
		   // once the sync is complete we want to re-read the updates from
		   // the smartstore
			return getListOfChildren(hhId);
		  }).then(function(listOfChildren){
		   // we now have our updated listOfChildren from SFDC and the smartstore
		   // so send back in the promise resolution.
			resolve(listOfChildren);
		  }).catch(function(resObject){
			  reject(resObject);
		  });
		} else {
		 // not first start or refresh so just get our data from the local
		  getListOfChildren(hhId).then(function(listOfChildren) {
			resolve(listOfChildren);
		  }).catch(function(resObject) {
			reject(resObject);
		  });
		}
	  });
	}


  function getListOfChildren(hhId) {
 console.log('in getListOfChildren' + hhId);

  return new Promise(function(resolve, reject) {
    var checkedInList = [];
    $rootScope.qrCode = false;
     devUtils.readRecords('Attendance_new__ap', []).then(function(resultsObject) {

      checkedInList = resultsObject.records;



      }).catch(function(resultsObject){
       reject(resultsObject);
     });

    devUtils.readRecords('Enrollment__ap', []).then(function(resObject) {
    //$rootScope.$broadcast('scroll.refreshComplete');
    console.log('resObject.enrollmentrecords = ' + resObject.records);

    if(resObject.records.length > 0) {
       devUtils.readRecords('Contact__ap', []).then(function(resultObject) {
         var contactIdList = resultObject;




     var childList1 = [];
     var childList2 = [];
     var childList3 = [];
             var hhChildrenCount = 0;
     $rootScope.childrenObjectList = resObject;
     var gender = 'M';
     var age = 0;
     for(var i=0; i< resObject.records.length; i ++) {
       var child = resObject.records[i];


       for (var j= 0; j < contactIdList.records.length; j++){
         var contact = contactIdList.records[j];
         if(child.Household__c === hhId && contact.Id === child.Child_Enrolled__c) {

           var chkstatus ="NOT CHECKED IN";
           var alreadyCheckIn = 'N';
           if(checkedInList !== null && checkedInList !== undefined && checkedInList.length > 0 ) {
              for(var p=0; p < checkedInList.length; p++){
                console.log('Deepa ---enrlChkList = ' + child.Id);
                var checkedInChild = checkedInList[p];
               if( checkedInChild.Enrollment_c === child.Id &&  (checkedInChild.Checked_In__c !== null &&  checkedInChild.Checked_In__c !== "undefined" )&&
                ( checkedInChild.Checked_Out__c === null &&  checkedInChild.Checked_Out__c === "undefined" )) {
                 alreadyCheckIn = 'Y';

                 chkstatus = "CHECKED IN";
               }else if(checkedInChild.Enrollment_c === child.Id &&  (checkedInChild.Checked_In__c !== null &&  checkedInChild.Checked_In__c !== "undefined" )&&
                ( checkedInChild.Checked_Out__c !== null &&  checkedInChild.Checked_Out__c !== "undefined" )){
                 alreadyCheckIn = 'Y';

                 chkstatus = "CHECKED OUT";
               }else{

                 chkstatus = "NOT CHECKED IN";
               }
              }
            }

             console.log('Gender__c --->'+child.Gender__c);
            hhChildrenCount ++;
            if(contact.Gender__c !== undefined ) {
             gender = contact.Gender__c;
             }
             if(contact.Birthdate !== undefined ) {
             var ageDifMs = Date.now() - contact.Birthdate.getTime();
             var ageDate = new Date(ageDifMs); // miliseconds from epoch
             age =  Math.abs(ageDate.getUTCFullYear() - 1970);

             }




            if(hhChildrenCount <=3 ) {
             childList1.push( {"childId":  child.Id, "childname": contact.Name, "childAge" : age,"isChecked" : false, "gender" : gender, "alreadyCheckIn" : 'N' , "status" : chkstatus});
            } else if(hhChildrenCount <=6 ) {
             childList2.push( {"childId":  child.Id, "childname": contact.Name, "childAge" : age,"isChecked" : false, "gender" : gender, "alreadyCheckIn" : 'N' ,"status" : chkstatus});
            } else if(hhChildrenCount <=9 ) {
             childList3.push( {"childId":  child.Id, "childname": contact.Name, "childAge" : age,"isChecked" : false, "gender" : gender, "alreadyCheckIn" : 'N' ,"status" : chkstatus});
            }
         }
       }
     }
     console.log('childList1' + childList1);
     console.log('childList2' + childList2);
     console.log('childList3' + childList3);



     $rootScope.listOfChildren1 = childList1;
     $rootScope.listOfChildren2 = childList2;
     $rootScope.listOfChildren3 = childList3;

     var children =  _.findWhere(resObject.records, {'Household__c': hhId });
     resolve(children.records);
     }).catch(function(resObject){
       reject(resObject);
     });
    }
    }).catch(function(resObject){
    reject(resObject);
    });
  });
  }


	 function getHHChildrenBasedOnQR(refreshFlag, callback) {
	 // is this the first time we've been called after a start up?
	  //var firstStartUp = (typeof $rootScope.firstStartUp == 'undefined' || $rootScope.firstStartUp === true);
	  var firstStartUp = true;

	  var childAuthCode = $rootScope.childAuthCode;

	  console.log('childAuthCode' + childAuthCode);
	  return new Promise(function(resolve, reject) {
		 if (refreshFlag || firstStartUp) {
		  $rootScope.firstStartUp = false;
		  if (typeof(callback) != "undefined") {
			// get local listOfChildren return through callback
			// this will mean our local listOfChildren will be shown intially to improve the UI
			getListOfChildrenBasedOnQR(childAuthCode)
			  .then(function(listOfChildren) {
				callback(listOfChildren);
			});
		  }
		  // now make a sync call through the MobileCaddy libraries to sync
		  // our Account__ap table
		  devUtils.syncMobileTable('Child__ap').then(function(resObject){
		   // once the sync is complete we want to re-read the updates from
		   // the smartstore
			return getListOfChildrenBasedOnQR(childAuthCode);
		  }).then(function(listOfChildren){
		   // we now have our updated listOfChildren from SFDC and the smartstore
		   // so send back in the promise resolution.
			resolve(listOfChildren);
		  }).catch(function(resObject){
			  reject(resObject);
		  });
		} else {
		 // not first start or refresh so just get our data from the local
		  getListOfChildrenBasedOnQR(childAuthCode).then(function(listOfChildren) {
			resolve(listOfChildren);
		  }).catch(function(resObject) {
			reject(resObject);
		  });
		}
	  });
	}


  function getListOfChildrenBasedOnQR(childAuthCode) {
 console.log('in getListOfChildren' + childAuthCode);

  return new Promise(function(resolve, reject) {
      $rootScope.qrCode = true;
   var checkedInList = [];
     devUtils.readRecords('Attendance_new__ap', []).then(function(resultsObject) {
     checkedInList = resultsObject.records;
     }).catch(function(resultsObject){
       reject(resultsObject);
     });

    devUtils.readRecords('Enrollment__ap', []).then(function(resObject) {
    //$rootScope.$broadcast('scroll.refreshComplete');
    console.log('resObject.records = ' + resObject.records);

    if(resObject.records.length > 0) {
      devUtils.readRecords('Contact__ap', []).then(function(resultObject) {
     var contactIdList = resultObject;
     $rootScope.childrenObjectList = resObject;

     var age = 0;
     var confMsg = '';
     var selChildList = [];
     var enrlChkList = [];
     var childList1 = [];
     for(var i=0; i< resObject.records.length; i ++) {
       var child = resObject.records[i];
       for (var j= 0; j < contactIdList.records.length; j++){
        var contact = contactIdList.records[j];

       if(child.Name === childAuthCode && contact.Id === child.Child_Enrolled__c) {
         alert('inside');
         var chkstatus ="NOT CHECKED IN";
          var alreadyCheckIn = 'N';
         if(checkedInList !== null && checkedInList !== undefined && checkedInList.length > 0 ) {
              for(var p=0; p < checkedInList.length; p++){
                 var checkedInChild = checkedInList[p];
               if( checkedInChild.Enrollment_c === child.Id &&  (checkedInChild.Checked_In__c !== null &&  checkedInChild.Checked_In__c !== "undefined" )&&
                ( checkedInChild.Checked_Out__c === null &&  checkedInChild.Checked_Out__c === "undefined" )) {
                 alreadyCheckIn = 'Y';
                 chkstatus = "CHECKED IN";
               }else if(checkedInChild.Enrollment_c === child.Id &&  (checkedInChild.Checked_In__c !== null &&  checkedInChild.Checked_In__c !== "undefined" )&&
                ( checkedInChild.Checked_Out__c !== null &&  checkedInChild.Checked_Out__c !== "undefined" )){
                 alreadyCheckIn = 'Y';
                 chkstatus = "CHECKED OUT";
               }else{
                 chkstatus = "NOT CHECKED IN";
               }
              }
            }
          selChildList.push(contact.Name);
          if(contact.Birthdate !== undefined ) {
             var ageDifMs = Date.now() - contact.Birthdate.getTime();
             var ageDate = new Date(ageDifMs); // miliseconds from epoch
             age =  Math.abs(ageDate.getUTCFullYear() - 1970);

             }
          //childList1.push( {"childId":  child.Id, "status": chkstatus, "childAge" : child.AGE__c,"isChecked" : true, "gender" : contact.Gender__c, "alreadyCheckIn" : alreadyCheckIn });
          childList1.push( {"childId":  child.Id, "childname": contact.Name, "childAge" : age,"isChecked" : false, "gender" : contact.Gender__c, "alreadyCheckIn" : 'N' , "status" : chkstatus});
          $rootScope.hhName = contact.LAST_NAME;

         enrlChkList.push({"childId": child.Id, "status" : chkstatus, "childname" : contact.Namee});
       }
     }
     }
     $rootScope.listOfChildren1 = childList1;
     $rootScope.listOfChildren2 = [];
     $rootScope.listOfChildren3 = [];
     for(var m=0; m < selChildList.length; m++){
       console.log('--->'+selChildList[m]);
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
     console.log('confMsg --->'+confMsg);
     $rootScope.enrlChkList = enrlChkList;
     alert('enrlChkList size ' +enrlChkList.length);
     $rootScope.confmsg = confMsg;

     var children =  _.findWhere(resObject.records, {'Name': childAuthCode });
     alert('children '+children);
     resolve(children.records);
     }).catch(function(resObject){
       reject(resObject);
     });
    }
    }).catch(function(resObject){
    reject(resObject);
    });
  });
  }



	function updateChildren(listOfChildren) {
		return new Promise(function(resolve, reject) {
				alert('updating record- calling');
				devUtils.updateRecords('Attendance_new__ap', listOfChildren, 'Id').then(function(resObjects) {
					alert('updating record');
				// perform background sync - we're not worried about Promise resp.
				//SyncService.syncAllTables();
				resolve(resObjects);
			}).catch(function(e) {
				reject(e);
			});
		});
	}

	function insertChildren(listOfChildren) {
					alert('inserting record - calling');
					console.log("madhav.......");
				/*devUtils.insertRecord('Attendance_new__ap', listOfChildren).then(function(resObjects) {
					alert('inserting record');
					syncMobileTable(Attendance_new__ap, true);
				// perform background sync - we're not worried about Promise resp.
				//SyncService.syncAllTables();
				resolve(resObjects);
			}).catch(function(e) {
				reject(e);
			});
			*/

			devUtils.insertRecord('Attendance_new__ap',listOfChildren).then(function(res) {
				alert('inserting record.....madhav');
    console.log('My res object', res);
}).catch(function(e) {
	alert('error '+e);
    console.log('Insert failed', e);
});




	}


  }

})();
