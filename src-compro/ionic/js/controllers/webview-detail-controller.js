app.controller("WebviewDetailCtrl", function ($scope,
                                           $http,
                                           $rootScope,
                                           httpService,
                                           $stateParams,
                                           $ionicLoading,
                                           $ionicPopup,
                                           $ionicPlatform,
                                           $cordovaClipboard,
                                           $cordovaToast,
                                           $timeout,
                                           $cordovaInAppBrowser) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.isDownloaded = false;
    $scope.progressval = 0;

    var loadCustomText = function() {
        $scope.button_text_open = getMenuText(ui_texts_webviews.button_text_open,"Open");
    };

    loadCustomText();


    $ionicPlatform.ready(function () {

        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }

        $scope.input = {
            comment: ''
        };


        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        httpService.post_token($scope, $http, url, obj);

    });

    // if get token success, request for book detail
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('WebviewDetailCtrl');
    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // if get detail book success, set detail book
    $scope.$on('httpService:getRequestSuccess', function () {
        var viewUrl = getPostMetaValueById($scope.data.post.post_meta, 'url').value;
        $scope.content_data = {
            title: $scope.data.post.title,
            viewUrl: viewUrl,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        $scope.isLoading = false;
        $scope.viewUrl = viewUrl;
        $scope.openBrowser($scope.viewUrl, $scope.content_data.title);
    });

    // if get token failed, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadPostJSONFromDB($stateParams.id, $scope);
            }
        }

        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }


    });

    //if get data failed, request token again
    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.openBrowser = function(url){
        if (!isPhoneGap()){
            window.open(url,'_blank','location=yes');
        }
        else {
            screen.unlockOrientation();
            cordova.ThemeableBrowser.open(url, '_blank', {
                statusbar: {
                    color: '#ffffffff'
                },
                toolbar: {
                    height: 44,
                    color: '#ffffffff'
                },
                title: {
                    color: '#212121ff',
                    showPageTitle: true
                },
                backButton: {
                    wwwImage: 'images/drawable-xhdpi/back.png',
                    wwwImagePressed: 'images/drawable-xhdpi/back_pressed.png',
                    wwwImageDensity: 2,
                    align: 'left',
                    event: 'backPressed'
                },
                forwardButton: {
                    wwwImage: 'images/drawable-xhdpi/forward.png',
                    wwwImagePressed: 'images/drawable-xhdpi/forward_pressed.png',
                    wwwImageDensity: 2,
                    align: 'left',
                    event: 'forwardPressed'
                },
                closeButton: {
                    wwwImage: 'images/drawable-xhdpi/close.png',
                    wwwImagePressed: 'images/drawable-xhdpi/close_pressed.png',
                    wwwImageDensity: 2,
                    align: 'right',
                    event: 'closePressed'
                },
                backButtonCanClose: true
            }).addEventListener('closePressed', function(e) {
                screen.lockOrientation('portrait-primary');
            });
        }
    };
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.socialShare = function () {
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.title, $scope.content_data.title, null, playstore_link, 'Read more at');
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.title, $scope.content_data.title, null, appstore_link, 'Read more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log($scope.content_data.title);
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log($scope.data);

        $scope.isLoading = false;
    });

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };
});
