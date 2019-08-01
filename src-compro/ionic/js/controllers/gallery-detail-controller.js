app.controller("GalleryDetailCtrl", function ($scope, $ionicModal, $http, httpService, $stateParams, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaClipboard, $cordovaToast, $timeout, $rootScope) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;

    $scope.images = [];

    $scope.galleryData = {};

    $ionicPlatform.ready(function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        httpService.post_token($scope, $http, url, obj);

    });


    // if get token success, request gallery data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        var url = "";
        if(loadCompressedImages==false)
        {
            url = post_content_url + $stateParams.id;
        }
        else
        {
            url = post_compressed_content_url + $stateParams.id;
        }
        httpService.get($scope, $http, url, 'content', token);
        console.log('*** GalleryDetailCtrl ***');
    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // get gallery detail data success.
    $scope.$on('httpService:getRequestSuccess', function () {
        console.log($scope.data);
        $scope.content_data = {
            title: $scope.data.post.title,
            published_date: $scope.data.post.published_date,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            featured_image_path: $scope.data.post.featured_image_path,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        $scope.isLoading = false;
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'GalleryCtrl', $scope.data);
        }

        //request compressed image if set to on
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
        }

    });

    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB($stateParams.id, $scope);
            }
        }
        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }

    });

    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = true;

        //httpService.post_token($scope, $http, url, obj, 'content');
    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;

        //console.log(token);
        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
    });

    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;

        $scope.content_data = {
            title: updated_data.post.title,
            published_date: updated_data.post.published_date,
            summary: updated_data.post.summary,
            content: updated_data.post.content,
            featured_image_path: updated_data.post.featured_image_path,
            post_meta: updated_data.post.post_meta
        };

        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        //display true resolution image
        console.log('true resolution loaded');

        // save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'GalleryCtrl', updated_data);
        }

    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getHighResDataError', function (event, args) {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        console.log($scope.data);
        $scope.content_data = {
            title: $scope.data.post.title,
            published_date: $scope.data.post.published_date,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            featured_image_path: $scope.data.post.featured_image_path
        };

        $scope.isLoading = false;
    });

    var defaultModalTemplate = 'templates/gallery-detail-1.html';

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl(defaultModalTemplate, {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        //success
    }, {
        //error
    });

    $scope.socialShare = function(index) {
        var img_src = $scope.content_data.galleries[index].featured_image_path;
        //console.log('share');
        if(isPhoneGap()) {
            if(isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, null, null, img_src, playstore_link, 'See more at');
            }
            else if(isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, null, null, img_src, appstore_link, 'See more at');
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

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

});
