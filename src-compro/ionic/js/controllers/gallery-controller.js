app.controller("GalleryCtrl", function ($scope, $ionicModal, $http, httpService, $stateParams, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaClipboard, $cordovaToast, $timeout) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;

    $scope.moreData = false;
    $scope.nextPage = '';
    var isLoadingMoreData = false;
    var i = 0;

    $scope.images = [];
    $scope.modal_index = 0;

    $scope.galleryData = {};

    $ionicPlatform.ready(function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        httpService.post_token($scope, $http, url, obj);

    });


    // if get token success, request gallery data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);

        //request compressed image or high res images
        var url = "";
        if(loadCompressedImages==false)
        {
            url = term_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'content', token);
        }
        else
        {
            url = term_compressed_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'content', token);
        }
        console.log('GalleryCtrl');
    });

    // if get gallery data success, set gallery data
    $scope.$on('httpService:getRequestSuccess', function () {
        // set image base url

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.loadImages = function () {

            for (image in $scope.data.term.term_posts) {
                $scope.images.push({id: i, src: image.featured_image_path});
                i++;
//                console.log(i);
            }


            $scope.content_data = {
                title: $scope.data.term.title,
                term_meta: $scope.data.term_meta,
                galleries: $scope.data.term_posts
            };
            $scope = replaceLanguageTitle($scope);

            $scope.moreData = $scope.data.has_next;
            if($scope.moreData)
            {
                $scope.nextPage = $scope.data.next_page;
            }

            $scope.isLoading = false;
        };

        $scope.loadImages();
        $ionicSlideBoxDelegate.update();
        $scope.$broadcast('scroll.refreshComplete');

        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'GalleryCtrl', $scope.data);
        }

        //request compressed image if set to on
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content',1);

        }

    });

    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB($stateParams.id, $scope);
            }
        }
        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }

    });

    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = true;

        //httpService.post_token($scope, $http, url, obj, 'content');
    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;
        var page = args.page;

        //console.log(token);
        var url = term_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token, page);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content',page);
    });

    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;
        var j = 0;

        for (image in updated_data.term.term_posts) {
            $scope.images[((updated_data.next_page-2)*6)+j]={id: ((updated_data.next_page-2)*6)+j, src: image.featured_image_path};
            j++;
        }
        //display true resolution image
        console.log('true resolution loaded');
        for(var i=0;i<updated_data.term_posts.length;i++)
        {
            $scope.content_data.galleries[((updated_data.next_page-2)*6)+i].featured_image_path = updated_data.term_posts[i].featured_image_path;
            $scope.content_data.galleries[((updated_data.next_page-2)*6)+i].content = updated_data.term_posts[i].content;
        }

        // save to db first page
        if(isPhoneGap() && updated_data.next_page==2)
        {
            saveTermJSONToDB($stateParams.id, 'GalleryCtrl', updated_data);
        }


    });

    $scope.$on('httpService:getHighResDataError', function (event, args) {
        var page = args.page;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content',page);

    });

    var defaultModalTemplate = 'templates/gallery-detail-1.html';

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl(defaultModalTemplate, {
        id: 'galleryModal',
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
    $scope.gallery = function ($idx, overrideModalTemplate) {
        $scope.modal_index = $idx;
        $ionicSlideBoxDelegate.update();

        if (overrideModalTemplate != undefined)
        if (defaultModalTemplate !== overrideModalTemplate && overrideModalTemplate !== ''){
            $scope.modal = undefined;
            defaultModalTemplate = overrideModalTemplate;
            $ionicModal.fromTemplateUrl(defaultModalTemplate, {
                id:'galleryModal',
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
                //success
            }, {
                //error
            });
        }

        $ionicSlideBoxDelegate.slide($idx);
        //$ionicSlideBoxDelegate.enableSlide(false);
        if ($scope.modal != undefined)
         $scope.modal.show();
    };

    $scope.socialShare = function(index) {
        var img_src = $scope.content_data.galleries[index].featured_image_path;
        //console.log('share');
        if(isPhoneGap()) {
            if(isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, null, null, img_src, playstore_link, 'See more at');
            }
            else if(isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, null, null, img_src, appstore_link, 'See more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log($scope.content_data.title);
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

    $scope.loadMoreData = function()
    {
        if($scope.moreData && isLoadingMoreData === false)
        {
            console.log('Loading...');
            isLoadingMoreData = true;
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }
        else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        //console.log('lagi');

    };

    $scope.$on('httpService:postTokenGetMoreDataSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        if(loadCompressedImages)
        {
            var url = term_compressed_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        }
        else
        {
            var url = term_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        }
        //console.log($scope.data);

    });

    $scope.$on('httpService:postTokenGetMoreDataError', function () {

        if ($scope.status !== 0)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }


    });

    $scope.$on('httpService:getMoreDataSuccess', function () {
        //console.log($scope.data);

        Array.prototype.push.apply($scope.content_data.galleries, $scope.data.term_posts);

        //track old next page number
        var old_next_page = $scope.nextPage;

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $ionicSlideBoxDelegate.update();
        isLoadingMoreData = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');


        //send request for high res image using old next page number
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content',old_next_page);
        }

    });

    $scope.$on('httpService:getMoreDataError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'more-data-content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log($scope.data);

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.loadOfflineImages = function () {

            for (var i=0; i< $scope.data.term_posts.length; i++) {
                //console.log($scope.data.term_posts[i].featured_image_path);
                $scope.images.push({id: i, src: $scope.data.term_posts[i].featured_image_path});

            }

            $scope.content_data = {
                title: $scope.data.term.title,
                galleries: $scope.data.term_posts
            };

            $scope.moreData = $scope.data.has_next;
            if($scope.moreData)
            {
                $scope.nextPage = $scope.data.next_page;
            }
            //console.log($scope.isLoading);
            $scope.isLoading = false;

        };

        $scope.loadOfflineImages();
        $ionicSlideBoxDelegate.update();
        $scope.$apply();

    });

    $scope.slideHasChanged = function($index){
        $scope.modal_index = $index;
        if($index+2 >= $scope.content_data.galleries.length)
        {
            $scope.loadMoreData();
        }
    };

    $scope.doRefresh = function() {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    };

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

});
