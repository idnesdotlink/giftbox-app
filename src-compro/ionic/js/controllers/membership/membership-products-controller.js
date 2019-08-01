app.controller("MembershipProductsCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;


    var isLoadingMoreData = false;

    var loadCustomText = function() {

        $scope.text_membership_products_only = getMenuText(ui_texts_membership_products.text_membership_products_only, "Only");
        $scope.text_membership_products_left = getMenuText(ui_texts_membership_products.text_membership_products_left, "left");
        $scope.text_membership_menu_points = getMenuText(ui_texts_membership_menu.text_membership_menu_points, "Points");
        $scope.text_membership_products_title = getMenuText(ui_texts_membership_menu.text_membership_menu_rewards, 'Rewards');
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
//        $scope.currency = currency;
    });


    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    // if get token for list article success, request list article
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = url_membership_products + company_id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('MembershipRewardsCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB('-1'+user_id, $scope);
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

        $scope.content_data = {
            products: $scope.data.membership_products,
            title: $scope.text_membership_products_title
        };

        for (var a = 0; a < $scope.content_data.products.length; a++){
            $scope.content_data.products[a].icLoadOK = false;
            $scope.content_data.products[a].image += '?' + Math.floor((Math.random() * 10000) + 1);
        }

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
        // save to db
//        if(isPhoneGap())
//        {
//            saveTermJSONToDB('-1'+user_id, 'MembershipRewardsCtrl', $scope.data);
//            //console.log($scope.data.term_posts);
//            clearPostDataByTermId('-1'+user_id);
//            for(var i=0; i< $scope.data.products.length; i++)
//            {
//                //console.log($scope.data.term_posts[i]);
//                savePostJSONToDB($scope.data.term_posts[i].id, $scope.data.term_posts[i].term_id, 'MembershipRewardsCtrl', $scope.data.term_posts[i]);
//
//            }
//        }
    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getRequestError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.getPostMetaValueById = function (arr, value) {
        return getPostMetaValueById(arr, value);
    };

    $scope.$on('TransactionListCtrl:getOfflineDataSuccess', function () {
        $scope.content_data = {
            products: $scope.data.products,
            title: $scope.text_membership_products_title
        };

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };
        $scope.isLoading = false;
    });

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
        //console.log('lagi' + ' ' + $scope.moreData + " " + isLoadingMoreData.toString());

    };

    $scope.$on('httpService:postTokenGetMoreDataSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = url_membership_products + company_id;
        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        console.log('TransactionListCtrl');
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
        //console.log($scope.data.term_posts);
        var arr_length = $scope.content_data.products.length;

        Array.prototype.push.apply($scope.content_data.products, $scope.data.membership_products);

        for (var a = arr_length; a < $scope.content_data.products.length; a++){
            $scope.content_data.products[a].icLoadOK = false;
        }

        //track old next page number
        var old_next_page = $scope.nextPage;

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        isLoadingMoreData = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');

    });

    $scope.$on('httpService:getMoreDataError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'more-data-content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            transactions: $scope.data.transactions,
            title: $scope.text_membership_products_title
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

    $scope.loadImageComplete = function(idx){
        // flag to disable image loading...
        $scope.content_data.products[idx].icLoadOK = true;
    };

});
