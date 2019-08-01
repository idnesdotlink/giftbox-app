/**
 * Created by KEVIN on 5/17/2016.
 */
app.controller('InAppPurchaseCtrl', function ($scope, $state, $ionicLoading, $http, httpService, $stateParams, $ionicPlatform,$ionicPopup) {
    // loading spinner in the beginning
    $scope.isLoading = true;

    //var productIds = ['id.compro.compro.product1','id.compro.compro.product2']; // <- Add your product Ids here
    //var productIds = ['id.compro.po1toolbox.product1'];

    var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';

    var loadMenuText = function(){
      $scope.text_inapp_purchase_title = getMenuText(ui_texts_inapp_purchase.text_inapp_purchase_title, "In App Purchase");
      $scope.text_purchase_success_title = getMenuText(ui_texts_inapp_purchase.text_purchase_success_title, "Purchase Success");
      $scope.text_purchase_error_title = getMenuText(ui_texts_inapp_purchase.text_purchase_error_title, "Purchase Failed");
      $scope.text_purchase_error_content = getMenuText(ui_texts_inapp_purchase.text_purchase_error_content, "Please check your internet connection and try again.");
      $scope.text_purchase_success_title = getMenuText(ui_texts_inapp_purchase.text_purchase_success_title, "Purchase Success");
      $scope.text_purchase_success_content = getMenuText(ui_texts_inapp_purchase.text_purchase_success_content, "Successfully purchased item.");
      $scope.text_restore_success_title = getMenuText(ui_texts_inapp_purchase.text_restore_success_title, "Restore Success");
      $scope.text_restore_success_content = getMenuText(ui_texts_inapp_purchase.text_restore_success_title, "Successfully restored data.");
      $scope.text_restore_failed_title = getMenuText(ui_texts_inapp_purchase.text_restore_failed_title, "Restore Failed");
      $scope.text_restore_failed_content = getMenuText(ui_texts_inapp_purchase.text_restore_failed_content, "Please check your internet connection and try again.");
      $scope.text_loading = getMenuText(ui_texts_inapp_purchase.text_loading, "Loading Products...");
      $scope.text_processing = getMenuText(ui_texts_inapp_purchase.text_processing, "Prcoessing...");
      $scope.text_restoring_purchase = getMenuText(ui_texts_inapp_purchase.text_restoring_purchase, "Restoring...");
    };

    loadMenuText();

    $ionicPlatform.ready(function () {

        console.log('InAppPurchaseCtrl');
        $scope.isLoading = false;

        //loading products
        if(isPhoneGap())
        {
            $ionicLoading.show({template: spinner + $scope.text_loading});
            inAppPurchase
                .getProducts(productIds)
                .then(function (products) {
                    $ionicLoading.hide();
                    $scope.products = products;
                })
                .catch(function (err) {
                    $ionicLoading.hide();
                    console.log(err);
                });
        }
        else
        {
            $ionicPopup.alert({
                title: 'Not a Mobile Device',
                template: 'Check in Mobile Device'
                });
        }
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // var url = token_url;
        // httpService.post_token($scope, $http, url, obj);

    });


    $scope.loadProducts = function () {
        $ionicLoading.show({template: spinner + $scope.text_loading });
        inAppPurchase
            .getProducts(productIds)
            .then(function (products) {
                $ionicLoading.hide();
                $scope.products = products;
            })
            .catch(function (err) {
                $ionicLoading.hide();
                console.log(err);
            });
    };

    $scope.buy = function (productId) {

        $ionicLoading.show({template: spinner + $scope.text_processing});
        inAppPurchase
            .buy(productId)
            .then(function (data) {
                console.log(JSON.stringify(data));
                console.log('consuming transactionId: ' + data.transactionId);
                return inAppPurchase.consume(data.type, data.receipt, data.signature);
            })
            .then(function () {
                $scope.topUpAccount(365);
            })
            .catch(function (err) {
                $ionicLoading.hide();
                console.log(err);
                $ionicPopup.alert({
                    title: $scope.text_purchase_error_title,
                    template: $scope.text_purchase_error_content
                });
            });

    };



    $scope.topUpAccount = function(extended_duration)
    {
        extendedDuration = extended_duration;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
//
//        var obj = serializeData({_method: 'POST', email: email, company_id: company_id, duration: extended_duration });
//
//        httpService.post($scope, $http, top_up_purchase_url, obj);
    };



    // if get token success, request contact data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = top_up_purchase_url+"?token="+token;
        var obj = serializeData({_method: 'POST', email: email, company_id: company_id, duration: extendedDuration });

        httpService.post($scope, $http, url, obj);
    });


    // if get token failed, request token again
    $scope.$on('httpService:postTokenError', function () {

        if ($scope.status === 0) {
            // No Internet Connection
        }
        else {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');

        }

    });

    // top up success
    $scope.$on('httpService:postRequestSuccess', function () {
        $ionicLoading.hide();
        //console.log($scope.data);
        if($scope.data.success === true)
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.text_purchase_success_title,
                template: '<div style="width:100%;text-align:center">'+$scope.data.message+'</div>'
            });
        }
        else
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.text_purchase_error_title,
                template: '<div style="width:100%;text-align:center">'+$scope.data.message+'</div>'
            });
        }

    });

    // if post top up error
    $scope.$on('httpService:postRequestError', function () {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_purchase_error_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_purchase_error_content + '</div>'
        });

    });

    $scope.showDialog = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_purchase_success_title,
            template: $scope.text_purchase_success_content
        });
        console.log('consume done!');
    };

    $scope.restore = function () {
        $ionicLoading.show({template: spinner + $scope.text_restoring_purchase});
        inAppPurchase
            .restorePurchases()
            .then(function (purchases) {
                $ionicLoading.hide();
                console.log(JSON.stringify(purchases));
                $ionicPopup.alert({
                    title: $scope.text_restore_success_title,
                    template: $scope.text_restore_success_content
                });
            })
            .catch(function (err) {
                $ionicLoading.hide();
                console.log(err);
                $ionicPopup.alert({
                    title: $scope.text_restore_failed_title,
                    template: $scope.text_restore_failed_content
                });
            });
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {

        $scope.content_data = {};

    });

});
