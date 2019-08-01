app.controller("WishlistTransactionDetailCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    $scope.vt_payment_service = vt_payment_service;

    console.log($stateParams);
    var id = $stateParams.id;

    var isLoadingMoreData = false;

    var loadCustomText = function() {
        $scope.subtitle_text_total = getMenuText(ui_texts_transactions.subtitle_text_total, "Total");
        $scope.subtitle_text_wishlist_transaction_detail = getMenuText(ui_texts_transactions.subtitle_text_wishlist_transaction_detail, "Wishlist Transaction Detail");
        $scope.ui_text_product_name = getMenuText(ui_texts_transactions.ui_text_product_name, "Product Name");
        $scope.ui_text_product_price = getMenuText(ui_texts_transactions.ui_text_product_price,"Product Price");
        $scope.ui_text_quantity = getMenuText(ui_texts_transactions.ui_text_quantity,"Quantity");
        $scope.ui_text_subtotal = getMenuText(ui_texts_transactions.ui_text_subtotal,"Subtotal");
        $scope.ui_text_wishlist_transaction_code = getMenuText(ui_texts_transactions.ui_text_wishlist_transaction_code, "Wishlist Transaction Code");
        $scope.ui_text_date = getMenuText(ui_texts_transactions.ui_text_date, "Date");
        $scope.ui_text_admin_notes = getMenuText(ui_texts_transactions.ui_text_admin_notes,"Admin Notes");
        $scope.subtitle_text_product_detail = getMenuText(ui_texts_transactions.subtitle_text_product_detail, "Product Detail");
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });


    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    // if get token for list article success, request list article
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = user_wishlist_transaction_detail + id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('WishlistTransactionDetailCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'content');
    });

    // if get data list article success, set list article
    $scope.$on('httpService:getRequestSuccess', function () {

        $scope.content_data = {
            wishlist_transaction_master: $scope.data.wishlist_transaction_master,
            wishlist_transaction_details: $scope.data.wishlist_transaction_details,
            title: $scope.data.wishlist_transaction_master.order_id
        };

        console.log("Mendapat Wishlist Transaction Detail");
        console.log($scope.content_data.wishlist_transaction_master);
        console.log($scope.content_data.wishlist_transaction_masters);


        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getRequestError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

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
