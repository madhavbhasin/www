(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('authenticateService', authenticateService);

  // inject our dependencies
  authenticateService.$inject = ['$rootScope', 'devUtils', 'logger','$state'];

  function authenticateService($rootScope, devUtils, logger, $state) {

	 var savedData = {};
	 function set(data) {
	   savedData = data;
	 }
	 function get() {
	  return savedData;
	 }



   var isauthenticated = {};
  function setisauthenticated(data) {
    isauthenticated = data;
  }
  function getisauthenticated() {
   return isauthenticated;
  }

	 return {
			  updateChildren: updateChildren,
			  getHHChildrenBasedOnQR: getHHChildrenBasedOnQR,
			  getHousehold: getHousehold,
			  getHHChildren: getHHChildren,
         authentiacteUser: authentiacteUser,
			  set: set,
			  get: get,
        setisauthenticated: setisauthenticated,
        getisauthenticated: getisauthenticated
	 };





   function authentiacteUser(childAuthCode,callback) {
     var isAuthentiacted=false;
    // var childAuthCode="Edge Communications";

     //alert("......"+childAuthCode);
     if(childAuthCode=="undefined"){
       //alert("blllaaaa");
     }
     else{
       devUtils.readRecords('Account_ap__ap', []).then(function(resObject) {
           //records = resObject.records;
          // childAuthCode=childAuthCode.toLowerCase;
          // alert("Inside");
           console.log('resObject.records = ' + resObject.records);
           if(resObject.records.length > 0) {
        //     alert("Inside12");
             	for(var i=0; i< resObject.records.length; i ++) {
          //    alert("new Inside");
   var child = resObject.records[i];
  //alert("Inside"+[i]+"......."+child.Name);
   console.log("child.Name...."+child.Name+"...childAuthCode...."+childAuthCode+"......");
   var childname=child.Name;
   childname=childname.toLowerCase;

   //alert("childname....."+childname+"......childAuthCode....."+childAuthCode);
   if(child.Name === childAuthCode) {
     //alert("gotchhhaaaa");
setisauthenticated(true);
$rootScope.vendorName =child.Name;
//$state.go('tab.vaHome');
isAuthentiacted=true;
   }
}
           callback(isAuthentiacted);
         }
         else{
           callback(false);
         }
       });
    }
    //alert("....."+isAuthentiacted);
    //return isAuthentiacted;
   }

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
		   devUtils.readRecords('Child__ap', []).then(function(resObject) {
			 //$rootScope.$broadcast('scroll.refreshComplete');
			 console.log('resObject.records = ' + resObject.records);
			 var selChildIdList = $rootScope.selChildIdList;
			 console.log('selChildIdList = ' + selChildIdList);
			 if(selChildIdList === null || selChildIdList === undefined) {
				selChildIdList = [];
			  }
			 if(resObject.records.length > 0) {
				var childList1 = [];
				var childList2 = [];
				var childList3 = [];
                var hhChildrenCount = 0;
				$rootScope.childrenObjectList = resObject;
				var gender = 'M';
				for(var i=0; i< resObject.records.length; i ++) {
					var child = resObject.records[i];
					//console.log('child.FIRST_NAME__c = ' + child.FIRST_NAME__c);
					//console.log('child.Household__c = ' + child.Household__c);
					if(child.Household__c === hhId) {

						var alreadyCheckIn = 'N';
						 if(selChildIdList !== null && selChildIdList !== undefined && selChildIdList.length > 0 ) {
							 for(var p=0; p < selChildIdList.length; p++){
								if( selChildIdList[p] === child.Id ) {
									console.log(child.first_name__c + 'already checked-In');
									alreadyCheckIn = 'Y';
								}
							 }
						 }
						  console.log('Gender__c --->'+child.Gender__c);
                         hhChildrenCount ++;
						 if(child.Gender__c !== undefined ) {
							gender = child.Gender__c;
						  }
						 if(hhChildrenCount <=3 ) {
							childList1.push( {"childId":  child.Id, "childname": (child.FIRST_NAME__c + ' ' + child.LAST_NAME__c), "childAge" : child.AGE__c,"isChecked" : false, "gender" : gender, "alreadyCheckIn" : alreadyCheckIn });
						 } else if(hhChildrenCount <=6 ) {
							childList2.push( {"childId":  child.Id, "childname": (child.FIRST_NAME__c + ' ' + child.LAST_NAME__c), "childAge" : child.AGE__c,"isChecked" : false, "gender" : gender, "alreadyCheckIn" : alreadyCheckIn });
						 } else if(hhChildrenCount <=9 ) {
							childList3.push( {"childId":  child.Id, "childname": (child.FIRST_NAME__c + ' ' + child.LAST_NAME__c), "childAge" : child.AGE__c,"isChecked" : false, "gender" : gender, "alreadyCheckIn" : alreadyCheckIn });
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
		   devUtils.readRecords('Child__ap', []).then(function(resObject) {
			 //$rootScope.$broadcast('scroll.refreshComplete');
			 console.log('resObject.records = ' + resObject.records);

			 if(resObject.records.length > 0) {
				$rootScope.childrenObjectList = resObject;
				var confMsg = '';
				var selChildList = [];
				var selChildIdList = $rootScope.selChildIdList;
				var childList1 = [];
				for(var i=0; i< resObject.records.length; i ++) {
					var child = resObject.records[i];
					//console.log('child.FIRST_NAME__c = ' + child.FIRST_NAME__c);
					//console.log('child.Household__c = ' + child.Household__c);
					if(child.AUTH_CODE__c === childAuthCode) {

						 var alreadyCheckIn = 'N';
						 if(selChildIdList !== null && selChildIdList !== undefined && selChildIdList.length > 0 ) {
							 for(var p=0; p < selChildIdList.length; p++){
								if( selChildIdList[p] === child.Id ) {
									alreadyCheckIn = 'Y';
								}
							 }
						 } else {
							selChildIdList = [];
						 }

						 selChildList.push(child.FIRST_NAME__c + ' ' + child.LAST_NAME__c);
						 childList1.push( {"childId":  child.Id, "childname": (child.FIRST_NAME__c + ' ' + child.LAST_NAME__c), "childAge" : child.AGE__c,"isChecked" : true, "gender" : child.Gender__c, "alreadyCheckIn" : alreadyCheckIn });
						 $rootScope.hhName = child.LAST_NAME__c;

						selChildIdList.push(child.Id);

					}
				}
				$rootScope.listOfChildren1 = childList1;
				$rootScope.listOfChildren2 = [];
				$rootScope.listOfChildren3 = [];
				for(var j=0; j < selChildList.length; j++){
					console.log('--->'+selChildList[j]);
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
				$rootScope.selChildIdList = selChildIdList;
				$rootScope.confmsg = confMsg;

				var children =  _.findWhere(resObject.records, {'AUTH_CODE__c': childAuthCode });
				resolve(children.records);
			 }
		   }).catch(function(resObject){
			 reject(resObject);
		   });
		 });
	   }

	function updateChildren(listOfChildren) {
		return new Promise(function(resolve, reject) {
				devUtils.updateRecords('Child__ap', listOfChildren, 'Id').then(function(resObjects) {
				// perform background sync - we're not worried about Promise resp.
				//SyncService.syncAllTables();
				resolve(resObjects);
			}).catch(function(e) {
				reject(e);
			});
		});
	}


  }

})();
