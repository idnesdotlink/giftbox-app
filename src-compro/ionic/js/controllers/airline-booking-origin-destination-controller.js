app.controller("AirlineBookingOriginDestinationCtrl", function ($scope,
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
    $scope.airline.one_way_direction = true;
    $scope.airline.return_direction = false;
    $scope.airline.search_origin = $rootScope.airline_search_origin;
    $scope.airline.search_destination = $rootScope.airline_search_destination;
    $scope.od = $stateParams.od;

    $ionicPlatform.ready(function () {
        console.log('Airline Booking Controller');
        var url = opsigo_get_airports_by_country_codes;
        httpService.post($scope, $http, url, 'opsigo_get_airports_by_country_codes');
    });

     $scope.$on('httpService:postRequestSuccess', function () {
        console.log($scope.data);
        $scope.content_data = {
            airlines: $scope.data
        };
        $scope.isLoading = false;
    });
    
});

