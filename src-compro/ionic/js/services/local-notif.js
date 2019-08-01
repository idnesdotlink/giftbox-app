app.factory ('notifService',function(){   
    
    function showNotification($scope, $rootScope, $ionicPlatform, $cordovaLocalNotification, $cordovaVibration,$ionicPopup, data){        
        var now = new Date().getTime() + 1000;  // add 1 seconds to make sure.
        console.log("Local Notification: Schedule Notif");
        $cordovaLocalNotification.schedule({
            id: 1,
            title: data.title,
            text: data.message,
            at: now,
            sound: "TYPE_ALARM",                  // play notif sound
            //smallIcon: "file://res/drawable-mdpi/icon",     // show icon
            icon: "file://res/mipmap-mdpi/icon",          // show icon
            data: data
        }).then(function (result) {
          // vibrate device
          //$cordovaVibration.vibrate(500);
            console.log("Local Notification: Notification shown, do whatever you want later.");
            
            /*$scope.showChangePageConfirmation = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Notification',
                    css: 'cp-button',
                    template: "<div style='display:flex;justify-content:center;align-items:center;text-align: center'>New Notification Arrived. Do you wish to see the new update?</div>",
                    okType:'cp-button'
                });

                //confirmation dialog
                confirmPopup.then(function (res) {
                    if (res) {
                        window.location.href= "#/app/" + data.additionalData.target;
                    }
                });
            };

            $scope.showChangePageConfirmation();*/


        });
    }    
    
    return {showNotification: showNotification};
});
/*
module.controller('MyCtrl',
  ['$scope', '$rootScope', '$ionicPlatform', '$cordovaLocalNotification',
   function($scope, $rootScope, $ionicPlatform, $cordovaLocalNotification) {
  
  $ionicPlatform.ready(function () {
    
    // ========== Scheduling
    
    $scope.scheduleSingleNotification = function () {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Title here',
        text: 'Text here',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });
    };
    
    $scope.scheduleMultipleNotifications = function () {
      $cordovaLocalNotification.schedule([
        {
          id: 1,
          title: 'Title 1 here',
          text: 'Text 1 here',
          data: {
            customProperty: 'custom 1 value'
          }
        },
        {
          id: 2,
          title: 'Title 2 here',
          text: 'Text 2 here',
          data: {
            customProperty: 'custom 2 value'
          }
        },
        {
          id: 3,
          title: 'Title 3 here',
          text: 'Text 3 here',
          data: {
            customProperty: 'custom 3 value'
          }
        }
      ]).then(function (result) {
        // ...
      });
    };
    
    $scope.scheduleDelayedNotification = function () {
      var now = new Date().getTime();
      var _10SecondsFromNow = new Date(now + 10 * 1000);
      
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Title here',
        text: 'Text here',
        at: _10SecondsFromNow
      }).then(function (result) {
        // ...
      });
    };
    
    $scope.scheduleEveryMinuteNotification = function () {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Title here',
        text: 'Text here',
        every: 'minute'
      }).then(function (result) {
        // ...
      });
    };
    
    // =========/ Scheduling
    
    // ========== Update
    
    $scope.updateSingleNotification = function () {
      $cordovaLocalNotification.update({
        id: 1,
        title: 'Title - UPDATED',
        text: 'Text - UPDATED'
      }).then(function (result) {
        // ...
      });
    };
    
    $scope.updateMultipleNotifications = function () {
      $cordovaLocalNotification.update([
        {
          id: 1,
          title: 'Title 1 - UPDATED',
          text: 'Text 1 - UPDATED'
        },
        {
          id: 2,
          title: 'Title 2 - UPDATED',
          text: 'Text 2 - UPDATED'
        },
        {
          id: 3,
          title: 'Title 3 - UPDATED',
          text: 'Text 3 - UPDATED'
        }
      ]).then(function (result) {
        // ...
      });
    };
    
    // =========/ Update
    
    // ========== Cancelation
    
    $scope.cancelSingleNotification = function () {
      $cordovaLocalNotification.cancel(1).then(function (result) {
        // ...
      });
    };
    
    $scope.cancelMultipleNotifications = function () {
      $cordovaLocalNotification.cancel([1, 2]).then(function (result) {
        // ...
      });
    };
    
    $scope.cancelAllNotifications = function () {
      $cordovaLocalNotification.cancelAll().then(function (result) {
        // ...
      });
    };
    
    // =========/ Cancelation
    
    
    
    $rootScope.$on('$cordovaLocalNotification:trigger',
    function (event, notification, state) {
      // ...
    });
    
    $rootScope.$on('$cordovaLocalNotification:update',
    function (event, notification, state) {
      // ...
    });
    
    $rootScope.$on('$cordovaLocalNotification:clear',
    function (event, notification, state) {
      // ...
    });
    
    $rootScope.$on('$cordovaLocalNotification:clearall',
    function (event, state) {
      // ...
    });
    
    $rootScope.$on('$cordovaLocalNotification:cancel',
    function (event, notification, state) {
      // ...
    });
    
    $rootScope.$on('$cordovaLocalNotification:cancelall',
    function (event, state) {
      // ...
    });
    
    $rootScope.$on('$cordovaLocalNotification:click',
    function (event, notification, state) {
      // ...
    });
    
    // =========/ Events
    
  });
  
}]);
*/