app.controller("AudioDetailCtrl", function ($scope,
                                            $ionicPopup,
                                            $ionicLoading,
                                            $cordovaMedia,
                                            MediaManager,
                                            $rootScope,
                                            $ionicPlatform,
                                            $ionicLoading,
                                            $ionicPopup,
                                            $state,
                                            $stateParams,
                                            $http,
                                            httpService,
                                            $cordovaClipboard,
                                            $cordovaToast,
                                            $timeout,
                                            $cordovaFileTransfer,
                                            $ionicHistory,
                                            $cordovaLocalNotification) {

    $rootScope.loading = true;
    // loading spinner in the beginning
    $scope.isLoading = true;

    $scope.progressval = 0;
    var path;
    $scope.audioDownloadEnabled = audioDownloadEnabled;

    var loadCustomText = function() {
        $scope.button_text_download = getMenuText(ui_texts_audios.button_text_download, "Download");
        $scope.button_text_downloaded = getMenuText(ui_texts_audios.button_text_downloaded, "Downloaded");
        $scope.ui_text_download_success = getMenuText(ui_texts_audios.ui_text_download_success, "Download Audio Success");
        $scope.ui_text_download_failed = getMenuText(ui_texts_audios.ui_text_download_failed, "Download Audio Failed. Please Check Your Internet Connection and Try Again");
        $scope.title_text_download = getMenuText(ui_texts_audios.title_text_download, "Download");
        $scope.text_loading_downloaded = getMenuText(ui_texts_audios.text_loading_downloaded, "Downloaded");
        $scope.text_loading_download_complete = getMenuText(ui_texts_audios.text_loading_download_complete, "Download Complete");
    };

    loadCustomText();

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

    $ionicPlatform.ready(function () {
        // track cannot be set dynamically, so used the variable that has been set up from check audio controller
        $scope.track = audioTrackData;
        $scope.content_data = audioDetailData;
        $scope.isDownloaded = $scope.content_data.isDownloaded;
        $scope.comments = $scope.content_data.comments;
        $scope.liked = false;

        if ($scope.content_data.comment_status != '0') {
            //console.log($scope.content_data.likes);
            if(audioDetailData.likes !== undefined && audioDetailData.likes !== null)
            {
                //console.log(audioDetailData.likes);
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }

        }

        if(isPhoneGap())path = cordova.file.externalDataDirectory + "/audios/audio" + $scope.content_data.filename + '.mp3';


        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }

        // initializa input text comment
        $scope.input = {
            comment: ''
        };

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        // check if application is running on mobile or website, used for hide play and download controller


        if (isPhoneGap()) {
            // function for stop audio
            $scope.stopPlayback = function () {
                MediaManager.stop();
            };
        }



        // function for downloading audio file
        $scope.downloadAudio = function (audioId) {
            $scope.showDownloadLoading();
            downloadFile($scope, $cordovaFileTransfer, $cordovaLocalNotification, $scope.track.url, 'audios', 'audio', $scope.content_data.filename, 'mp3');
        };

        // function submit comment
        $scope.postComment = function () {
            if ($scope.input.comment !== '') {
                $scope.showLoading();
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                // get token for posting comment
                httpService.post_token($scope, $http, url, obj, 'post_comment');
            }
        };

        $scope.isLoading = false;
    });

    $ionicPlatform.on("resume", function(){
        if (isPhoneGap()) {
            MediaManager.resume();
        }
    });

    $ionicPlatform.on("pause", function(){
        if (isPhoneGap()) {
            MediaManager.play();
        }
    });

    // stop any track before leaving current view
    $scope.$on('$ionicView.beforeLeave', function () {
        if (isPhoneGap()) {
            MediaManager.stop();
        }
        // $ionicHistory.nextViewOptions({
        //     disableBack: true
        // });
        // $ionicHistory.clearHistory();
        // window.location.href = "#/app/" + audioListTemplateName + '/' + audioListTermId;
        // $ionicHistory.clearHistory();
        $rootScope.audioBackOnceMore();
    });

    // if token for post comment success
    $scope.$on('httpService:postTokenCommentSuccess', function () {
        token = $scope.data.token;
        var obj = serializeData({_method: 'POST', content: $scope.input.comment, post_id: $stateParams.id, user_id: user_id, company_id: company_id, author: username_login});
        httpService.post($scope, $http, comments_url + '?token=' + token, obj, 'post_comment');
    });

    // if token for post comment error
    $scope.$on('httpService:postTokenCommentError', function () {
        $scope.hideLoading();
        $scope.showCommentFailedAlert();
    });

    // if post comment success
    $scope.$on('httpService:postCommentSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hideLoading();
            $scope.showCommentSuccessAlert();
            $scope.content_data.comments.push($scope.data.comment);
            $scope.content_data.total_comments++;

            $scope.input = {
                comment: ''
            };
            //console.log($scope.comments);
        } else {
            $scope.hideLoading();
            $scope.showCommentFailedAlert();
        }

    });

    $scope.$on('httpService:postCommentError', function () {
        console.log('failed post comment');
        $scope.hideLoading();
        $scope.showCommentFailedAlert();
    });

    $scope.likeFunction = function () {
        $scope.showLoading();
        console.log('masuk like');

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'post_like');

    };

    $scope.$on('httpService:postTokenLikeSuccess', function () {
        var new_token = $scope.data.token;
        var obj = serializeData({_method: 'POST', content: '', post_id: $stateParams.id, user_id: user_id, company_id: company_id, author: username_login});
        httpService.post($scope, $http, likes_url + '?token=' + new_token, obj, 'post_like');

    });


    $scope.$on('httpService:postLikeSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hideLoading();
            $scope.liked = true;
            $scope.content_data.total_likes++;
        } else {
            $scope.hideLoading();
            $scope.liked = false;
        }

    });

    $scope.$on('httpService:postLikeError', function () {
        $scope.hide();
    });

    $scope.$on('httpService:postTokenLikeError', function () {
        $scope.hide();
    });

    $scope.showDownloadLoading = function (progessval) {
        $ionicLoading.show({
            templateUrl: "templates/download-progress-bar.html",
            scope : $scope
        });
    };

    $scope.hideDownloadLoading = function () {
        $ionicLoading.hide();
    };

    $scope.showLoading = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hideLoading = function () {
        $ionicLoading.hide();
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

    $scope.showCommentSuccessAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_comment_title,
            css: 'cp-button',
            okType:'cp-button',
            okText:$scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_success + '</div>'
        });
    };

    $scope.showCommentFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_comment_title,
            css: 'cp-button',
            okType:'cp-button',
            okText:$scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_success + '</div>'
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

    $rootScope.$on('$cordovaLocalNotification:click',
        function (event, notification, state) {
            $scope.openFile();
        }
    );

    $scope.openFile = function()
    {
        window.plugins.fileOpener.open(path);
    };
});
