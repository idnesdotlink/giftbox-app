app.controller("WebviewCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    var isLoadingMoreData = false;
    var load_counter = 0;

    $ionicPlatform.ready(function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);

    });

    // if get token for list article success, request list article
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;

        //request compressed image or high res images
        var url = "";
        if(load_counter==1 || loadCompressedImages==false)
        {
            url = term_content_url + $stateParams.id;
        }
        else
        {
            url = term_compressed_content_url + $stateParams.id;
        }

        httpService.get($scope, $http, url, 'content', token);
        console.log('WebviewCtrl');
    });

    // if get token error, request token again
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

    // if get data list article success, set list article
    $scope.$on('httpService:getRequestSuccess', function () {
        //if the image loaded is a compressed image or does not request compressed image
        if(load_counter==0 || loadCompressedImages==false)
        {

            $scope.content_data = {
                title: $scope.data.term.title,
                term_meta: $scope.data.term_meta,
                posts: $scope.data.term_posts
            };
            $scope = replaceLanguageTitle($scope);

            $scope.moreData = $scope.data.has_next;
            if($scope.moreData) $scope.nextPage = $scope.data.next_page;
            $scope.getPostMetaValueById = function (arr, value) {
                return getPostMetaValueById(arr, value);
            };
            $scope.isLoading = false;
            $scope.$broadcast('scroll.refreshComplete');

            // save to db
            if(isPhoneGap())
            {
                saveTermJSONToDB($stateParams.id, 'WebviewCtrl', $scope.data);
                clearPostDataByTermId($stateParams.id);
                for(var i=0; i< $scope.data.term_posts.length; i++)
                {
                    savePostJSONToDB($scope.data.term_posts[i].id, $scope.data.term_posts[i].term_id, 'WebviewCtrl', $scope.data.term_posts[i]);
                }
            }
        }
    });

    // if get data list article error, request token again
    $scope.$on('httpService:getRequestError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.loadMoreData = function() {
        if($scope.moreData && isLoadingMoreData === false) {
            isLoadingMoreData = true;
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }
        else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    };

    $scope.$on('httpService:postTokenGetMoreDataSuccess', function () {
        token = $scope.data.token;
        var url = term_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
    });

    $scope.$on('httpService:postTokenGetMoreDataError', function () {
        if ($scope.status !== 0) {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }
    });

     $scope.$on('httpService:getMoreDataSuccess', function () {
        console.log('masuk more data success');
        Array.prototype.push.apply($scope.content_data.posts, $scope.data.term_posts);

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData) $scope.nextPage = $scope.data.next_page;
        isLoadingMoreData = false;

        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.isTimeout = true;
    });

    $scope.$on('httpService:getMoreDataError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'more-data-content');
    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            title: $scope.data.term.title,
            img_src: $scope.data.term.featured_image_path,
            posts: $scope.data.term_posts
        };

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData) $scope.nextPage = $scope.data.next_page;

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };
        $scope.isLoading = false;
    });

    $scope.doRefresh = function() {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };
});
