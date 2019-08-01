app.controller("HomeCtrl", function ($scope,
                                     $rootScope,
                                     $http,
                                     httpService,
                                     $stateParams,
                                     $ionicModal,
                                     $ionicLoading,
                                     $ionicPlatform,
                                     $cordovaClipboard,
                                     $cordovaToast,
                                     //adMobService,
                                     $timeout) {

    $scope.isLoading = true;
    $scope.isTimeout = false;

    $ionicPlatform.ready(function () {
        console.log('Home Controller');
        if (isPhoneGap()) {
            // adMobService.showBannerAd();
            loadTermJSONFromDB($stateParams.id, $scope);
            // Added Load from SQLite before HTTP Request
            // Siapapun yang duluan di-load akan dimunculkan (utk Koneksi Internet yg kurang cepat)
        }

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);

    });

    // if get token success, request home data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        console.log('GET TOKEN SUCCESS');
        var url = term_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);
    });

    // if get home data success, set home data
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            title: $scope.data.term.title,
            img_src: $scope.data.term.featured_image_path,
            menus: $scope.data.term_child,
            menu_post: $scope.data.term_child_posts
        };
        
        if ($scope.data.home_share_apps_image != null && home_id == $scope.data.term.id && $scope.data.term.content_type_id == 2) {
            var ShareApps = {
                id: -5,
                icon_code: 'icon ion-android-share-alt',
                title: 'Share Apps',
                no: 1005,
                featured_image_path: $scope.data.home_share_apps_image
            };

            $scope.content_data.menus.push(ShareApps);
            //console.log($scope.content_data.menus);
        }


        $scope.isLoading = false;
        console.log('GET CONTENT SUCCESS');
        //console.log($scope.data);

        // save to db
        if (isPhoneGap()) {
            saveTermJSONToDB($stateParams.id, 'HomeCtrl', $scope.data);
        }
    });

    $scope.$on('httpService:postTokenError', function () {
        if ($scope.status === 0) {
            console.log('NO INTERNET CONNECTION');
            if (isPhoneGap()) {
                loadTermJSONFromDB($stateParams.id, $scope);
            }
        }
        else {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // $scope.isTimeout = true;
        httpService.post_token($scope, $http, url, obj, 'content');
    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            title: $scope.data.term.title,
            img_src: $scope.data.term.featured_image_path,
            menus: $scope.data.term_child,
            menu_post: $scope.data.term_child_posts
        };
        
        if ($scope.data.home_share_apps_image != null && home_id == $scope.data.term.id && $scope.data.term.content_type_id == 2) {
            var ShareApps =
            {
                id: -5,
                icon_code: 'icon ion-android-share-alt',
                title: 'Share Apps',
                no: 1005,
                featured_image_path: $scope.data.home_share_apps_image
            };

            $scope.content_data.menus.push(ShareApps);
            //console.log($scope.content_data.menus);
        }

        $scope.isLoading = false;
        console.log('GET CONTENT SUCCESS');
        //console.log($scope.data);
    });

    $scope.$on('SQLite:getOfflineDataError', function () {
        $scope.isLoading = true;
        console.log('NO LOCAL DATA FOUND, PLEASE CONNECT TO INTERNET TO UPDATE DATA');
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
    
/**** START: circular menu ****/
    var circles = document.getElementsByClassName('ionic-wheel-circle');

    $scope.circlesHidden = true;

    $scope.showCircles= function() {
      var $circles = angular.element(circles);
      if ($scope.circlesHidden) {
        $circles.addClass('active');
      } else {
        $circles.removeClass('active');
      }
      $scope.toggleCirclesHidden();
    };

    $scope.toggleCirclesHidden = function() {
      return $scope.circlesHidden = !$scope.circlesHidden;
    };
    
/**** END: circular menu ****/
    
    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        
        $scope.isTimeout = false;
        
        httpService.post_token($scope, $http, url, obj, 'content');
    };
    
    $rootScope.$on('httpService:refreshMenu',function(){
        console.log("Refresh Menu: Home Controller");
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isLoading = true;
        httpService.post_token($scope, $http, url, obj);
    }); 
});

