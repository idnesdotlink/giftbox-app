app.controller('StudioLoginCtrl',function($scope,
                                          $state,
                                          $rootScope,
                                          $http,
                                          httpService,
                                          $cordovaDevice,
                                          $ionicLoading,
                                          $ionicPopup,
                                          $ionicPlatform,
                                          $ionicHistory){

    $scope.isLoading = true;
    $scope.isTimeout = false;

    $scope.button_text_login = "Login";
    $scope.welcome_title = "Welcome to Compro Studio!";
    $scope.welcome_subtitle = "Please log in to continue";
    $scope.login_alert_title = "Login";
    $scope.login_failed_check_connection = "Login Failed. Please Check Your Internet Connection and Try Again";
    $scope.login_failed_wrong_email_password = "Wrong email or password!";
    $scope.login_requirement = "Email and Password must be filled!";

    console.log("STUDIO: INIT LOGIN CTRL ***");

    var translate_login_status = function(status_code)
    {
        if(status_code=="expired")
            return $scope.login_failed_expired;
        else if(status_code=="unapproved")
            return $scope.login_failed_unapproved;
        else if(status_code=="bound_device")
            return $scope.login_failed_bound_device;
        else if(status_code=="wrong_email_password")
            return $scope.login_failed_wrong_email_password;
        else if(status_code=="exception")
            return $scope.login_failed_wrong_email_password;
        else if(status_code=="success")
            return $scope.alert_login_success;
    }

    $ionicPlatform.ready(function () {
        $scope.result = '';

        // initialize user login data, set '' for deployment
        $scope.input = {
            email: '',//'guest@compro.id',
            password: ''//'guestcompro'
        };

        if (st_user_id == ''){
            if (isPhoneGap()){
                if (st_db === '') {
                    console.log(st_sqlitedb);
                    st_db = window.sqlitePlugin.openDatabase({name: st_sqlitedb, location: 'default'});
                    console.log("STUDIO HOME db sqlite");
                }
                st_db.transaction(function(tx){
                    tx.executeSql('DROP TABLE IF EXISTS st_users');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + st_user_table + ' (id INTEGER PRIMARY KEY, st_user TEXT)');
                    tx.executeSql('SELECT id, st_user FROM ' + st_user_table, [],
                        function (tx, res) {
                            if (res.rows.length >= 1) {
                                st_user_id = res.rows.item(0).id;
                                var data = JSON.parse(res.rows.item(0).st_user);

                                st_login_menu = st_username_login = data.name;

                                $scope.st_username_login = st_username_login;
                                $scope.st_email = st_email = data.email;

                                $scope.isStudioLogin = true;
                                $rootScope.isStudioLoggedIn = true;

                                console.log(st_user_id + ' Username: ' + $scope.st_username_login);
                                $state.go('studio.app-list');
                            }
                            else {
                                console.log('STUDIO USER LOGGED OUT');
                                $state.go('studio-login');
                                $scope.isLoading = false;
                            }
                        },
                        function (e) {
                            console.log('STUDIO USER LOGGED OUT ERROR');
                            console.log(e);

                            $state.go('studio-login');
                            $scope.isLoading = false;
                        }
                    );
                });
            }
            else {
                $scope.isLoading = false;
            }
        }
        else {
            $scope.isLoading = false;
        }
        // httpService.get($scope, $http, url, 'company-options');
        // httpService.get($scope,$http,url,'company-admin');
    });

    $scope.login = function () {

        if ($scope.input.email !== '' && $scope.input.password !== '') {
            $scope.show();

            var url = studio_login_url;
            var input = $scope.input;
            var device_id = '';
            if (isPhoneGap()) {
                device_id = $cordovaDevice.getDevice().uuid;
            }
//            console.log(input);
            var obj = serializeData({email: input.email, password: input.password});

            httpService.post($scope, $http, url, obj);
        } else {
            $scope.showRequirementAlert();
        }

    };

    $scope.$on('httpService:postRequestSuccess', function () {
        $scope.result = $scope.data;
        $scope.hide();

//        $scope.app_list = $scope.result.message.apps;

//        console.log($scope.app_list);

        if ($scope.result.message == null || $scope.result.message == '' || $scope.result.message == undefined) {
            $scope.showFailedAlert($scope.login_failed_wrong_email_password);
        }

        // if user authentication success
        if ($scope.result.success === true) {
            console.log("STUDIO: Login Success");
            if (isPhoneGap()) {
            	if (st_db === '') {
                    st_db = window.sqlitePlugin.openDatabase({name: st_sqlitedb, location: 'default'});
                }

                st_db.transaction(function(tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + st_user_table + ' (id INTEGER PRIMARY KEY, st_user TEXT)');
                    tx.executeSql('DELETE FROM ' + st_user_table);
                    tx.executeSql("INSERT INTO " + st_user_table + " (id, st_user) VALUES (?,?)", [$scope.result.studio_user.id, JSON.stringify($scope.result.studio_user)],
                        function (tx, res) {
                            console.log(res);
                            st_user_id = $scope.result.studio_user.id;
                            st_username_login = $scope.result.studio_user.name;
                            st_email = $scope.result.studio_user.email;

                            $scope.st_username_login = st_username_login;
                            $scope.st_email = st_email;
                            $scope.isStudioLogin = true;
                            $rootScope.isStudioLoggedIn = true;

                            $state.go('studio.app-list');
                        },
                        function (e) {
                            console.log('STUDIO USER LOGGED OUT ERROR');
                            console.log(e);
                            $scope.isStudioLogin = false;
                        }
                    );
                });
            }
            else {
                st_user_id = $scope.result.studio_user.id;
                st_username_login = $scope.result.studio_user.name;
                st_email = $scope.result.studio_user.email;

                $scope.st_username_login = st_username_login;
                $scope.st_email = st_email;
                $scope.isStudioLogin = true;
                $rootScope.isStudioLoggedIn = true;

                console.log("Going to app-list");
                window.location.href = "#/studio/studio-app-list";
//                $state.go('studio.app-list');
            }
        }
        else {
            $scope.showAlert($scope.login_alert_title, translate_login_status($scope.result.status_code));
        }
    });

    $scope.$on('httpService:postRequestError', function () {
        $scope.hide();
        console.log("POST ERROR: STUDIO LOGIN");
        $scope.showFailedAlert($scope.login_failed_check_connection);
    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.showAlert = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            css: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + message + '</div>',
            okType:'cp-button'
        });
    };


    $scope.showFailedAlert = function (msg) {
        var alertPopup = $ionicPopup.alert({
            title: $scope.login_alert_title,
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">'+msg+'</div>'
        });
    };

    $scope.showRequirementAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.login_alert_title,
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">'+$scope.login_requirement+'</div>'
        });
    };

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
                title: 'Exit Application',
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>Are you sure want to exit?</div>",
                okType:'cp-button'
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


});
