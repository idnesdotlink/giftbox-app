app.controller("MembershipMemberItemDetailCtrl", function ($scope,
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
    $scope.enableConfirmTab = true;

    var loadCustomText = function(){

        $scope.button_text_membership_member_item_description = getMenuText(ui_texts_membership_member_items.button_text_membership_member_item_description, 'DESCRIPTION');
        $scope.button_text_membership_member_item_confirm = getMenuText(ui_texts_membership_member_items.button_text_membership_member_item_confirm,'CONFIRM');
        $scope.text_membership_member_item_until = getMenuText(ui_texts_membership_member_items.text_membership_member_item_until,'until');
        $scope.text_input_membership_member_item_label_redeem_password = getMenuText(ui_texts_membership_member_items.text_input_membership_member_item_label_redeem_password,'Code (Filled by Merchant)');
        $scope.text_input_membership_member_item_label_redeem_password_placeholder = getMenuText(ui_texts_membership_member_items.text_input_membership_member_item_label_redeem_password_placeholder,'Input code here...');
        $scope.button_text_membership_member_item_confirm_button_submit = getMenuText(ui_texts_membership_member_items.button_text_membership_member_item_confirm_button_submit, 'Submit');

        $scope.text_popup_redeem_password_title = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_title,'Confirm');
        $scope.text_popup_redeem_password_content = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_content,'Content');
        $scope.text_popup_redeem_password_yes = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_yes,'Yes');
        $scope.text_popup_redeem_password_no = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_no,'No');
        $scope.text_popup_redeem_password_failed_title = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_title,'Confirm Failed');
        $scope.text_popup_redeem_password_failed_content = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_content,'Failed to confirm, please try again.');
        $scope.text_popup_redeem_password_failed_button_ok = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_button_ok,'OK');
        $scope.text_popup_redeem_password_success_title = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_success_title,'Confirm Success');
        $scope.text_popup_redeem_password_success_content = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_success_content,'Reward confirmed successfully!');
        $scope.text_popup_redeem_password_success_button_ok = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_success_button_ok,'OK');
        $scope.text_popup_redeem_password_failed_item_confirmed = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_item_confirmed,'This item was already confirmed.');
        $scope.text_popup_redeem_password_failed_connection_error = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_connection_error,'Please check your internet connection and try again.');
        $scope.text_popup_redeem_password_failed_unexpected_error = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_unexpected_error,'An unexpected error occured. Please contact our admin.');
        $scope.text_popup_redeem_password_failed_item_not_found = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_item_not_found, 'Item not found, please contact admin for more details.');
        $scope.text_popup_redeem_password_failed_verification = getMenuText(ui_texts_membership_member_items.text_popup_redeem_password_failed_verification,'Failed to verify, please input the correct verification code.');
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
        url = url_membership_member_item_detail + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('MembershipMemberItemDetailCtrl');

    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        var product = $scope.data.member_item;
//        console.log("**********************");
//        console.log(product);
//        console.log("**********************");
        $scope.content_data = {
            id: $stateParams.id,
            image: product.image,
            name: product.name,
            type: product.type,
            description: product.description,
            tutorial: product.tutorial,
            status: product.status,
            terms_conditions: product.terms_conditions,
            price: product.price,
            quantity: product.quantity,
            expired_date: product.expired_date,
            end_date: product.end_date,
            has_expired: product.has_expired,
            imgLoadOK: false
        };

        $scope.isLoading = false;
        $scope.enableConfirmTab = $scope.content_data.status === 'ACTIVE' && $scope.content_data.has_expired === 'FALSE';
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

    // alert fragment
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

        var product = $scope.data.member_item;
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

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.confirmPassword = function(){
        $scope.show();

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj,'membership-redeem-password');
    };

    $scope.popupRedeemPasswordFailed = function(msg){
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_redeem_password_failed_title,
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_redeem_password_failed_content+'<br>' + msg + '</div>',
            buttons: [
                {
                    text: $scope.text_popup_redeem_password_failed_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.popupRedeemPasswordSuccess = function(){
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_popup_redeem_password_success_title,
            template: '<div style="width:100%;text-align:center">'+$scope.text_popup_redeem_password_success_content+'</div>',
            buttons: [
                {
                    text: $scope.text_popup_redeem_password_success_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.$on('httpService:postTokenRedeemPasswordSuccess',function(){
        var token = $scope.data.token;
        var obj = serializeData({_method: 'POST', user_id: user_id, item_id: $stateParams.id, redeem_password: $scope.input.redeem_password });

        httpService.post($scope, $http, url_membership_redeem_password + company_id + '?token=' + token, obj, 'membership-redeem-password');
    });

    $scope.$on('httpService:postTokenRedeemPasswordError',function(){
        $scope.hide();
        $scope.popupRedeemPasswordFailed('');
    });

    $scope.$on('httpService:postRedeemPasswordSuccess',function(){
        $scope.hide();
        if ($scope.data.success == true){
            $scope.popupRedeemPasswordSuccess();
            $scope.content_data.status = 'USED';
            $timeout(function(){
                $scope.enableConfirmTab = false;
            }, 100);
        }
        else if ($scope.data.success == false){
            var msg = '';
            switch ($scope.data.code){
                case 'UNEXPECTED_ERROR': msg = $scope.text_popup_redeem_password_failed_unexpected_error; break;
                case 'ITEM_NOT_FOUND': msg = $scope.text_popup_redeem_password_failed_item_not_found;break;
                case 'VERIFICATION_FAILED': msg = $scope.text_popup_redeem_password_failed_verification; break;
                case 'CONNECTION_ERROR': msg = $scope.text_popup_redeem_password_failed_connection_error; break;
            }
            $scope.popupRedeemPasswordFailed(msg);
        }
    });

    $scope.$on('httpService:postRedeemPasswordError',function(){
        $scope.hide();
        $scope.popupRedeemPasswordFailed('');
    });

});
