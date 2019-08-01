app.controller("TestimonialCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform,$ionicLoading,$ionicPopup) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    var isLoadingMoreData = false;

    var loadCustomText = function() {
        $scope.input_error_text_must_be_filled = getMenuText(ui_texts_general.input_error_text_must_be_filled, 'must be filled.');
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        $scope.post_id = $stateParams.post_id;
        console.log($scope.post_id);
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
        if($stateParams.id != undefined){
            url = edit_comment_url + $stateParams.id;
            httpService.get($scope, $http, url, 'edit-comment', token);
            console.log('EditComment');
        }
        // get data
        url = comment_list_url + $stateParams.post_id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('TestimonialCtrl');
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // httpService.post_token($scope, $http, url, obj);
        // $scope.currency = currency;
    });

    $scope.editComment = function (){
        var obj = serializeData({_method: 'POST', content: $scope.input.comment});

        // post comment
        httpService.post($scope, $http, edit_comment_url + $stateParams.id, obj, 'post_edit_comment');
    };

    $scope.$on('httpService:postEditCommentSuccess', function () {
        $scope.showSuccessEditCommentAlert();
    });

    // if token for post comment error
    $scope.$on('httpService:postEditCommentError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    $scope.$on('httpService:getEditCommentSuccess', function () {
        $scope.input.comment = $scope.data.content;
        // token = $scope.data.token;
        // console.log($scope.post_id);
        // //console.log('token post comment = ' + token);
        // var obj = serializeData({_method: 'POST', content: $scope.input.comment, post_id: $scope.post_id, user_id: user_id, company_id: company_id, author: username_login});

        // // post comment
        // httpService.post($scope, $http, comments_url + '?token=' + token, obj, 'post_comment');
    });

    // if token for post comment error
    $scope.$on('httpService:getEditCommentError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        var title = $scope.data.title[language];
        if(title == undefined){
            title = $scope.data.title.english;
        }
        $scope.content_data = {
            title: title,
            comments: $scope.data.comments
        };

        console.log($scope.content_data);
        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
    });

    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    $scope.doRefresh = function() {
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function(){
        url = comment_list_url + $stateParams.post_id;

        $scope.isTimeout = false;

        httpService.get($scope, $http, url, 'content', token);
    };

    $scope.postCommentGuest = function () {
        //console.log('token post comment = ' + token);
        var guest = null;
        console.log($scope.input.comment);
        console.log($scope.post_id);
        console.log(guest);
        console.log(company_id);
        var obj = serializeData({_method: 'POST', content: $scope.input.comment, post_id: $scope.post_id, user_id: guest, company_id: company_id, author: "Guest"});

        // post comment
        httpService.post($scope, $http, comments_guest_url, obj, 'post_comment');
    };

    $scope.postComment = function () {
        console.log($scope.input.comment);
        if ($scope.input.comment !== '') {
            $scope.show();
            if($scope.isLogin){
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                
                // get token for posting comment
                httpService.post_token($scope, $http, url, obj, 'post_comment');
            }
            else{
                $scope.postCommentGuest();
            }
        }
    };

    $scope.$on('httpService:postTokenCommentSuccess', function () {
        token = $scope.data.token;
        console.log($scope.post_id);
        //console.log('token post comment = ' + token);
        var obj = serializeData({_method: 'POST', content: $scope.input.comment, post_id: $scope.post_id, user_id: user_id, company_id: company_id, author: username_login});

        // post comment
        httpService.post($scope, $http, comments_url + '?token=' + token, obj, 'post_comment');
    });

    // if token for post comment error
    $scope.$on('httpService:postTokenCommentError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    // if post comment success, show notification
    $scope.$on('httpService:postCommentSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hide();
            $scope.showSuccessAlert();
            $scope.content_data.comments.push($scope.data.comment);
            $scope.content_data.total_comments++;

            $scope.input.comment = '';

            //console.log($scope.comments);
        } else {
            $scope.hide();
            $scope.showFailedAlert();
        }

    });

    $scope.$on('httpService:postCommentError', function () {
        console.log('failed post comment');
        $scope.hide();
        $scope.showFailedAlert();
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
          okText:$scope.alert_button_ok,
          template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_success + '</div>'
        });
    };

    $scope.showFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_comment_title,
            css: 'cp-button',
            okType:'cp-button',
            okText:$scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_error + '</div>'
        });
    };

    $scope.showSuccessEditCommentAlert = function () {
        var alertPopup = $ionicPopup.alert({
          title: $scope.text_comment_title,
          css: 'cp-button',
          okType:'cp-button',
          okText:$scope.alert_button_ok,
          template: '<div style="width:100%;text-align:center">' + $scope.text_edit_comment_alert_success + '</div>'
        });
    };

});
