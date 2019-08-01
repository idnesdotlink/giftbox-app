app.controller("CheckAudioFileCtrl", function ($scope,
                                               $rootScope,
                                               $timeout,
                                               $ionicLoading,
                                               $stateParams,
                                               $http,
                                               httpService,
                                               $ionicPlatform,
                                               $ionicHistory) {
    var fileLocation = '';
    $ionicPlatform.ready(function () {

        $scope.isLoading = true;
        $scope.isDownloaded = false;
        $scope.isTimeout = false;
        // if running in mobile, check for audio existency
        if (isPhoneGap()) {
            //console.log('dari hp');
            // default local audio file location
            //downloadFile($scope, $cordovaFileTransfer, $cordovaLocalNotification, $scope.track.url, 'audios', 'audio', $scope.content_data.filename, 'mp3');
            fileLocation = cordova.file.externalDataDirectory + "/" + "audios" + "/" + "audio" +"_" + $stateParams.filename + ".mp3";

            // check if file audio exist
            window.resolveLocalFileSystemURL(fileLocation,
                function () {
                    // if exist
                    console.log("Audio File Found, Audio will play with local file");
                    $scope.isDownloaded = true;
                    $scope.$broadcast('CheckAudioFileCtrl:checkFileDone');

                },
                function () {
                    // if not exist
                    console.log("No Audio File Found, Audio will streaming from API");
                    $scope.isDownloaded = false;
                    // set file location with url for streaming

                    fileLocation = post_files_base_url + $stateParams.filename;
                    //console.log(fileLocation);
                    $scope.$broadcast('CheckAudioFileCtrl:checkFileDone');
                }
            );
        } else {
            $timeout(function () {
                $scope.$broadcast('CheckAudioFileCtrl:checkFileDone');
            });
            //$scope.$broadcast('CheckAudioFileCtrl:checkFileDone');
            fileLocation = post_files_base_url + $stateParams.filename;
            //console.log('dari browser');
        }
    });



    //fileLocation = "http://192.168.0.35:8079/audio/test.mp3";


    // event after finished checking file existency
    $scope.$on('CheckAudioFileCtrl:checkFileDone', function () {
        console.log("masuk check file done");

        // set new location for audio file
        audioFileLocation = fileLocation;

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj);

    });

    // if get token success, request for data audio detail
    $scope.$on('httpService:postTokenSuccess', function () {
        console.log('masuk post token success');
        token = $scope.data.token;
        //console.log($scope.data.token);
        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);

    });

    // if get audio detail success, set to variable
    $scope.$on('httpService:getRequestSuccess', function () {
        console.log('masuk getRequestSuccess');
        //console.log(audioFileLocation);

        // set up parameter for playing audio
        audioTrackData = {
            url: audioFileLocation,
            artist: getPostMetaValueById($scope.data.post.post_meta, 'artist').value,
            title: $scope.data.post.title,
            art: $scope.data.post.featured_image_path
        };

        audioDetailData = {
            id: $scope.data.post.id,
            filename: $stateParams.filename,
            title: $scope.data.post.title,
            created_date: $scope.data.post.published_date,
            img_src: $scope.data.post.featured_image_path,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            total_likes: $scope.data.post.like_count,
            total_comments: $scope.data.post.comment_count,
            comment_status: $scope.data.post.comment_status,
            comments: $scope.data.post.comment,
            likes: $scope.data.post.like,
            isDownloaded: $scope.isDownloaded
        };

        //console.log($scope.data);

        // redirect to playlist detail page
        $scope.isLoading = false;

        window.location.href = "#/app/" + $stateParams.template_name + "/" + $stateParams.id;

    });

    $rootScope.audioBackOnceMore = function(){
      $ionicHistory.goBack();
    };

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

    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        //console.log(audioFileLocation);
        //console.log($scope.data);
        // set up parameter for playing audio
        audioTrackData = {
            url: audioFileLocation,
            artist: getPostMetaValueById($scope.data.post_meta, 'artist').value,
            title: $scope.data.title,
            art: $scope.data.featured_image_path
        };

        audioDetailData = {
            id: $scope.data.post.id,
            filename: $stateParams.filename,
            title: $scope.data.post.title,
            created_date: $scope.data.post.published_date,
            img_src: $scope.data.post.featured_image_path,
            summary: $scope.data.post.summary,
            content: $scope.data.post.content,
            total_likes: $scope.data.post.like_count,
            total_comments: $scope.data.post.comment_count,
            comment_status: $scope.data.post.comment_status,
            comments: $scope.data.post.comment,
            likes: $scope.data.post.like,
            isDownloaded: $scope.isDownloaded
        };

        // redirect to playlist detail page
        $scope.isLoading = false;

        window.location.href = "#/app/" + $stateParams.template_name + "/" + $stateParams.id;
    });

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };
});
