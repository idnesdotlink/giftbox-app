app.controller("GosendMapCtrl", function ($scope, $ionicModal, $http, httpService, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaClipboard, $cordovaToast, $timeout, $rootScope) {
    $rootScope.destination_gosend_lat = 0;
    $rootScope.destination_gosend_lng = 0;
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;


    $scope.getCostGoSend = function(){
        console.log("Masuk function gosend");
        var originLat = $scope.gosend_origin_lat;//-6.143367;
        var originLng = $scope.gosend_origin_lng;//106.876846;
        var destinationLat = $rootScope.destination_gosend_lat;
        var destinationLng = $rootScope.destination_gosend_lng;
        //$scope.showLoading();
        var url = url_gosend_estimate_price + originLat + "/" + originLng + "/" + destinationLat + "/" + destinationLng;
        $scope.urlGetGoSendPrice = url;
        httpService.get($scope, $http, url, 'gosend-cost', $scope.data.token);
    };

    $ionicPlatform.ready(function () {
        console.log("ionic platform ready");
        var myLocation = {lat: -34.397, lng: 150.644};
        var map;
        var btnLocation = document.getElementById("btn-location");
        function initialize() {
            var mapOptions = {
                center: { lat: 28.613939, lng: 77.209021 },
                zoom: 13,
                disableDefaultUI: true, // To remove default UI from the map view
                scrollwheel: false
            };
    
            $scope.disableTap = function() {
                var container = document.getElementsByClassName('pac-container');
                angular.element(container).attr('data-tap-disabled', 'true');
                var backdrop = document.getElementsByClassName('backdrop');
                angular.element(backdrop).attr('data-tap-disabled', 'true');
                angular.element(container).on("click", function() {
                    document.getElementById('pac-input').blur();
                });
            };
    
            map = new google.maps.Map(document.getElementById('map_gosend'),
                mapOptions);

            var input = /** @type {HTMLInputElement} */ (
                document.getElementById('pac-input'));
    
            // Create the autocomplete helper, and associate it with
            // an HTML text input box.
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);
    
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    $rootScope.destination_gosend_lat = position.coords.latitude;
                    $rootScope.destination_gosend_lng = position.coords.longitude;
                    myLocation.lat = position.coords.latitude;
                    myLocation.lng = position.coords.longitude;
                    console.log("gosend-map-geolocation");
                    console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                    $scope.getCostGoSend();
                    infowindow.setPosition(pos);
                    infowindow.setContent('Location found.');
                    infowindow.open(map);
                    map.setCenter(pos);
                }, function() {
                  handleLocationError(true, infowindow, map.getCenter());
                });
            } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infowindow, map.getCenter());
            }

            function handleLocationError(browserHasGeolocation, infowindow, pos) {
                infowindow.setPosition(pos);
                infowindow.setContent(browserHasGeolocation ?
                                      'Error: The Geolocation service failed.' :
                                      'Error: Your browser doesn\'t support geolocation.');
                infowindow.open(map);
            }

            marker.addListener('click', toggleBounce);
            function toggleBounce() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            // google.maps.event.addListener(marker, 'dragend', function(e) 
            // {
            //     console.log(e);
            //     console.log(marker.getPosition());
            //     map.setCenter(this.getPosition());
            //     //updatePosition(this.getPosition().lat(), this.getPosition().lng());
            //     // $rootScope.destination_gosend_lat = place.geometry.location.lat();
            //     // $rootScope.destination_gosend_lng = place.geometry.location.lng();
            // });

            // google.maps.event.addListener(map, 'drag', function () {
            //     marker.setPosition(this.getCenter()); // set marker position to map center
            //     //updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
            // });

            // google.maps.event.addListener(map, 'dragend', function () {
            //     marker.setPosition(this.getCenter()); // set marker position to map center
            //     //updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
            // });

            // Get the full place details when the user selects a place from the
            // list of suggestions.
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                infowindow.close();
                var place = autocomplete.getPlace();
                $rootScope.destination_gosend_lat = place.geometry.location.lat();
                $rootScope.destination_gosend_lng = place.geometry.location.lng();
                myLocation.lat = place.geometry.location.lat();
                myLocation.lng = place.geometry.location.lng();
                $scope.getCostGoSend();
                console.log("gosend-map");
                console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                if (!place.geometry) {
                    return;
                }
    
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }
    
                // Set the position of the marker using the place ID and location.
                marker.setPlace( /** @type {!google.maps.Place} */ ({
                    placeId: place.place_id,
                    location: place.geometry.location
                }));
                marker.setVisible(true);
    
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, marker);
            });
        }
        initialize();
        // btnLocation.addEventListener('click', function() {
        //     goToMyLocation();
        // });
        
        function goToMyLocation() {
            console.log("Mengcenterkan");
            map.setCenter({lat:myLocation.lat, lng:myLocation.lng});
        }
        
    });

    $scope.$on('httpService:getGoSendCostSuccess', function () {
        //$rootScope.hideLoading();
        console.log("Berhasil");
        if($scope.data.content.Instant.active == true){
            $rootScope.gosend_instant_price = $scope.data.content.Instant.price.total_price;
            $rootScope.gosend_sameday_price = $scope.data.content.SameDay.price.total_price;
            $rootScope.gosend_instant_description = $scope.data.content.Instant.shipment_method_description;
            $rootScope.gosend_sameday_description = $scope.data.content.SameDay.shipment_method_description;
            console.log($rootScope.gosend_instant_price);
            console.log($rootScope.gosend_sameday_price);
        }
        else{
            $rootScope.gosend_instant_price = 0;
            $rootScope.gosend_sameday_price = 0;
            $scope.showGosendErrorAlert($scope.data.content);
        }
        $scope.isLoading = false;
        //$scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getGoSendCostError', function () {
        //$scope.hideLoading();
        console.log("Error");
        $rootScope.gosend_instant_price = $scope.data.content.Instant.price.total_price;
        $rootScope.gosend_sameday_price = $scope.data.content.SameDay.price.total_price;
        $rootScope.gosend_instant_description = $scope.data.content.Instant.shipment_method_description;
        $rootScope.gosend_sameday_description = $scope.data.content.SameDay.shipment_method_description;
        console.log("gosend-map-controller");
        console.log($rootScope.gosend_instant_price);
        console.log($rootScope.gosend_sameday_price);
        $scope.isLoading = false;
        //$scope.$broadcast('scroll.refreshComplete');
    });

    $scope.showGosendErrorAlert = function (data) {
        var alertPopup = $ionicPopup.alert({
            title: "GO-SEND Warning",
            template: '<div style="width:100%;text-align:center">'+data.Instant.shipment_method_description+' dan '+data.SameDay.shipment_method_description+'</div><br>'+
                        '<div style="width:100%;text-align:center"><b>Silahkan mengganti destinasi perjalanan</b></div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                }
            ]
        });
    };

    

})