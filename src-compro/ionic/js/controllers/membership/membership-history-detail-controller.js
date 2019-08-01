app.controller("MembershipHistoryDetailCtrl", function ($scope,
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
    $scope.currency = currency + " ";

    var loadCustomText = function(){
        $scope.text_membership_history_detail_title = "Points Obtained";
        $scope.text_membership_history_detail_subtitle_purchase = "Transaction Detail";
        $scope.text_membership_history_detail_subtitle_bonus = "Bonus";
        $scope.text_membership_history_detail_subtitle_redeem = "Redeemed Item";
        $scope.text_membership_history_detail_purchase_order_id = "ID";
        $scope.text_membership_history_detail_purchase_price = "Price";
        $scope.text_membership_history_detail_purchase_date = "Purchase Date";
        $scope.text_membership_history_detail_redeem_item_name = "Item Name";
        $scope.text_membership_history_detail_redeem_item_status = "Status";
        $scope.text_membership_history_detail_redeem_item_acquired_date = "Acquired Date";
        $scope.text_membership_history_detail_bonus_description = "Description";
        $scope.text_membership_history_detail_bonus_added_at = "Added At";

        $scope.text_membership_history_detail_title = getMenuText(ui_texts_membership_history.text_membership_history_detail_title, "Points Obtained");
        $scope.text_membership_history_detail_subtitle_purchase = getMenuText(ui_texts_membership_history.text_membership_history_detail_subtitle_purchase, "Transaction Detail");
        $scope.text_membership_history_detail_subtitle_bonus = getMenuText(ui_texts_membership_history.text_membership_history_detail_subtitle_bonus, "Bonus");
        $scope.text_membership_history_detail_subtitle_redeem = getMenuText(ui_texts_membership_history.text_membership_history_detail_subtitle_redeem, "Redeemed Item");
        $scope.text_membership_history_detail_purchase_order_id = getMenuText(ui_texts_membership_history.text_membership_history_detail_purchase_order_id, "ID");
        $scope.text_membership_history_detail_purchase_price = getMenuText(ui_texts_membership_history.text_membership_history_detail_purchase_price, "Price");
        $scope.text_membership_history_detail_purchase_date = getMenuText(ui_texts_membership_history.text_membership_history_detail_purchase_date, "Purchase Date");
        $scope.text_membership_history_detail_redeem_item_name = getMenuText(ui_texts_membership_history.text_membership_history_detail_redeem_item_name, "Item Name");
        $scope.text_membership_history_detail_redeem_item_status = getMenuText(ui_texts_membership_history.text_membership_history_detail_redeem_item_status, "Status");
        $scope.text_membership_history_detail_redeem_item_acquired_date = getMenuText(ui_texts_membership_history.text_membership_history_detail_redeem_item_acquired_date, "Acquired Date");
        $scope.text_membership_history_detail_bonus_description = getMenuText(ui_texts_membership_history.text_membership_history_detail_bonus_description, "Description");
        $scope.text_membership_history_detail_bonus_added_at = getMenuText(ui_texts_membership_history.text_membership_history_detail_bonus_added_at, "Added At");

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
        url = url_membership_history_detail + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('MembershipHistoryDetailCtrl');

    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        var member_trans = $scope.data.member_trans;
        var member_item = $scope.data.member_item;
        var transaction = $scope.data.transaction;

        member_trans.typeBadge = member_trans.type.indexOf('ADMIN') > -1 ? 'ADMIN' : member_trans.type;

        $scope.content_data = {
            member_trans: member_trans,
            item: member_item,
            trans: transaction
        };

        console.log($scope.content_data);

        $scope.isLoading = false;


        if(isPhoneGap())
        {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, $scope.data.detail.term_id, 'MembershipRewardDetailCtrl', $scope.data);
            //console.log('saved');
        }

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

        var member_trans = $scope.data.member_trans;
        var member_item = $scope.data.member_item;
        var transaction = $scope.data.transaction;

        $scope.content_data = {
            member_trans: member_trans,
            item: member_item,
            trans: transaction
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

    $scope.requestDelivery = function(id){
        $scope.chosen_item_id = id;
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_request_delivery_title,
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_request_delivery_content+'</div>',
            buttons: [
                {
                    text: $scope.text_popup_request_delivery_button_no
                },
                {
                    text: $scope.text_popup_request_delivery_button_yes,
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

    $scope.popupRequestDeliveryFailed = function(msg){
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_request_delivery_failed_title,
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_request_delivery_failed_content+'<br>' + msg + '</div>',
            buttons: [
                {
                    text: $scope.text_popup_request_delivery_failed_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.popupRequestDeliverySuccess = function(){
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_request_delivery_success_title,
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_request_delivery_success_content+'</div>',
            buttons: [
                {
                    text: $scope.text_popup_request_delivery_success_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.$on('httpService:postTokenRequestDeliverySuccess',function(){
        var token = $scope.data.token;
        var obj = serializeData({_method: 'POST', user_id: user_id, membership_member_history_detail_id: $scope.chosen_item_id });

        httpService.post($scope, $http, url_membership_request_delivery + company_id + '?token=' + token, obj, 'redeem-item');
    });

    $scope.$on('httpService:postTokenRequestDeliveryError',function(){
        $scope.hide();
        $scope.popupRequestDeliveryFailed('');
    });

    $scope.$on('httpService:postRequestDeliverySuccess',function(){
        $scope.hide();
        if ($scope.data.success == true){
            $scope.popupRequestDeliverySuccess();
        }
        else if ($scope.data.success == false){
            var msg = '';
            switch ($scope.data.code){
                case 'UNEXPECTED_ERROR': msg = $scope.text_popup_request_delivery_failed_unexpected_error; break;
                case 'CONNECTION_ERROR': msg = $scope.text_popup_request_delivery_failed_connection_error; break;
            }
            $scope.popupRequestDeliveryFailed(msg);
        }
    });

    $scope.$on('httpService:postRequestDeliveryError',function(){
        $scope.hide();
        $scope.popupRequestDeliveryFailed('');
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
