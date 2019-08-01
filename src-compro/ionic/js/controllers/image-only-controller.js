app.controller("ImageOnlyCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform, $rootScope) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;


    $ionicPlatform.ready(function()
    {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });


    // if get token success, request profile data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
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
        console.log('ImageOnlyCtrl');

    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // if get profile data success, set profile data
    $scope.$on('httpService:getRequestSuccess', function () {

        $scope.content_data = {
            title: $scope.data.post.title,
            img_src: $scope.data.post.featured_image_path,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        if ($scope.data.post.term_content_type_id == 3) {
          $scope = replaceLanguagePostTitle($scope);
        }
        $scope.isLoading = false;

        //save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'ImageOnlyCtrl', $scope.data);
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
                loadTermJSONFromDB($stateParams.id,$scope);
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
//        httpService.post_token($scope, $http, url, obj, 'content');

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
            img_src: updated_data.post.featured_image_path,
            post_meta: updated_data.post.post_meta
        };

        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        //display true resolution image
        console.log('true resolution loaded');

        //save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'ImageOnlyCtrl', updated_data);
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
        $scope.content_data = {
            title: $scope.data.post.title,
            img_src: $scope.data.post.featured_image_path
        };
        $scope.isLoading = false;
    });

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

});
