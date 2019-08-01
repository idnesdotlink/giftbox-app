app.controller("ArticleDetail4Ctrl", function ($scope, $http, httpService, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, $ionicModal, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaClipboard, $cordovaToast, $timeout, $rootScope) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.images = [];
    $scope.modal_index = 0;
    $scope.isTimeout = false;

    $scope.galleryData = {};

    $scope.loadMenuText = function(){
      $scope.text_comment_title = getMenuText(ui_texts_general.text_comment_title, "Comment");
      $scope.text_comment_alert_success = getMenuText(ui_texts_general.text_comment_alert_success, "Successfully posted comment.");
      $scope.text_comment_alert_error = getMenuText(ui_texts_general.text_comment_alert_error, "Failed to post comment. Please check your internet connection and try again.");
    };

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

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj);

        // variable for saving new comment data
        $scope.list_comment_temp = '';
        $scope.loadMenuText();
    });


    // get token for getting detail data success
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        if(loadCompressedImages==false)
        {
            url = post_content_url + $stateParams.id;
        }
        else
        {
            url = post_compressed_content_url + $stateParams.id;
        }

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('ArticleDetailCtrl');

    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {

        $scope.loadImages = function () {
            var i = 1;

            $scope.images.push({id:0, src: $scope.data.post.featured_image_path});

            var images_temp = getProductDetailImageFromPostMeta($scope.data.post.post_meta, "image_list");

            for (var image in images_temp) {
                $scope.images.push({id: i, src: image.value});
                i++;

            }

            $scope.content_data = {
                id: $stateParams.id,
                title: $scope.data.post.title,
                created_date: $scope.data.post.published_date,
                img_src: $scope.data.post.featured_image_path,
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

            $scope.isLoading = false;

            $scope.comments = $scope.content_data.comments;
            //$scope.isLoading = false;
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
        };

        $scope.loadImages();
        $ionicSlideBoxDelegate.update();


        if(isPhoneGap())
        {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, $scope.data.post.term_id, 'ArticleDetail4Ctrl', $scope.data);
            //console.log('saved');
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
        var i = 1;

        $scope.images[0].src= updated_data.post.featured_image_path;

        var images_temp = getProductDetailImageFromPostMeta(updated_data.post.post_meta, "image_list");

        for (var image in images_temp) {
            $scope.images[i].src=images_temp[image].value;
            i++;

        }
        var images_temp = getProductDetailImageFromPostMeta(updated_data.post.post_meta, "image_list");


        $scope.content_data = {
            id: $stateParams.id,
            title: updated_data.post.title,
            created_date: updated_data.post.published_date,
            img_src: updated_data.post.featured_image_path,
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

        // save to db first page
        if(isPhoneGap())
        {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, updated_data.post.term_id, 'ArticleDetail4Ctrl', updated_data);
            //console.log('saved');
        }

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
        var img_src = $scope.content_data.img_src;
        console.log(img_src);
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.summary, $scope.content_data.title, img_src, playstore_link, 'Read more at');
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.summary, $scope.content_data.title, img_src, appstore_link, 'Read more at');
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

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/product-image-detail-1.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        //success
    }, {
        //error
    });

    // Triggered in the gallery modal to close it
    $scope.closeGallery = function () {
        $scope.modal.hide();
    };

    // Open the gallery modal
    $scope.gallery = function ($idx) {
        $scope.modal_index = $idx;
        //console.log($scope.modal_index);
        $scope.modal.show();
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.loadOfflineImages = function () {


            $scope.images.push({id:0, src: $scope.data.featured_image_path});

            var images_temp = getProductDetailImageFromPostMeta($scope.data.post_meta, "image_list");

            for (var i = 0; i< images_temp.length; i++)
            {
                $scope.images.push({id: i+1, src: images_temp[i].value});

            }

            $scope.content_data = {
                id: $stateParams.id,
                title: $scope.data.post.title,
                created_date: $scope.data.post.published_date,
                img_src: $scope.data.post.featured_image_path,
                summary: $scope.data.post.summary,
                content: $scope.data.post.content,
                comment_status: $scope.data.post.comment_status,
                total_likes: $scope.data.post.like_count,
                total_comments: $scope.data.post.comment_count,
                comments: $scope.data.post.comment,
                likes: $scope.data.post.like,
                post_meta: $scope.data.post.post_meta
            };


            for(var i = 0; i<shoppingCharts.length; i++)
            {
                //console.log(shoppingCharts[i]);
                //console.log(shoppingCharts[i]);

                if(shoppingCharts[i].id === $scope.content_data.id)
                {
                    $scope.inShoppingCarts = true;
                }
            }

            $scope.isLoading = false;
            $scope.$apply();

            if ($scope.content_data.comment_status !== '0') {
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
        };

        $scope.loadOfflineImages();
        $ionicSlideBoxDelegate.update();
    });

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };
});
