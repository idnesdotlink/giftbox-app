app.controller("AirlineBookingCtrl", function ($scope,
                                     $rootScope,
                                     $http,
                                     httpService,
                                     $stateParams,
                                     $ionicModal,
                                     $ionicPlatform,
                                     $cordovaClipboard,
                                     $cordovaToast,
                                     $ionicGesture,
                                     $ionicPopup,
                                     //adMobService,
                                     $filter,
                                     $timeout) {

    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.airline = {};
    $scope.date_rdv = $filter('date')(Date.now(), 'yyyy-MM-dd');
    $scope.airline.departure_date = "";
    $scope.airline.return_date = "";
    $scope.airline.round_trip = false;
    $scope.airline.search_origin = $rootScope.airline_search_origin;
    $scope.airline.search_origin_code = $rootScope.airline_search_origin_code;
    $scope.airline.search_destination = $rootScope.airline_search_destination;
    $scope.airline.search_destination_code = $rootScope.airline_search_destination_code;
    $scope.airline.adult = 1;
    $scope.airline.child = 0;
    $scope.airline.infant = 0;
    $scope.airline_result = $rootScope.airline_result;
    $scope.button_text_login = getMenuText(ui_texts_login.button_text_login, "Log in");

    console.log($stateParams);

    if($stateParams.origin !== undefined) {
        $rootScope.airline_search_origin = $stateParams.origin;
        $rootScope.airline_search_origin_code = $stateParams.origin_code;
        $scope.airline.search_origin = $stateParams.origin;
        $scope.airline.search_origin_code = $stateParams.origin_code;
    }
    if($stateParams.destination !== undefined) {
        $rootScope.airline_search_destination = $stateParams.destination;
        $rootScope.airline_search_destination_code = $stateParams.destination_code;
        $scope.airline.search_destination = $stateParams.destination;
        $scope.airline.search_destination_code = $stateParams.destination_code;
    }

    $ionicPlatform.ready(function () {
        console.log('Airline Booking Controller');
        console.log($rootScope.user_id);
        if($rootScope.user_id != undefined){
            $scope.isLogin = true;
        }
        else{
            $scope.isLogin = false;
        }
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });

     $scope.$on('httpService:postTokenSuccess', function () {
        $scope.isLoading = false;
    });

    $scope.formatDate = function(_date) {
        return formatDate(_date);
    }

    $scope.showLoginAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "Warning",
            template: '<div style="width:100%;text-align:center">Please Login Before Access Airline Booking</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                },
                {
                    text: $scope.button_text_login,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        $rootScope.login_redirect_location = '#/app/airline-booking';
                        window.location.href= "#/app/login/-1" ;
                    }
                }
            ]
        });
    };

    $scope.validateSubmit = function() {
        if($rootScope.user_id == undefined) {
            $scope.showLoginAlert();
        }
        else
        {
            var total_passenger = parseFloat($scope.airline.adult) + parseFloat($scope.airline.child);
            var alert_message = "";

            console.log("adult: " + $scope.airline.adult);
            console.log("child: " + $scope.airline.child);
            console.log("infant: " + $scope.airline.infant);
            console.log("total: " + total_passenger);
            console.log("return_date: " + $scope.airline.return_date);
            console.log("departure_date: " + $scope.airline.departure_date);
            console.log("roundtrip: " + $scope.airline.round_trip);

            if($scope.airline.adult == 0) {
                alert_message = "Minimum number of adult must be 1 (one)";
                $scope.showBookingAlert(alert_message);
            }
            else if(total_passenger > 6) {
                alert_message = "Only six (6) adult and child passengers are allowed in each booking";
                $scope.showBookingAlert(alert_message);
            }
            else if($scope.airline.infant > 4) {
                alert_message = "Only four (4) infant passengers are allowed in each booking";
                $scope.showBookingAlert(alert_message);
            }
            else if($scope.airline.infant > $scope.airline.adult) {
                alert_message = "The number of infants must not exceed the number of adult passenger(s)";
                $scope.showBookingAlert(alert_message);
            }
            else if($scope.airline.departure_date == undefined || $scope.airline.departure_date == '') {
                alert_message = "Please input departure date";
                $scope.showBookingAlert(alert_message);
            }
            else if($scope.airline.round_trip) {
                if($scope.airline.return_date == undefined || $scope.airline.return_date == '') {
                    alert_message = "Please input return date";
                    $scope.showBookingAlert(alert_message);
                }   
                window.location.href= "#/app/airline-booking-search?round_trip="+$scope.airline.round_trip+"&origin="+$scope.airline.search_origin+"&destination="+$scope.airline.search_destination+"&origin_code="+$scope.airline.search_origin_code+"&destination_code="+$scope.airline.search_destination_code+"&departure_date="+$scope.airline.departure_date+"&return_date="+$scope.airline.return_date+"&adult="+$scope.airline.adult+"&child="+$scope.airline.child+"&infant="+$scope.airline.infant;
            }
            else {
                window.location.href= "#/app/airline-booking-search?round_trip="+$scope.airline.round_trip+"&origin="+$scope.airline.search_origin+"&destination="+$scope.airline.search_destination+"&origin_code="+$scope.airline.search_origin_code+"&destination_code="+$scope.airline.search_destination_code+"&departure_date="+$scope.airline.departure_date+"&return_date="+$scope.airline.return_date+"&adult="+$scope.airline.adult+"&child="+$scope.airline.child+"&infant="+$scope.airline.infant;
            }
        }
    }

    $scope.showBookingAlert = function (alert_message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Booking Validation',
            template: '<div style="width:100%;text-align:center">'+ alert_message +'</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button',
                }
            ]
        });
    };
});

