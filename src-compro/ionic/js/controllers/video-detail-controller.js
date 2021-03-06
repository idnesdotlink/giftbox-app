/**
 * Created by Audy on 19-Feb-16.
 */
app.controller("VideoDetailCtrl", function ($scope, $http, httpService, $timeout, $cordovaClipboard, $cordovaToast,
                                            $stateParams, $sce, $ionicPlatform, $ionicLoading, $ionicPopup, $rootScope) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    var flagFullscreen = false;

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
        if (loadCompressedImages == false) {
            url = post_content_url + $stateParams.id;
        }
        else {
            url = post_compressed_content_url + $stateParams.id;
        }
        httpService.get($scope, $http, url, 'content', token);
        console.log('VideoDetailCtrl');
        //console.log($scope.);
    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // if get detail book success, set detail book
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            id: $stateParams.id,
            cover: $scope.data.post.featured_image_path,
            title: $scope.data.post.title,
            video_link: $sce.trustAsResourceUrl(getPostMetaValueById($scope.data.post.post_meta, "video_link").value),
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            comment_status: $scope.data.post.comment_status,
            total_likes: $scope.data.post.like_count,
            total_comments: $scope.data.post.comment_count,
            comments: $scope.data.post.comment,
            likes: $scope.data.post.like,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);
        //console.log($scope.content_data);

        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status !== 0) {
            if ($scope.content_data.likes !== undefined && $scope.content_data.likes !== null) {
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }

        $scope.$on('src-loaded', function () {
            var video = document.getElementById("videoIFrame");

            video.onplay = function (e) {
                if (video.webkitEnterFullScreen) {
                    video.webkitEnterFullScreen();
                }
                else if (video.webkitRequestFullScreen) {
                    video.webkitRequestFullScreen();
                }
                else if (video.requestFullscreen) {
                    video.requestFullscreen();
                }
            };

        });

        document.addEventListener("webkitfullscreenchange", function () {
            if (isPhoneGap()) {

                if (!flagFullscreen) {
                    flagFullscreen = true;
                    screen.lockOrientation('landscape-primary');
                }
                else {
                    flagFullscreen = false;
                    screen.lockOrientation('portrait-primary');
                    //screen.unlockOrientation();
                }
            }

        }, false);

        //request compressed image if set to on
        if (loadCompressedImages) {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
        }


        /*video.onwebkitfullscreenchange = function (e) {
         if (video.webkitEnterFullScreen) {
         //video.webkitEnterFullScreen();
         console.log("mulai fullscreen")
         }
         else if (video.webkitCancelFullScreen) {
         //video.webkitEnterFullScreen();

         }
         else if (video.webkitRequestFullScreen) {
         video.webkitRequestFullScreen();
         }
         else if (video.requestFullscreen) {
         video.requestFullscreen();
         }
         if (!e.currentTarget.webkitIsFullScreen) {
         console.log('Not Full Screen');
         } else {
         console.log('Full Screen');
         }


         };
         video.onfullscreenchange = function (e) {
         if (!e.currentTarget.webkitIsFullScreen) {
         console.log('Not Full Screen');



         } else {
         console.log('Full Screen');
         }
         console.log(screen.orientation);
         };*/

    });

    // if get token failed, request token again
    $scope.$on('httpService:postTokenError', function () {
        if ($scope.status === 0) {
            if (isPhoneGap()) {
                loadPostJSONFromDB($stateParams.id, $scope);
            }
        }
        else {
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
        $scope.content_data = {
            id: $stateParams.id,
            cover: updated_data.post.featured_image_path,
            title: updated_data.post.title,
            video_link: $sce.trustAsResourceUrl(getPostMetaValueById(updated_data.post.post_meta, "video_link").value),
            summary: updated_data.post.summary,
            content: updated_data.post.content,
            comment_status: updated_data.post.comment_status,
            total_likes: updated_data.post.like_count,
            total_comments: updated_data.post.comment_count,
            comments: updated_data.post.comment,
            likes: updated_data.post.like,
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
        var obj = serializeData({
            _method: 'POST',
            content: $scope.input.comment,
            post_id: $stateParams.id,
            user_id: user_id,
            company_id: company_id,
            author: username_login
        });

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
        var obj = serializeData({
            _method: 'POST',
            content: '',
            post_id: $stateParams.id,
            user_id: user_id,
            company_id: company_id,
            author: username_login
        });

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

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            id: $stateParams.id,
            cover: $scope.data.post.featured_image_path,
            title: $scope.data.post.title,
            video_link: $sce.trustAsResourceUrl(getPostMetaValueById($scope.data.post.post_meta, "video_link").value),
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            comment_status: $scope.data.post.comment_status,
            total_likes: $scope.data.post.like_count,
            total_comments: $scope.data.post.comment_count,
            comments: $scope.data.post.comment,
            likes: $scope.data.post.like,
            post_meta: $scope.data.post.post_meta
        };

        if ($scope.data.post.term_content_type_id == 3) {
          $scope = replaceLanguagePostTitle($scope);
        }

        //console.log($scope.content_data);

        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status !== 0) {
            if ($scope.content_data.likes !== undefined && $scope.content_data.likes !== null) {
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }

        var video = document.getElementById("videoIFrame");
        video.onplay = function (e) {
            if (video.webkitEnterFullScreen) {
                video.webkitEnterFullScreen();
            }
            else if (video.webkitRequestFullScreen) {
                video.webkitRequestFullScreen();
            }
            else if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        };

        video.onwebkitfullscreenchange = function (e) {
            if (video.webkitEnterFullScreen) {
                video.webkitEnterFullScreen();
            }
            else if (video.webkitRequestFullScreen) {
                video.webkitRequestFullScreen();
            }
            else if (video.requestFullscreen) {
                video.requestFullscreen();
            }
            if (!e.currentTarget.webkitIsFullScreen) {
                console.log('Not Full Screen');
            } else {
                console.log('Full Screen');
            }
        };
        video.onfullscreenchange = function (e) {
            if (!e.currentTarget.webkitIsFullScreen) {
                console.log('Not Full Screen');
            } else {
                console.log('Full Screen');
            }
        };
    });

    $scope.retryLoadContent = function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
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

    $scope.isPhoneGap = function () {
        return isPhoneGap();
    };

    $scope.isIOS = function() {
        return isIOS();
    };

    $scope.isAndroid = function() {
        return isAndroid();
    };

    $scope.nativePlayVideo = function(videoLink) {
        console.log(videoLink);
        window.open(videoLink, '_system');
    };
});
