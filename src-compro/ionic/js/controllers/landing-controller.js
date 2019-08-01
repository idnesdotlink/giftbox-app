app.controller("LandingCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;

    $ionicPlatform.ready(function () {
        console.log('LandingCtrl');
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });

    // if get token success, request profile data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);
    });

    // if get profile data success, set profile data
    $scope.$on('httpService:getRequestSuccess', function () {
        var logo = $scope.data.post.post_meta.length > 0 ? getPostMetaValueById($scope.data.post.post_meta, "logo").value : null;
        $scope.content_data = {
            title: $scope.data.post.title,
            img_src: $scope.data.post.featured_image_path,
            logo: logo
            //logo: getPostMetaValueById($scope.data.post.post_meta, "logo").value
        };
        $scope.isLoading = false;
        
        //save to db
        if(isPhoneGap()) {
            saveTermJSONToDB($stateParams.id, 'LandingCtrl', $scope.data);
        }
    });

    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0) {
            if(isPhoneGap()) {
                loadTermJSONFromDB($stateParams.id,$scope);
            }
        }
        else {
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

    $scope.$on('SQLite:getOfflineDataSuccess', function() {
        var logo = $scope.data.post.post_meta.length > 0 ? getPostMetaValueById($scope.data.post.post_meta, "logo").value : null;
        $scope.content_data = {
            title: $scope.data.post.title,
            img_src: $scope.data.post.featured_image_path,
            logo: logo
            //logo: getPostMetaValueById($scope.data.post.post_meta, "logo").value
        };
        $scope.isLoading = false;
    });
    
    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        
        $scope.isTimeout = false;
        
        httpService.post_token($scope, $http, url, obj, 'content');
    };
});