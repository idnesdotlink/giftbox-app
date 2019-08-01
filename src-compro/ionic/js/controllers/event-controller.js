app.controller("EventCtrl", function ($scope, $http, httpService, $stateParams, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaClipboard, $cordovaToast, $timeout) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;

    $scope.moreData = false;
    $scope.nextPage = '';

    var isLoadingMoreData = false;

    $ionicPlatform.ready(function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);

    });


    // if get token success, request data event
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        var url = "";
        if(loadCompressedImages==false)
        {
            url = term_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'content', token);
        }
        else
        {
            url = term_compressed_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'content', token);
        }
        console.log('EventCtrl');
    });

    // if get event data success, set data event
    $scope.$on('httpService:getRequestSuccess', function () {

        $scope.content_data = {
            title: $scope.data.term.title,
            term_meta: $scope.data.term_meta,
            events: $scope.data.term_posts
        };

        $scope = replaceLanguageTitle($scope);

        //console.log($scope.data);

        $ionicSlideBoxDelegate.update();

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');

        //save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'EventCtrl', $scope.data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId($stateParams.id);
            for(var i=0; i< $scope.data.term_posts.length; i++)
            {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB($scope.data.term_posts[i].id, $scope.data.term_posts[i].term_id, 'EventCtrl', $scope.data.term_posts[i]);

            }
        }

        //request compressed image if set to on
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content',1);

        }

    });

    // if get token failed, request token again
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

    // if get event data failed, request token again
    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
//        httpService.post_token($scope, $http, url, obj, 'content');
        $scope.isTimeout = true;
    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;
        var page = args.page;

        var url = term_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token, page);

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
        for(var i=0;i<updated_data.term_posts.length;i++)
        {
            $scope.content_data.events[((updated_data.next_page-2)*6)+i].featured_image_path = updated_data.term_posts[i].featured_image_path;
            $scope.content_data.events[((updated_data.next_page-2)*6)+i].content = updated_data.term_posts[i].content;
        }

        // save to db first page
        if(isPhoneGap() && updated_data.next_page==2)
        {
            saveTermJSONToDB($stateParams.id, 'EventCtrl', updated_data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId($stateParams.id);
            for(var i=0; i< updated_data.term_posts.length; i++)
            {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB(updated_data.term_posts[i].id, updated_data.term_posts[i].term_id, 'EventCtrl', updated_data.term_posts[i]);

            }
        }

    });

    $scope.$on('httpService:getHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content',page);

    });

    $scope.socialShare = function(index)
    {
        var img_src = $scope.content_data.events[index].featured_image_path;
        //console.log('share');
        if(isPhoneGap())
        {
            if(isAndroid())
            {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, null, null, img_src, playstore_link, 'See more at');
            }
            else if(isIOS())
            {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, null, null, img_src, appstore_link, 'See more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log($scope.content_data.title);
            console.log(playstore_link);
            console.log(appstore_link);
        }

    };

    $scope.slideHasChanged = function($index){
        if($index+2 >= $scope.content_data.events.length)
        {
            $scope.loadMoreData();
        }
    };

    $scope.loadMoreData = function()
    {
        if($scope.moreData && isLoadingMoreData === false)
        {

            isLoadingMoreData = true;

            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }
        else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        //console.log('lagi');


    };

    $scope.$on('httpService:postTokenGetMoreDataSuccess', function () {
        token = $scope.data.token;
        //console.log('masuk token more data');
        //console.log(token);
        if(loadCompressedImages)
        {
            var url = term_compressed_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        }
        else
        {
            var url = term_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        }
        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetMoreDataError', function () {

        if ($scope.status !== 0)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }


    });

    $scope.$on('httpService:getMoreDataSuccess', function () {
        //console.log('masuk more data success');

        //console.log($scope.data.term_posts);

        Array.prototype.push.apply($scope.content_data.events, $scope.data.term_posts);

        //track old next page number
        var old_next_page = $scope.nextPage;

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        isLoadingMoreData = false;

        $ionicSlideBoxDelegate.update();

        $scope.$broadcast('scroll.infiniteScrollComplete');

        //send request for high res image using old next page number
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content',old_next_page);
        }
    });

    $scope.$on('httpService:getMoreDataError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'more-data-content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            title: $scope.data.term.title,
            events: $scope.data.term_posts
        };

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.isLoading = false;

        $ionicSlideBoxDelegate.update();
        $scope.$apply();

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
});
