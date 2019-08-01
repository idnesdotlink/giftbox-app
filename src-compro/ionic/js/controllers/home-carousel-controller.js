app.controller("HomeCarouselCtrl", function ($scope,
                                             $http,
                                             httpService,
                                             $stateParams,
                                             $ionicLoading,
                                             $ionicPlatform,
                                             $ionicSlideBoxDelegate,
                                             $cordovaClipboard,
                                             $cordovaToast,
                                             //adMobService,
                                             $timeout) {

    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.isCarouselLoading = true;
    $scope.constCarousel = '__CAROUSEL__';
    $scope.images = [];

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

    $scope.$on('httpService:postTokenCarouselContentSuccess', function () {
        token = $scope.data.token;
        console.log('GET TOKEN CAROUSEL CONTENT SUCCESS');
        var url = term_content_url + $scope.carousel_id;
        httpService.get($scope, $http, url, 'carousel-content', token);
    });

    // if get home data success, set home data
    $scope.$on('httpService:getRequestSuccess', function () {
        var menus = [];
        // do a fresh copy to remove array reference when saving...
        angular.copy($scope.data.term_child, menus);

        $scope.content_data = {
            title: $scope.data.term.title,
            img_src: $scope.data.term.featured_image_path,
            menus: menus,
            menu_post: $scope.data.term_child_posts
        };

        //console.log($scope.data);

        //console.log('home share app ' + home_share_apps);
        if ($scope.data.home_share_apps_image != null && home_id == $scope.data.term.id && $scope.data.term.content_type_id == 2) {
            var ShareApps =
            {
                id: -5,
                icon_code: 'icon ion-android-share-alt',
                title: 'Share Apps',
                no: 1005,
                featured_image_path: 'images/shareapp.png'
            };

            $scope.data.term_child.push(ShareApps);
            $scope.content_data.menus.push(ShareApps);
            //console.log($scope.content_data.menus);
        }
        $scope.isLoading = false;
        console.log('GET CONTENT SUCCESS');
        //console.log($scope.data);

        // save to db
        if (isPhoneGap()) {
            saveTermJSONToDB($stateParams.id, 'HomeCtrl', $scope.data);
            console.log("***HOME DATA***");
            console.log($scope.data);
        }

        /*
         * LOAD CAROUSEL DATA HERE... ------------------------------------------
         */

        var mainMenu = $scope.content_data;
        for (var a = 0; a < mainMenu.menus.length; a++) {
            var strMenu = mainMenu.menus[a].title;

            // if strMenu has '__CAROUSEL__', then load list post with the id.            
            if (strMenu.indexOf($scope.constCarousel) > -1) {

                $scope.carousel_id = mainMenu.menus[a].id;
                // get new token to validate request...
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});

                // load gallery list as carousel by sending token first.
                httpService.post_token($scope, $http, url, obj, 'carousel-content');

                // save to-be-removed carousel_menu
                $scope.carousel_menu_idx = a;
                $scope.content_data.menus.splice(a, 1);
                break;
            }
        }
        /*
         * FINISHED LOADING CAROUSEL DATA --------------------------------------
         */
    });

    // if getting data for carousel succeeds
    $scope.$on('httpService:getCarouselContentSuccess', function () {

        //$scope.content_data.menus.splice($scope.carousel_menu_idx,1);
        // set image base url

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.loadImages = function () {


            for (image in $scope.data.term.term_posts) {
                $scope.images.push({id: i, src: image.featured_image_path});
                i++;
                console.log(i);
            }

            // changed name from content_data to carousel_data to prevent overlap.
            $scope.carousel_data = {
                title: $scope.data.term.title,
                galleries: $scope.data.term_posts
            };

            $scope.isCarouselLoading = false;
        };

        $scope.loadImages();
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.start();


        if (isPhoneGap()) {
            saveTermJSONToDB($scope.carousel_id, 'CarouselCtrl', $scope.data);
            console.log("***CAROUSEL DATA***");
            console.log($scope.data);
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

    $scope.$on('httpService:postTokenCarouselContentError', function () {
        if ($scope.status === 0) {
            console.log('NO INTERNET CONNECTION, CAROUSEL WILL LOAD AFTER OFFLINE MENU HAS BEEN LOADED');
        }
        else {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'carousel-content');
        }

    });

    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');
    });

    $scope.$on('httpService:getCarouselContentError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'carousel-content');
    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log("*** TERM ID *** " + $scope.data.term.id + " STATE PARAMS: " + $stateParams.id + ($scope.data.term.id == $stateParams.id));
        if ($scope.data.term.id == $stateParams.id) {
            console.log("***STARTING-GET-OFFLINE-DATA***");
            //console.log($scope.data);
            $scope.content_data = {
                title: $scope.data.term.title,
                img_src: $scope.data.term.featured_image_path,
                menus: $scope.data.term_child,
                menu_post: $scope.data.term_child_posts
            };

            $scope.isLoading = false;
            $scope.isCarouselLoading = true;
            //console.log('GET-CONTENT-SUCCESS');
            //console.log($scope.data);

            // extract menus, check if carousel exists...
            var mainMenu = $scope.content_data;
            for (var a = 0; a < mainMenu.menus.length; a++) {
                var strMenu = mainMenu.menus[a].title;

                // if strMenu has '__CAROUSEL__', then load list post with the id.            
                if (strMenu.indexOf($scope.constCarousel) > -1) {

                    $scope.carousel_id = mainMenu.menus[a].id;
                    // load offline data for carousel---------------------------------------
                    //console.log("*** OFFLINE-CAROUSEL-ID *** " + $scope.carousel_id);
                    loadTermJSONFromDB($scope.carousel_id, $scope);

                    // pop '__CAROUSEL__', remove the menu out.
                    $scope.content_data.menus.splice(a, 1);
                    break;
                }
            }
        }
        else if ($scope.data.term.id == $scope.carousel_id) {
            console.log('*** STARTING-GET-OFFLINE-CAROUSEL-CONTENT ***');
            $scope.getPostMetaValueById = function (arr, value) {
                return getPostMetaValueById(arr, value);
            };

            $scope.loadOfflineImages = function () {
                //console.log($scope.data.term_posts);
                for (var i = 0; i < $scope.data.term_posts.length; i++) {
                    //console.log($scope.data.term_posts[i].featured_image_path);
                    $scope.images.push({id: i, src: $scope.data.term_posts[i].featured_image_path});

                }

                $scope.carousel_data = {
                    title: $scope.data.term.title,
                    galleries: $scope.data.term_posts
                };

                // console.log("IS CAROUSEL LOADING: " + $scope.isCarouselLoading);

                console.log("GET-CAROUSEL-CONTENT-OK");
                $scope.isCarouselLoading = false;
            };

            $scope.loadOfflineImages();
            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.start();
            $scope.$apply();
            //----------------------------------------------------------------------
        }


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
    
    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        
        $scope.isTimeout = false;
        
        httpService.post_token($scope, $http, url, obj, 'content');
    };
});


