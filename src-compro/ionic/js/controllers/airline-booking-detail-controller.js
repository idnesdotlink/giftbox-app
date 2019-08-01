app.controller("AirlineBookingDetailCtrl", function ($scope,
                                     $rootScope,
                                     $http,
                                     httpService,
                                     $stateParams,
                                     $ionicModal,
                                     $ionicPlatform,
                                     $cordovaClipboard,
                                     $cordovaToast,
                                     $ionicGesture,
                                     //adMobService,
                                     $timeout) {

    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.airline = {};
    $scope.airline.booking_id = "-999";
    $scope.airline.search_origin = $rootScope.airline_search_origin;
    $scope.airline.search_destination = $rootScope.airline_search_destination;
    $scope.airline_search_result = $rootScope.airline_search_result;
    $scope.airline_search_return_result = $rootScope.airline_search_return_result;
    $scope.airline_search_request = $rootScope.airline_search_request;
    $scope.airline_search_return_request = $rootScope.airline_search_return_request;
    $scope.airline.round_trip = false;
    $scope.airline.return = false;
    $scope.airline.menu = "";
    $scope.currency = currency + ' ';

    console.log($stateParams);
    console.log($rootScope.airline_search_request);

    if($stateParams.airline_booking_id !== undefined) {
        $scope.airline.booking_id = $stateParams.airline_booking_id;
    }
    if($stateParams.return !== undefined) {
        $scope.airline.return = $stateParams.return;
    }
    if($stateParams.menu !== undefined) {
        $scope.airline.menu = $stateParams.menu;
    }

    $ionicPlatform.ready(function () {
        console.log('Airline Booking Detail Controller');
        $scope.content_data = {
            flights: $scope.airline.return ? $rootScope.airline_search_return_result : $rootScope.airline_search_result
        };

        console.log($scope.content_data.flights);
    });
});

