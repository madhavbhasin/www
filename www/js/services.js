/**
 * starter.services module
 *
 * @description defines starter.service module and also sets up some other deps
 * as Angular modules.
 */
angular.module('underscore', [])
  .factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

angular.module('devUtils', [])
  .factory('devUtils', function() {
    return mobileCaddy.require('mobileCaddy/devUtils');
});

angular.module('vsnUtils', [])
  .factory('vsnUtils', function() {
    return mobileCaddy.require('mobileCaddy/vsnUtils');
});

angular.module('smartStoreUtils', [])
  .factory('smartStoreUtils', function() {
    return mobileCaddy.require('mobileCaddy/smartStoreUtils');
});

angular.module('logger', [])
  .factory('logger', function() {
    return mobileCaddy.require('mobileCaddy/logger');
});

angular.module('starter.services', ['underscore', 'devUtils', 'vsnUtils', 'smartStoreUtils', 'logger']);
/**
 * AppRunStatus Factory
 *
 * @description Handles app status events such as "resume" etc.
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('AppRunStatusService', AppRunStatusService);

  AppRunStatusService.$inject = ['$ionicPopup', '$ionicLoading', 'devUtils', 'vsnUtils', 'SyncService', 'logger'];

  function AppRunStatusService($ionicPopup, $ionicLoading, devUtils, vsnUtils, SyncService, logger) {

	 return {
	    statusEvent: function(status){
	      logger.log('AppRunStatusService status ' + status);
	      if (status == "resume") {
	        // resume();
	      }
	    }
	  };

	  function resume() {
	    devUtils.dirtyTables().then(function(tables){
	      logger.log('on resume: dirtyTables check');
	      if (tables && tables.length === 0) {
	        logger.log('on resume: calling upgradeAvailable');
	        vsnUtils.upgradeAvailable().then(function(res){
	          logger.log('on resume: upgradeAvailable? ' + res);
	          if (res) {
	            var notificationTimeout = (1000 * 60 * 5); // 5 minutes
	            var prevUpNotification = localStorage.getItem('prevUpNotification');
	            var timeNow = Date.now();
	            if (prevUpNotification === null) {
	              prevUpNotification = 0;
	            }
	            if (parseInt(prevUpNotification) < (timeNow - notificationTimeout)){
	              var confirmPopup = $ionicPopup.confirm({
	                title: 'Upgrade available',
	                template: 'Would you like to upgrade now?',
	                cancelText: 'Not just now',
	                okText: 'Yes'
	              });
	              confirmPopup.then(function(res) {
	                if(res) {
	                  $ionicLoading.show({
	                    duration: 30000,
	                    delay : 400,
	                    maxWidth: 600,
	                    noBackdrop: true,
	                    template: '<h1>Upgrade app...</h1><p id="app-upgrade-msg" class="item-icon-left">Upgrading...<ion-spinner/></p>'
	                  });
	                  localStorage.removeItem('prevUpNotification');
	                  logger.log('on resume: calling upgradeIfAvailable');
	                  vsnUtils.upgradeIfAvailable().then(function(res){
	                    logger.log('on resume: upgradeIfAvailable res = ' + res);
	                    //console.log('upgradeIfAvailable', res);
	                    if (!res) {
	                      $ionicLoading.hide();
	                      $scope.data = {};
	                      $ionicPopup.show({
	                        title: 'Upgrade',
	                        subTitle: 'The upgrade could not take place due to sync in progress. Please try again later.',
	                        scope: $scope,
	                        buttons: [
	                          {
	                            text: 'OK',
	                            type: 'button-positive',
	                            onTap: function(e) {
	                              return true;
	                            }
	                          }
	                        ]
	                      });
	                    }
	                  }).catch(function(e){
	                    logger.error("resume " + JSON.stringify(e));
	                    $ionicLoading.hide();
	                  });
	                } else {
	                  localStorage.setItem('prevUpNotification', timeNow);
	                }
	              });
	            }
	          }
	        });
	      } else {
	        logger.log('on resume: dirtyTables found');
	      }
	    });
	    return true;
	  }
  }

})();
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

/**
 * Camera Factory
 *
 * @description Camera
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('Camera', Camera);


  Camera.$inject = ['$q'];

  function Camera($q) {
	  return {
	    getPicture: function() {
	      var q = $q.defer();

	      navigator.camera.getPicture(function(result) {
	        // Do any magic you need
	        q.resolve(result);
	      }, function(err) {
	        q.reject(err);
	      }, {
	        quality         : 10,
	        targetWidth     : 300,
	        targetHeight    : 300,
	        encodingType    : navigator.camera.EncodingType.JPEG,
	        destinationType : navigator.camera.DestinationType.DATA_URL
	      });
	      return q.promise;
	    }
	  };
  }

})();
/**
 * Deploy Factory
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('DeployService', DeployService);

  DeployService.$inject = ['$rootScope', '$q', '$timeout', '$http'];

  function DeployService($rootScope, $q, $timeout, $http) {
		var apiVersionInt = 32;
		var apiVersion = "v" + 32 + ".0";

	  return {
	  	checkVsn : checkVsn,

	    getDetails : getDetails,

	    deployBunlde : function(appConfig){
	      return encodeAppBundle(appConfig).then(function(myBody, bundleFiles){
	        return uploadAppBundle(appConfig, myBody);
	      });
	    },
	    uploadCachePage : uploadCachePage,

	    uploadStartPage : uploadStartPage,

	    srDetails: function() {
	      return encodeAppBundle().then(function(myBody){
	        return uploadAppBundle(myBody);
	      }).then(function(res){
	        return uploadStartPage();
	      });
	    }
	  };


	  /**
	   * checkVsn
	   * @description Checks to see if the destination org has at least the min
	   *              version on MobileCaddy installed
	   * @param  {string} minMCPackVsn
	   * @return {promise} Resolves if OK, rejects with object if fails
	   */
	  function checkVsn(minMCPackVsn) {
	    return new Promise(function(resolve, reject) {
	    	var options = JSON.stringify({ "function":"versionInfo"});
		  	force.request(
	        {
	          method: 'POST',
						path:"/services/apexrest/mobilecaddy1/PlatformDevUtilsR001",
						contentType:"application/json",
						data:{startPageControllerVersion:'001', jsonParams:options}
	        },
	        function(response) {
	        	var respJson = JSON.parse(response);
	        	if (respJson.errorMessage == "success") {
	          	if ( respJson.packageVersion >= minMCPackVsn) {
	          		resolve();
	          	} else {
	          		reject({message : "Version of MobileCaddy on SFDC needs to be min version " + minMCPackVsn + ".\nCurrently running " + respJson.packageVersion + ".\nPlease upgrade.", type : "error"});
	          	}
	          } else {
							if (respJson.errorNo == 48)
							{
		          	respJson.message = "Sorry, looks like you have not enabled a Remote Site on your destination org. Please see http://developer.mobilecaddy.net/docs/adding-remote-site/ for details";
		          	respJson.type = "error";
	          	} else {
		          	respJson.message = respJson.errorMessage;
		          	respJson.type = "error";
	          	}
	          	console.error(respJson);
	          	reject(respJson);
	          }
	        },
	        function(error) {
	          console.error(error);
	          if (error[0].errorCode == "NOT_FOUND") {
	          	// we're likely running against an old package
          		reject({message : "Version of MobileCaddy on SFDC needs to be min version " + minMCPackVsn + ".\nPlease upgrade.", type : "error"});
	          } else {
	          	reject({message :'Deploy failed. See console for details.', type: 'error'});
	        	}
	        }
	      );
	  	});
	  }


	  function _arrayBufferToBase64( buffer ) {
	    var binary = '';
	    var bytes = new Uint8Array( buffer );
	    var len = bytes.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary += String.fromCharCode( bytes[ i ] );
	    }
	    return window.btoa( binary );
	  }

	  /**
	   * Does the static resource already exist on the platform for this app/vsn
	   */
	  function doesBundleExist(appConfig){
	    return new Promise(function(resolve, reject) {
	    var dataName = appConfig.sf_app_name + '_' + appConfig.sf_app_vsn;
	    // check if statid resource already exists
	    force.request(
	      {
	        path: '/services/data/' + apiVersion + '/tooling/query/?q=select Id, Name, Description, LastModifiedDate from StaticResource WHERE Name=\'' + dataName + '\' LIMIT 1'
	      },
	      function(response) {
	          console.debug('response' , response);
	          resolve(response);
	      },
	      function(error) {
	        console.error('Failed to check if app bundle already existed on platform');
	        reject({message :"App bundle upload failed. See console for details.", type: 'error'});
	      });
	    });
	  }

	  /**
	   * Does the static resource already exist on the platform for this app/vsn
	   */
	  function doesPageExist(pageName){
	    return new Promise(function(resolve, reject) {
	    // check if statid resource already exists
	    force.request(
	      {
	        path: '/services/data/' + apiVersion + '/tooling/query/?q=select Id, Name, Description, LastModifiedDate from ApexPage WHERE Name=\'' + pageName + '\' LIMIT 1'
	      },
	      function(response) {
	          console.debug('response' , response);
	          resolve(response);
	      },
	      function(error) {
	        console.error('Failed to check if page already existed on platform');
	        reject({message :"Page upload failed. See console for details.", type: 'error'});
	      });
	    });
	  }

	  function getDetails () {
	    return new Promise(function(resolve, reject) {
	    var details = {};
	    $timeout(function() {
	        $http.get('../package.json').success(function(appConfig) {
	          appConfig.sf_app_vsn = appConfig.version.replace(/\./g, '');
	          resolve(appConfig);
	        }).catch(function(err){
	          console.error(err);
	        });
	    }, 30);
	    });
	  }

	  function encodeAppBundle(appConfig){
	    return new Promise(function(resolve, reject) {

	      JSZipUtils.getBinaryContent('../' + appConfig.name + '-' + appConfig.version +'.zip', function(err, data) {
	        if(err) {
	          console.error(err);
	          reject(err); // or handle err
	        }
	        var zipFileLoaded = new JSZip(data);
	        $rootScope.deployFiles = zipFileLoaded.files;
	        resolve(_arrayBufferToBase64(data));
	      });
	    });
	  }

	  function uploadAppBundle (appConfig, myBody) {
	    return new Promise(function(resolve, reject) {
	    var dataName = appConfig.sf_app_name + '_' + appConfig.sf_app_vsn;
	    doesBundleExist(appConfig).then(function(response){
	      if (response.records.length > 0) {
	        // Update existing resource
	        console.debug('resource exists... patching existing');
	        var existingSR = response.records[0];
	        force.request(
	          {
	            method: 'PATCH',
	            contentType: 'application/json',
	            path: '/services/data/' + apiVersion + '/tooling/sobjects/StaticResource/' + existingSR.Id + '/',
	            data: {
	              'Body':myBody
	            }
	          },
	          function(response) {
	              console.debug('response' , response);
	              resolve('Existing app bundle updated');
	          },
	          function(error) {
	            console.error('Failed to check if app bundle already existed on platform');
	            reject({message :"App bundle upload failed. See console for details.", type: 'error'});
	          }
	        );
	      } else {
	        // Updload new resource
	        force.request(
	          {
	            method: 'POST',
	            contentType: 'application/json',
	            path: '/services/data/' + apiVersion + '/tooling/sobjects/StaticResource/',
	            data: {
	              'Name': dataName,
	              'Description' : 'App Bundle - auto-uploaded by MobileCaddy delopyment tooling',
	              'ContentType':'application/zip',
	              'Body':myBody,
	              'CacheControl': 'Public'
	            }
	          },
	          function(response) {
	            console.debug('response' , response);
	            resolve('App bundle uploaded');
	          },
	          function(error) {
	            console.error(error);
	            reject({message :"App bundle upload failed. See console for details.", type: 'error'});
	          });
	      }
	    });
	    });
	  }

	  function uploadCachePage(appConfig) {
	    return new Promise(function(resolve, reject) {
	      $timeout(function() {
	        $http.get('../apex-templates/cachepage-template.apex').success(function(data) {
	          var dataName = appConfig.sf_app_name + 'Cache_' + appConfig.sf_app_vsn;
	          var cacheEntriesStr = '';
	          _.each($rootScope.deployFiles, function(el){
	            if (!el.dir) cacheEntriesStr += '{!URLFOR($Resource.' + appConfig.sf_app_name + '_' + appConfig.sf_app_vsn + ', \'' + el.name + '\')}\n';
	          });
	          var dataParsed = data.replace(/MC_UTILS_RESOURCE/g, appConfig.mc_utils_resource);
	          dataParsed = dataParsed.replace(/MY_APP_FILE_LIST/g, cacheEntriesStr);
	          delete $rootScope.deployFiles;

						var pageOptions = JSON.stringify({
							"function":"createApexPage",
							"pageApiName":dataName,
							"pageLabel":dataName,
							"pageContents":dataParsed,
							"apiVersion":apiVersionInt,
							"pageDescription":"MobileCaddy CachePage" });
	          force.request(
	            {
	              method: 'POST',
								path:"/services/apexrest/mobilecaddy1/PlatformDevUtilsR001",
								contentType:"application/json",
								data:{startPageControllerVersion:'001', jsonParams:pageOptions}
	            },
	            function(response) {
	            	// we will get a response like this, is it fails
	            	// "{\"errorMessage\":\"Create Apex Page exception: Error occured processing component ShellAppCache_001. That page name is already in use, please choose a different one. (DUPLICATE_DEVELOPER_NAME). Fields Name.\",\"errorNo\":49}"
	            	var respJson = JSON.parse(response);
	            	if (respJson.errorMessage == "success") {
	              	resolve('Cache manifest uploaded');
	              } else {
		            	respJson.message = respJson.errorMessage;
		            	respJson.type = "error";
	              	console.error(respJson);
	              	reject(respJson);
	              }
	            },
	            function(error) {
	              console.error(error);
	              reject({message :'Start page upload failed. See console for details.', type: 'error'});
	            }
	          );
    			});
	      }, 30);
	    });
	  }


	  function uploadStartPage(appConfig) {
	    return new Promise(function(resolve, reject) {
	      $timeout(function() {
	        $http.get('../apex-templates/startpage-template.apex').success(function(data) {
	          var dataName = appConfig.sf_app_name + '_' + appConfig.sf_app_vsn;
	          var dataParsed = data.replace(/MC_UTILS_RESOURCE/g, appConfig.mc_utils_resource);
	          dataParsed = dataParsed.replace(/MY_APP_RESOURCE/g, appConfig.sf_app_name + '_' + appConfig.sf_app_vsn);
	          dataParsed = dataParsed.replace(/MY_APP_CACHE_RESOURCE/g, appConfig.sf_app_name + 'Cache_' + appConfig.sf_app_vsn);


						var pageOptions = JSON.stringify({
							"function":"createApexPage",
							"pageApiName":dataName,
							"pageLabel":dataName,
							"pageContents":dataParsed,
							"apiVersion":apiVersionInt,
							"pageDescription":"MobileCaddy StartPage" });
	          force.request(
	            {
	              method: 'POST',
								path:"/services/apexrest/mobilecaddy1/PlatformDevUtilsR001",
								contentType:"application/json",
								data:{startPageControllerVersion:'001', jsonParams:pageOptions}
	            },
	            function(response) {
	            	var respJson = JSON.parse(response);
	            	if (respJson.errorMessage == "success") {
	              	resolve('Start page uploaded');
	              } else {
		            	respJson.message = respJson.errorMessage;
		            	respJson.type = "error";
	              	console.error(respJson);
	              	reject(respJson);
	              }
	            },
	            function(error) {
	              console.error(error);
	              reject({message :'Start page upload failed. See console for details.', type: 'error'});
	            }
	          );
	        });
	      }, 30);
	    });
	  }

  }

})();
/**
 * Dev Factory
 *
 * @description
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('DevService', DevService);

  DevService.$inject = ['$rootScope', '$q', '_', 'devUtils', 'smartStoreUtils'];

  function DevService($rootScope, $q, _, devUtils, smartStoreUtils) {

	  return {
	    allTables: getTables,

	    allRecords: function(tableName,refreshFlag) {
	    	var tableRecs = [];
	      switch (refreshFlag) {
	        case true :
	          tableRecs = [];
	          tableRecs = getRecords(tableName, true);
	          break;
	        default :
	          if ((typeof tableRecs == 'undefined') || (tableRecs.length < 1)) {
	            tableRecs = [];
	            tableRecs = getRecords(tableName, true);
	          } else {
	            tableRecs = [];
	            tableRecs = getRecords(tableName, false);
	          }
	      }
	      return tableRecs;
	    },
	    getRecordForSoupEntryId: getRecordForSoupEntryId,

	    insertMobileLog: insertMobileLog
	  };

	  function getTables() {
	    var deferred = $q.defer();
	    var tables = [];

	    // Add other system tables
	    tables.push({'Name' : 'syncLib_system_data'});
	    tables.push({'Name' : 'appSoup'});
	    tables.push({'Name' : 'cacheSoup'});
	    tables.push({'Name' : 'recsToSync'});
	    smartStoreUtils.listMobileTables(
	      smartStoreUtils.ALPHA,
	      // Success callback
	      function(tableNames) {
	          $j.each(tableNames, function(i,tableName) {
	            tables.push({'Name' : tableName});
	            // TODO :: make this a promise ?
	            // TODO :: Improve this, add a meta table?
	            smartStoreUtils.getTableDefnColumnValue(
	              tableName,
	              'Snapshot Data Required',
	              function(snapshotValue) {
	                // Create the snapshot table too, if required
	                if (snapshotValue == 'Yes') {
	                  tables.push({'Name' : 'SnapShot_' + tableName});
	                } else {
	                }
	                $rootScope.$apply(function(){
	                  tables = tables;
	                });
	                return tables;
	              }, // end success callback
	              function(resObject){
	                console.error('MC : Error from listMobileTables -> ' + angular.toJson(resObject));
	                deferred.reject('error');
	              });
	          });

	          $rootScope.$apply(function(){
	            deferred.resolve(tables);
	            });
	          return deferred.promise;
	        },
	      function(e) {
	        console.log('MC: error from listMobileTables -> ' + angular.toJson(e));
	        deferred.reject(e);
	      });
	    return deferred.promise;
	  }


	 /**
	  * Works out if Val is likely an ID based on it's format
	  * @param {string} Val
	  * @return {boolean}
	  */
	  function isId(Val) {
	    var patt = /^[a-zA-Z0-9]{18}$/;
	    return patt.test(Val);
	  }


	  function getRecords(tableName, refreshFlag) {
	    var deferred = $q.defer();
	    var myTableRecs = [];
	    devUtils.readRecords(tableName, []).then(function(resObject) {
	    	console.log(tableName, resObject);
	      $j.each(resObject.records, function(i,record) {
	        var tableRec = [];
	        for (var fieldDef in record) {
	          var field = {
	            'Name' : fieldDef,
	            'Value' : record[fieldDef],
	            'ID_flag' : isId(record[fieldDef])};
	          tableRec.push(field);
	        } // end loop through the object fields
	        myTableRecs.push(tableRec);
	      });
	      deferred.resolve(myTableRecs);
	    }).catch(function(resObject){
	      console.error('MC : Error from devUtils.readRecords -> ' + angular.toJson(resObject));
	      deferred.reject('error');
	    });
	    return deferred.promise;
	  }

	  function getRecordForSoupEntryId(tableName, soupRecordId) {
	    return new Promise(function(resolve, reject) {
	      devUtils.readRecords(tableName, []).then(function(resObject) {
	        var record = _.findWhere(resObject.records, {'_soupEntryId': soupRecordId});
	        resolve(record);
	      }).catch(function(resObject){
	        reject(resObject);
	      });
	    });
	  }

	  function insertRecordUsingSmartStoreUtils(tableName, rec) {
	    return new Promise(function(resolve, reject) {
	      smartStoreUtils.insertRecords(tableName, [rec],
	        function(res) {
	          resolve(res);
	        },
	        function(err) {
	          reject(err);
	        }
	      );
	    });
	  }

	  function insertMobileLog(recs) {
	    return new Promise(function(resolve, reject) {
	      var remainingData = JSON.stringify(recs);
	      var dataToInsert = [];
	      // Push 'chunks' of data to array for processing further down
	      while (remainingData.length > 0) {
	        dataToInsert.push(remainingData.substring(0,32767));
	        remainingData = remainingData.substring(32767);
	      }
	      // Iterate over the data 'chunks', inserting each 'chunk' into the Mobile_Log_mc table
	      var sequence = Promise.resolve();
	      dataToInsert.forEach(function(data){
	        sequence = sequence.then(function() {
	          var mobileLog = {};
	          mobileLog.Name = "TMP-" + new Date().valueOf();
	          mobileLog.mobilecaddy1__Error_Text__c = data;
	          mobileLog.SystemModstamp = new Date().getTime();
	          return insertRecordUsingSmartStoreUtils('Mobile_Log__mc', mobileLog);
	        }).then(function(resObject) {
	          resolve(resObject);
	        }).catch(function(res){
	          reject(res);
	        });
	      });
	    });
	  }

  }

})();
/**
 * LocalNotificationService
 *
 * @description Enables device local notifications using Cordova Local-Notification Plugin
 *              (https://github.com/katzer/cordova-plugin-local-notifications)
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('LocalNotificationService', LocalNotificationService);

  LocalNotificationService.$inject = ['$cordovaLocalNotification', '$cordovaNetwork', 'devUtils', 'logger'];

  function LocalNotificationService($cordovaLocalNotification, $cordovaNetwork, devUtils, logger) {

    var lnDefaultTimeout = 600,  // 5 minutes
        lnDefaultId      = 100100,
        lnDefaultMsg     = 'Unsynced records';

    return {
      cancelNotification: cancelNotification,

      setLocalNotification: setLocalNotification,

      handleLocalNotification: handleLocalNotification,

      handleLocalNotificationClick: handleLocalNotificationClick,

      getLocalNotificationState: getLocalNotificationState,

      setLocalNotificationState: setLocalNotificationState
    };


    /**
     * @function cancelNotification
     * @description Attempts to cancel the localNotifcation with a certain id
     * @param  {string | number | undefined} id
     */
    function cancelNotification(id) {
      return new Promise(function(resolve, reject) {
        id =  (id) ? id : lnDefaultId;
        if (getLocalNotificationState() == "disabled") {
          logger.log('cancelNotification NotificationState disabled');
          resolve();
        } else {
          logger.log('cancelNotification', id);
          if (cordova && cordova.plugins && cordova.plugins.notification) {
            $cordovaLocalNotification.cancel(id).then(function (result) {
              logger.log('localNotification cancelled if it existed', id, result);
              resolve(result);
            });
          }
        }
    });
    }

    /**
     * @function setLocalNotification
     * @description Sets a localNotification for id
     * @param {string | number | undefined} id
     * @param {integer | undefined} secsTillNotify - number of seconds till notification
     * @param {string | undefined} msg
     */
    function setLocalNotification(id, secsTillNotify, msg) {
      return new Promise(function(resolve, reject) {
        if (getLocalNotificationState() == "disabled") {
          logger.log('setLocalNotification NotificationState disabled');
          resolve('ok');
        } else {
          // Set to defaults if needed
          id =  (id) ? id : lnDefaultId;
          secsTillNotify =  (secsTillNotify) ? secsTillNotify : lnDefaultTimeout;
          msg =  (msg) ? msg : lnDefaultMsg;

          logger.log('setLocalNotification id', id, secsTillNotify, msg );
          devUtils.dirtyTables().then(function(tables){
            if (tables && tables.length === 0 && id == lnDefaultId) {
              // do nothing if no dirtyTables and using defeault ID (the used by SyncService)
              logger.log('setLocalNotification no dirty tables', id);
              resolve();
            } else {
              if (cordova && cordova.plugins && cordova.plugins.notification) {
                var alarmTime = new Date();
                alarmTime.setSeconds(alarmTime.getSeconds() + secsTillNotify);
                logger.log('setLocalNotification alarmTime', alarmTime);
                $cordovaLocalNotification.isScheduled(id).then(function(isScheduled) {
                  logger.log('setLocalNotification isScheduled', isScheduled);
                  if (isScheduled) {
                    // update existing notification
                    $cordovaLocalNotification.update({
                      id: id,
                      at: alarmTime,
                    }).then(function (result) {
                      logger.log("localNotification updated", id, result);
                      resolve(result);
                    });
                  } else {
                    // set a new notification
                    var args = {
                      id: id,
                      at: alarmTime,
                      text: msg,
                      sound: null};
                    if (device.platform == "Android") {
                       args.ongoing = true;
                       args.smallIcon = "res://icon";
                    }
                    $cordovaLocalNotification.schedule(args).then(function (result) {
                      logger.log("localNotification has been set", id, result);
                      resolve(result);
                    });
                  }
                }).catch(function(err){
                  logger.error("setLocalNotification", JSON.stringify(err));
                  reject(err);
                });
              } else {
                logger.log('setLocalNotification no cordova plugin');
                resolve();
              }
            }
          });
        }
      });
    }

    function handleLocalNotification(id, state) {
      return new Promise(function(resolve, reject) {
        if (getLocalNotificationState() == "disabled") {
          logger.log('handleLocalNotification NotificationState disabled');
          resolve();
        } else {
          logger.log('handleLocalNotification', id, state);
          if (cordova && cordova.plugins && cordova.plugins.notification) {
            if (id == lnDefaultId) { // lnDefaultId is used for our syncProcess
              $cordovaLocalNotification.cancel(id, function(){});
              devUtils.dirtyTables().then(function(tables){
                //console.log('mc tables', tables);
                if (tables && tables.length !== 0) {
                  var isOnline = $cordovaNetwork.isOnline();
                  logger.log('handleLocalNotification isOnline', isOnline);
                  if (isOnline) {
                    // take this opportunity to set our network status in case it's wrong
                    localStorage.setItem('networkStatus', 'online');
                    resolve();
                    SyncService.syncAllTables();
                  } else {
                    // take this opportunity to set our network status in case it's wrong
                    localStorage.setItem('networkStatus', 'offline');
                    setLocalNotification(id).then(function(result){
                      resolve(result);
                    }).catch(function(e){
                      reject(e);
                    });
                  }
                } else {
                  resolve();
                }
              });
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        }
      });
    }


    function handleLocalNotificationClick(id, state) {
      return new Promise(function(resolve, reject) {
        if (getLocalNotificationState() == "disabled") {
          logger.log('handleLocalNotification NotificationState disabled');
          resolve();
        } else {
          logger.log('handleLocalNotification', id, state);
          if (cordova && cordova.plugins && cordova.plugins.notification) {
            if (id == lnDefaultId) { // lnDefaultId is used for our syncProcess
              $cordovaLocalNotification.cancel(id, function(){});
              devUtils.dirtyTables().then(function(tables){
                //console.log('mc tables', tables);
                if (tables && tables.length !== 0) {
                  var isOnline = $cordovaNetwork.isOnline();
                  logger.log('handleLocalNotification isOnline', isOnline);
                  if (isOnline) {
                    // take this opportunity to set our network status in case it's wrong
                    localStorage.setItem('networkStatus', 'online');
                    resolve();
                  } else {
                    // take this opportunity to set our network status in case it's wrong
                    localStorage.setItem('networkStatus', 'offline');
                    setLocalNotification(id).then(function(result){
                      resolve(result);
                    }).catch(function(e){
                      reject(e);
                    });
                  }
                } else {
                  resolve();
                }
              });
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        }
      });
    }

    function getLocalNotificationState() {
      var localNotificationState = localStorage.getItem("localNotificationState");
      if (localNotificationState === null) {
        localNotificationState = "enabled";
        localStorage.setItem("localNotificationState", localNotificationState);
      }
      return localNotificationState;
    }

    function setLocalNotificationState(status) {
      localStorage.setItem("localNotificationState", status);
    }

  }

})();
/**
 * Network Factory
 *
 * @description Handles network events (online/offline) and kicks off tasks if needed
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('NetworkService', NetworkService);

  NetworkService.$inject = ['$rootScope', 'SyncService', 'logger'];

  function NetworkService($rootScope, SyncService, logger) {
  	return {
	    networkEvent: networkEvent,

      getNetworkStatus: getNetworkStatus,

      setNetworkStatus: setNetworkStatus
	  };

	  function networkEvent(status){
      var pastStatus = localStorage.getItem('networkStatus');
      if (status == "online" && pastStatus != status) {
        // You could put some actions in here that you want to take place when
        // your app regains connectivity. For example see the Mobile Seed Apps
        // If you don't need this then you can ignore this. e.g.
        // SyncService.syncTables(['Table_x__ap', 'Table_y__ap'], true);
        //
        // TODO (TH) Are we doing this, I've not looked at the flows at the time of writing?
      }
      if (pastStatus != status) {
        $rootScope.$broadcast('networkState', {state : status});
      }
      localStorage.setItem('networkStatus', status);
      logger.log("NetworkService " + status);
      return true;
    }

   	function getNetworkStatus() {
      return localStorage.getItem('networkStatus');
    }

    function setNetworkStatus(status) {
	      localStorage.setItem('networkStatus', status);
     }

  }

})();
/**
 * Outbox Factory
 *
 * @description Gets data for the Outbox menu option.
 *
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('OutboxService', OutboxService);

  OutboxService.$inject = ['devUtils', 'logger'];

  function OutboxService(devUtils, logger) {

    return {
      getDirtyRecordsCount: getDirtyRecordsCount,
      getDirtyRecords: getDirtyRecords
    };

    function getDirtyRecordsCount() {
      return new Promise(function(resolve, reject) {
        devUtils.readRecords('recsToSync', []).then(function(resObject) {
          var records = _.chain(resObject.records)
            .filter(function(el){
                return (el.Mobile_Table_Name != "Connection_Session__mc" && el.Mobile_Table_Name != "Mobile_Log__mc") ? true : false;
              })
            .value();
          resolve(records.length);
        }).catch(function(resObject){
          // console.error('getDirtyRecordsCount ', angular.toJson(resObject));
          logger.error('getDirtyRecordsCount ' + angular.toJson(resObject));
          reject(resObject);
        });
      });
    }

    function getDirtyRecords() {
      return new Promise(function(resolve, reject) {
        devUtils.readRecords('recsToSync', []).then(function(resObject) {
          var records = _.chain(resObject.records)
            .filter(function(el){
                return (el.Mobile_Table_Name != "Connection_Session__mc" && el.Mobile_Table_Name != "Mobile_Log__mc") ? true : false;
              })
            .value();
          resolve(records);
        }).catch(function(resObject){
          // console.error('getDirtyRecords ', angular.toJson(resObject));
          logger.error('getDirtyRecords ' + angular.toJson(resObject));
          reject(resObject);
        });
      });
    }

  }

})();
/**
 * Sync Factory
 *
 * @description Handles Sync calls to the MobileCaddy API amd gets/sets sync state
 *
 */
(function() {
	'use strict';

	angular
		.module('starter.services')
		.factory('SyncService', SyncService);

	SyncService.$inject = ['$rootScope', 'devUtils', 'LocalNotificationService','UserService'];

	function SyncService($rootScope, devUtils, LocalNotificationService, UserService) {

		// Just a guess at the record age that is acceptable to be on the device
		// Set as needed for your use case
		var fourHours = 1000 * 60 * 60 * 4; // 4 hours in milliseconds

		// This is where you put your list of tables that you want from the platform
		var appTables = [
			{'Name': 'Account_ap__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : fourHours},
			{'Name': 'Attendance_new__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : fourHours},
			{'Name': 'Household__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : fourHours},
			{'Name': 'Contact__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : fourHours},
			{'Name': 'Enrollment__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : fourHours}
		];

		var appTablesSyncNow = [
			{'Name': 'Account_ap__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Attendance_new__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Household__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Contact__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Enrollment__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0}
		];

		var syncVendorTables=[
			{'Name': 'myDummyTable1__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Attendance_new__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Household__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Contact__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Enrollment__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0},
			{'Name': 'Account_ap__ap', 'syncWithoutLocalUpdates': true, 'maxTableAge' : 0}
		];


		return {
			appTables: appTables,

			getSyncLock: getSyncLock,

			setSyncLock: setSyncLock,

			getSyncState: getSyncState,

			setSyncState: setSyncState,

			syncAllTables: syncAllTables,

			syncAllTablesNow: syncAllTablesNow,

			syncTables: syncTables,

			initialSync: initialSync,

			coldStartSync: coldStartSync,

			pushTables: pushTables

		};


		/**
		 * @function getSyncLock
		 * @description gets syncLockName value from localStorage, or "false" if not set
		 * @param {string | undefined} syncLockName
		 * @return {string}
		 */
		function getSyncLock(syncLockName) {
			if (!syncLockName) syncLockName = 'syncLock';
			var syncLock = localStorage.getItem(syncLockName);
			if (syncLock === null) {
				syncLock = "false";
				localStorage.setItem(syncLockName, syncLock);
			}
			return syncLock;
		}


		/**
		 * @function setSyncLock
		 * @description Sets syncLockName value in localStorage item
		 * @param {string} syncLockName
		 * @param {string} status
		 */
		function setSyncLock(syncLockName, status) {
			if (!status) {
				status = syncLockName;
				syncLockName = 'syncLock';
			}
			localStorage.setItem(syncLockName, status);
		}


		/**
		 * @function getSyncState
		 * @description gets syncState from localStorage, or "complete" if not set
		 * @return {string}
		 */
		function getSyncState() {
			var syncState = localStorage.getItem("syncState");
			if (syncState === null) {
				syncState = "Complete";
				localStorage.setItem("syncState", syncState);
			}
			return syncState;
		}


		/**
		 * @function setSyncState
		 * @description Sets syncState localStorage item
		 * @param {string} status
		 */
		function setSyncState(status) {
			localStorage.setItem("syncState", status);
		}


		/**
		 * @function initialSync
		 * @description Makes initialSync call for all (biz logic) tables
		 * @return {promise}
		 */
		function initialSync() {
			// return syn/cAllTables();
			return new Promise(function(resolve, reject) {
				setSyncState("syncing");
				var initialTabArr = [];
				//alert("here");
				//var initialTabArr = syncVendorTables;
				//alert("initialTabArr........");
				appTables.forEach(function(el){
					if (el.syncWithoutLocalUpdates) initialTabArr.push(el.Name);
				});
				//console.log('initialSync', initialTabArr);
				devUtils.initialSync(['Account_ap__ap','Attendance_new__ap','Household__ap','Contact__ap','Enrollment__ap']).then(function(res){
					alert("Inside");
					UserService.setProcessDone("initialDataLoaded");
					alert("UserService......"+UserService.hasDoneProcess("initialDataLoaded"));
					$rootScope.$broadcast('syncTables', {result : "InitialLoadComplete"});
					setSyncState("Complete");
					resolve();
				}).catch(function(resObject){
					// TODO LOGGER in MOCK FOR UNIT TEST
					console.error('initialSync ',resObject);
					reject(resObject);
				});
			});
		}


		/**
		 * @function coldStartSync description
		 * @description Calls iterative sync on all tables (Mobile_Log__mc first)
		 * @return {promise}
		 */
		function coldStartSync() {
			return new Promise(function(resolve, reject) {
				//console.log("coldStartSync");
				var myAppTables = [{'Name': 'Mobile_Log__mc', 'syncWithoutLocalUpdates': false, 'maxTableAge' : fourHours}].concat(appTables);
				syncTables(myAppTables).then(function(resObject){
					//console.log('coldStartSync', resObject);
					resolve(resObject);
				});
				// IT ALWAYS RESOLVES
				// }) .catch(function(resObject){
				//     logger.warn('syncAllTables ',resObject);
				//     reject(resObject);
				// });
			});
		}


		/**
		 * @function syncAllTables description
		 * @description Calls iterative sync on all tables (Mobile_Log__mc first)
		 * @return {promise}
		 */
		function syncAllTables() {
			return new Promise(function(resolve, reject) {
				var myAppTables = appTables;
				myAppTables.push({'Name': 'Mobile_Log__mc', 'syncWithoutLocalUpdates': false, 'maxTableAge' : fourHours});
				syncTables(myAppTables).then(function(resObject){
					//console.log('syncAllTables', resObject);
					resolve(resObject);
				});
				// IT ALWAYS RESOLVES
				// }) .catch(function(resObject){
				//     logger.warn('syncAllTables ',resObject);
				//     reject(resObject);
				// });
			});
		}


		/**
		 * @function syncAllTablesNow
		 * @description Calls iterative sync on all tables now
		 * @return {promise}
		 */
		function syncAllTablesNow() {
			return new Promise(function(resolve, reject) {
				syncTables(appTablesSyncNow).then(function(resObject){
					//console.log('syncAllTablesNow', resObject);
					resolve(resObject);
				});
				// IT ALWAYS RESOLVES
				// }) .catch(function(resObject){
				//     logger.warn('syncAllTablesNow ',resObject);
				//     reject(resObject);
				// });
			});
		}


		/**
		 * @function syncTables
		 * @description syncs tables to/from SFDC
		 * @param  {object[]} - array of {Name, syncWithoutLocalUpdates, maxTableAge}
		 */
		function syncTables(tablesToSync){
			return new Promise(function(resolve, reject) {
				// TODO - put some local notification stuff in here.
				doSyncTables(tablesToSync).then(function(res){
					// console.log("syncTables", res);
					$rootScope.$broadcast('syncTables', {result : "Complete"});
					setSyncState("Complete");
					// NOTE - Commented out for the time being - see TOPS-96
					if (!res || res.status == 100999) {
						LocalNotificationService.setLocalNotification();
					} else {
						LocalNotificationService.cancelNotification();
					}
					resolve(res);
				});
				// IT ALWAYS RESOLVES
				// }).catch(function(e){
				// 	logger.warn('syncTables', e);
				// 	$rootScope.$broadcast('syncTables', {result : "Complete"});
				//    setSyncState("Complete");
				//    reject(e);
				// });
			});
		}

		/**
		 * @description This is used to push a list of tables only if there are records waiting to be pushed
		 * @param string[] Array of table names to be synced in order
		 **/
		function pushTables(tablesToPush) {
			// Loop through the tables and build up an array of {Name, syncWithoutLocalUpdates, maxTableAge}
			var tablesToSync = [];
			tablesToPush.forEach(function(el){
				tablesToSync.push({'Name':el, 'syncWithoutLocalUpdates':false, 'maxTableAge':0});
			});
			// console.log('tops tablesToSync ',tablesToSync);
			return new Promise(function(resolve, reject) {
				// TODO - put some local notification stuff in here.
				doSyncTables(tablesToSync).then(function(res){
					// console.log("syncTables", res);
					$rootScope.$broadcast('syncTables', {result : "Complete"});
					setSyncState("Complete");
					// NOTE - Commented out for the time being - see TOPS-96
					if (!res || res.status == 100999) {
					 LocalNotificationService.setLocalNotification();
					} else {
					 LocalNotificationService.cancelNotification();
					}
					resolve(res);
				});
				// IT ALWAYS RESOLVES
				// }).catch(function(e){
				//  logger.warn('syncTables', e);
				//  $rootScope.$broadcast('syncTables', {result : "Complete"});
				//    setSyncState("Complete");
				//    reject(e);
				// });
			});
		}

		function doSyncTables(tablesToSync){
			// Check that we not syncLocked or have a sync in progress
			var syncLock = getSyncLock();
			var syncState = getSyncState();
			if (syncLock == "true" || syncState == "syncing") {
				return Promise.resolve({status:100999});
			} else {
				setSyncState("syncing");
				$rootScope.$broadcast('syncTables', {result : "StartSync"});

				var stopSyncing = false;
				var sequence = Promise.resolve();

				return tablesToSync.reduce(function(sequence, table){
					if (typeof(table.maxTableAge) == "undefined") {
						table.maxTableAge = (1000 * 60 * 1); // 3 minutes
					}
					return sequence.then(function(res) {
						//console.log("doSyncTables inSequence", table, res, stopSyncing);
						//$rootScope.$broadcast('syncTables', {result : "TableComplete " + table.Name});
						if (!stopSyncing) {
							return devUtils.syncMobileTable(table.Name, table.syncWithoutLocalUpdates, table.maxTableAge);
						} else {
							//console.log("skipping sync");
							return {status:100999};
						}
					}).then(function(resObject){
						switch (resObject.status) {
							case devUtils.SYNC_NOK :
							case devUtils.SYNC_ALREADY_IN_PROGRESS :
								if (typeof(resObject.mc_add_status) == "undefined" || resObject.mc_add_status != "no-sync-no-updates") {
									stopSyncing = true;
									setSyncState("Complete");
								}
						}
						$rootScope.$broadcast('syncTables', {table: table.Name, result : resObject.status});
						return resObject;
					}).catch(function(e){
						//console.error('doSyncTables', e);
						if (e.status != devUtils.SYNC_UNKONWN_TABLE) {
							stopSyncing = true;
							$rootScope.$broadcast('syncTables', {table: table.Name, result : e.status});
							setSyncState("Complete");
						}
						return e;
					});
				}, Promise.resolve());

			}
		}


	}

})();

/**
 * User Factory
 *
 * @description User services: sets/gets current user id; sets/gets 'processes' local storage
 * sync status.
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('UserService', UserService);

  UserService.$inject = ['devUtils', 'logger'];

  function UserService(devUtils, logger) {

    return {
      getCurrentUserId: getCurrentUserId,
      setCurrentUserId: setCurrentUserId,
      hasDoneProcess: hasDoneProcess,
      setProcessDone: setProcessDone,
    };

    function getCurrentUserId() {
      return new Promise(function(resolve, reject) {
        var currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId !== null) {
          resolve(currentUserId);
        } else {
          devUtils.getCurrentUserId().then(function(userId){
            localStorage.setItem('currentUserId', userId);
            resolve(userId);
          }).catch(function(resObject){
            logger.log('getCurrentUserId',resObject);
            reject(resObject);
          });
        }
      });
    }

    function setCurrentUserId(userId) {
      return new Promise(function(resolve, reject) {
        localStorage.setItem('currentUserId', userId);
        resolve(true);
      });
    }

    function hasDoneProcess(processName) {
      return new Promise(function(resolve, reject) {
        var processes = JSON.parse(localStorage.getItem('processes'));
        if (processes === null) {
          resolve(false);
        } else {
          if (processes[processName] == "true") {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    }

    function setProcessDone(processName) {
      return new Promise(function(resolve, reject) {
        logger.log('setProcessDone',processName);
        var processes = JSON.parse(localStorage.getItem('processes'));
        if (processes === null) {
          processes = {};
        }
        processes[processName] = "true";
        localStorage.setItem('processes', JSON.stringify(processes));
        resolve(true);
      });
    }

  }

})();

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