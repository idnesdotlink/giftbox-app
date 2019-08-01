app.controller("WishlistCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform, $ionicLoading) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    var isLoadingMoreData = false;
    $scope.need = 0;
    $scope.get = 0;
    $scope.input = {
        categorySelected: '',
        orderBySelected: 'featured'
    };

    $scope.shopping_enabled = shopping_enabled ? "YES" : "NO";

    $scope.order_by_list = [
        {key: 'featured', value: 'Featured'},
        {key: 'recent', value: 'New Arrival'},
        {key: 'title', value: 'Alphabet (A-Z)'},
        {key: 'popular', value: 'Most Popular'},
        {key: 'price_asc', value: 'Lowest Price'},
        {key: 'price_desc', value: 'Highest Price'},
        {key: 'discount', value: 'Best Discount'}
    ];

    if($scope.shopping_enabled == "NO")
    {
        $scope.order_by_list = [
            {key: 'featured', value: 'Featured'},
            {key: 'recent', value: 'New Arrival'},
            {key: 'title', value: 'Alphabet (A-Z)'},
            {key: 'popular', value: 'Most Popular'},
            {key: 'label_asc', value: 'Label Ascending'},
            {key: 'label_desc', value: 'Label Descending'},
            {key: 'discount', value: 'Best Discount'}
        ];
    }

    $scope.stock_status_visible = stock_status_visible;
    $scope.product_search = {};
    $scope.product_search.search_text = '';

    var loadCustomText = function() {
        $scope.input_error_text_must_be_filled = getMenuText(ui_texts_general.input_error_text_must_be_filled, 'must be filled.');
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });

    // loading fragment
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    // if get token for wishlist success, request wishlist
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        if (loadCompressedImages == false) {
            url = term_content_url + $stateParams.id;
        }
        else {
            url = term_compressed_content_url + $stateParams.id;
        }
        httpService.get($scope, $http, url, 'content', token, 0);
        console.log('WishlistCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if ($scope.status === 0) {
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

    // if get data wishlist success, set wishlist
    $scope.$on('httpService:getRequestSuccess', function () {
        //if the image loaded is a compressed image or does not request compressed image
        $scope.hide();

        isLoadingMoreData = false;

        $scope.content_data = {
            title: $scope.data.term.title,
            products: $scope.data.term_posts,
            term_meta: $scope.data.term_meta
        };
        console.log($scope.content_data);
        $scope = replaceLanguageTitle($scope);

        if ($scope.data.category_list !== undefined && $scope.data.category_list !== '' && $scope.data.category_list !== null) {
            $scope.category_list = $scope.data.category_list;
        }
        for (var i = 0; i < $scope.content_data.products.length; i++) {
            for (var b = 0; b < $scope.content_data.products[i].post_meta.length; b++) {
                if($scope.content_data.products[i].post_meta[b].key == 'need'){
                    $scope.need = parseInt($scope.content_data.products[i].post_meta[b].value);
                    console.log($scope.need);
                }
                if($scope.content_data.products[i].post_meta[b].key == 'get'){
                    $scope.get = parseInt($scope.content_data.products[i].post_meta[b].value);
                    console.log($scope.get);
                }
            }
            if($scope.need <= $scope.get){
                $scope.content_data.products[i].canbuy = false;
            }
            else{
                $scope.content_data.products[i].canbuy = true;
            }
        }
        console.log($scope.content_data.products);
        $scope.moreData = false;


        $scope.moreData = $scope.data.has_next;
        //console.log($scope.moreData);
        if ($scope.moreData) {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };
        $scope.currency = currency + ' ';
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
        // save to db
        if (isPhoneGap()) {
            saveTermJSONToDB($stateParams.id, 'WishlistCtrl', $scope.data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId($stateParams.id);
            for (var i = 0; i < $scope.data.term_posts.length; i++) {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB($scope.data.term_posts[i].id, $scope.data.term_posts[i].term_id, 'WishlistCtrl', $scope.data.term_posts[i]);

            }

        }

        //request compressed image if set to on
        if (loadCompressedImages) {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content', 1);

        }

    });

    // if get data wishlist error, request token again
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
        var url = term_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token, page);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content', page);
    });

    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;

        //check if returned data category is current category
        var category = decodeURI(args.category);
        if (category == $scope.input.categorySelected) {
            //display true resolution image
            console.log('true resolution loaded');
            for (var i = 0; i < updated_data.term_posts.length; i++) {
                $scope.content_data.products[((updated_data.next_page - 2) * 6) + i].featured_image_path = updated_data.term_posts[i].featured_image_path;
                $scope.content_data.products[((updated_data.next_page - 2) * 6) + i].content = updated_data.term_posts[i].content;
            }

            // save to db first page
            if (isPhoneGap() && updated_data.next_page == 2) {
                saveTermJSONToDB($stateParams.id, 'WishlistCtrl', updated_data);
                //console.log($scope.data.term_posts);
                clearPostDataByTermId($stateParams.id);
                for (var i = 0; i < updated_data.term_posts.length; i++) {
                    //console.log($scope.data.term_posts[i]);
                    savePostJSONToDB(updated_data.term_posts[i].id, updated_data.term_posts[i].term_id, 'WishlistCtrl', updated_data.term_posts[i]);

                }
            }
        }

    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content', page);

    });

    $scope.getPostMetaValueById = function (arr, value) {
        return getPostMetaValueById(arr, value);
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {

        var products_temp = new Array();

        if ($scope.input.categorySelected != '' && $scope.input.categorySelected != null) {
            for (var i = 0; i < $scope.data.term_posts.length; i++) {
                if (getPostMetaValueById($scope.data.term_posts[i].post_meta, 'subcategory').value == $scope.input.categorySelected) {
                    products_temp.push($scope.data.term_posts[i]);
                }
            }

        }
        //console.log(products_temp);


        if ($scope.data.category_list !== undefined && $scope.data.category_list !== '' && $scope.data.category_list !== null) {
            $scope.category_list = $scope.data.category_list;
        }


        if ($scope.input.categorySelected != '' && $scope.input.categorySelected != null) {
            $scope.content_data = {
                title: $scope.data.term.title,
                products: products_temp,
                term_meta: $scope.data.term_meta
            };

        }

        else {
            $scope.content_data = {
                title: $scope.data.term.title,
                products: $scope.data.term_posts,
                term_meta: $scope.data.term_meta
            };
        }


        $scope.currency = currency + ' ';
        $scope.isLoading = false;
        $scope.hide();

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

    });

    $scope.loadMoreData = function () {
        if ($scope.moreData && isLoadingMoreData === false) {
            //console.log($scope.input.categorySelected);
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
        if (loadCompressedImages) {
            var url = term_compressed_content_url + $stateParams.id;
        }
        else {
            var url = term_content_url + $stateParams.id;
        }
        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
    });

    $scope.$on('httpService:postTokenGetMoreDataError', function () {

        if ($scope.status !== 0) {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }

    });

    $scope.$on('httpService:getMoreDataSuccess', function (event, args) {

        //check if returned data category is current category
        var category = decodeURI(args.category);
        if (category == $scope.input.categorySelected) {
            $scope.hide();
            Array.prototype.push.apply($scope.content_data.products, $scope.data.term_posts);

            if ($scope.data.category_list !== undefined && $scope.data.category_list !== '' && $scope.data.category_list !== null) {
                $scope.category_list = $scope.data.category_list;
            }

            var old_next_page = $scope.nextPage;

            $scope.moreData = $scope.data.has_next;

            if ($scope.moreData) {
                $scope.nextPage = $scope.data.next_page;
            }

            $scope.getPostMetaValueById = function (arr, value) {
                return getPostMetaValueById(arr, value);
            };

            if (loadCompressedImages) {
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                // call angular http service
                httpService.post_token($scope, $http, url, obj, 'high-res-data-content', old_next_page);
            }

            $scope.isLoading = false;
            isLoadingMoreData = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }

    });

    $scope.$on('httpService:getMoreDataError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'more-data-content');

    });

    $scope.sortList = function () {
        $scope.isLoading = true;
        //$scope.isLoadingCategory = true;
        $scope.content_data.products = '';
        // $scope.show();

        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
        //console.log('selected:'+$scope.input.categorySelected);

        isLoadingMoreData = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.loadCategory = function () {
        $scope.isLoading = true;
        //$scope.isLoadingCategory = true;
        $scope.content_data.products = '';
        // $scope.show();

        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
        //console.log('selected:'+$scope.input.categorySelected);

        isLoadingMoreData = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


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

    $scope.getTermMetaValueByKey = function (arr, value) {
        return getTermMetaValueByKey(arr, value);
    };

    $scope.productSearch = function() {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
        $scope.show();
    }

    $scope.clearProductSearch = function() {
        console.log($scope.product_search.search_text);
        $scope.product_search.search_text = "";
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
        $scope.show();
    }
});
