app.controller('AppCtrl', function ($scope,
    $ionicModal,
    $timeout,
    $http,
    httpService,
    $ionicHistory,
    $ionicPlatform,
    $ionicPopup,
    $ionicLoading,
    $ionicSideMenuDelegate,
    $state,
    $cordovaDevice,
    $rootScope,
    $cordovaLocalNotification,
    notifService,
    $cordovaVibration,
    $cordovaClipboard,
    //adMobService,
    $cordovaToast,
    $cordovaStatusbar,
    $timeout) {

    $scope.version_data = [];
    $scope.isloading = true;
    $scope.isLogin = false;
    $scope.login_enabled = 'NO';
    $scope.selected_menu = 0;
    $rootScope.totalQty = 0;
    $rootScope.manual_payment = false;
    $rootScope.isLoggedIn = false;
    $rootScope.jne_service = 'NO';
    $rootScope.search_text = '';
    $rootScope.airline_search_origin_code = 'CGK';
    $rootScope.airline_search_origin = 'JAKARTA (CGK) - Soekarno Hatta';
    $rootScope.airline_search_destination_code = 'DPS';
    $rootScope.airline_search_destination = 'DENPASAR (DPS) - Ngurah Rai (Bali)';
    $rootScope.airline_search_result = [];
    $rootScope.airline_search_request = {};
    $rootScope.airline_search_return_result = [];
    $rootScope.airline_search_return_request = {};
    $rootScope.initHomeCustom = 0;
    $scope.loadMenuSuccess = false;
    $scope.isLoadingPoints = false;
    $scope.isPointsTryAgain = false;

    $rootScope.transaction_count = 0;

    $rootScope.lastRedirectLocation = '';
    $rootScope.destination_gosend_lat = 0; 
    $rootScope.destination_gosend_lng = 0;
    $rootScope.gosend_instant_price = 0;
    $rootScope.gosend_sameday_price = 0;
    var menu_text_login = "Login";
    var menu_text_user = "User";
    var menu_text_notif = "Notification List";
    var menu_text_cart = "Shopping Cart";
    var menu_text_search = "Search";
    var menu_text_share = "Share Apps";

    var menu_text_booking_history = "Booking History";
    var menu_text_transaction_history = "Transaction History";
    var menu_text_chat_support = "Chat With Support";

    var menu_text_member_area = "Member Area";
    var menu_text_menu = "Menu";
    var menu_text_settings = "Settings";

    var menuSearch = null;
    var menuShare = null;
    var menuNotificationList = null;
    var menuSettings = null;
    var menuLogin = null;

    $scope.menu_text_share = "Share Apps";

    $scope.menu_text_share = menu_text_share;
    $scope.menu_text_settings = menu_text_settings;
    $scope.menu_text_booking_history = menu_text_booking_history;
    $scope.menu_text_transaction_history = menu_text_transaction_history;
    $scope.menu_text_chat_support = menu_text_chat_support;
    is_expired = false;

    // flag untuk entry point apabila masuk app dari push notif.
    //    var urlPushLocalNotif = '';

    $scope.checkVersion = function(){
      if (app_user_env == 'PROD') {

        var verPlatform = isAndroid() ? 'android' : (isIOS() ? 'ios' : 'PLATFORM NOT DETECTED');

        var obj = serializeData({
          company_id: company_id,
          version: app_version,
          platform: verPlatform
        });

        httpService.post_version($scope, $http, check_version_url, obj, 'check-version');
      }
      else
        console.log("No need check version, still in DEV mode");
    };

    $scope.$on('httpService:postCheckVersionSuccess',function(){
      var data = $scope.version_data;
      console.log(data);
      if (!data.version && isPhoneGap()){
        var alertPopup = $ionicPopup.alert({
          title: $scope.alert_update_version_title,
          css: 'cp-button',
          template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_update_version_content + "</div>",
          okType:'cp-button',
          okText:$scope.alert_button_ok,
          buttons: [
            {
              text: $scope.alert_button_ok,
              type: 'cp-button',
              onTap: function(e){
                if (isAndroid()) {
                  // deep linking to play store
                  console.log(data);
                  var deeplink_url = data.deeplink_playstore;
                  var ref = cordova.InAppBrowser.open(deeplink_url, "_system", "location=yes");
                  // exit app
                  ionic.Platform.exitApp();
                }
                else if (isIOS()) {
                  // deep linking to Apple Store
                  var deeplink_url = data.deeplink_appstore;
                  var ref = cordova.InAppBrowser.open(deeplink_url, "_system", "location=yes");
                  // exit app
                  ionic.Platform.exitApp();
                }
                else {
                  console.log("NOT IN MOBILE DEVICE!");
                  console.log(playstore_link);
                  console.log(appstore_link);
                }
              }
            }
          ]
        });
      }
    });

    $scope.$on('httpService:postCheckVersionError',function(){
      console.log('Check version error.');
    });

    $ionicPlatform.ready(function () {
        console.log('App Controller');
        console.log(navigator.userAgent);
        console.log('Android: ' + isAndroid());
        console.log('iOS: ' + isIOS());

        $scope.app_type = app_type;

        if (login_required)
            $rootScope.isLoggedIn = isLoggedIn;

        if (isPhoneGap()) {
            $cordovaStatusbar.overlaysWebView(true);
            // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
            $cordovaStatusbar.style(3);
            // supported names: black, darkGray, lightGray, white, gray, red, green,
            // blue, cyan, yellow, magenta, orange, purple, brown
            $cordovaStatusbar.styleColor('black');
            $cordovaStatusbar.styleHex('#000000');
            $cordovaStatusbar.hide();
            $cordovaStatusbar.show();


            // window.FirebasePlugin.getToken(function (token) {
            //     // save this server-side and use it to push notifications to this device
            //     console.log(token);
            //     registration_id = token;
            //     device_id = $cordovaDevice.getDevice().uuid;
            //     console.log("PushNotif: RegistrationID: " + registration_id);
            //     console.log("PushNotif: DeviceID: " + device_id);
            //     console.log("PushNotif: CompanyID: " + company_id);
            //     var url = token_url;
            //     var obj = serializeData({ email: "wirendy@gmail.com", password: "password", company_id: company_id });
            //     httpService.post_token($scope, $http, url, obj, 'push_notif');
            // }, function (error) {
            //     console.error(error);
            // });

            // if (app_type != 'studio') {
              // window.FirebasePlugin.onNotificationOpen(function (data) {
              //     // save this server-side and use it to push notifications to this device
              //     if (typeof $scope.flagPushLocalNotif === 'undefined'){
              //         $scope.flagPushlocalNotif = false;
              //     }
              //     if (!$scope.flagPushLocalNotif) {
              //         if ($scope.loadMenuSuccess) {
              //             urlPushLocalNotif = "#/app/" + data.target;
              //             window.location.href = urlPushLocalNotif;
              //         }
              //         else {
              //             if (!is_expired) {
              //                 urlPushLocalNotif = "#/app/" + data.target;
              //                 $scope.loadPushLocalNotifTarget = true;
              //                 $scope.showLoading();
              //             }
              //             $scope.flagPushLocalNotif = true;
              //         }
              //     }
              //     else {
              //         urlPushLocalNotif = "#/app/" + data.target;
              //         window.location.href = urlPushLocalNotif;
              //         notifService.showNotification($scope,
              //             $rootScope,
              //             $ionicPlatform,
              //             $cordovaLocalNotification,
              //             $cordovaVibration,
              //             $ionicPopup,
              //             data);
              //     }
              // });
              //
              // window.FirebasePlugin.unregister(
              //     function () {
              //         console.log('success unregister');
              //         window.FirebasePlugin.onTokenRefresh(function (token) {
              //             console.log(token);
              //             registration_id = token;
              //             device_id = $cordovaDevice.getDevice().uuid;
              //             //  console.log("PushNotif: RegistrationID: " + registration_id);
              //             //  console.log("PushNotif: DeviceID: " + device_id);
              //             //  console.log("PushNotif: CompanyID: " + company_id);
              //
              //             var url = token_url;
              //             var obj = serializeData({ email: username, password: password, company_id: company_id });
              //             httpService.post_token($scope, $http, url, obj, 'push_notif');
              //         }, function (error) {
              //             console.error(error);
              //         });
              //
              //         window.FirebasePlugin.onNotificationOpen(function (data) {
              //             console.log(data);
              //             console.log(data.target);
              //             if (typeof $scope.flagPushLocalNotif === 'undefined') {
              //                 $scope.flagPushlocalNotif = false;
              //             }
              //             if (!$scope.flagPushLocalNotif) {
              //                 if ($scope.loadMenuSuccess) {
              //                     urlPushLocalNotif = "#/app/" + data.target;
              //                     window.location.href = urlPushLocalNotif;
              //                 }
              //                 else {
              //                     if (!is_expired) {
              //                         urlPushLocalNotif = "#/app/" + data.target;
              //                         $scope.loadPushLocalNotifTarget = true;
              //                         $scope.showLoading();
              //                     }
              //                     $scope.flagPushLocalNotif = true;
              //                 }
              //             }
              //             else {
              //                 urlPushLocalNotif = "#/app/" + data.target;
              //                 window.location.href = urlPushLocalNotif;
              //                 notifService.showNotification($scope,
              //                     $rootScope,
              //                     $ionicPlatform,
              //                     $cordovaLocalNotification,
              //                     $cordovaVibration,
              //                     $ionicPopup,
              //                     data);
              //             }
              //         }, function (error) {
              //             console.error(error);
              //         });
              //     });
              // }


              if (app_type != 'studio'){
                  // Push Notification
                  // when device is ready, register the device to the server.
                  console.log("PushNotif: Init");
                  var push = PushNotification.init({
                      android: {
                          sound: "true",
                          vibrate: "true",
                          forceShow: "true"
                      },
                      ios: {
                          alert: "true",
                          badge: "true",
                          sound: "true"
                      },
                      windows: {}
                  });

                  push.on('notification', function (data) {
                      // what do you want to do on notification?
                      // data.message,
                      // data.title,
                      //
                      // data.count,
                      // data.sound,
                      // data.image,
                      // data.additionalData
                      // console.log("Push Notif When Opened: ");
                      // console.log(data);

                      if (typeof $scope.flagPushLocalNotif === 'undefined')
                          $scope.flagPushlocalNotif = false;

                      if (!$scope.flagPushLocalNotif) {
                          if ($scope.loadMenuSuccess){
                              urlPushLocalNotif = "#/app/" + data.additionalData.target;
                              window.location.href = urlPushLocalNotif;
                          }
                          else {
                              if(!is_expired){
  //                                console.log("**********************");
  //                                console.log(data.additionalData.target);
  //                                console.log("**********************");
  //                                $timeout(function(){
  //                                    window.location.href = "#/app/" + data.additionalData.target;
  //                                },200);
                                  urlPushLocalNotif = "#/app/" + data.additionalData.target;
                                  $scope.loadPushLocalNotifTarget = true;
                                  $scope.showLoading();
                              }
                              $scope.flagPushLocalNotif = true;
                          }
                      }
                      else {
                          urlPushLocalNotif = "#/app/" + data.additionalData.target;
                          window.location.href = urlPushLocalNotif;
                          notifService.showNotification($scope,
                              $rootScope,
                              $ionicPlatform,
                              $cordovaLocalNotification,
                              $cordovaVibration,
                              $ionicPopup,
                              data);
                      }

                      //  $scope.data = {
                      //      registerID: JSON.stringify(data)
                      //  };
                  });

                  //  console.log("PushNotif: ");
                  //  console.log(push);
                  push.unregister(function () {
                      console.log('success unregister');
                      //call init again
                      push = PushNotification.init({
                          android: {
                            sound: "true",
                            vibrate: "true",
                            forceShow: "true"
                          },
                          ios: {
                              alert: "true",
                              badge: "true",
                              sound: "true"
                          },
                          windows: {}
                      });

                      push.on('registration', function (data) {
                          registration_id = data.registrationId;
                          device_id = $cordovaDevice.getDevice().uuid;
                          //  console.log("PushNotif: RegistrationID: " + registration_id);
                          //  console.log("PushNotif: DeviceID: " + device_id);
                          //  console.log("PushNotif: CompanyID: " + company_id);

                          var url = token_url;
                          var obj = serializeData({email: username, password: password, company_id: company_id});
                          httpService.post_token($scope, $http, url, obj, 'push_notif');
                      });

                      push.on('notification', function (data) {
                          // what do you want to do on notification?
                          // data.message,
                          // data.title,
                          //
                          // data.count,
                          // data.sound,
                          // data.image,
                          // data.additionalData
                          // console.log("Push Notif When Opened: ");
                          // console.log(data);

                          if (typeof $scope.flagPushLocalNotif === 'undefined'){
                              $scope.flagPushlocalNotif = false;
                          }

                          if (!$scope.flagPushLocalNotif) {
                              if ($scope.loadMenuSuccess){
                                  urlPushLocalNotif = "#/app/" + data.additionalData.target;
                                  window.location.href = urlPushLocalNotif;
                              }
                              else {
                                  if(!is_expired){
      //                                console.log("**********************");
      //                                console.log(data.additionalData.target);
      //                                console.log("**********************");
      //                                $timeout(function(){
      //                                    window.location.href = "#/app/" + data.additionalData.target;
      //                                },200);
                                      urlPushLocalNotif = "#/app/" + data.additionalData.target;
                                      $scope.loadPushLocalNotifTarget = true;
                                      $scope.showLoading();
                                  }
                                  $scope.flagPushLocalNotif = true;
                              }
                          }
                          else {
                              urlPushLocalNotif = "#/app/" + data.additionalData.target;
                              window.location.href = urlPushLocalNotif;
                              notifService.showNotification($scope,
                                  $rootScope,
                                  $ionicPlatform,
                                  $cordovaLocalNotification,
                                  $cordovaVibration,
                                  $ionicPopup,
                                  data);
                          }

                          //  $scope.data = {
                          //      registerID: JSON.stringify(data)
                          //  };
                      });

                      push.on('error', function (e) {
                          // e.message
                          console.log(e);
                          //  $scope.data = {
                          //      registerID: JSON.stringify(e)
                          //  };
                      });
                  }, function () {
                      console.log('error unregister');
                  });

              }


            // adMobService.initBannerAd();
            // check if any user login data stored in database
            if (db === '') {
                db = window.sqlitePlugin.openDatabase({ name: sqlitedb, location: 'default' });
                console.log("HOME db sqlite");
            }

            if (user_id == '') {
                db.transaction(function (tx) {
                    //tx.executeSql('DROP TABLE IF EXISTS contents'); // for DEBUG purposes only
                    //tx.executeSql('DROP TABLE IF EXISTS ' + user_table); // remove old users table
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + user_table + ' (id INTEGER PRIMARY KEY, user TEXT)');
                    tx.executeSql("SELECT id, user FROM " + user_table, [],
                        function (tx, res) {
                            if (res.rows.length >= 1) {
                                var data = JSON.parse(res.rows.item(0).user);

                                user_id = res.rows.item(0).id;
                                username_login = data.username;
                                email = data.email;
                                login_menu = menu_text_user;

                                var temp_user_meta = data.company_user_meta;
                                for (var i = 0; i < temp_user_meta.length; i++) {
                                    var key = temp_user_meta[i]['key'];
                                    var value = temp_user_meta[i]['value'];
                                    if (key.indexOf('_date') !== -1) {
                                        value = new Date(value);
                                    }
                                    user_meta[key] = value;
                                }

                                console.log('USER LOGGED IN');
                                //console.log(user_id + ' ' + username_login);
                                $scope.isLogin = true;
                                $rootScope.isLoggedIn = true;
                                main_menu['transaction_list'] = $scope.isLogin;

                                if (getPostMetaValueById(data.company_user_meta, 'expired_date') != null && getPostMetaValueById(data.company_user_meta, 'expired_date') != undefined) {
                                    var d1 = new Date();
                                    var d2 = new Date(value);
                                    console.log(d1);
                                    console.log(d2);
                                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

                                    var diffDays = Math.round(Math.abs((d2.getTime() - d1.getTime()) / (oneDay)));
                                    if (d1 <= d2) {
                                        console.log("active");
                                        is_expired = false;
                                    }
                                    else {
                                        console.log("expired");
                                        $scope.isLogin = false;
                                        main_menu['transaction_list'] = $scope.isLogin;
                                        is_expired = true;
                                    }
                                }
                                else {

                                }

                                $scope.user_meta = user_meta;
                                $scope.username_login = username_login;
                                $rootScope.user_id = user_id;
                                console.log("*** User ID: " + user_id + " ***");
                                var url = menu_url + "/" + user_id;
                                httpService.get($scope, $http, url, 'menu');
                            }
                            else {
                                console.log('USER LOGGED OUT');
                                $scope.isLogin = false;
                                main_menu['transaction_list'] = $scope.isLogin;
                                is_expired = true;

                                console.log("*** User ID: " + user_id + " ***");
                                var url = menu_url;// + "/" + user_id;
                                if (app_type != 'studio')
                                    httpService.get($scope, $http, url, 'menu');
                            }
                        },
                        function (e) {
                            console.log('USER LOGGED OUT');
                            $scope.isLogin = false;
                            main_menu['transaction_list'] = $scope.isLogin;

                            console.log("*** User ID: " + user_id + " ***");
                            var url = menu_url;// + "/" + user_id;
                            if (app_type != 'studio')
                                httpService.get($scope, $http, url, 'menu');
                        }
                    );
                }, function (error) {
                    console.log('transaction error: ' + error.message);
                }, function () {
                    console.log('transaction ok');
                });

                loadCartFromDB($scope, $rootScope);
            }

            // loadJSONFromDB(-1, $scope);
        }
        else {
            // var url = token_url;
            // var obj = serializeData({email: username, password: password, company_id: company_id});
            // httpService.post_token($scope, $http, url, obj, 'menu');
            console.log("*** User ID: " + user_id + " ***");

            var url = menu_url + (user_id == '' || user_id == undefined || user_id == false ? '' : '/' + user_id);//+ "/" + user_id;
            if (app_type != 'studio')
                httpService.get($scope, $http, url, 'menu');
        }
    });

    // if get token for menu success, get data menu
    $scope.$on('httpService:postTokenMenuSuccess', function () {
        token = $scope.data.token;
        console.log("APP: TOKEN SUCCESS" + token);
        //console.log(token);

        var url = menu_url + "/" + user_id;
        httpService.get($scope, $http, url, 'menu');

    });

    // if get token for menu failed, request token again
    $scope.$on('httpService:postTokenMenuError', function () {
        if ($scope.status === 0) {
            console.log('NO INTERNET CONNECTION');
            if (isPhoneGap()) {
                loadTermJSONFromDB(-1, $scope);
            }
        }
        else {
            var url = token_url;
            var obj = serializeData({ email: username, password: password, company_id: company_id });
            httpService.post_token($scope, $http, url, obj, 'menu');

        }
    });

    $scope.$on('httpService:getDeviceIdSuccess', function () {
        curr_device_id = $scope.data.device_id;
        console.log('Device ID: ' + curr_device_id);
        var user_device_id = '';
        if (isPhoneGap()) {
            user_device_id = $cordovaDevice.getDevice().uuid;
        }
        if (curr_device_id != user_device_id && user_id != '' && isPhoneGap()) {
            // Logged in to other device, logging out...
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_logged_in_title,
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_login_failed_bound_device + "</div>",
                okType: 'cp-button',
                okText: $scope.alert_button_ok
            });

            //confirmation dialog
            alertPopup.then(function (res) {
                if (res) {
                    console.log('USER LOGGED OUT');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearHistory();
                    $scope.do_logout();
                    $ionicHistory.clearHistory();
                }
            });
        }
    });

    $scope.$on('httpService:getUserExpirationSuccess', function () {
        is_expired = $scope.data.is_expired;
        console.log('is_expired: ' + is_expired);
        if (is_expired) {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_logged_in_title,
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_login_failed_expired + "</div>",
                okType: 'cp-button',
                okText: $scope.alert_button_ok
            });
            alertPopup.then(function (res) {
                if (res) {

                    console.log('USER LOGGED OUT');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearHistory();
                    $scope.do_logout();
                    $ionicHistory.clearHistory();
                }
            });
        }
    });

    $scope.do_logout = function () {
        //confirmation dialog
        var device_id = '';
        if (isPhoneGap()) {
            device_id = $cordovaDevice.getDevice().uuid;
        }
        //device_id = '2c5652e569bba77f'; // Testing Purposes Only
        var url = logout_url + '?user_id=' + user_id + '&company_id=' + company_id + '&device_id=' + device_id;
        httpService.get($scope, $http, url, 'logout');

        if (isPhoneGap()) {
            //console.log(db);
            if (db === '') {
                db = window.sqlitePlugin.openDatabase({ name: sqlitedb, location: 'default' });
            }
            db.transaction(function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS ' + user_table);
                //console.log(user_id + " " + username_login);
                tx.executeSql("DELETE FROM " + user_table, [], function (tx, res) {
                    //apus dari db
                    user_id = '';
                    username_login = '';
                    email = '';
                    phone = '';
                    address = '';

                    $scope.isLogin = false;
                    login_menu = menu_text_login;
                    $scope.title = login_menu;

                    //                    var idx = main_menu.findIndex(checkTemplate);
                    var idx = findMenuIndex(main_menu, "login");
                    menuLogin = main_menu[idx];
                    main_menu[idx].title = login_menu;
                    // main_menu[main_menu.length - 4].title = login_menu;

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearHistory();

                    if (login_required == true) {
                        login_menu = menu_text_user;
                        //                        var idx = main_menu.findIndex(checkTemplate);
                        var idx = findMenuIndex(main_menu, "login");
                        menuLogin = main_menu[idx];
                        main_menu[idx].title = login_menu;
                        // main_menu[main_menu.length - 4].title = login_menu;
                        $state.go("login");
                        $ionicHistory.clearHistory();
                    } else {
                        $state.go('app.' + home_template, { id: home_id });
                        $ionicHistory.clearHistory();
                    }

                }, function (e) {
                    console.log("ERROR: " + e.message);
                    $scope.isLogin = true;
                });
            });
        }
        else {

            user_id = '';
            username_login = '';
            email = '';
            phone = '';
            address = '';

            $scope.isLogin = false;
            login_menu = menu_text_login;
            $scope.title = login_menu;

            // console.log(main_menu[main_menu.length - 3]);
            //            var idx = main_menu.findIndex(checkTemplate);
            var idx = findMenuIndex(main_menu, "login");
            menuLogin = main_menu[idx];
            main_menu[idx].title = login_menu;
            // main_menu[main_menu.length - 4].title = login_menu;

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $ionicHistory.clearHistory();

            if (login_required == true) {
                login_menu = menu_text_user;
                //                var idx = main_menu.findIndex(checkTemplate);
                var idx = findMenuIndex(main_menu, "login");
                menuLogin = main_menu[idx];
                main_menu[idx].title = login_menu;
                // main_menu[main_menu.length - 4].title = login_menu;
                $state.go("login");
                $ionicHistory.clearHistory();
            } else {
                $state.go('app.' + home_template, { id: home_id });
                $ionicHistory.clearHistory();
            }
        }
    };

    $scope.loadUITextMembership = function () {
        $scope.membership_features_enabled = membership_features_enabled;
        $scope.member_card_enabled = member_card_enabled;

        $scope.text_membership_menu_button_text_view_profile = getMenuText(ui_texts_membership_menu.text_membership_menu_button_text_view_profile, "View Profile");
        $scope.text_membership_menu_text_points = getMenuText(ui_texts_membership_menu.text_membership_menu_text_points, "Points");
        $scope.text_membership_menu_text_welcome = getMenuText(ui_texts_membership_menu.text_membership_menu_text_welcome, "Welcome,");
        $scope.text_membership_menu_history = getMenuText(ui_texts_membership_menu.text_membership_menu_history, "History");
        $scope.text_membership_menu_my_items = getMenuText(ui_texts_membership_menu.text_membership_menu_my_items, "My Items");
        $scope.text_membership_menu_rewards = getMenuText(ui_texts_membership_menu.text_membership_menu_rewards, "Rewards");

        // reload user points if membership_features_enabled == YES
        if (membership_features_enabled == 'YES') {
            // load points from API, put the function globally on app-functions.js
        }
    };

    $scope.loadDefaultMenuTitles = function () {
        if (default_menu_titles != false) {
            $scope.menu_text_login = menu_text_login = getMenuText(default_menu_titles.login, "Login");
            $scope.menu_text_user = menu_text_user = getMenuText(default_menu_titles.user, "User");
            $scope.menu_text_notif = menu_text_notif = getMenuText(default_menu_titles.notification, "Notification List");
            $scope.menu_text_cart = menu_text_cart = getMenuText(default_menu_titles.cart, "Shopping Cart");
            $scope.menu_text_search = menu_text_search = getMenuText(default_menu_titles.search, "Search");
            $scope.menu_text_share = menu_text_share = getMenuText(default_menu_titles.share, "Share Apps");
            $scope.menu_text_booking_history = menu_text_booking_history = getMenuText(default_menu_titles.booking_history, "Booking History");
            $scope.menu_text_transaction_history = menu_text_transaction_history = getMenuText(default_menu_titles.transaction_history, "Transaction History");
            $scope.menu_text_chat_support = menu_text_chat_support = getMenuText(default_menu_titles.chat_support, "Chat with Support");
            $scope.menu_text_menu = menu_text_menu = getMenuText(default_menu_titles.menu, "Menu");
            $scope.menu_text_member_area = menu_text_member_area = getMenuText(default_menu_titles.member_area, "Member Area");
            $scope.menu_text_form_request_history = menu_text_form_request_history = getMenuText(default_menu_titles.form_request_history, "Form Request History");
            $scope.menu_text_settings = menu_text_settings = getMenuText(default_menu_titles.settings, "Settings");

            if (login_menu == "Login") login_menu = menu_text_login;
            else if (login_menu == "User") login_menu = menu_text_user;
        }
        else {
            menu_text_login = "Login";
            menu_text_user = "User";
            menu_text_notif = "Notification List";
            menu_text_cart = "Shopping Cart";
            menu_text_search = "Search";
            menu_text_share = "Share Apps";

            menu_text_booking_history = "Booking History";
            menu_text_transaction_history = "Transaction History";
            menu_text_chat_support = "Chat With Support";

            menu_text_member_area = "Member Area";
            menu_text_menu = "Menu";
            menu_text_settings = "Settings";
        }

        $scope.menu_text_share = menu_text_share;
        $scope.menu_text_booking_history = menu_text_booking_history;
        $scope.menu_text_transaction_history = menu_text_transaction_history;
        $scope.menu_text_chat_support = menu_text_chat_support;
        $scope.text_login_menu = (login_required && isLoginEnabled) || $scope.isLoggedIn ? $scope.menu_text_user : $scope.menu_text_login;

        if (menuSearch != null) menuSearch.title = $scope.menu_text_search;
        if (menuShare != null) menuShare.title = $scope.menu_text_share;
        if (menuNotificationList != null) menuNotificationList.title = $scope.menu_text_notif;
        if (menuSettings != null) menuSettings.title = $scope.menu_text_settings;
        if (menuLogin != null) menuLogin.title = $scope.text_login_menu;
    };

    $scope.loadUITextGeneral = function(){
      // all term list
      $scope.text_pull_to_refresh = getMenuText(ui_texts_general.text_pull_to_refresh, "Pull to refresh...");
      $scope.text_share = getMenuText(ui_texts_general.text_share, "Share");

      // comments
      $scope.text_comment_title = getMenuText(ui_texts_general.text_comment_title, "Comment");
      $scope.text_comment_button = getMenuText(ui_texts_general.text_comment_button, "Comment");
      $scope.text_comment_alert_success = getMenuText(ui_texts_general.text_comment_alert_success, "Successfully posted comment");
      $scope.text_edit_comment_alert_success = getMenuText(ui_texts_general.text_edit_comment_alert_success, "Successfully edit comment");
      $scope.text_comment_alert_error = getMenuText(ui_texts_general.text_comment_alert_error, "Failed to post comment. Please check your internet connection and try again.");
      $scope.text_comment_btn_login = getMenuText(ui_texts_general.text_comment_btn_login, 'Login');
      $scope.text_comment_btn_login_to_comment = getMenuText(ui_texts_general.text_comment_btn_login_to_comment, 'Please Login to Comment');
      $scope.text_comment_prompt_login_content = getMenuText(ui_texts_general.text_comment_prompt_login_content, 'Please login to post your comment.');
      $scope.text_comment_you_liked_this = getMenuText(ui_texts_general.text_comment_you_liked_this, 'You liked this.');
      $scope.text_comment_like = getMenuText(ui_texts_general.text_comment_like, "Like");

      //input field error
      $scope.input_error_text_must_be_filled = getMenuText(ui_texts_general.input_error_text_must_be_filled, 'must be filled.');
      $scope.input_error_text_wrong_format = getMenuText(ui_texts_general.input_error_text_wrong_format, 'Wrong format for field');
      $scope.input_error_text_please_input_valid = getMenuText(ui_texts_general.input_error_text_please_input_valid, 'please input a valid');
      $scope.input_error_text_min_characters = getMenuText(ui_texts_general.input_error_text_min_characters, 'must be 6 characters minimum.');
      $scope.input_field_type_time = getMenuText(ui_texts_general.input_field_type_time, 'time');
      $scope.input_field_type_date = getMenuText(ui_texts_general.input_field_type_date, 'date');
      $scope.input_field_type_email = getMenuText(ui_texts_general.input_field_type_email, 'email');
      $scope.input_field_type_image = getMenuText(ui_texts_general.input_field_type_image, 'image');
      $scope.input_field_type_password = getMenuText(ui_texts_general.input_field_type_password, 'password');

      // general alert
      $scope.alert_title_exit_app = getMenuText(ui_texts_general.alert_title_exit_app, "Exit Application?");
      $scope.alert_content_exit_app = getMenuText(ui_texts_general.alert_content_exit_app, "Are you sure you want to exit app?");
      $scope.alert_button_ok = getMenuText(ui_texts_general.alert_button_ok, "OK");
      $scope.alert_button_cancel = getMenuText(ui_texts_general.alert_button_cancel, "Cancel");
      $scope.alert_button_try_again = getMenuText(ui_texts_general.alert_button_try_again, "Try Again");
      $scope.alert_update_version_title = getMenuText(ui_texts_general.alert_update_version_title, "Update Available!");
      $scope.alert_update_version_content = getMenuText(ui_texts_general.alert_update_version_content, "Please update our app to enjoy our newest features!");

      // logged in
      $scope.alert_logged_in_title = getMenuText(ui_texts_general.alert_logged_in_title, "Logged In");
      $scope.alert_login_failed_bound_device = getMenuText(ui_texts_general.alert_login_failed_bound_device, "You are logged in to other device. Please login again with this device.");
      $scope.alert_login_failed_expired = getMenuText(ui_texts_general.alert_login_failed_expired, "Your account has expired.");
      $scope.alert_login_failed_expired = getMenuText(ui_texts_login.alert_login_failed_expired, "Your account has expired, please top up first.");
      $scope.alert_login_failed_unapproved = getMenuText(ui_texts_login.alert_login_failed_unapproved, "Your account has not been approved by our Administrator.");
      $scope.alert_login_failed_wrong_email_password = getMenuText(ui_texts_login.alert_login_failed_wrong_email_password, "Wrong email or password!");
      $scope.alert_login_failed_wrong_username_password = getMenuText(ui_texts_login.alert_login_failed_wrong_username_password, "Wrong username or password!");
      $scope.alert_login_success = getMenuText(ui_texts_login.alert_login_success, "Login success!");
      $scope.alert_login_failed_cp_expired = getMenuText(ui_texts_login.alert_login_failed_cp_expired, "Your account is expired. Extend your membership at <a href='https://member.compro.id' class='external-link'>https://member.compro.id</a>9");
      $scope.alert_login_failed_verify = getMenuText(ui_texts_login.alert_login_failed_verify, "Login Failed. Please verify your email account to login.");

      // exit preview
      $scope.alert_exit_preview_title = getMenuText(ui_texts_general.alert_exit_preview_title,"Exit Preview");
      $scope.alert_exit_preview_content = getMenuText(ui_texts_general.alert_exit_preview_content,"Are you sure want to exit preview?");

      // loading
      $scope.text_loading = getMenuText(ui_texts_general.text_loading, "Loading...");
      $scope.text_try_again = getMenuText(ui_texts_general.text_try_again, "Try again later.");
      $scope.text_please_connect_to_loyalty = getMenuText(ui_texts_general.text_please_connect_to_loyalty, "Please connect to ") + $scope.loyalty_app_integration_apps_loyalty;
      $scope.text_reload = getMenuText(ui_texts_general.text_reload, "Reload");
      $scope.text_please_wait = getMenuText(ui_texts_general.text_please_wait, "Please wait a moment...");
      $scope.text_something_wrong = getMenuText(ui_texts_general.text_something_wrong, "Oops, something is wrong here...");
      $scope.text_reload_to_retry = getMenuText(ui_texts_general.text_reload_to_retry, "Tap reload to try again.");
      $scope.text_no_data_found = getMenuText(ui_texts_general.text_no_data_found, "No data found.");
      ionicLoadingTemplate = '<div style="display:flex;justify-content:center;align-items:center;">' + $scope.text_loading + '<ion-spinner></ion-spinner></div>';

      // search
      $scope.text_search_error_connection = getMenuText(ui_texts_general.text_search_error_connection,"Failed to search, please check your internet connection and try again.");
      $scope.text_keyword = getMenuText(ui_texts_general.text_keyword, "Keyword");

      // external URL
      $scope.alert_external_link_title = getMenuText(ui_texts_general.alert_external_link_title,"External URL");
      $scope.alert_external_link_content = getMenuText(ui_texts_general.alert_external_link_content, "This link contains external URL. Do you want to proceed?");

      // drop down
      $scope.text_dropdown_choose_one = getMenuText(ui_texts_general.text_dropdown_choose_one, "Choose one...");

      // upload image
      $scope.button_text_take_photo = getMenuText(ui_texts_upload_image.button_text_take_photo, "Take Photo");
      $scope.button_text_browse = getMenuText(ui_texts_upload_image.button_text_browse, "Browse Image");
      $scope.button_text_back = getMenuText(ui_texts_upload_image.button_text_back, "Cancel");
      $scope.button_text_change = getMenuText(ui_texts_upload_image.button_text_change, "Change");
      $scope.text_upload_image_modal = getMenuText(ui_texts_upload_image.text_upload_image_modal, "Upload Image");
      $scope.text_upload_image_description = getMenuText(ui_texts_upload_image.text_upload_image_description, "Please upload image using one of the options below.");
      $scope.alert_upload_image_title = getMenuText(ui_texts_upload_image.alert_upload_image_title, "Image Upload");
      $scope.alert_upload_image_success = getMenuText(ui_texts_upload_image.alert_upload_image_success, "Successfully uploaded image.");
      $scope.alert_upload_image_failed_connection = getMenuText(ui_texts_upload_image.alert_upload_image_failed_connection, "Failed to upload image, please check your internet connection and try again.");
      $scope.alert_upload_image_button_try_again = getMenuText(ui_texts_upload_image.alert_upload_image_button_try_again, "Try Again");
      $scope.alert_upload_image_button_ok = getMenuText(ui_texts_upload_image.alert_upload_image_button_ok, "OK");

      //login
      $scope.button_text_login = getMenuText(ui_texts_login.button_text_login, "Log in");
    };

    $scope.loadUITexts = function ($scope) {
        ui_texts_audios = loadUIMenuTexts($scope.data.options, 'ui_texts_audios', false);
        ui_texts_bookings = loadUIMenuTexts($scope.data.options, 'ui_texts_bookings', false);
        ui_texts_careers = loadUIMenuTexts($scope.data.options, 'ui_texts_careers', false);
        ui_texts_contacts = loadUIMenuTexts($scope.data.options, 'ui_texts_contacts', false);
        ui_texts_contact_forms = loadUIMenuTexts($scope.data.options, 'ui_texts_contact_forms', false);
        ui_texts_custom_forms = loadUIMenuTexts($scope.data.options, 'ui_texts_custom_forms', false);
        ui_texts_custom_form_reply_history = loadUIMenuTexts($scope.data.options, 'ui_texts_custom_form_reply_history', false);
        ui_texts_events = loadUIMenuTexts($scope.data.options, 'ui_texts_events', false);
        ui_texts_general = loadUIMenuTexts($scope.data.options, 'ui_texts_general', false);
        ui_texts_files = loadUIMenuTexts($scope.data.options, 'ui_texts_files', false);
        ui_texts_inapp_purchase = loadUIMenuTexts($scope.data.options, 'ui_texts_inapp_purchase', false);
        ui_texts_language = loadUIMenuTexts($scope.data.options, 'ui_texts_language', false);
        ui_texts_login = loadUIMenuTexts($scope.data.options, 'ui_texts_login', false);
        ui_texts_manual_payments = loadUIMenuTexts($scope.data.options, 'ui_texts_manual_payments', false);
        ui_texts_membership_menu = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_menu', false);
        ui_texts_membership_products = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_products', false);
        ui_texts_membership_member_items = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_member_items', false);
        ui_texts_membership_history = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_history', false);
        ui_texts_profile = loadUIMenuTexts($scope.data.options, 'ui_texts_profile', false);
        ui_texts_products = loadUIMenuTexts($scope.data.options, 'ui_texts_products', false);
        ui_texts_register = loadUIMenuTexts($scope.data.options, 'ui_texts_register', false);
        ui_texts_reset_password = loadUIMenuTexts($scope.data.options, 'ui_texts_reset_password', false);
        ui_texts_settings = loadUIMenuTexts($scope.data.options, 'ui_texts_settings', false);
        ui_texts_shopping_cart = loadUIMenuTexts($scope.data.options, 'ui_texts_shopping_cart', false);
        ui_texts_transactions = loadUIMenuTexts($scope.data.options, 'ui_texts_transactions', false);
        ui_texts_upload_image = loadUIMenuTexts($scope.data.options, 'ui_texts_upload_image', false);
        ui_texts_webviews = loadUIMenuTexts($scope.data.options, 'ui_texts_webviews', false);

        $scope.loadUITextGeneral();
    };


    $scope.getMenuSuccess = function () {

        console.log('GET MENU SUCCESS');
        if (app_type === 'studio') {
            $scope.data = $rootScope.data;
            // override back button
            doregisterHardBack = $ionicPlatform.registerBackButtonAction(doCustomBack, 101);
        }
        //        else if ($rootScope.isLoginRefresh != undefined && $rootScope.isLoginRefresh == true){
        //            $scope.data = $rootScope.data;
        //            console.log("overriding menu data");
        //        }
        console.log($scope.data);
        var user = $scope.data.user;
        main_menu = $scope.data.terms;
        console.log("******* MAIN MENU *******");
        console.log(main_menu);
        console.log("**************************");

        main_menu['transaction_list'] = $scope.isLogin;

        updated_time = $scope.data.company.updated_at;
        //console.log('Updated At: ' + updated_time);
        var login_enabled = getPostMetaValueById($scope.data.options, "login_enabled");
        isLoginEnabled = login_enabled !== undefined ? (login_enabled.value == 'YES' ? true : false) : false;

        register_phone_required = getPostMetaValueById($scope.data.options, "register_phone_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_phone_required").value : 'NO';

        login_mode = getPostMetaValueById($scope.data.options, "login_mode");
        login_mode = login_mode !== undefined ? login_mode.value : 'email';

        register_phone_required = getPostMetaValueById($scope.data.options, "register_phone_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_phone_required").value : 'NO';
        register_address_required = getPostMetaValueById($scope.data.options, "register_address_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_address_required").value : 'NO';
        register_message_required = getPostMetaValueById($scope.data.options, "register_message_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_message_required").value : 'NO';
        field_title_register_additional_message = getPostMetaValueById($scope.data.options, "field_title_register_additional_message") !== undefined ? getPostMetaValueById($scope.data.options, "field_title_register_additional_message").value : '';

        audioDownloadEnabled = getPostMetaValueById($scope.data.options, "audio_download_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "audio_download_enabled").value == 'YES' ? true : false) : false;

        canAttendEvent = getPostMetaValueById($scope.data.options, "can_attend_event") !== undefined ? (getPostMetaValueById($scope.data.options, "can_attend_event").value == 'YES' ? true : false) : false;

        home_share_apps = getPostMetaValueById($scope.data.options, "home_share_apps") !== undefined ? (getPostMetaValueById($scope.data.options, "home_share_apps").value == 'YES' ? true : false) : false;
        home_category_text = getPostMetaValueById($scope.data.options, "home_category_text") !== undefined ? (getPostMetaValueById($scope.data.options, "home_category_text").value === 'YES') : true;

        isDeviceLogin = getPostMetaValueById($scope.data.options, "is_device_login") !== undefined ? (getPostMetaValueById($scope.data.options, "is_device_login").value == 'YES' ? true : false) : false;

        //login_required = getPostMetaValueById($scope.data.options, "login_required");
        shopping_enabled = getPostMetaValueById($scope.data.options, "shopping_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "shopping_enabled").value == 'YES' ? true : false) : false;

        currency = getPostMetaValueById($scope.data.options, "price_currency") !== undefined ? getPostMetaValueById($scope.data.options, "price_currency").value : 'Rp';

        stock_status_visible = getPostMetaValueById($scope.data.options, "stock_status_visible") !== undefined ? getPostMetaValueById($scope.data.options, "stock_status_visible").value : 'NO';

        booking_enabled = getPostMetaValueById($scope.data.options, "booking_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "booking_enabled").value == 'YES' ? true : false) : false;

        playstore_link = getPostMetaValueById($scope.data.options, "link_playstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_playstore").value : '';
        appstore_link = getPostMetaValueById($scope.data.options, "link_appstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_appstore").value : '';

        inAppPurchaseEnabled = getPostMetaValueById($scope.data.options, "in_app_purchase_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "in_app_purchase_enabled").value == 'YES' ? true : false) : false;

        is_membership_enabled = getPostMetaValueById($scope.data.options, "is_membership_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "is_membership_enabled").value : 'NO';

        membership_product_data_android = getPostMetaValueById($scope.data.options, "membership_product_data_android");
        membership_product_data_android = JSON.parse(membership_product_data_android !== undefined ? membership_product_data_android.value : "[]");

        custom_register_fields = getPostMetaValueById($scope.data.options, "custom_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_register_fields").value : false;
        default_register_fields = getPostMetaValueById($scope.data.options, "default_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "default_register_fields").value : false;

        custom_form_fields = getPostMetaValueById($scope.data.options, "custom_form_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_form_fields").value : false;

        custom_transaction_fields = getPostMetaValueById($scope.data.options, "custom_transaction_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_transaction_fields").value : false;
        default_transaction_fields = getPostMetaValueById($scope.data.options, "default_transaction_fields") !== undefined ? getPostMetaValueById($scope.data.options, "default_transaction_fields").value : false;

        member_card_enabled = getPostMetaValueById($scope.data.options, "member_card_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "member_card_enabled").value == 'YES' ? true : false) : false;

        member_card_fields = getPostMetaValueById($scope.data.options, "member_card_fields") !== undefined ? getPostMetaValueById($scope.data.options, "member_card_fields").value : false;

        payment_type = getPostMetaValueById($scope.data.options, "payment_type") !== undefined ? getPostMetaValueById($scope.data.options, "payment_type").value : payment_type;
        payment_channel = getPostMetaValueById($scope.data.options, "payment_channel") !== undefined ? getPostMetaValueById($scope.data.options, "payment_channel").value : payment_channel;

        vt_payment_service = getPostMetaValueById($scope.data.options, "vt_payment_service") !== undefined ? getPostMetaValueById($scope.data.options, "vt_payment_service").value : 'NO';
        $rootScope.manual_payment = vt_payment_service == 'YES' ? false : true;

        rajaongkir_enabled = getPostMetaValueById($scope.data.options, "rajaongkir_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_enabled").value : 'NO';
        pickup_enabled = getPostMetaValueById($scope.data.options, "pickup_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "pickup_enabled").value : 'NO';
        no_delivery_enabled = getPostMetaValueById($scope.data.options, "no_delivery_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "no_delivery_enabled").value : 'YES';
        sicepat_enabled = getPostMetaValueById($scope.data.options, "sicepat_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "sicepat_enabled").value : 'NO';
        shipper_enabled = getPostMetaValueById($scope.data.options, "shipper_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_enabled").value : 'NO';
        shipper_intl_enabled = getPostMetaValueById($scope.data.options, "shipper_intl_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_intl_enabled").value : 'NO';
        opsigo_enabled = getPostMetaValueById($scope.data.options, "opsigo_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "opsigo_enabled").value : 'NO';
        promocode_enabled = getPostMetaValueById($scope.data.options, "promocode_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "promocode_enabled").value : 'NO';
        custom_delivery_enabled = getPostMetaValueById($scope.data.options, "custom_delivery_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "custom_delivery_enabled").value : 'NO';
        go_send_enabled = getPostMetaValueById($scope.data.options, "go_send_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "go_send_enabled").value : 'NO';
        gosend_origin_lat = getPostMetaValueById($scope.data.options, "gosend_origin_lat") !== undefined ? getPostMetaValueById($scope.data.options, "gosend_origin_lat").value : -6.229557;
        gosend_origin_lng = getPostMetaValueById($scope.data.options, "gosend_origin_lng") !== undefined ? getPostMetaValueById($scope.data.options, "gosend_origin_lng").value : 106.825374;
        gosend_display_city = getPostMetaValueById($scope.data.options, "gosend_display_city") !== undefined ? getPostMetaValueById($scope.data.options, "gosend_display_city").value : '';
        opsigo_list = getPostMetaValueById($scope.data.options, "opsigo_list") !== undefined ? getPostMetaValueById($scope.data.options, "opsigo_list").value : [];
        reservation_admin = getPostMetaValueById($scope.data.options, "reservation_admin") !== undefined ? getPostMetaValueById($scope.data.options, "reservation_admin").value : [];
        reservation_enabled = getPostMetaValueById($scope.data.options, "reservation_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "reservation_enabled").value : 'NO';
        wishlist_enabled = getPostMetaValueById($scope.data.options, "wishlist_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "wishlist_enabled").value : 'NO';
        pos_malaysia_enabled = getPostMetaValueById($scope.data.options, "pos_malaysia_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "pos_malaysia_enabled").value : 'NO';

        maintenance_enabled = getPostMetaValueById($scope.data.options, "maintenance_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "maintenance_enabled").value : 'NO';

        rajaongkir_sender_city_id = getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id").value : '152';
        sicepat_origin = getPostMetaValueById($scope.data.options, "sicepat_origin") !== undefined ? getPostMetaValueById($scope.data.options, "sicepat_origin").value : 'CGK';
        shipper_origin = getPostMetaValueById($scope.data.options, "shipper_origin") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_origin").value : '4773';

        rajaongkir_selected_services = getPostMetaValueById($scope.data.options, "rajaongkir_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_selected_services").value : '';
        shipper_selected_services = getPostMetaValueById($scope.data.options, "shipper_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_selected_services").value : '';

        $rootScope.jne_service = getPostMetaValueById($scope.data.options, "jne_service") !== undefined ? getPostMetaValueById($scope.data.options, "jne_service").value : 'NO';

        sku_enabled = getPostMetaValueById($scope.data.options, "sku_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "sku_enabled").value : 'NO';

        limit_per_customer_enabled = getPostMetaValueById($scope.data.options, "limit_per_customer_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "limit_per_customer_enabled").value : 'NO';

        default_menu_titles = getPostMetaValueById($scope.data.options, "default_menu_titles") !== undefined ? getPostMetaValueById($scope.data.options, "default_menu_titles").value : false;
        default_menu_titles = JSON.parse(default_menu_titles);

        // MEMBERSHIP
        membership_features_enabled = getPostMetaValueById($scope.data.options, 'membership_features_enabled') !== undefined ? getPostMetaValueById($scope.data.options, "membership_features_enabled").value : 'NO';
        membership_points_rule_conversion = getPostMetaValueById($scope.data.options, 'membership_points_rule_conversion') !== undefined ? getPostMetaValueById($scope.data.options, "membership_points_rule_conversion").value : 'NO';

        // Loyalty Integration
        loyalty_integration_active = getPostMetaValueById($scope.data.options,'loyalty_integration_active') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_integration_active").value : 'NO';
        loyalty_merchant_code = getPostMetaValueById($scope.data.options,'loyalty_merchant_code') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_merchant_code").value : '';
        loyalty_domain = getPostMetaValueById($scope.data.options,'loyalty_domain') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_domain").value : '';
        loyalty_app_integration = getPostMetaValueById($scope.data.options,'loyalty_app_integration') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_app_integration").value : '';
        loyalty_app_integration_apps_loyalty = getPostMetaValueById($scope.data.options,'loyalty_app_integration_apps_loyalty') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_app_integration_apps_loyalty").value : '';
        loyalty_link_play_store = getPostMetaValueById($scope.data.options,'loyalty_link_play_store') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_link_play_store").value : '';
        loyalty_link_app_store = getPostMetaValueById($scope.data.options,'loyalty_link_app_store') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_link_app_store").value : '';

        // OPSIGO INTEGRATION
        opsigo_integration_enabled = getPostMetaValueById($scope.data.options,'opsigo_integration_enabled') !== undefined ? getPostMetaValueById($scope.data.options, "opsigo_integration_enabled").value : 'NO';

        // VT SNAP
        vt_client_key = getPostMetaValueById($scope.data.options, "vt_client_key") !== undefined ? getPostMetaValueById($scope.data.options, "vt_client_key").value : '';
        vt_production = getPostMetaValueById($scope.data.options, "vt_production") !== undefined ? getPostMetaValueById($scope.data.options, "vt_production").value : 'NO';

        var snapJS = document.getElementById('initMidtransSNAP');
        midtrans_js_url = vt_production == 'YES' ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';
        if (snapJS) {
            snapJS.setAttribute('src', midtrans_js_url);
            snapJS.setAttribute('data-client-key', vt_client_key);
        }
        else
            console.log("- Failed to load SNAP -");

        if(go_send_enabled == 'YES') {
          var googleMaps = document.getElementById('initGoogleMaps');
          //var key_google_maps = "AIzaSyAbITLNwBg7Z5rwPoOQBKzKtjJWmOj85I4";
          key_google_maps = getPostMetaValueById($scope.data.options, "key_google_maps") !== undefined ? getPostMetaValueById($scope.data.options, "key_google_maps").value : "AIzaSyAbITLNwBg7Z5rwPoOQBKzKtjJWmOj85I4";
          var google_maps_url = "https://maps.googleapis.com/maps/api/js?key="+ key_google_maps +"&sensor=false&libraries=places";
          if (googleMaps) {
              googleMaps.setAttribute('src', google_maps_url);
          }
          else
              console.log("- Failed to load Google Maps -");
        }
        // MULTI-LANGUAGE
        multi_language = getPostMetaValueById($scope.data.options, "multi_language") !== undefined ? getPostMetaValueById($scope.data.options, "multi_language").value : 'NO';
        available_languages = getPostMetaValueById($scope.data.options, "available_languages") !== undefined ? getPostMetaValueById($scope.data.options, "available_languages").value : false;
        available_languages = JSON.parse(available_languages);

        if (!isRefreshLanguage) {
            language = getPostMetaValueById($scope.data.options, "default_language") !== undefined ? getPostMetaValueById($scope.data.options, "default_language").value : 'english';
        }
        isRefreshLanguage = false;

        custom_feedback_message = getPostMetaValueById($scope.data.options, "custom_feedback_message") !== undefined ? getPostMetaValueById($scope.data.options, "custom_feedback_message").value : false;

        manual_payment_method_list = getPostMetaValueById($scope.data.options, "manual_payment_method_list") !== undefined ? getPostMetaValueById($scope.data.options, "manual_payment_method_list").value : false;

        manual_payment_instruction = getPostMetaValueById($scope.data.options, "manual_payment_instruction") !== undefined ? getPostMetaValueById($scope.data.options, "manual_payment_instruction").value : '1. Please transfer the required amount from an ATM or mobile banking to one of the accounts below.  <br/><br/>2. Tap "Take Photo" to take the picture of receipt with your phone camera, or "Choose Photo" to take the picture from gallery.<br/><br/>  3. The picture will be uploaded, the our admin will process your transaction*.<br/><br/><br/>    * Please note that invalid transaction receipt will be ignored.';

        how_to_contribute_instruction = getPostMetaValueById($scope.data.options, "how_to_contribute_instruction") !== undefined ? getPostMetaValueById($scope.data.options, "how_to_contribute_instruction").value : "";

        shopping_tnc = getPostMetaValueById($scope.data.options, "shopping_tnc") !== undefined ? getPostMetaValueById($scope.data.options, "shopping_tnc").value : 'Terms and condition dalam transaksi penjualan utk Compro<br/><br/>1. Kebijakan utk customer jika barang yang diterima tidak sesuai dg permintaan yg telah disepakati antara pihak penjual (Compro) dan customer. Kami selaku pihak penjual akan menjamin jika barang yg diterima oleh customer tidak sesuai dengan kriteria dan ksepakatan maka kami siap untuk mengganti barang tersebut 100% sesuai dg kriteria yg disepakati dalam proses jual beli barang dg syarat Batas waktu utk complain barang adalah maks 7 hari setelah barang diterima oleh customer. <br/><br/>2. Kebijakan utk customer jika barang tidak terkirim atau customer tidak menerima barang yang dipesan maka Kami selaku pihak penjual akan mengirim ulang kembali barang tsb dan menjamin 100%  barang dapat diterima oleh customer. Pihak customer diwajibkan utk mengisi alamat pengiriman dengan lengkap dan jelas. Batas waktu utk complain barang tdk sampai adalah maks 12 hari setelah customer melakukan pembayaran';

        tax_enabled = getPostMetaValueById($scope.data.options, "tax_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "tax_enabled").value : "NO";

        custom_tax_fields = getPostMetaValueById($scope.data.options, "custom_tax_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_tax_fields").value : false;

        register_enabled = getPostMetaValueById($scope.data.options, "register_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "register_enabled").value === 'YES' : true;

        hotline_chat_enabled = getPostMetaValueById($scope.data.options, "hotline_chat_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "hotline_chat_enabled").value === 'YES' : false;

        form_request_history = getPostMetaValueById($scope.data.options, "form_request_history") !== undefined ? getPostMetaValueById($scope.data.options, "form_request_history").value === 'YES' : false;

        verify_user_register_enabled = getPostMetaValueById($scope.data.options, "verify_user_register_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "verify_user_register_enabled").value === 'YES' : false;

      // Compro Products Options
        cp_mode = getPostMetaValueById($scope.data.options, "cp_mode") !== undefined ? getPostMetaValueById($scope.data.options, "cp_mode").value : "NO";
        cp_credit_notice_redirect_link = getPostMetaValueById($scope.data.options, "cp_credit_notice_redirect_link") !== undefined ? getPostMetaValueById($scope.data.options, "cp_credit_notice_redirect_link").value : "#"
        cp_total_rounding = parseInt(getPostMetaValueById($scope.data.options, "cp_total_rounding") !== undefined ? getPostMetaValueById($scope.data.options, "cp_total_rounding").value : cp_total_rounding);

        /* SELECT LANGUAGE, FIRST-TIME ONLY */
        // console.log("******* USERNAME LOGIN ********");
        // console.log(username_login);
        // console.log("*******************************");
        if (login_required == false || (login_required == true && username_login != ''))
            $scope.selectLanguage();

        // load UI Texts
        $scope.loadUITexts($scope);

        // load UI text: default menu titles
        $scope.loadDefaultMenuTitles();

        // load UI text: membership
        $scope.loadUITextMembership();

        // replace language
        replaceLanguageMenuList(true);

        $scope.checkVersion();

        //check if maintenance
        if (maintenance_enabled == 'YES') {
            $state.go('maintenance');
        }

        $scope.shopping_enabled = shopping_enabled;
        $scope.menu_text_cart = menu_text_cart;

        $scope.text_login_menu = login_required && login_enabled.value === 'YES' ? $scope.menu_text_user : login_menu;

        if (login_enabled.value === 'YES') {
            if (login_required) {
                login_menu = menu_text_user;
            }
            menuLogin = {
                id: -1, //'login',
                content_type_id: '1',
                icon_code: 'icon ion-log-in',
                term_template: { name: 'login' },
                title: $scope.text_login_menu,
                no: 1003
            };

            if (!$scope.isLoggedIn && member_card_enabled) {
                main_menu.unshift(menuLogin);
            }
            else {
                main_menu.push(menuLogin);
            }

            //$scope.main_menu_post.push(Object);
        }

        if(user != ''){
            console.log("login");
            if(reservation_admin.length > 0){
                var all_admin = JSON.parse(reservation_admin);
                if(user.company_user_group_id != null){
                    var company_user_group_id = user.company_user_group_id.toString();
                    if(all_admin.includes(company_user_group_id)){
                        console.log("admin");
                        $rootScope.admin_login = 'YES';
                    }
                }
            }
        }
        else{
            console.log("tidak login");
            $rootScope.admin_login = 'NO';
        }

        if (showNotificationListMenu == true) {
            menuNotificationList = {
                id: company_id, //'shopping_cart',
                content_type_id: '1',
                icon_code: 'icon ion-android-notifications',
                term_template: { name: 'notif-list' },
                title: $scope.menu_text_notif,
                no: 10000
            };
            main_menu.push(menuNotificationList);
        }
        menuSearch = {
            id: -4, //'search',
            content_type_id: '1',
            icon_code: 'icon ion-search',
            term_template: { name: 'search' },
            title: $scope.menu_text_search,
            no: 1004
        };
        main_menu.push(menuSearch);

        menuShare = {
            id: -5,
            icon_code: 'icon ion-android-share-alt',
            title: menu_text_share,
            no: 1005
        };
        main_menu.push(menuShare);

        menuSettings = {
            id: -6,
            icon_code: 'icon ion-gear-a',
            title: menu_text_settings,
            no: 1006
        };
        main_menu.push(menuSettings);

        //console.log(main_menu);

        //        var InAppPurchase = {
        //            id: -6,
        //            content_type_id: '1',
        //            icon_code: 'icon ion-social-android',
        //            term_template: {name: 'purchase'},
        //            title: 'In App Purchase',
        //            no: 1006
        //        };
        //
        //        if (inAppPurchaseEnabled) {
        //            main_menu.push(InAppPurchase);
        //        }

        var Game001Settings = {
            id: -7,
            content_type_id: '1',
            icon_code: 'icon ion-ios-game-controller-b',
            term_template: { name: 'games-001-setting' },
            title: 'Game 1 Settings',
            no: 1006
        };
        if (game001Enabled) {
            main_menu.push(Game001Settings);
        }

        $scope.main_menu = null;
        $scope.main_menu_post = $scope.data;
        $scope.main_menu = main_menu;
        $scope.login_enabled = login_enabled.value;
        $scope.login_required = login_required.value;
        $scope.shopping_enabled = shopping_enabled;
        $scope.booking_enabled = booking_enabled;
        $scope.menu_type = menu_type;
        $scope.menu_template = menu_template;
        $scope.tab_type = tab_type;
        $scope.membership_enabled = membership_features_enabled == 'YES';
        $scope.rajaongkir_enabled = rajaongkir_enabled;
        $scope.shipper_enabled = shipper_enabled;
        $scope.shipper_intl_enabled = shipper_intl_enabled;
        $scope.custom_delivery_enabled = custom_delivery_enabled;
        $scope.sicepat_enabled = sicepat_enabled;
        $scope.go_send_enabled = go_send_enabled;
        $scope.gosend_origin_lat = gosend_origin_lat;
        $scope.gosend_origin_lng = gosend_origin_lng;
        $scope.gosend_display_city = gosend_display_city;
        $scope.pos_malaysia_enabled = pos_malaysia_enabled;
        $scope.hotline_chat_enabled = hotline_chat_enabled;
        $scope.form_request_history = form_request_history;
        $scope.opsigo_enabled = opsigo_enabled;
        $scope.promocode_enabled = promocode_enabled;
        $scope.wishlist_enabled = wishlist_enabled;
        $scope.opsigo_list = opsigo_list;
        $scope.reservation_admin = reservation_admin;
        $scope.reservation_enabled = reservation_enabled;
        $scope.loyalty_integration_active = loyalty_integration_active;
        $scope.loyalty_app_integration_apps_loyalty = loyalty_app_integration_apps_loyalty;
        $scope.loyalty_link_play_store = loyalty_link_play_store;
        $scope.loyalty_link_app_store = loyalty_link_app_store;
        $scope.loyalty_merchant_code = loyalty_merchant_code;
        $scope.loyalty_domain = loyalty_domain;
        $scope.loyalty_app_integration = loyalty_app_integration;
        $rootScope.totalVoucher = 0;
        $rootScope.voucher_id = 0;
        $rootScope.voucher_price = 0;
        $rootScope.voucher_code = "";
        $scope.currency = currency + ' ';

        // $scope.$apply();

        // SAVE menu data to SQLite
        if (isPhoneGap()) {
            saveTermJSONToDB(-1, 'AppCtrl', $scope.data);
        }
        $scope.isloading = false;

        if (isDeviceLogin == true) {
            var url = company_user_device_url + '?user_id=' + encodeURIComponent(user_id) + '&company_id=' + encodeURIComponent(company_id);
            httpService.get($scope, $http, url, 'device_id', '');
        }

        if (is_membership_enabled == 'YES') {
            var url = company_user_expiration_url + '?user_id=' + encodeURIComponent(user_id) + '&company_id=' + encodeURIComponent(company_id);
            httpService.get($scope, $http, url, 'user_expiration', '');
        }

        // if entry point is from push notification
        if ($scope.flagPushLocalNotif) {
            window.location.href = urlPushLocalNotif;
            $scope.hideLoading();
            $scope.flagPushLocalNotif = false;
        }

        /* TO-DO: IF CP-MODE is ON, on login successful, direct to products. */
        $scope.showAppInitPopup();
        $scope.loadMenuSuccess = true;
    };

    // refresh menu on login & logout (user group)
    $rootScope.$on('httpService:refreshMenu', function () {

        var url = '';
        console.log("rootScope.user_id: " + $rootScope.user_id);
        if ($rootScope.user_id != undefined && $rootScope.user_id != '')
            url = menu_url + '/' + user_id;
        else
            url = menu_url;

        $scope.user_meta = user_meta;
        $scope.username_login = username_login;
        httpService.get($scope, $http, url, 'menu');
    });

    // refresh menu on studio.
    $rootScope.$on('httpService:refreshMenuSuccess', function () {
        console.log("Refresh Menu Success!!");
        $scope.getMenuSuccess();
    });

    $scope.$on('httpService:getMenuSuccess', $scope.getMenuSuccess);

    // if get menu data error, request token again
    $scope.$on('httpService:getMenuError', function () {
        if ($scope.status === 0 || $scope.status == '' || $scope.status == '-1') {
            console.log('NO INTERNET CONNECTION');
            if (isPhoneGap()) {
                loadTermJSONFromDB(-1, $scope);
            }
        }
        else {
            var url = menu_url + "/" + user_id;
            var obj = serializeData({ email: username, password: password, company_id: company_id });
            httpService.get($scope, $http, url, 'menu');
        }
        // httpService.post_token($scope, $http, url, obj, 'menu');


    });

    var doCustomBack = function () {
        console.log("*** Back App Controller ***");
        switch (app_type) {
            case 'affiliate':
            case 'app':
                if (($ionicHistory.backView() === null || $ionicHistory.backView() === undefined) && $ionicHistory.currentStateName() !== ("app." + home_template)) {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearHistory();
                    $state.go('app.' + home_template, { id: home_id });
                    $ionicHistory.clearHistory();

                }
                else if ($ionicHistory.currentStateName() === ("app." + home_template)) {
                    $scope.showExitConfirmation = function () {
                        var confirmPopup = $ionicPopup.confirm({
                            title: $scope.alert_title_exit_app,
                            css: 'cp-button',
                            template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_content_exit_app + "</div>",
                            okType: 'cp-button',
                            okText: $scope.alert_button_ok,
                            cancelText: $scope.alert_button_cancel
                        });

                        //confirmation dialog
                        confirmPopup.then(function (res) {
                            if (res) {
                                ionic.Platform.exitApp();
                            }
                        });
                    };

                    $scope.showExitConfirmation();
                }
                else {
                    $ionicHistory.goBack();
                }
                break;
            case 'studio':
                if (($ionicHistory.backView() === null || $ionicHistory.backView() === undefined) && $ionicHistory.currentStateName() !== ("app." + home_template)) {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearHistory();
                    $state.go('app.' + home_template, { id: home_id });
                    $ionicHistory.clearHistory();
                }
                else if ($ionicHistory.currentStateName() === ("app." + home_template)) {
                    $ionicHistory.clearHistory();
                    $scope.showExitConfirmation = function () {
                        var confirmPopup = $ionicPopup.confirm({
                            title: $scope.alert_exit_preview_title,
                            css: 'cp-button',
                            template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_exit_preview_content + "</div>",
                            okType: 'cp-button'
                        });

                        //confirmation dialog
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.backToAppList();
                            }
                        });
                    };

                    $scope.showExitConfirmation();
                }
                else
                    $ionicHistory.goBack();
                break;
        }
        //console.log($ionicHistory.backView());
    };

    // override back button
    doregisterHardBack = $ionicPlatform.registerBackButtonAction(doCustomBack, 101);

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

    $scope.$on('SQLite:getOfflineMenuSuccess', function () {
        //console.log($scope.data);
        main_menu = $scope.data.terms;
        console.log("GET MENU SUCCESS");
        //console.log(main_menu);

        var login_enabled = getPostMetaValueById($scope.data.options, "login_enabled");
        isLoginEnabled = login_enabled !== undefined ? (login_enabled.value == 'YES' ? true : false) : false;

        member_card_enabled = getPostMetaValueById($scope.data.options, "member_card_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "member_card_enabled").value == 'YES' ? true : false) : false;
        member_card_fields = getPostMetaValueById($scope.data.options, "member_card_fields") !== undefined ? getPostMetaValueById($scope.data.options, "member_card_fields").value : false;

        register_phone_required = getPostMetaValueById($scope.data.options, "register_phone_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_phone_required").value : 'NO';
        register_address_required = getPostMetaValueById($scope.data.options, "register_address_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_address_required").value : 'NO';
        register_message_required = getPostMetaValueById($scope.data.options, "register_message_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_message_required").value : 'NO';

        audioDownloadEnabled = getPostMetaValueById($scope.data.options, "audio_download_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "audio_download_enabled").value == 'YES' ? true : false) : false;

        canAttendEvent = getPostMetaValueById($scope.data.options, "can_attend_event") !== undefined ? (getPostMetaValueById($scope.data.options, "can_attend_event").value == 'YES' ? true : false) : false;

        home_share_apps = getPostMetaValueById($scope.data.options, "home_share_apps") !== undefined ? (getPostMetaValueById($scope.data.options, "home_share_apps").value == 'YES' ? true : false) : false;
        home_category_text = getPostMetaValueById($scope.data.options, "home_category_text") !== undefined ? (getPostMetaValueById($scope.data.options, "home_category_text").value === 'YES') : true;

        isDeviceLogin = getPostMetaValueById($scope.data.options, "is_device_login") !== undefined ? (getPostMetaValueById($scope.data.options, "is_device_login").value == 'YES' ? true : false) : false;

        shopping_enabled = getPostMetaValueById($scope.data.options, "shopping_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "shopping_enabled").value == 'YES' ? true : false) : false;

        currency = getPostMetaValueById($scope.data.options, "price_currency") !== undefined ? getPostMetaValueById($scope.data.options, "price_currency").value : 'Rp';

        stock_status_visible = getPostMetaValueById($scope.data.options, "stock_status_visible") !== undefined ? getPostMetaValueById($scope.data.options, "stock_status_visible").value : 'NO';

        booking_enabled = getPostMetaValueById($scope.data.options, "booking_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "booking_enabled").value == 'YES' ? true : false) : false;

        playstore_link = getPostMetaValueById($scope.data.options, "link_playstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_playstore").value : '';

        appstore_link = getPostMetaValueById($scope.data.options, "link_appstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_appstore").value : '';

        inAppPurchaseEnabled = getPostMetaValueById($scope.data.options, "in_app_purchase_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "in_app_purchase_enabled").value == 'YES' ? true : false) : false;

        is_membership_enabled = getPostMetaValueById($scope.data.options, "is_membership_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "is_membership_enabled").value : 'NO';

        membership_product_data_android = getPostMetaValueById($scope.data.options, "membership_product_data_android");
        membership_product_data_android = JSON.parse(membership_product_data_android !== undefined ? membership_product_data_android.value : "[]");

        custom_register_fields = getPostMetaValueById($scope.data.options, "custom_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_register_fields").value : false;
        default_register_fields = getPostMetaValueById($scope.data.options, "default_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "default_register_fields").value : false;

        custom_form_fields = getPostMetaValueById($scope.data.options, "custom_form_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_form_fields").value : false;

        custom_transaction_fields = getPostMetaValueById($scope.data.options, "custom_transaction_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_transaction_fields").value : false;
        default_transaction_fields = getPostMetaValueById($scope.data.options, "default_transaction_fields") !== undefined ? getPostMetaValueById($scope.data.options, "default_transaction_fields").value : false;

        payment_type = getPostMetaValueById($scope.data.options, "payment_type") !== undefined ? getPostMetaValueById($scope.data.options, "payment_type").value : payment_type;
        payment_channel = getPostMetaValueById($scope.data.options, "payment_channel") !== undefined ? getPostMetaValueById($scope.data.options, "payment_channel").value : payment_channel;

        vt_payment_service = getPostMetaValueById($scope.data.options, "vt_payment_service") !== undefined ? getPostMetaValueById($scope.data.options, "vt_payment_service").value : 'NO';
        $rootScope.manual_payment = vt_payment_service == 'YES' ? false : true;

        rajaongkir_enabled = getPostMetaValueById($scope.data.options, "rajaongkir_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_enabled").value : 'NO';
        pickup_enabled = getPostMetaValueById($scope.data.options, "pickup_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "pickup_enabled").value : 'NO';
        no_delivery_enabled = getPostMetaValueById($scope.data.options, "no_delivery_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "no_delivery_enabled").value : 'YES';
        sicepat_enabled = getPostMetaValueById($scope.data.options, "sicepat_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "sicepat_enabled").value : 'NO';
        shipper_enabled = getPostMetaValueById($scope.data.options, "shipper_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_enabled").value : 'NO';
        shipper_intl_enabled = getPostMetaValueById($scope.data.options, "shipper_intl_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_intl_enabled").value : 'NO';
        go_send_enabled = getPostMetaValueById($scope.data.options, "go_send_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "go_send_enabled").value : 'NO';
        gosend_origin_lat = getPostMetaValueById($scope.data.options, "gosend_origin_lat") !== undefined ? getPostMetaValueById($scope.data.options, "gosend_origin_lat").value : -6.229557;
        gosend_origin_lng = getPostMetaValueById($scope.data.options, "gosend_origin_lng") !== undefined ? getPostMetaValueById($scope.data.options, "gosend_origin_lng").value : 106.825374;
        gosend_display_city = getPostMetaValueById($scope.data.options, "gosend_display_city") !== undefined ? getPostMetaValueById($scope.data.options, "gosend_display_city").value : "";

        rajaongkir_sender_city_id = getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id").value : '152';
        sicepat_origin = getPostMetaValueById($scope.data.options, "sicepat_origin") !== undefined ? getPostMetaValueById($scope.data.options, "sicepat_origin").value : 'CGK';
        shipper_origin = getPostMetaValueById($scope.data.options, "shipper_origin") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_origin").value : '4773';

        rajaongkir_selected_services = getPostMetaValueById($scope.data.options, "rajaongkir_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_selected_services").value : '';
        shipper_selected_services = getPostMetaValueById($scope.data.options, "shipper_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_selected_services").value : '';

        maintenance_enabled = getPostMetaValueById($scope.data.options, "maintenance_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "maintenance_enabled").value : 'NO';
        // Loyalty Integration
        loyalty_integration_active = getPostMetaValueById($scope.data.options,'loyalty_integration_active') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_integration_active").value : 'NO';
        loyalty_merchant_code = getPostMetaValueById($scope.data.options,'loyalty_merchant_code') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_merchant_code").value : '';
        loyalty_domain = getPostMetaValueById($scope.data.options,'loyalty_domain') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_domain").value : '';
        loyalty_app_integration = getPostMetaValueById($scope.data.options,'loyalty_app_integration') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_app_integration").value : '';
        loyalty_app_integration_apps_loyalty = getPostMetaValueById($scope.data.options,'loyalty_app_integration_apps_loyalty') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_app_integration_apps_loyalty").value : '';
        loyalty_link_play_store = getPostMetaValueById($scope.data.options,'loyalty_link_play_store') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_link_play_store").value : '';
        loyalty_link_app_store = getPostMetaValueById($scope.data.options,'loyalty_link_app_store') !== undefined ? getPostMetaValueById($scope.data.options, "loyalty_link_app_store").value : '';

        $rootScope.jne_service = getPostMetaValueById($scope.data.options, "jne_service") !== undefined ? getPostMetaValueById($scope.data.options, "jne_service").value : 'NO';

        sku_enabled = getPostMetaValueById($scope.data.options, "sku_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "sku_enabled").value : 'NO';

        opsigo_integration_enabled = getPostMetaValueById($scope.data.options,'opsigo_integration_enabled') !== undefined ? getPostMetaValueById($scope.data.options, "opsigo_integration_enabled").value : 'NO';

        limit_per_customer_enabled = getPostMetaValueById($scope.data.options, "limit_per_customer_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "limit_per_customer_enabled").value : 'NO';

        hotline_chat_enabled = getPostMetaValueById($scope.data.options, "hotline_chat_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "hotline_chat_enabled").value == 'YES') : false;

        default_menu_titles = getPostMetaValueById($scope.data.options, "default_menu_titles") !== undefined ? getPostMetaValueById($scope.data.options, "default_menu_titles").value : false;
        default_menu_titles = JSON.parse(default_menu_titles);

        // MULTI-LANGUAGE
        multi_language = getPostMetaValueById($scope.data.options, "multi_language") !== undefined ? getPostMetaValueById($scope.data.options, "multi_language").value : 'NO';
        available_languages = getPostMetaValueById($scope.data.options, "available_languages") !== undefined ? getPostMetaValueById($scope.data.options, "available_languages").value : false;
        available_languages = JSON.parse(available_languages);

        custom_feedback_message = getPostMetaValueById($scope.data.options, "custom_feedback_message") !== undefined ? getPostMetaValueById($scope.data.options, "custom_feedback_message").value : false;

        manual_payment_method_list = getPostMetaValueById($scope.data.options, "manual_payment_method_list") !== undefined ? getPostMetaValueById($scope.data.options, "manual_payment_method_list").value : false;

        manual_payment_instruction = getPostMetaValueById($scope.data.options, "manual_payment_instruction") !== undefined ? getPostMetaValueById($scope.data.options, "manual_payment_instruction").value : '1. Please transfer the required amount from an ATM or mobile banking to one of the accounts below.  <br/><br/>2. Tap "Take Photo" to take the picture of receipt with your phone camera, or "Choose Photo" to take the picture from gallery.<br/><br/>  3. The picture will be uploaded, the our admin will process your transaction*.<br/><br/><br/>    * Please note that invalid transaction receipt will be ignored.';

        how_to_contribute_instruction = getPostMetaValueById($scope.data.options, "how_to_contribute_instruction") !== undefined ? getPostMetaValueById($scope.data.options, "how_to_contribute_instruction").value : "";
        
        shopping_tnc = getPostMetaValueById($scope.data.options, "shopping_tnc") !== undefined ? getPostMetaValueById($scope.data.options, "shopping_tnc").value : "Terms and condition dalam transaksi penjualan utk Compro<br/><br/>1. Kebijakan utk customer jika barang yang diterima tidak sesuai dg permintaan yg telah disepakati antara pihak penjual (Compro) dan customer. Kami selaku pihak penjual akan menjamin jika barang yg diterima oleh customer tidak sesuai dengan kriteria dan ksepakatan maka kami siap untuk mengganti barang tersebut 100% sesuai dg kriteria yg disepakati dalam proses jual beli barang dg syarat Batas waktu utk complain barang adalah maks 7 hari setelah barang diterima oleh customer. <br/><br/>2. Kebijakan utk customer jika barang tidak terkirim atau customer tidak menerima barang yang dipesan maka Kami selaku pihak penjual akan mengirim ulang kembali barang tsb dan menjamin 100%  barang dapat diterima oleh customer. Pihak customer diwajibkan utk mengisi alamat pengiriman dengan lengkap dan jelas. Batas waktu utk complain barang tdk sampai adalah maks 12 hari setelah customer melakukan pembayaran";

        tax_enabled = getPostMetaValueById($scope.data.options, "tax_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "tax_enabled").value : "NO";

        custom_tax_fields = getPostMetaValueById($scope.data.options, "custom_tax_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_tax_fields").value : false;

        form_request_history = getPostMetaValueById($scope.data.options, "form_request_history") !== undefined ? getPostMetaValueById($scope.data.options, "form_request_history").value === 'YES' : false;

        opsigo_enabled = getPostMetaValueById($scope.data.options, "opsigo_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "opsigo_enabled").value === 'YES' : false;
        promocode_enabled = getPostMetaValueById($scope.data.options, "promocode_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "promocode_enabled").value : 'NO';
        opsigo_list = getPostMetaValueById($scope.data.options, "opsigo_list") !== undefined ? getPostMetaValueById($scope.data.options, "opsigo_list").value : [];
        reservation_admin = getPostMetaValueById($scope.data.options, "reservation_admin") !== undefined ? getPostMetaValueById($scope.data.options, "reservation_admin").value : [];
        reservation_enabled = getPostMetaValueById($scope.data.options, "reservation_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "reservation_enabled").value : 'NO';
        wishlist_enabled = getPostMetaValueById($scope.data.options, "wishlist_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "wishlist_enabled").value : 'NO';

        $scope.main_menu_post = $scope.data;
        //console.log($scope.main_menu_post);
        $scope.main_menu = main_menu;
        $scope.login_enabled = login_enabled.value;
        $scope.login_required = login_required.value;
        $scope.shopping_enabled = shopping_enabled.value;
        $scope.menu_type = menu_type;
        $scope.menu_template = menu_template;
        $scope.tab_type = tab_type;
        $scope.isloading = false;
        $scope.rajaongkir_enabled = rajaongkir_enabled;
        $scope.shipper_enabled = shipper_enabled;
        $scope.shipper_intl_enabled = shipper_intl_enabled;
        $scope.sicepat_enabled = sicepat_enabled;
        $scope.go_send_enabled = go_send_enabled;
        $scope.gosend_origin_lat = gosend_origin_lat;
        $scope.gosend_origin_lng = gosend_origin_lng;
        $scope.gosend_display_city = gosend_display_city;
        $scope.pos_malaysia_enabled = pos_malaysia_enabled;
        $scope.hotline_chat_enabled = hotline_chat_enabled;
        $scope.form_request_history = form_request_history;
        $scope.opsigo_enabled = opsigo_enabled;
        $scope.promocode_enabled = promocode_enabled;
        $scope.wishlist_enabled = wishlist_enabled;
        $scope.opsigo_list = opsigo_list;
        $scope.reservation_admin = reservation_admin;
        $scope.reservation_enabled = reservation_enabled;
        $scope.loyalty_integration_active = loyalty_integration_active;
        $scope.loyalty_app_integration_apps_loyalty = loyalty_app_integration_apps_loyalty;
        $scope.loyalty_link_play_store = loyalty_link_play_store;
        $scope.loyalty_link_app_store = loyalty_link_app_store;
        $scope.loyalty_merchant_code = loyalty_merchant_code;
        $scope.loyalty_app_integration = loyalty_app_integration;
        $scope.loyalty_domain = loyalty_domain;
        $rootScope.totalVoucher = 0;
        $rootScope.voucher_id = 0;
        $rootScope.voucher_price = 0;
        $rootScope.voucher_code = "";
        $scope.loadUITexts($scope);
        $scope.loadDefaultMenuTitles();
        $scope.loadUITextGeneral();
        $scope.loadUITextMembership();
    });

    // Create the menu modal that we will use later
    $ionicModal.fromTemplateUrl('templates/tabs-more-modal-1.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        //success
    }, {
            //error
        });

    // Triggered in the menu modal to close it
    $scope.closeMenu = function () {
        $scope.modal.hide();
    };

    // Open the menu modal
    $scope.openMenu = function () {
        $scope.modal.show();
    };

    $scope.openDrawer = function (modalTemplateURL) {
        // Create the menu modal that we will use later
        if ($scope.modal == undefined) {
            $ionicModal.fromTemplateUrl(modalTemplateURL, {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                //success
                $scope.openMenu();
            }, {
                    //error
                });
        }
        else if (modalTemplateURL !== "")
            $ionicModal.fromTemplateUrl(modalTemplateURL, {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                //success
                $scope.openMenu();
            }, {
                    //error
                });
        else
            $scope.openMenu();
    };

    $scope.setActiveMenu = function ($index) {
        $scope.selected_menu = $index;
    };

    $scope.$on('httpService:postTokenPushNotifSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        // upload registration_id, device_id, dan company_id to server.
        console.log('Register data to server...');
        var url = base_url + register_push_notif_url;
        var device_type = isIOS() ? 'ios' : 'android';
        var objPushNotif = serializeData({
            registration_id: registration_id,
            device_id: device_id,
            device_type: device_type,
            company_id: company_id,
            token: token
        });
        $scope.registerPushResult = httpService.post($scope, $http, url, objPushNotif, 'push_notif');
        //console.log($scope.registerPushResult);
    });

    $scope.$on('httpService:postTokenPushNotifError', function () {
        if ($scope.status === 0) {
            console.log('NO INTERNET CONNECTION');
        }
        else {
            var url = token_url;
            var obj = serializeData({ email: username, password: password, company_id: company_id });
            httpService.post_token($scope, $http, url, obj, 'push_notif');
        }
    });

    $scope.$on('httpService:postRegisterPushNotifSuccess', function () {
        console.log('Register Push Notif SUCCESS!');
    });

    $scope.$on('httpService:postRegisterPushNotifError', function () {
        console.log('Register Push Notif ERROR!');
    });

    $scope.socialShare = function () {
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, "Download the app at:", null, null, playstore_link, null);
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, 'Download the app at:', null, null, appstore_link, null);
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $rootScope.$on("$cordovaLocalNotification:click", function (notification, state) {
        var data = JSON.parse(state.data);
        //console.log('test pencet notif');
        //console.log(data.additionalData.target);
        window.location.href = "#/app/" + data.target;
    });

    $scope.login_menu = login_menu;


    // Triggered in the menu modal to close it
    $scope.closeZoombleImageModal = function () {
        $scope.ZoombleImageModal.hide();
    };

    // Open the menu modal
    $scope.openZoombleImageModal = function () {
        $scope.ZoombleImageModal.show();
    };

    $scope.openZoombleImage = function (modalTemplateURL) {
        // Create the menu modal that we will use later
        if ($scope.ZoombleImageModal == undefined) {
            $ionicModal.fromTemplateUrl(modalTemplateURL, {
                scope: $scope
            }).then(function (modal) {
                $scope.ZoombleImageModal = modal;
                //success
                $scope.openZoombleImageModal();
            }, {
                    //error
                });
        }
        else if (modalTemplateURL !== "")
            $ionicModal.fromTemplateUrl(modalTemplateURL, {
                scope: $scope
            }).then(function (modal) {
                $scope.ZoombleImageModal = modal;
                //success
                $scope.openZoombleImageModal();
            }, {
                    //error
                });
        else
            $scope.openZoombleImageModal();
    };

    $scope.showLoginToCommentAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_comment_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_comment_prompt_login_content + '</div>',
            buttons: [
                {
                    text: $scope.alert_button_ok
                },
                {
                    text: $scope.text_comment_btn_login,
                    type: 'cp-button',
                    onTap: function (e) {
                        $rootScope.login_redirect_location = '#' + $ionicHistory.currentView().url;
                        window.location.href = "#/app/login/-1";
                    }
                }
            ]
        });
    };

    $scope.splitString = function (input, splitLength) {
        i = 0;
        var arr = [];
        for (var a = 0; a < input.length; a += splitLength) {
            arr[i++] = input.substring(a, a + splitLength);
        }

        var res = '';
        for (var a = 0; a < arr.length - 1; a++) {
            res += arr[a] + " ";
        }
        res += arr[arr.length - 1];

        return res;
    };

    // show confirmation modal for external link
    document.onclick = function (e) {
        e = e || window.event;
        var element = e.target || e.srcElement;
        if (element.tagName == 'A' && element.classList.contains('external-link')) {
            //window.open(element.href, "_blank", "location=yes");
            showExternalLinkConfirmation($cordovaClipboard, $cordovaToast, $ionicPopup, element.href);
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

    var doStudioBack = function () {
        //        console.log("*** Back Studio Controller ***");
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.clearHistory();
        $scope.showExitConfirmation = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: $scope.alert_title_exit_app,
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_content_exit_app + "</div>",
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                cancelText: $scope.alert_button_cancel
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

    $scope.backToAppList = function () {
        $ionicHistory.clearHistory();
        st_preview_app = false;
        doregisterHardBack = $ionicPlatform.registerBackButtonAction(doStudioBack, 101);
        $state.go('studio.app-list');
        //        window.location.href = '#/studio/studio-app-list';
    }

    $rootScope.customSocialShare = function (title, summary) {
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, summary, title, null, playstore_link, 'Read more at');
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, summary, title, null, appstore_link, 'Read more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log(summary);
            console.log(title);
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $scope.$watch(function () {
        return $ionicSideMenuDelegate.getOpenRatio();
    },
        function (ratio) {
            if (ratio === 1) {
                $scope.reloadMemberPoints();
            }
        });

    $scope.reloadMemberPoints = function () {
        if (membership_features_enabled === 'YES' && $scope.isLoggedIn) {
            $scope.isLoadingPoints = true;
            $scope.isPointsTryAgain = false;

            var url = token_url;
            var obj = serializeData({ email: username, password: password, company_id: company_id });
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'membership-reload-points');
        }
    };

    $scope.$on('httpService:postTokenReloadMemberPointsSuccess', function () {
        var token = $scope.data.token;
        var obj = serializeData({ _method: 'POST', user_id: user_id });

        httpService.post($scope, $http, url_membership_reload_points + company_id + '?token=' + token, obj, 'membership-reload-points');
    });

    $scope.$on('httpService:postTokenReloadMemberPointsError', function () {
        // show try again.
        $scope.isLoadingPoints = false;
        $scope.isPointsTryAgain = true;
    });

    $scope.$on('httpService:postReloadMemberPointsSuccess', function () {
        $scope.isLoadingPoints = false;
        var pts = $scope.data.points;
        if ($scope.data.success) {
            user_meta['approved_points'] = pts.approved_points;
            user_meta['lifetime_points'] = pts.lifetime_points;
            if($scope.loyalty_integration_active == 'YES') {
                user_meta['loyalty_balance'] = pts.loyalty_balance;
                user_meta['loyalty_reward'] = pts.loyalty_reward;
                user_meta['loyalty_connect'] = pts.loyalty_connect;
            }

            $scope.user_meta = user_meta;
        }
        else if (!$scope.data.success) {
            $scope.isPointsTryAgain = true;
        }
    });

    $scope.$on('httpService:postReloadMemberPointsError', function () {
        $scope.isLoadingPoints = false;
        $scope.isPointsTryAgain = true;
    });

    $scope.showLoading = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hideLoading = function () {
        $ionicLoading.hide();
    };

    // do pop-up in certain conditions
    $scope.showAppInitPopup = function () {
        if (cp_mode === 'YES' && user_meta.cp_compro_member === 'YES') {
            if ($rootScope.lastRedirectLocation.indexOf('shopping-cart') === -1) {
                $scope.showCPPopup();
            }
        }
        $rootScope.lastRedirectLocation = '';
    };

    // currently on CAI only, but can be used on other apps if necessary.
    $scope.showCPPopup = function () {
        console.log(user_meta);

        var cpFirstPurchase = user_meta.cp_first_purchase;
        var cpCreditStatus = user_meta.cp_credit_status;
        var cpCredit = user_meta.cp_credit;
        var cpCreditExpiryDate = user_meta.cp_credit_expiry_date;

        var timeOffset = cpCreditExpiryDate.getTimezoneOffset() * 60000;

        var currentDate = Date.now();
        var expiryDate = Date.parse(cpCreditExpiryDate) - timeOffset; // perlu di-offset karena tanggalnya dianggap +7 atau locale lain dari sananya.
        var outputDate = getSimpleDateFormatted(new Date(expiryDate));

        var timeToExpire = (expiryDate - currentDate) / 1000;

        if (cpFirstPurchase === 'TRUE' && cpCredit > 0 && cpCreditStatus === 'ACTIVE' && timeToExpire > 0) {
            //                var expireDays = parseInt((timeToExpire / 86400) % 86400);
            //                var expireHours = parseInt((timeToExpire / 3600) % 3600) - (expireDays * 24);
            var titlePopupCreditExpire = "<b>NOTICE</b>";
            var msgPopupCreditExpire = "Please claim your items before <br><span style='font-weight:bold;'>" + outputDate + "!</span>";
            var txtPopupConfirmCreditExpire = 'Claim';

            /* show expire notification here... */
            $scope.alertExpire = function () {
                var confirmPopup = $ionicPopup.alert({
                    title: titlePopupCreditExpire,
                    css: 'cp-button',
                    template: "<div style='text-align:center;justify-content:center;align-items:center;'>" + msgPopupCreditExpire + "</div>",
                    okType: 'cp-button',
                    okText: $scope.alert_button_ok,
                    buttons: [{
                        text: txtPopupConfirmCreditExpire,
                        type: 'cp-button',
                        onTap: function (e) {
                            window.location.href = "#/app/" + cp_credit_notice_redirect_link;
                        }
                    }]
                });
            };
            registerPopup($scope.alertExpire); // app-functions.js
            showNextPopup();
        }
    };

    $scope.showSupportChat = function () {
        console.log('masuk');
        var userInfo =
        {
            "name": username_login,
            "email": email,
            "externalId": user_id
            // "countryCode" : "+62",
            // "phoneNumber" : "1234234123"
        };

        // var member_type_description = member_type;

        // switch(member_type)
        // {
        //     case "CB-01" : member_type_description = "Basic"; break;
        //     case "CA-01" : member_type_description = "Advanced"; break;
        //     case "CP-01" : member_type_description = "Professional"; break;
        //     case "CF-01" : member_type_description = "Founder"; break;
        // }

        var userProperties =
        {
            "member_username": username_login,
            // "member_type" : member_type,
            // "member_type_description" : member_type_description
        }

        window.Hotline.updateUser(userInfo);
        window.Hotline.updateUserProperties(userProperties);
        window.Hotline.showConversations();
    };

    $scope.showFAQs = function () {
        window.Hotline.showFAQs({
            showFaqCategoriesAsGrid: true,
            showContactUsOnAppBar: true,
            showContactUsOnFaqScreens: true,
            showContactUsOnFaqNotHelpful: false
        });
    };

    //--------- MULTI-LANGUAGE FUNCTIONS ---------

    $scope.selectLanguage = function () {
        // LOAD DEFAULT LANGUAGE ON SQLITE
        if (isPhoneGap()) {
            // deleteSpecialVarsFromDB("default_language");
            loadSpecialVarsFromDB("default_language", $scope);
        }
    };

    $scope.$on('SQLite:getSpecialVarsSuccess:default_language', function () {
        if ($scope.special_vars != null) {
            $scope.language = language = $scope.special_vars;
            reloadDefaultLanguage();
            $rootScope.$emit('ReloadDefaultLanguage');
        }
        else {
            if (available_languages.length > 1) {
                $state.go('app.setting-language');
            }
        }
    });

    $scope.$on('SQLite:getSpecialVarsError:default_language', function () {
        if (available_languages.length > 1) {
            $state.go('app.setting-language');
        }
    });

    var reloadDefaultLanguage = function () {
        $scope.loadDefaultMenuTitles();
        $scope.loadUITextMembership();
        $scope.loadUITextGeneral();
    };

    var replaceLanguageMenuList = function (loadFromScope) {
        var main_menu = loadFromScope ? $scope.data.terms : $scope.main_menu;

        if (main_menu) {
            for (var a = 0; a < main_menu.length; a++) {
                var termMeta = main_menu[a].term_meta;
                if (termMeta !== undefined) {
                    var meta = getMetaValueById(termMeta, 'lang_title');
                    var title = JSON.parse(meta !== undefined ? meta.value : '{"english":"' + main_menu[a].title + '"}');
                    main_menu[a].title = title[language] == null || title[language] == undefined ? main_menu[a].title : title[language];
                }
            }
            $scope.main_menu = main_menu;
        }
    };

    $rootScope.$on('ReloadDefaultLanguage', function () {
        reloadDefaultLanguage();
        replaceLanguageMenuList(false);

        if (isPhoneGap()) {
            // SAVE SELECTED LANGUAGES HERE...
            saveSpecialVarsToDB("default_language", "LanguageCtrl", language);
        }
    });

    $scope.showAirlineLoginAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "Warning",
            template: '<div style="width:100%;text-align:center">Please Login Before Access Airline Booking</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                },
                {
                    text: $scope.button_text_login,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        $rootScope.login_redirect_location = '#/app/airline-booking';
                        window.location.href= "#/app/login/-1" ;
                    }
                }
            ]
        });
    };

    $scope.showReservationLoginAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "Warning",
            template: '<div style="width:100%;text-align:center">Please Login Before Access Reservation</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                },
                {
                    text: $scope.button_text_login,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        $rootScope.login_redirect_location = '#/app/reservation-list';
                        window.location.href= "#/app/login/-1" ;
                    }
                }
            ]
        });
    };

    $scope.showWishlistLoginAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "Warning",
            template: '<div style="width:100%;text-align:center">Please Login Before Access Wishlist Transaction</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                },
                {
                    text: $scope.button_text_login,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        $rootScope.login_redirect_location = '#/app/wishlist-transaction';
                        window.location.href= "#/app/login/-1" ;
                    }
                }
            ]
        });
    };

});
