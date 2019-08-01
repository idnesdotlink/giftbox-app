/**
 * Created by KEVIN on 5/17/2016.
 */
app.controller('TopUpRequiredCtrl', function ($scope, $state, $ionicLoading, $http, httpService, $stateParams, $ionicPlatform,$ionicPopup) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.hasPendingTransaction = false;
    $scope.pendingTransactionDuration = 0;

    //var productIds = ['id.compro.compro.product1','id.compro.compro.product2']; // <- Add your product Ids here
    //var productIds = ['id.compro.po1toolbox.product1']; 

    var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';
    
    var extendedDuration = 0;
    
    var productIds = [];
    var duration_lists = '';
    var retry_counter = 0;
    
    $ionicPlatform.ready(function () {

        console.log('InAppPurchaseCtrl');
        $scope.isLoading = false;
        
        duration_lists = '{';
        for (var i = 0; i < membership_product_data_android.length; i++) { 
            productIds.push(membership_product_data_android[i].productId);
            if(i>0)
                duration_lists+=',';
            duration_lists+='"'+membership_product_data_android[i].productId+'":'+membership_product_data_android[i].duration;
        }
        duration_lists+='}';
        duration_lists = JSON.parse(duration_lists);
        
        console.log(productIds);
        //loading products
        if(isPhoneGap())
        {
            loadSpecialVarsFromDB(1,$scope);
//            $ionicPopup.alert({
//                title: 'Inside Phonegap',
//                template: 'Inside Phonegap'
//            });
            $ionicLoading.show({template: spinner + 'Loading Products...'});
            inAppPurchase
                .getProducts(productIds)
                .then(function (products) {
                    $ionicLoading.hide();
                    $scope.products = products;
                })
                .catch(function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Failed To Purchase',
                        template: JSON.stringify(err)
                    });
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
        $ionicLoading.show({template: spinner + 'Loading Products...'});
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

        $ionicLoading.show({template: spinner + 'Processing Top Up...'});
        inAppPurchase
            .buy(productId)
            .then(function (data) {
                console.log(JSON.stringify(data));
                console.log('consuming transactionId: ' + data.transactionId);   
            
                var saved_data = new Object;
                saved_data.user_id = user_id;
                saved_data.isUsed = false;
                saved_data.duration = duration_lists[productId];
                saved_data.purchase_data = JSON.stringify(data);
            
                saveSpecialVarsToDB(1, 'TopUpCtrl', saved_data);
                $scope.saveReceipt(data.transactionId, "inAppPurchaseTopUp", data.receipt, user_id, company_id);
                return inAppPurchase.consume(data.type, data.receipt, data.signature);
            })
            .then(function () {
                $scope.topUpAccount(duration_lists[productId]);
//                if      (productId === productIds[0]) $scope.topUpAccount(365);
//                else if (productId === productIds[1]) $scope.topUpAccount(730);
//                else if (productId === productIds[2]) $scope.topUpAccount(1095);
            })
            .catch(function (err) {
                $ionicLoading.hide();
                console.log(err);
                $ionicPopup.alert({
                    title: 'Something went wrong',
                    template: 'Check your internet connection'
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
    
    
    $scope.saveReceipt = function(order_id, type, receipt, user_id, company_id)
    {
        var url = save_transaction_receipt_url;
        var obj = serializeData({_method: 'POST', order_id: order_id, type: type, receipt: receipt, user_id: user_id, company_id: company_id });
        
        httpService.post($scope, $http, url, obj, 'save_transaction_receipt');
      
    };
    
    $scope.pendingTopUpAccount = function(extended_duration)
    {
        retry_counter = 0;
        $ionicLoading.show({template: spinner + 'Processing Top Up...'});
        extendedDuration = extended_duration;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
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
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
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
            deleteSpecialVarsFromDB(1);
            $scope.hasPendingTransaction = false;
            $scope.pendingTransactionDuration = 0;
            
            //window.location.href = "#/login";
            window.location.href = "#/app/" + home_template + "/" + home_id;
            var alertPopup = $ionicPopup.alert({
                title: 'Success',
                template: '<div style="width:100%;text-align:center">'+$scope.data.message+'<br/>(SCREENSHOT THIS MESSAGE AS A TRANSACTION RECEIPT)</div>'
            });
        }
        else
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Failed',
                template: '<div style="width:100%;text-align:center">'+$scope.data.message+'<br/>(SCREENSHOT THIS MESSAGE AND SEND IT TO ADMINISTRATOR)</div>'
            });
        }

    });
    
    // if post top up error
    $scope.$on('httpService:postRequestError', function () {
        if(retry_counter<3)
        {
            retry_counter++;
            if ($scope.status === 0) {
                // No Internet Connection
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                httpService.post_token($scope, $http, url, obj, 'content');
            }
            else {
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                httpService.post_token($scope, $http, url, obj, 'content');

            }
        }
        else
        {
            retry_counter = 0;
            $ionicLoading.hide();
            $scope.hasPendingTransaction = true;
            $scope.pendingTransactionDuration = extendedDuration;
            var alertPopup = $ionicPopup.alert({
                title: 'Top Up',
                template: '<div style="width:100%;text-align:center">Failed to Top Up. Please check Your Internet Connection and Try Again<br/>(PLEASE SCREENSHOT THIS MESSAGE AND CONTACT ADMINISTRATOR)</div>'
            });
        }

    });
    
    // save receipt success
    $scope.$on('httpService:postSaveTransactionReceiptSuccess', function () {
        console.log("success save receipt");

    });
    
    // if post save receipt error
    $scope.$on('httpService:postSaveTransactionReceiptError', function () {

    });
    
    
    $scope.showDialog = function () {

        var alertPopup = $ionicPopup.alert({
                    title: 'Purchase was successful!',
                    template: 'Check your console log for the transaction data'
                });
                console.log('consume done!');

    };

    $scope.restore = function () {
        $ionicLoading.show({template: spinner + 'Restoring Purchases...'});
        inAppPurchase
            .restorePurchases()
            .then(function (purchases) {
                $ionicLoading.hide();
                console.log(JSON.stringify(purchases));
                $ionicPopup.alert({
                    title: 'Restore was successful!',
                    template: 'Check your console log for the restored purchases data'
                });
            })
            .catch(function (err) {
                $ionicLoading.hide();
                console.log(err);
                $ionicPopup.alert({
                    title: 'Something went wrong',
                    template: 'Check your console log for the error details'
                });
            });
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {

        $scope.content_data = {};

    });
    
    $scope.testSavePending = function () {
    
        var saved_data = new Object;
        saved_data.user_id = user_id;
        saved_data.isUsed = false;
        saved_data.duration = 365;
        saved_data.purchase_data = "data";

        $scope.saveReceipt("test", "inAppPurchaseTopUp", "test", user_id, company_id);
        saveSpecialVarsToDB(1, 'TopUpCtrl', saved_data);
        loadSpecialVarsFromDB(1,$scope);
    }

    $scope.$on('SQLite:getSpecialVarsSuccess', function () {
        if($scope.special_vars.isUsed==false && $scope.special_vars.user_id == user_id)
        {       
            var alertPopup = $ionicPopup.alert({
                title: 'Warning',
                template: '<div style="width:100%;text-align:center">Your last transaction has not been applied please try again by pressing the button.</div>'
            });
            $scope.hasPendingTransaction = true;
            $scope.pendingTransactionDuration = $scope.special_vars.duration;
            //$scope.topUpAccount($scope.special_vars.duration);
        }
        else if($scope.special_vars.isUsed==false)
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Warning',
                template: '<div style="width:100%;text-align:center">Your last transaction of another user has not been applied. Please login using that user to try again (the last pending transaction will be removed if you make another purchase)</div>'
            });
        }
    });

});