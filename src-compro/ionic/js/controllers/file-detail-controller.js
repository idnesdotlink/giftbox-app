app.controller("FileDetailCtrl", function ($scope,
                                           $http,
                                           $rootScope,
                                           httpService,
                                           $stateParams,
                                           $ionicLoading,
                                           $ionicPopup,
                                           $ionicPlatform,
                                           $cordovaClipboard,
                                           $cordovaToast,
                                           $timeout,
                                           $cordovaFileTransfer,
                                           $cordovaLocalNotification) {
    // loading spinner in the beginning
    const googleURL = 'https://docs.google.com/viewer?url=';
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.isDownloaded = false;
    $scope.progressval = 0;
    var path;
    var pdfUrl;

    var loadCustomText = function() {
        $scope.button_text_open = getMenuText(ui_texts_files.button_text_open, "Open");
        $scope.button_text_download = getMenuText(ui_texts_files.button_text_download, "Download");
        $scope.button_text_open_pdf = getMenuText(ui_texts_files.button_text_open_pdf, "Open PDF");
        $scope.text_loading_downloaded = getMenuText(ui_texts_files.text_loading_downloaded, "Downloaded");
        $scope.text_loading_download_complete = getMenuText(ui_texts_files.text_loading_download_complete, "Download Complete");
    };

    loadCustomText();

    $ionicPlatform.ready(function () {

        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }

        $scope.input = {
            comment: ''
        };


        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        httpService.post_token($scope, $http, url, obj);

    });

    // if get token success, request for book detail
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        var url = "";
        if(loadCompressedImages==false)
        {
            url = post_content_url + $stateParams.id;
        }
        else
        {
            url = post_compressed_content_url + $stateParams.id;
        }
        httpService.get($scope, $http, url, 'content', token);
        console.log('FileDetailCtrl');
    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // if get detail book success, set detail book
    $scope.$on('httpService:getRequestSuccess', function () {
        var file_url = getPostMetaValueById($scope.data.post.post_meta, 'file');
        $scope.content_data = {
            id: $stateParams.id,
            cover: $scope.data.post.featured_image_path,
            title: $scope.data.post.title,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            comment_status: $scope.data.post.comment_status,
            total_likes: $scope.data.post.like_count,
            total_comments: $scope.data.post.comment_count,
            comments: $scope.data.post.comment,
            likes: $scope.data.post.like,
            url: (file_url != undefined) ? post_files_base_url + file_url.value : '',
            mime_type: $scope.data.mime_type,
            extension: $scope.data.extension,
            file_name: $scope.data.file_name,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        console.log("$scope.content_data");
        console.log($scope.content_data);

        if(isPhoneGap()) {

            // sementara, nanti diganti filename beserta extensionnya
            if(isAndroid()) {
                var fileLocation = cordova.file.externalDataDirectory + "files/file_" + $scope.content_data.file_name + '.' + $scope.content_data.extension;
            }
            if(isIOS()) {
                var fileLocation = cordova.file.dataDirectory + "files/file_" + $scope.content_data.file_name + '.' + $scope.content_data.extension;   
            }
            path = fileLocation;
            pdfUrl = $scope.content_data.url;

            // check if file existed
            window.resolveLocalFileSystemURL(fileLocation,
                function () {
                    // if exist
                    console.log("File Found");
                    $scope.isDownloaded = true;
                    $scope.$apply();
                },
                function () {
                    // if not exist
                    console.log("File Not Found");
                    $scope.isDownloaded = false;
                    $scope.$apply();
                }
            );
        }
        else {
            pdfUrl = $scope.content_data.url;
        }

        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status != 0) {
            if($scope.content_data.likes !== undefined && $scope.content_data.likes !== null) {
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }

        //request compressed image if set to on
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
        }

    });

    // if get token failed, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadPostJSONFromDB($stateParams.id, $scope);
            }
        }

        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }


    });

    //if get data failed, request token again
    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;

        //console.log(token);
        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
    });

    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;
        var file_url = getPostMetaValueById(updated_data.post.post_meta, 'file');

        $scope.content_data = {
            id: $stateParams.id,
            cover: updated_data.post.featured_image_path,
            title: updated_data.post.title,
            summary: updated_data.post.summary,
            content: updated_data.post.content,
            comment_status: updated_data.post.comment_status,
            total_likes: updated_data.post.like_count,
            total_comments: updated_data.post.comment_count,
            comments: updated_data.post.comment,
            likes: updated_data.post.like,
            url: (file_url != undefined) ? post_files_base_url + file_url.value : '',
            mime_type: updated_data.mime_type,
            extension: updated_data.extension,
            file_name: updated_data.file_name,
            post_meta: updated_data.post.post_meta
        };

        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        //display true resolution image
        console.log('true resolution loaded');

    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getHighResDataError', function (event, args) {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');

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

    // if post comment success
    $scope.$on('httpService:postCommentSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hide();
            $scope.showSuccessAlert();
            $scope.content_data.comments.push($scope.data.comment);
            $scope.content_data.total_comments++;

            $scope.input = {
                comment: ''
            };

            //console.log($scope.comments);
        } else {
            $scope.hide();
            $scope.showFailedAlert();
        }

    });

    $scope.$on('httpService:postCommentError', function () {
        //console.log('failed post comment');
        $scope.hide();
        $scope.showFailedAlert();
    });

    $scope.likeFunction = function () {
        $scope.show();

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

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log($scope.data);
        $scope.content_data = {
            id: $stateParams.id,
            cover: $scope.data.post.featured_image_path,
            title: $scope.data.post.title,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            comment_status: $scope.data.post.comment_status,
            total_likes: $scope.data.post.like_count,
            total_comments: $scope.data.post.comment_count,
            comments: $scope.data.post.comment,
            likes: $scope.data.post.like,
            url: (file_url != undefined) ? post_files_base_url + file_url.value : '',
            mime_type: $scope.data.mime_type,
            extension: $scope.data.extension,
            file_name: $scope.data.file_name
        };


        if(isPhoneGap())
        {
            // sementara, nanti diganti filename beserta extensionnya
            var fileLocation = cordova.file.externalDataDirectory + "files/file_" + $stateParams.id + '.pdf';

            // check if file existed
            window.resolveLocalFileSystemURL(fileLocation,
                function () {
                    // if exist
                    console.log("File Found");
                    $scope.isDownloaded = true;
                    path = fileLocation;
                },
                function () {
                    // if not exist
                    console.log("File Not Found");
                    $scope.isDownloaded = false;
                }
            );
        }

        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status != 0) {
            if($scope.content_data.likes !== undefined && $scope.content_data.likes !== null) {
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }
    });

    $scope.downloadFile = function () {
        $scope.progressval = 0;

        if(isPhoneGap())
        {
            $scope.showDownloadLoading($scope.progressval);

            downloadFile($scope, $cordovaFileTransfer, $cordovaLocalNotification, $scope.content_data.url, 'files', 'file', $scope.content_data.file_name, $scope.content_data.extension);
        }


        /*var now = new Date().getTime() + 1000;  // add 1 seconds to make sure.
         //console.log("Local Notification: Schedule Notif");
         $cordovaLocalNotification.schedule({
         id: 1,
         title: data.title,
         text: data.message
         }).then(function (result) {
         // vibrate device


         });*/
    };

    $rootScope.$on('$cordovaLocalNotification:click',
        function (event, notification, state) {
            // ...
            $scope.openFile();

            // still confuse how to get file mime type
            /*$cordovaFileOpener2.open(
             notification.text,
             ''
             ).then(function() {
             // Success!
             }, function(err) {
             // An error occurred. Show a message to the user
             });
             window.open(notification.text, '_system');
             */
        }
    );

    $scope.openFile = function()
    {
        //console.log(path);
        // window.plugins.fileOpener.open(path);
        cordova.plugins.fileOpener2.open(
          path,
          $scope.content_data.mime_type,
          {
            error : function(e){
              console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
            },
            success : function(){
              console.log("Success opening file.");
            }
          }
        );
    };


    $scope.showDownloadLoading = function (progressval) {
        $ionicLoading.show({
            templateUrl: "templates/download-progress-bar.html",
            scope : $scope
        });
    };

    $scope.hideDownloadLoading = function () {
        $ionicLoading.hide();
    };

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();

    };

    $scope.openPDF = function()
    {
//        window.open(googleURL+pdfUrl,'_blank','location=no');
        $scope.openBrowser(googleURL + pdfUrl);
    };

    $scope.openBrowser = function(url){
        if (!isPhoneGap()){
            window.open(url,'_blank','location=yes');
        }
        else {
            cordova.ThemeableBrowser.open(url, '_blank', {
                statusbar: {
                    color: '#ffffffff'
                },
                toolbar: {
                    height: 44,
                    color: '#ffffffff'
                },
                title: {
                    color: '#212121ff',
                    showPageTitle: true
                },
                backButton: {
                    wwwImage: 'images/drawable-xhdpi/back.png',
                    wwwImagePressed: 'images/drawable-xhdpi/back_pressed.png',
                    wwwImageDensity: 2,
                    align: 'left',
                    event: 'backPressed'
                },
                forwardButton: {
                    wwwImage: 'images/drawable-xhdpi/forward.png',
                    wwwImagePressed: 'images/drawable-xhdpi/forward_pressed.png',
                    wwwImageDensity: 2,
                    align: 'left',
                    event: 'forwardPressed'
                },
                closeButton: {
                    wwwImage: 'images/drawable-xhdpi/close.png',
                    wwwImagePressed: 'images/drawable-xhdpi/close_pressed.png',
                    wwwImageDensity: 2,
                    align: 'right',
                    event: 'closePressed'
                },
                backButtonCanClose: true
            });
        }
    };

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };
});
