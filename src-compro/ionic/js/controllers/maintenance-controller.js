app.controller("MaintenanceCtrl", function ($scope,
                                              $rootScope,
                                              $http,
                                              httpService,
                                              $cordovaDevice,
                                              $ionicLoading,
                                              $ionicPopup,
                                              $ionicPlatform,
                                              $ionicHistory) {

    $scope.isLoading = false;
    $scope.isTimeout = false;
    $scope.home_template = home_template;
    $scope.home_id = home_id;
    $scope.package_name = package_name;
    $scope.admin_email = '';

    $ionicPlatform.ready(function () {
        var url = menu_url;
        httpService.get($scope, $http, url, 'menu');
    });

    $scope.$on('httpService:getMenuSuccess',function() {
    	$scope.admin_email = $scope.data.admin.email;
    });

    $scope.$on('httpService:getMenuError', function () {
        $scope.admin_email = false;
    });

    // override back button

    $scope.clearHistory = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    };

    $scope.$on('$destroy', function () {
        doregisterHardBack();

    });

    var doCustomBack = function () {
        $scope.clearHistory();
        $scope.showExitConfirmation = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: $scope.alert_title_exit_app,
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_content_exit_app + "</div>",
                okType:'cp-button',
                okText:$scope.alert_button_ok
            });

            //confirmation dialog
            confirmPopup.then(function (res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            });
        };

        $scope.showExitConfirmation();
    };

    var doregisterHardBack = $ionicPlatform.registerBackButtonAction(doCustomBack, 101);

    $scope.refreshMenu = function(){
        console.log("Login Refresh Menu Success");
        $scope.$emit('httpService:refreshMenu');
    }

});
