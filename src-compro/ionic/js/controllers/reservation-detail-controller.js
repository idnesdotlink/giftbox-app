app.controller("ReservationDetailCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    $scope.vt_payment_service = vt_payment_service;

    console.log($stateParams);
    var id = $stateParams.id;

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
        var url = user_reservation_detail + id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('ReservationDetailCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'content');
    });

    // if get data list article success, set list article
    $scope.$on('httpService:getRequestSuccess', function () {

        $scope.content_data = {
            reservation_master: $scope.data.reservation_master,
            reservation_detail: $scope.data.reservation_details,
            title: 'Reservation Detail'
        };

        console.log("Mendapat Reservation Detail");
        console.log($scope.content_data.reservation_master);
        console.log($scope.content_data.reservation_detail);


        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getRequestError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

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
