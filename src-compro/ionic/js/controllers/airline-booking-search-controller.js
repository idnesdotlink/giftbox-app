app.controller("AirlineBookingSearchCtrl", function ($scope,
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
    $scope.content_data = [];
    $scope.airline = {};
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
    $scope.currency = currency + ' ';
    $scope.search_airline = [];

    console.log($stateParams);

    if($stateParams.origin !== undefined) {
        $scope.airline.search_origin = $stateParams.origin;
        $scope.airline.search_origin_code = $stateParams.origin_code;
    }
    if($stateParams.destination !== undefined) {
        $scope.airline.search_destination = $stateParams.destination;
        $scope.airline.search_destination_code = $stateParams.destination_code;
    }
    if($stateParams.round_trip !== undefined) {
        $scope.airline.round_trip = $stateParams.round_trip;
        if($stateParams.round_trip == 'false') $scope.airline.round_trip = false;
        else if($stateParams.round_trip == 'true') $scope.airline.round_trip = true;
        console.log("airline round trip: " + $scope.airline.round_trip);
    }
    if($stateParams.departure_date !== undefined) {
        $scope.airline.departure_date = $stateParams.departure_date;
        $scope.airline.departure_date = $scope.airline.departure_date.replace(/['"]+/g,'');
    }
    if($stateParams.return_date !== undefined) {
        $scope.airline.return_date = $stateParams.return_date;
        $scope.airline.return_date = $scope.airline.return_date.replace(/['"]+/g,'');
    }
    if($stateParams.adult !== undefined) {
        $scope.airline.adult = $stateParams.adult;
    }
    if($stateParams.child !== undefined) {
        $scope.airline.child = $stateParams.child;
    }
    if($stateParams.infant !== undefined) {
        $scope.airline.infant = $stateParams.infant;
    }

    $ionicPlatform.ready(function () {
        console.log('Airline Booking Search Controller');
        var opsigo_data = JSON.parse(opsigo_list);
        for(var i = 0; i < opsigo_data.length;i++){
            if(opsigo_data[i].checked == "YES"){
                $scope.search_airline.push(opsigo_data[i].code);
            }
        }
        console.log($scope.search_airline);
        airlineFindFlights();
    });

    function airlineFindFlights() {
        console.log('airlineFindFlights');
        var url = opsigo_request_flight_v3;
        var obj = serializeData({
            origin: $scope.airline.search_origin_code,
            destination: $scope.airline.search_destination_code,
            departdate: formatDate($scope.airline.departure_date),
            // returndate: $scope.airline.round_trip ? formatDate($scope.airline.return_date) : "",
            adult: $scope.airline.adult,
            child: $scope.airline.child,
            infant: $scope.airline.infant,
            faretype: "Default",
            preferredairlines: JSON.stringify($scope.search_airline)
            // [2,3,4,5,7,8,11]
        });
        $rootScope.airline_search_request = {
            origin: $scope.airline.search_origin_code,
            destination: $scope.airline.search_destination_code,
            departdate: formatDate($scope.airline.departure_date),
            // returndate: $scope.airline.round_trip ? formatDate($scope.airline.return_date) : "",
            adult: $scope.airline.adult,
            child: $scope.airline.child,
            infant: $scope.airline.infant,
            faretype: "Default",
            preferredairlines: JSON.stringify($scope.search_airline)
        };
        console.log(obj);
        httpService.post($scope, $http, url, obj, 'opsigo-request-flight-v3');
    }

    $scope.$on('httpService:postOpsigoRequestFlightV3Success', function () {
        console.log('opsigo-request-flight-v3');
        console.log($scope.data);

        $scope.content_data = {
            airlines: $scope.data,
            flights: $scope.data.Schedules == undefined ? [] : $scope.data.Schedules[0].Flights
        };

        $rootScope.airline_search_result = $scope.content_data.flights;
        console.log($scope.content_data.flights);
        $scope.isLoading = false;
    });

    $scope.$on('httpService:postOpsigoRequestFlightV3Error', function () {
        console.log('opsigo-request-flight-v3-error');
        airlineFindFlights();
    });
    
});

