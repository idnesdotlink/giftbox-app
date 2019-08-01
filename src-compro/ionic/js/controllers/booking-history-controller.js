app.controller("BookingHistoryCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform, $ionicPopup, $ionicLoading) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;

    var isLoadingMoreData = false;

    var loadCustomText = function() {
        $scope.title_text_booking = getMenuText(ui_texts_bookings.title_text_booking,"Booking");
        $scope.title_text_booking_history = getMenuText(ui_texts_bookings.title_text_booking_history,"Booking History");
        $scope.input_text_name = getMenuText(ui_texts_bookings.input_text_name,"Name");
        $scope.input_text_booking_date = getMenuText(ui_texts_bookings.input_text_booking_date,"Booking Date.");
        $scope.input_text_booking_time = getMenuText(ui_texts_bookings.input_text_booking_time,"Booking Time.");
        $scope.input_text_message = getMenuText(ui_texts_bookings.input_text_message,"Message");
        $scope.ui_text_booking_post = getMenuText(ui_texts_bookings.ui_text_booking_post,'Booking Post');
        $scope.button_text_cancel_booking = getMenuText(ui_texts_bookings.button_text_cancel_booking,'Cancel Booking');
        $scope.button_text_cancelled = getMenuText(ui_texts_bookings.button_text_cancelled,'Cancelled');
        $scope.button_text_confirmed = getMenuText(ui_texts_bookings.button_text_confirmed,'Confirmed');
        $scope.button_text_rejected = getMenuText(ui_texts_bookings.button_text_rejected,'Rejected');
        $scope.alert_text_cancel_this_booking = getMenuText(ui_texts_bookings.alert_text_cancel_this_booking, 'Cancel this booking');
        $scope.alert_text_booking_cancelled_success = getMenuText(ui_texts_bookings.alert_text_booking_cancelled_success, 'Successfully cancelled booking.');
        $scope.alert_text_booking_cancelled_failed = getMenuText(ui_texts_bookings.alert_text_booking_cancelled_failed, 'Failed to cancel booking.');
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
        $scope.currency = currency;
    });


    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    // if get token for list article success, request list article
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = user_booking_history + user_id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('BookingHistoryCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB('-2'+user_id, $scope);
            }
        }
        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });


    $scope.getPostMetaValueById = function (arr, value) {
        return getPostMetaValueById(arr, value);
    };

    // if get data list article success, set list article
    $scope.$on('httpService:getRequestSuccess', function () {

        $scope.content_data = {
            bookings: $scope.data.user_post,
            title: $scope.title_text_booking_history
        };

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        if(isPhoneGap())
        {
            saveTermJSONToDB('-2'+user_id, 'BookingHistoryCtrl', $scope.data);
        }

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

    $scope.getPostMetaValueById = function (arr, value) {
        return getPostMetaValueById(arr, value);
    };

    $scope.$on('BookingHistoryCtrl:getOfflineDataSuccess', function () {
        $scope.content_data = {
            bookings: $scope.data.user_post,
            title: $scope.title_text_booking_history
        };

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };
        $scope.currency = currency + ' ';
        $scope.isLoading = false;
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
        var url = user_booking_history + user_id;
        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage);
        console.log('BookingHistoryCtrl');
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

        Array.prototype.push.apply($scope.content_data.bookings, $scope.data.user_post);

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
            bookings: $scope.data.user_post,
            title: $scope.title_text_booking_history
        };

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };
        $scope.isLoading = false;
    });

    $scope.cancelBooking = function (user_post_id) {
        var alertPopup = $ionicPopup.confirm({
                title: $scope.title_text_booking,
                css: 'cp-button',
                okType:'cp-button',
                okText:$scope.alert_button_ok,
                cancelText: $scope.alert_button_cancel,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_text_cancel_this_booking + '?</div>'
            }).then(function(res) {
                 if(res) {
                        $scope.show();
                        var url = token_url;
                        var obj = serializeData({email: username, password: password, company_id: company_id});
                        $scope.selected_user_post_id = user_post_id;
                        // get token for posting comment
                        httpService.post_token($scope, $http, url, obj, 'booking-cancel');
                 } else {

                 }
            });


    };

    // if get token success, request profile data
    $scope.$on('httpService:postTokenBookingCancelSuccess', function () {
        token = $scope.data.token;
        var url = user_cancel_booking + $scope.selected_user_post_id;
        httpService.get($scope, $http, url, 'booking-cancel', token);
    });

    $scope.$on('httpService:getBookingCancelSuccess', function () {
        $scope.hide();
        $scope.doRefresh();
        if($scope.data.success !== false)
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.title_text_booking,
                css: 'cp-button',
                okType:'cp-button',
                okText:$scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_text_booking_cancelled_success + '</div>'
            });
            //$scope.showSubmitFormSuccessAlert();
        }
        else
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.title_text_booking,
                css: 'cp-button',
                okType:'cp-button',
                okText:$scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center"' + $scope.alert_text_booking_cancelled_failed + '</div>'
            });
        }
    });


    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.$on('httpService:postTokenBookingCancelError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    $scope.$on('httpService:getBookingCancelError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

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
