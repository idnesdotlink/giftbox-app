app.controller("RssReaderCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform, $cordovaInAppBrowser, $rootScope) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;

    $ionicPlatform.ready(function()
    {
        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }

        $scope.isTimeout = false;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        // call angular http service
        httpService.post_token($scope, $http, url, obj);
    });


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

    // get token for getting detail data success
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        var url = "";
        url = post_content_url + $stateParams.id;


        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('RssReaderCtrl');

    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            id: $stateParams.id,
            title: $scope.data.post.title,
            created_date: $scope.data.post.published_date,
            img_src: $scope.data.post.featured_image_path,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        var rss_url = getPostMetaValueById($scope.data.post.post_meta,"rss_url").value;
        var rss_num = getPostMetaValueById($scope.data.post.post_meta,"rss_num").value;

        console.log(rss_url);
        console.log(rss_num);

         // using YQL
        var query = ' select * from feednormalizer where url = "'+rss_url+'" limit '+rss_num+' | sort(field="pubDate", descending="true")  ';
        var url = "https://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query) + "&format=json&callback=";
        console.log(url);

        // using YQL
        $http.get(url)
        .success(function(res) {
//            console.log("*******************");
//            console.log(res);
//            console.log("*******************");
            $scope.isLoading = false;
            if (!res.query.results.error){
                var data = res.query.results.rss.channel;
                $scope.rssTitle = data.title;
                $scope.rssUrl = data.url;
                $scope.rssSiteUrl = data.link;
                $scope.entries = data.item;
            }
            else {
                $scope.isTimeout = true;
                $scope.isLoading = true;
                console.log("ERROR: " + res.query.results.error);
            }
        })
        .error(function(res) {
            $scope.isTimeout = true;
            console.log("ERROR: " + res.query.results.error);
        });

        if(isPhoneGap())
        {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, $scope.data.post.term_id, 'RssReaderCtrl', $scope.data);
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

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

    $scope.addImageClass = function(html){
//        console.log(html);
        var res = html.replace(/<img/g,"<img class='full-image-auto-height'");
//        console.log(res);
        return res;
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log($scope.data);
        $scope.isLoading = false;

        $scope.content_data = {
            id: $stateParams.id,
            title: $scope.data.post.title,
            created_date: $scope.data.post.published_date,
            img_src: $scope.data.post.featured_image_path,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content
        };


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
    });

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };
});
