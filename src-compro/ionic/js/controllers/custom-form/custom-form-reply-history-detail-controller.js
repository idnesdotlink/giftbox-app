app.controller("CustomFormReplyHistoryDetailCtrl", function ($scope,
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
        $scope.text_custom_form_reply_history_detail_title = "History Detail Title";
        $scope.text_custom_form_reply_history_detail_subtitle_data = "Data";
        $scope.text_custom_form_reply_history_detail_subtitle_reply = "Reply";
        $scope.text_custom_form_reply_history_detail_button_approve = "Approve";
        $scope.text_custom_form_reply_history_detail_no_reply_yet = "No reply yet.";
        $scope.text_custom_form_reply_history_detail_popup_text_approve_reply = "Approve this reply?";
        $scope.text_custom_form_reply_history_detail_requested_at = "Requested at";
        $scope.text_custom_form_reply_history_detail_reply_expired_at = "Will expire at";
        $scope.text_popup_custom_form_reply_history_detail_approve_failed_title = "Approve Failed";
        $scope.text_popup_custom_form_reply_history_detail_approve_failed_content = "Failed to approve, please try again later.";
        $scope.text_popup_custom_form_reply_history_detail_approve_failed_button_ok = 'OK';
        $scope.text_popup_custom_form_reply_history_detail_approve_success_title = "Approve Success";
        $scope.text_popup_custom_form_reply_history_detail_approve_success_content = "Successfully approved this reply!  Our representative will contact you soon.";
        $scope.text_popup_custom_form_reply_history_detail_approve_success_button_ok = 'OK';
        $scope.text_popup_custom_form_reply_history_detail_failed_unexpected_error = "Unexpected Error";
        $scope.text_popup_custom_form_reply_history_detail_failed_connection_error = "Connection Error";

        $scope.text_custom_form_reply_history_detail_title = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_title, "History Detail Title");
        $scope.text_custom_form_reply_history_detail_subtitle_data = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_subtitle_data, "Data");
        $scope.text_custom_form_reply_history_detail_subtitle_reply = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_subtitle_reply, "Reply");
        $scope.text_custom_form_reply_history_detail_button_approve = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_button_approve, "Approve");
        $scope.text_custom_form_reply_history_detail_no_reply_yet = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_no_reply_yet,"No reply yet.");
        $scope.text_custom_form_reply_history_detail_popup_text_approve_reply = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_popup_text_approve_reply,"Approve this reply?");
        $scope.text_custom_form_reply_history_detail_requested_at = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_requested_at,"Requested at");
        $scope.text_custom_form_reply_history_detail_reply_expired_at = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_reply_expired_at,"Will expire at");
        $scope.text_custom_form_reply_history_detail_approve_failed_title = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_approve_failed_title,"Approve Failed");
        $scope.text_custom_form_reply_history_detail_approve_failed_content = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_approve_failed_content,"Failed to approve, please try again later.");
        $scope.text_custom_form_reply_history_detail_approve_failed_button_ok = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_approve_failed_button_ok,"OK");
        $scope.text_custom_form_reply_history_detail_approve_success_title = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_approve_success_title,"Approve Success");
        $scope.text_custom_form_reply_history_detail_approve_success_content = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_approve_success_content,'Successfully approved this reply! Our representative will contact you soon.');
        $scope.text_custom_form_reply_history_detail_approve_success_button_ok = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_approve_success_button_ok,"OK");
        $scope.text_custom_form_reply_history_detail_failed_unexpected_error = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_failed_unexpected_error,"Unexpected Error");
        $scope.text_custom_form_reply_history_detail_failed_connection_error = getMenuText(ui_texts_custom_form_reply_history.text_custom_form_reply_history_detail_failed_connection_error,"Connection Error");
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
        url = url_custom_form_reply_history_detail + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('MembershipHistoryDetailCtrl');

    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            admin_reply_content: $scope.data.admin_reply_content,
            user_post: $scope.data.user_post,
            status: $scope.data.status,
            category: $scope.data.category,
            date_created: $scope.data.date_created,
            user_post_unique_id: $scope.data.user_post_unique_id,
            reply_expired_at: $scope.data.reply_expired_at
        };

        console.log("*************************");
        console.log($scope.content_data);
        console.log("*************************");

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
        $ionicLoading.hide();
    };

    // alert fragment
    $scope.showSuccessAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.text_comment_title,
        css: 'cp-button',
        okType:'cp-button',
        template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_success + '</div>'
      });
    };

    $scope.showFailedAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.text_comment_title,
        css: 'cp-button',
        okType:'cp-button',
        template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_error + '</div>'
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

    $scope.approveReply = function(){
        var alertPopup = $ionicPopup.confirm({
            title: $scope.text_custom_form_reply_history_detail_button_approve,
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">'+$scope.text_custom_form_reply_history_detail_popup_text_approve_reply+'</div>'
        }).then(function(res) {
            if(res) {
                $scope.show();
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id });
                $scope.selected_user_post_id = $stateParams.id;
                // get token for posting comment
                httpService.post_token($scope, $http, url, obj, 'custom-form-reply-approve');
            }
        });
    };

    $scope.popupApproveReplyFailed = function(msg){
      var alertPopup = $ionicPopup.alert({
        title: $scope.text_popup_custom_form_reply_history_detail_approve_failed_title,
        template: '<div style="width:100%;text-align:center">'+$scope.text_popup_custom_form_reply_history_detail_approve_failed_content+'<br>' + msg + '</div>',
        buttons: [
          {
            text: $scope.text_popup_custom_form_reply_history_detail_approve_failed_button_ok,
            type: 'cp-button'
          }
        ]
      });
    };

    $scope.popupApproveReplySuccess = function(msg){
      var alertPopup = $ionicPopup.alert({
        title: $scope.text_popup_custom_form_reply_history_detail_approve_success_title,
        template: '<div style="width:100%;text-align:center">'+$scope.text_popup_custom_form_reply_history_detail_approve_success_content+'<br>' + msg + '</div>',
        buttons: [
          {
            text: $scope.text_popup_custom_form_reply_history_detail_approve_success_button_ok,
            type: 'cp-button'
          }
        ]
      });
    };

    $scope.$on('httpService:postTokenCustomFormReplyApproveSuccess',function(){
      var token = $scope.data.token;
      var obj = serializeData({ _method: 'POST', user_post_id: $stateParams.id });
      httpService.post($scope, $http, url_custom_form_reply_approve + company_id + '?token=' + token, obj, 'custom-form-reply-approve');
    });

    $scope.$on('httpService:postTokenCustomFormReplyApproveError',function(){
      $scope.hide();
      $scope.popupApproveReplyFailed('');
    });

    $scope.$on('httpService:postCustomFormReplyApproveSuccess',function(){
      $scope.hide();
      if ($scope.data.success == true){
        $scope.popupApproveReplySuccess('');
        $scope.content_data.status = 'APPROVED';
      }
      else if ($scope.data.success == false){
        var msg = '';
        switch ($scope.data.code){
          case 'UNEXPECTED_ERROR': msg = $scope.text_popup_custom_form_reply_history_detail_failed_unexpected_error; break;
          case 'CONNECTION_ERROR': msg = $scope.text_popup_custom_form_reply_history_detail_failed_connection_error; break;
        }
        $scope.popupApproveReplySuccess(msg);
      }
    });

    $scope.$on('httpService:postCustomFormReplyApproveError',function(){
      $scope.hide();
      $scope.popupApproveReplyFailed('');
    });


});
