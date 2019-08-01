app.controller("ReservationAdminCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    $scope.vt_payment_service = vt_payment_service;

    var isLoadingMoreData = false;

    var loadCustomText = function() {
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });


    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    // if get token for list article success, request list article
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = admin_reservation_list + company_id;
        httpService.get($scope, $http, url, 'reservation', token);
        console.log('ReservationAdminCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'content');
    });

    // if get data list article success, set list article
    $scope.$on('httpService:getReservationListSuccess', function () {

        $scope.content_data = {
            posts: $scope.data.posts,
            title: 'Reservation Admin List'
        };

        console.log("Mendapat Reservation Admin List");
        console.log($scope.content_data.posts);

        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getReservationListError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            posts: $scope.data.posts,
            title: 'Reservation Admin List'
        };

        $scope.isLoading = false;
    });

    $scope.doRefresh = function() {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

});
