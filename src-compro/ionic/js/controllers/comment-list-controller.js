app.controller("CommentListCtrl", function ($scope,
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


        // get data
        url = comment_list_url + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('CommentListCtrl');
    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            comments: $scope.data.comments
        };

        console.log($scope.content_data);
        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status != '0') {
            if($scope.content_data.likes !== undefined && $scope.content_data.likes !== null)
            {
                console.log('bisa like');
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    console.log('pernah like');
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }
    });

    // if get detail data Error, request token again
    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    // function submit comment
    $scope.postComment = function () {
        if ($scope.input.comment !== '') {
            $scope.show();
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});

            // get token for posting comment
            httpService.post_token($scope, $http, url, obj, 'post_comment');
        }
    };

    // if token for post comment success
    $scope.$on('httpService:postTokenCommentSuccess', function () {
        token = $scope.data.token;
        //console.log('token post comment = ' + token);
        var obj = serializeData({_method: 'POST', content: $scope.input.comment, post_id: $stateParams.id, user_id: user_id, company_id: company_id, author: username_login});

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

    $scope.likeFunction = function () {
        $scope.show();
        console.log('masuk like');

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'post_like');
    };

    $scope.$on('httpService:postTokenLikeSuccess', function () {
        var new_token = $scope.data.token;
        //console.log('token post Likes = ' + new_token);
        var obj = serializeData({_method: 'POST', content: '', post_id: $stateParams.id, user_id: user_id, company_id: company_id, author: username_login});

        // post comment
        httpService.post($scope, $http, likes_url + '?token=' + new_token, obj, 'post_like');
    });

    $scope.$on('httpService:postLikeSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hide();
            $scope.liked = true;
            $scope.content_data.total_likes++;
        } else {
            $scope.hide();
            $scope.liked = false;
        }

    });

    $scope.$on('httpService:postLikeError', function () {

        $scope.hide();

    });

    $scope.$on('httpService:postTokenLikeError', function () {
        $scope.hide();
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

    $scope.socialShare = function () {
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.summary, $scope.content_data.title, null, playstore_link, 'Read more at');
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.summary, $scope.content_data.title, null, appstore_link, 'Read more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log($scope.content_data.summary);
            console.log($scope.content_data.title);
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

    $scope.retryLoadContent = function(){
        url = comment_list_url + $stateParams.id;

        $scope.isTimeout = false;

        httpService.get($scope, $http, url, 'content', token);
    };


});
