app.controller("ReservationCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
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
        var url = user_reservation_list + user_id;
        httpService.get($scope, $http, url, 'reservation', token);
        console.log('ReservationCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB('-1'+user_id, $scope);
            }
        }
        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    // if get data list article success, set list article
    $scope.$on('httpService:getReservationListSuccess', function () {

        $scope.content_data = {
            reservations: $scope.data.reservations,
            title: 'Reservation List'
        };
        for(var i = 0; i < $scope.content_data.reservations.length; i++){
            if($scope.content_data.reservations[i].post.title.length > 11){
                console.log("woi");
                $scope.content_data.reservations[i].post.title = $scope.content_data.reservations[i].post.title.substring(0,10) + '...';
            }
        }
        console.log("Mendapat Reservation List");
        console.log($scope.content_data.reservations);

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
        // save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB('-1'+user_id, 'ReservationCtrl', $scope.data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId('-1'+user_id);
            for(var i=0; i< $scope.data.term_posts.length; i++)
            {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB($scope.data.term_posts[i].id, $scope.data.term_posts[i].term_id, 'ReservationCtrl', $scope.data.term_posts[i]);

            }
        }
    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getReservationListError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.loadMoreData = function()
    {
        if($scope.moreData && isLoadingMoreData === false)
        {
            isLoadingMoreData = true;
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }
        else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        //console.log('lagi' + ' ' + $scope.moreData + " " + isLoadingMoreData.toString());

    };

    $scope.$on('httpService:postTokenGetMoreDataSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = user_reservation_list + user_id;
        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        console.log('ReservationCtrl');
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
        //console.log($scope.data.term_posts);

        Array.prototype.push.apply($scope.content_data.reservations, $scope.data.reservations);

        //track old next page number
        var old_next_page = $scope.nextPage;

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        isLoadingMoreData = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');

    });

    $scope.$on('httpService:getMoreDataError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'more-data-content');

    });

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            reservations: $scope.data.reservations,
            title: 'Reservation List'
        };

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

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
