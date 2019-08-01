app.controller('StudioCtrl', function($scope,
                                    $state,
                                    $ionicHistory,
                                    $ionicPlatform,
                                    $ionicPopup,
                                    $rootScope){

    $scope.isLoading = true;
    $scope.isStudioLogin = false;
    $rootScope.isStudioLoggedIn = false;

    menu_text_login = "Login";

    $ionicPlatform.ready(function () {
     	console.log('Studio Controller');
        console.log(navigator.userAgent);
        console.log('Android: ' + isAndroid());
        console.log('iOS: ' + isIOS());

        console.log ("STUDIO: REDIRECTING");
        if (isPhoneGap()) {
            if (st_db === '') {
                st_db = window.sqlitePlugin.openDatabase({name: st_sqlitedb, location: 'default'});
                console.log("STUDIO: db: st_sqlite");
            }

            if (st_user_id == '') {
            	st_db.transaction(function(tx){
                    tx.executeSql('DROP TABLE IF EXISTS st_users'); 
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + st_user_table + ' (id INTEGER PRIMARY KEY, st_user TEXT)');
                    tx.executeSql('SELECT id, st_user FROM ' + st_user_table, [], 
                        function (tx, res) {
                        // console.log("=====RES LENGTH======");
                            // console.log(res.rows.length);
                            // console.log("=====RES LENGTH END======");
                            if (res.rows.length >= 1) {
                                st_user_id = res.rows.item(0).id;
                                var data = JSON.parse(res.rows.item(0).st_user);

                                st_login_menu = st_username_login = data.name;
                                st_email = data.email;
                                $scope.st_username_login = st_username_login;
                                
                                console.log("*** Studio Controller *** " + $scope.st_username_login);
                                
                                $scope.isStudioLogin = true;
                                $rootScope.isStudioLoggedIn = true;
                                $state.go('studio.app-list');
                            }
                            else {
                                console.log('STUDIO USER LOGGED OUT');
                                $scope.isStudioLogin = false;
                            }
                        },
                        function (e) {
                            console.log('STUDIO USER LOGGED OUT ERROR');
                            console.log(e);
                            $scope.isStudioLogin = false;

                            $state.go('studio-login');
                        }
                    );
                });
            }
        }
        else {
            $scope.st_username_login = st_username_login;
        }
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

    var doStudioBack = function () {
        console.log("*** Back Studio Controller ***");
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
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
                else {
                    doregisterHardBack = $ionicPlatform.registerBackButtonAction(doStudioBack, 101);
                }
            });
        };
        
        $scope.showExitConfirmation();
    };
    
    doregisterHardBack = $ionicPlatform.registerBackButtonAction(doStudioBack, 101);
    
    $scope.doLogout = function(){
        console.log("Logging Out...");
        if (isPhoneGap()) {
            if (st_db === '') {
                st_db = window.sqlitePlugin.openDatabase({name: st_sqlitedb, location: 'default'});
            }
            st_db.transaction(function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS ' + user_table);
                //console.log(user_id + " " + username_login);
                tx.executeSql("DELETE FROM " + st_user_table, [], function (tx, res) {
                    //apus dari db
                    st_user_id = '';
                    st_username_login = '';
                    st_email = '';
                   
                    $scope.isStudioLogin = $rootScope.isStudioLoggedIn = false;

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearHistory();
                    
                    $state.go("studio-login");
                    $scope.isLoading = false;
                    $ionicHistory.clearHistory();

                }, function (e) {
                    console.log("ERROR: " + e.message);
                    $scope.isStudioLogin = $rootScope.isStudioLoggedIn = true;
                });
            });
        }
        else {
            st_user_id = '';
            st_username_login = '';
            st_email = '';

            $scope.isStudioLogin = $rootScope.isStudioLoggedIn = false;

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $ionicHistory.clearHistory();
            
            $state.go("studio-login");
            $ionicHistory.clearHistory();
        }
    };
    
    $scope.getUsername = function(){
        return st_username_login;
    }
    
    $scope.openExtLink = function(url){
//        var confirmPopup = $ionicPopup.confirm({
//            title: 'Compro Engine',
//            css: 'cp-button',
//            template: "<div style='display:flex;justify-content:center;align-items:center;'>Proceed to Compro Engine?</div>",
//            okType:'cp-button'
//        });
//
//        //confirmation dialog
//        confirmPopup.then(function (res) {
//            if (res) {
//                window.open(url, "_system", "location=yes");
//            }
//        });

        window.open(url, "_system", "location=yes");
        return false;
    }
  
    document.onclick = function (e) {
        e = e || window.event;
        var element = e.target || e.srcElement;

        if (element.tagName == 'A' && element.classList.contains('external-link')) {
            //window.open(element.href, "_blank", "location=yes");
            showExitConfirmation($ionicPopup, element.href);
            return false; // prevent default action and stop event propagation
        }

        if (element.tagName == 'IMG' && element.classList.contains('image-zoomable')) {
            console.log('Zoom Image');
            //console.log(element.src);
            $scope.zoomable_image = element.src;
            $scope.openZoombleImage("templates/zoomable-image-modal-1.html");
            return;
        }
    };
});
