app.controller('StudioAppInitializeCtrl',function($scope,
                                                  $rootScope,
                                                  $http,
                                                  $state,
                                                  $ionicPopup,
                                                  httpService, 
                                            	  $ionicPlatform,
                                                  $ionicNavBarDelegate,
                                            	  $timeout){
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.isExist = false;
    $scope.titleFailedInitApp = "Open App Failed";
    $scope.txtFailedInitApp = "Failed to open app. Please check your internet connection and try again.";
    $ionicNavBarDelegate.showBar(false);
//    $ionicNavBarDelegate.showBackButton(false);

    $ionicPlatform.ready(function () {
        $scope.result = '';

        $scope.st_username_login = st_username_login;
        $scope.st_email = st_email;
        $scope.st_app_id = st_app_id;

        if (st_user_id === '') {
            $scope.isStudioLogin = false;
        } else {
            $scope.isStudioLogin = true;
        }

        var obj = serializeData({email: st_email, app_id: st_app_id});
        var url = studio_app_url;
        console.log(obj);
        httpService.post($scope,$http,url,obj);
    });

    $scope.$on('httpService:postRequestSuccess', function () {
        console.log("STUDIO: POST APP INITIALIZE SUCCESS");

        var message = $scope.data.message.message;
        var splash = $scope.data.message.splash == 'undefined' || $scope.data.message.splash === '' ? 
            ('http://placehold.it/640x640?text=' + 'No+Splashscreen') : $scope.data.message.splash;
        var appParams = $scope.data.message.app_parameters;
        var themes = $scope.data.message.themes.css;
        
        company_id = appParams.company_id;
        home_id = appParams.home_id;
        home_template = appParams.home_template;
        username = appParams.username;
        password = appParams.password;

        var appItem = {
            splash: splash
        };

        $scope.message = message;
        $scope.app = appItem;

        $scope.isLoading = false;
        $scope.isTimeout = false;
        $scope.isExist = true;
        $scope.themes = themes;
        
        // re-initialize everything needed on app-vars.js
        menu_url = base_url + 'company/' + company_id;
        options_url = base_url+ 'company/'+company_id+'/options';
        send_email_url = base_url + 'companies/' + company_id + '/send-email';
        company_options_url = base_url + "companies/" + company_id + "/options";
        playstore_link = 'https://play.google.com/store/apps/details?id=' + st_app_package;
        
        $timeout($scope.startApp,3000);
    });
    
    $scope.$on('httpService:postRequestError', function () {
        console.log("STUDIO: POST APP INITIALIZE ERROR");
        console.log($scope.data);     
        $scope.isLoading = $scope.isExist = false; 
        $scope.showFailedInitAlert();
    });

    $scope.startApp = function(){
    	var stSplash = angular.element(document).find('studioSplash');
        // do splash fade animation ( with HTML5/CSS3 )
        
        // change theme color for app.
        var themes = angular.element(document).find('style');
        themes.html($scope.themes);

        var url = menu_url;
        httpService.get($scope, $http, url, 'menu');
        
        window.location.href = '#/app/' + home_template + '/' + home_id;
    
    };

    $scope.$on('httpService:getMenuSuccess',function(){
        $rootScope.data = $scope.data;
        $scope.$emit('httpService:refreshMenuSuccess');
    });

    // if get menu data error, request token again
    $scope.$on('httpService:getMenuError', function () {
        if ($scope.status === 0 || $scope.status == '' || $scope.status == '-1') {
            console.log('NO INTERNET CONNECTION');
            if (isPhoneGap()) {
                loadTermJSONFromDB(-1, $scope);
            }
        }
        else {
            var url = menu_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.get($scope, $http, url, 'menu');
        }
        // httpService.post_token($scope, $http, url, obj, 'menu');
    });
    
    $scope.showFailedInitAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.titleFailedInitApp,
            css: 'cp-button',
            okType:'cp-button', 
            okText:'Retry',
            template: '<div style="width:100%;text-align:center">'+$scope.txtFailedInitApp+'</div>'
        });
        alertPopup.then(function(res) {
            $scope.isLoading = true;
            $scope.isTimeout = false;
            var obj = serializeData({email: st_email, app_id: st_app_id});
            var url = studio_app_url;
            httpService.post($scope,$http,url,obj);
        });
    };
});