app.controller('AudioCtrl', function ($scope, $rootScope, $stateParams, $http, httpService, $ionicPlatform) {

    // loading spinner in the beginning
    $scope.isLoading = true;

    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.isTimeout = false;
    var isLoadingMoreData = false;

    $ionicPlatform.ready(function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);

    });

    // if get token success
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
        console.log('AudioCtrl');
    });

    // if get detail audio success
    $scope.$on('httpService:getRequestSuccess', function () {
        // set audio list template name and term id for back function in audio detail controller
        audioListTemplateName = $scope.data.term.term_template.name;
        audioListTermId = $stateParams.id;

        $scope.content_data = {
            title: $scope.data.term.title,
            term_meta: $scope.data.term_meta,
            audios: $scope.data.term_posts
        };

        $scope = replaceLanguageTitle($scope);

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
            if (isPhoneGap())
              $scope.loadMoreData();
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
        // save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'AudioCtrl', $scope.data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId($stateParams.id);
            for(var i=0; i< $scope.data.term_posts.length; i++)
            {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB($scope.data.term_posts[i].id, $scope.data.term_posts[i].term_id, 'AudioCtrl', $scope.data.term_posts[i]);

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

    // if get detail audio error, request token again
    $scope.$on('httpService:getRequestError', function () {
        $scope.isLoading = true;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {

        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                console.log('load from db');
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

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;
        var page = args.page;

        //console.log(token);
        var url = term_content_url + $stateParams.id;
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
        for(var i=0;i<updated_data.term_posts.length;i++)
        {
            $scope.content_data.audios[((updated_data.next_page-2)*6)+i].featured_image_path = updated_data.term_posts[i].featured_image_path;
            $scope.content_data.audios[((updated_data.next_page-2)*6)+i].content = updated_data.term_posts[i].content;
        }

        // save to db first page
        if(isPhoneGap() && updated_data.next_page==2)
        {
            saveTermJSONToDB($stateParams.id, 'AudioCtrl', updated_data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId($stateParams.id);
            for(var i=0; i< updated_data.term_posts.length; i++)
            {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB(updated_data.term_posts[i].id, updated_data.term_posts[i].term_id, 'AudioCtrl', updated_data.term_posts[i]);

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


    $scope.loadMoreData = function()
    {
        if($scope.moreData && isLoadingMoreData === false)
        {

            isLoadingMoreData = true;
            //console.log('masuk load');
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
        console.log('masuk token more data');
        //console.log(token);
        var url = term_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
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
        console.log('masuk more data success');

        //console.log($scope.data.term_posts);

        Array.prototype.push.apply($scope.content_data.audios, $scope.data.term_posts);

        //track old next page number
        var old_next_page = $scope.nextPage;

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        isLoadingMoreData = false;

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
        audioListTemplateName = $scope.data.term.term_template.name;
        audioListTermId = $stateParams.id;

        $scope.content_data = {
            title: $scope.data.term.title,
            audios: $scope.data.term_posts
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
    // show confirmation modal for external link
//    document.onclick = function (e) {
//        e = e ||  window.event;
//        var element = e.target || e.srcElement;
//
//        if (element.tagName == 'A') {
//            //window.open(element.href, "_blank", "location=yes");
//            showExitConfirmation($ionicPopup, element.href);
//            /*console.log('articel detail ctrl');
//             console.log(element.href);*/
//            return false; // prevent default action and stop event propagation
//        }
//    };

});
