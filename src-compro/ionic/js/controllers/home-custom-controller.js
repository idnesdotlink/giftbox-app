app.controller("HomeCustomCtrl", function ($scope,
                                     $rootScope,
                                     $http,
                                     httpService,
                                     $stateParams,
                                     $ionicModal,
                                     $ionicLoading,
                                     $ionicPlatform,
                                     $cordovaClipboard,
                                     $ionicSlideBoxDelegate,
                                     $cordovaToast,
                                     $ionicGesture,
                                     //adMobService,
                                     $timeout) {

    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.gallery_template_ids = ['2','7'];
    $scope.product_template_ids = ['13','15'];
    $scope.webview_template_ids = ['24'];
    $scope.exception_template_ids = ['2','4','5','7','13','15','24'];

    $scope.stock_status_visible = stock_status_visible;
    $scope.currency = currency + ' ';
    $scope.home_category_text = home_category_text;

    $ionicPlatform.ready(function () {
        console.log('Home Controller', $scope.home_category_text);
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
        $hasUser = user_id != '' && user_id != false && user_id != undefined ? true : false;
        if(loadCompressedImages==false)
        {
            url = term_content_url + $stateParams.id + ($hasUser ? '/' + user_id : '');
        }
        else
        {
            url = term_compressed_content_url + $stateParams.id + ($hasUser ? '/' + user_id : '');
        }
        httpService.get($scope, $http, url, 'content', token);
    });


    // if get home data success, set home data
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            title: $scope.data.term.title,
            img_src: $scope.data.term.featured_image_path,
            menus: $scope.data.term_child,
            menu_post: $scope.data.term_child_posts,
            menu_term: new Array(),
            isLoading: new Array()
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

        //request compressed image if set to on
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content',1);

        }

        var mainMenu = $scope.content_data.menus;
        console.log(mainMenu);
        for (var a = 0; a < mainMenu.length; a++) {
            var menuContentType = mainMenu[a].content_type_id;

            // if strMenu has '__CAROUSEL__', then load list post with the id.
            if (menuContentType!='3') {
                $scope.content_data.isLoading[mainMenu[a].id] = true;
                // get new token to validate request...
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                // load gallery list as carousel by sending token first.
                httpService.post_token($scope, $http, url, obj, 'home-post-content', 0, mainMenu[a].id);
                //break;
            }
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
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');
    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;
        var page = args.page;

        //console.log(token);
        $hasUser = user_id != '' && user_id != false && user_id != undefined ? true : false;
        var url = term_content_url + $stateParams.id + ($hasUser ? '/' + user_id : '');
        httpService.get($scope, $http, url, 'high-res-data-content', token, page);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content',page);
    });

    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;

        //display true resolution image
        console.log('true resolution loaded');
        for(var i=0;i<updated_data.term_child.length;i++)
        {
            $scope.content_data.menus[i].featured_image_path = updated_data.term_child[i].featured_image_path;
        }

        // save to db
        if (isPhoneGap()) {
            saveTermJSONToDB($stateParams.id, 'HomeCtrl', updated_data);
        }

    });

    $scope.$on('httpService:getHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content',page);

    });


    $scope.$on('httpService:postTokenGetHomePostSuccess', function (event, args) {
        token = $scope.data.token;
        var page = args.page;
        var id = args.term_id;

        //console.log(token);
        $hasUser = user_id != '' && user_id != false && user_id != undefined ? true : false;
        var url = term_content_url + id + ($hasUser ? '/' + user_id : '');
        httpService.get($scope, $http, url, 'home-post-content', token, page);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHomePostError', function (event, args) {
        var page = args.page;
        var id = args.term_id;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'home-post-content',page, id);
    });

    $scope.$on('httpService:getHomePostSuccess', function (event, args) {
        var updated_data = args.data;

        //display true resolution image
        console.log('home post loaded');
        if(updated_data.term.content_type_id=='1')
        {
            $scope.content_data.menu_post[updated_data.term.id] = updated_data.term_posts;
        }
        else if(updated_data.term.content_type_id=='2')
        {
            $scope.content_data.menu_term[updated_data.term.id] = updated_data;
        }
        $scope.content_data.isLoading[updated_data.term.id] = false;
        console.log($scope.content_data.menu_post);
        $ionicSlideBoxDelegate.update();

    });

    $scope.$on('httpService:getHomePostError', function (event, args) {
        var page = args.page;
        var id = args.term_id;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id, term_id:id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'home-post-content',page, id);

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

    $scope.getPostMetaValueById = function (arr, value) {
        return getPostMetaValueById(arr, value);
    };

    $scope.openLink = function(post_meta){
        var type = getPostMetaValueById(post_meta, 'actionlink_type');
        if (type != undefined && type != false && type != '' && type != null){
            type = type.value;
            var value = getPostMetaValueById(post_meta, 'actionlink_value').value;

            if (value != '' && value != 'http://')
            if (type === 'home_external_link')
                openBrowser(value);
            else if (type === 'home_internal_link')
                window.location.href = '#/app/' + value.replace("term/","").replace("post/","");
        }
        console.log("LINK UNAVAILABLE!");
    }

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

    $scope.checkIdx = function(templates, menu){
        return templates.indexOf(menu.term_template.post_template_group_id.toString()) != -1;
    };
});

