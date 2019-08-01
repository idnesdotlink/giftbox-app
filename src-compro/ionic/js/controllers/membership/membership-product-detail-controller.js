app.controller("MembershipProductDetailCtrl", function ($scope,
                                              $http,
                                              httpService,
                                              $stateParams,
                                              $ionicLoading,
                                              $ionicPopup,
                                              $ionicHistory,
                                              $ionicPlatform,
                                              $ionicScrollDelegate,
                                              $cordovaClipboard,
                                              $cordovaToast,
                                              $timeout) {

    // loading spinner in the beginning
    $scope.isLoading = true;

    var loadCustomText = function(){
        $scope.button_text_membership_product_buy = getMenuText(ui_texts_membership_products.button_text_membership_product_buy, "Get");
        $scope.button_text_membership_product_tutorial = getMenuText(ui_texts_membership_products.button_text_membership_product_tutorial,"HOW TO REDEEM");
        $scope.button_text_membership_product_terms_conditions = getMenuText(ui_texts_membership_products.button_text_membership_product_terms_conditions, "TERMS & CONDITIONS");
        $scope.button_text_membership_product_description = getMenuText(ui_texts_membership_products.button_text_membership_product_description, "DESCRIPTION");
        $scope.text_popup_redeem_item_title = getMenuText(ui_texts_membership_products.text_popup_redeem_item_title, "Redeem Item");
        $scope.text_popup_redeem_item_content = getMenuText(ui_texts_membership_products.text_popup_redeem_item_content, "Are you sure you want to redeem this item?");
        $scope.text_popup_redeem_item_button_no = getMenuText(ui_texts_membership_products.text_popup_redeem_item_button_no, "No");
        $scope.text_popup_redeem_item_button_yes = getMenuText(ui_texts_membership_products.text_popup_redeem_item_button_yes, "Yes");
        $scope.text_popup_redeem_item_failed_title = getMenuText(ui_texts_membership_products.text_popup_redeem_item_failed_title, 'Redeem Item Failed');
        $scope.text_popup_redeem_item_failed_content = getMenuText(ui_texts_membership_products.text_popup_redeem_item_failed_content, 'Failed to redeem item!');
        $scope.text_popup_redeem_item_failed_button_ok = getMenuText(ui_texts_membership_products.text_popup_redeem_item_failed_button_ok, 'OK');
        $scope.text_popup_redeem_item_success_title = getMenuText(ui_texts_membership_products.text_popup_redeem_item_success_title, 'Redeem Item Success');
        $scope.text_popup_redeem_item_success_content = getMenuText(ui_texts_membership_products.text_popup_redeem_item_success_content, 'Successfully redeemed this item!');
        $scope.text_popup_redeem_item_success_button_ok = getMenuText(ui_texts_membership_products.text_popup_redeem_item_success_button_ok, 'OK');
        $scope.text_popup_redeem_item_failed_stock_unavailable = getMenuText(ui_texts_membership_products.text_popup_redeem_item_failed_stock_unavailable, 'This item is out of stock.');
        $scope.text_popup_redeem_item_failed_unexpected_error = getMenuText(ui_texts_membership_products.text_popup_redeem_item_failed_unexpected_error,'An unexpected error occurred. Please let us know by contacting us.');
        $scope.text_popup_redeem_item_failed_insufficient_points = getMenuText(ui_texts_membership_products.text_popup_redeem_item_failed_insufficient_points,'Please get more points to redeem this item.');
    };

    loadCustomText();

    $ionicPlatform.ready(function(){

        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
        //console.log($ionicHistory.viewHistory());

        // initialize input text comment
        $scope.input = {
            comment: ''
        };

        $scope.liked = false;
        $scope.isTimeout = false;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj);

        // variable for saving new comment data
        $scope.list_comment_temp = '';
    });


    // get token for getting detail data success
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        var url = "";
        url = url_membership_product_detail + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('MembershipRewardDetailCtrl');

    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        var product = $scope.data.membership_product;
        $scope.content_data = {
            id: $stateParams.id,
            image: product.image,
            name: product.name,
            type: product.type,
            description: product.description,
            tutorial: product.tutorial,
            terms_conditions: product.terms_conditions,
            price: product.price,
            quantity: product.quantity,
            end_date: product.end_date,
            imgLoadOK: false
        };

        $scope.isLoading = false;


//        if(isPhoneGap())
//        {
//            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
//            savePostJSONToDB($stateParams.id, $scope.data.product.term_id, 'MembershipRewardDetailCtrl', $scope.data);
//            //console.log('saved');
//        }
//
    });

    // if get token detail data Error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadPostJSONFromDB($stateParams.id, $scope);
            }


        }
        else {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    // if get detail data Error, request token again
    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    // loading fragment
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $scope.hide();
    };

    $scope.showDownloadSuccessAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.title_text_download,
        css: 'cp-button',
        okType:'cp-button',
        okText:$scope.alert_button_ok,
        template: '<div style="width:100%;text-align:center">'+$scope.ui_text_download_success+'</div>'
      });
    };

    $scope.showDownloadFailedAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.title_text_download,
        css: 'cp-button',
        okType:'cp-button',
        okText:$scope.alert_button_ok,
        template: '<div style="width:100%;text-align:center">'+$scope.ui_text_download_failed+'</div>'
      });
    };


  $scope.socialShare = function () {
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.description, $scope.content_data.name, null, playstore_link, 'Read more at');
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.description, $scope.content_data.name, null, appstore_link, 'Read more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log($scope.content_data.description);
            console.log($scope.content_data.name);
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log($scope.data);
        $scope.isLoading = false;

        var product = $scope.data.product;
        $scope.content_data = {
            id: $stateParams.id,
            image: product.image,
            name: product.name,
            type: product.type,
            description: product.description,
            tutorial: product.tutorial,
            terms_conditions: product.terms_conditions,
            price: product.price,
            quantity: product.quantity,
            end_date: product.end_date,
            imgLoadOK: false
        };

    });

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

    $scope.loadImageComplete = function(){
        // flag to disable image loading...
        $scope.content_data.imgLoadOK = true;
    };

    $scope.redeemItem = function(id){
        $scope.chosen_product_id = id;
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_redeem_item_title,
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_redeem_item_content+'</div>',
            buttons: [
                {
                    text: $scope.text_popup_redeem_item_button_no
                },
                {
                    text: $scope.text_popup_redeem_item_button_yes,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        $scope.show();
                        // send redeem item functions here...
                        var url = token_url;
                        var obj = serializeData({email: username, password: password, company_id: company_id});

                        httpService.post_token($scope, $http, url, obj, 'redeem-item');
                    }

                }
            ]
        });
    };

    $scope.popupRedeemItemFailed = function(msg){
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_redeem_item_failed_title,
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_redeem_item_failed_content+'<br>' + msg + '</div>',
            buttons: [
                {
                    text: $scope.text_popup_redeem_item_failed_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.popupRedeemItemSuccess = function(){
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_redeem_item_success_title,
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_redeem_item_success_content+'</div>',
            buttons: [
                {
                    text: $scope.text_popup_redeem_item_success_button_ok,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        window.location.href = '#/app/membership-member-item-detail/' + $scope.data.item_id;
                    }
                }
            ]
        });
    };

    $scope.$on('httpService:postTokenRedeemItemSuccess',function(){
        var token = $scope.data.token;
        var obj = serializeData({_method: 'POST', user_id: user_id, membership_product_id: $scope.chosen_product_id });

        httpService.post($scope, $http, url_membership_redeem_item + company_id + '?token=' + token, obj, 'redeem-item');
    });

    $scope.$on('httpService:postTokenRedeemItemError',function(){
        $scope.hide();
        $scope.popupRedeemItemFailed('');
    });

    $scope.$on('httpService:postRedeemItemSuccess',function(){
        $scope.hide();
        if ($scope.data.success == true){
            $scope.popupRedeemItemSuccess();
        }
        else if ($scope.data.success == false){
            var msg = '';
            switch ($scope.data.code){
                case 'INSUFFICIENT_POINTS': msg = $scope.text_popup_redeem_item_failed_insufficient_points; break;
                case 'UNEXPECTED_ERROR': msg = $scope.text_popup_redeem_item_failed_unexpected_error; break;
                case 'STOCK_UNAVAILABLE': msg = $scope.text_popup_redeem_item_failed_stock_unavailable; break;
            }
            $scope.popupRedeemItemFailed(msg);
        }
    });

    $scope.$on('httpService:postRedeemItemError',function(){
        $scope.hide();
        $scope.popupRedeemItemFailed('');
    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

});
