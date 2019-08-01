app.controller("QRCodeScannerCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform,$ionicLoading,$ionicPopup, $cordovaBarcodeScanner) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    var isLoadingMoreData = false;

    var loadCustomText = function() {
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        console.log($scope.post_id);
        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
    });

    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };

    $scope.scanBarcode = function() {
        if (!isPhoneGap()){
            console.log("Not working on website");
            var alertPopup = $ionicPopup.alert({
                title: "Warning",
                template: '<div style="width:100%;text-align:center">You can try this feature only on application</div>'
            });
        }
        else {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                var url = user_attend_reservation + imageData.text;
                httpService.get($scope, $http, url, 'attend-reservation', token);
                console.log('QRCodeScannerCtrl');
            }, function(error) {
                console.log("An error happened -> " + error);
                alert("Error Scanning "+ error);
            },
            {
                showTorchButton : true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt : "Place a QR Code inside the scan area", // Android
                orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations : true, // iOS
                disableSuccessBeep: false // iOS and Android
            });
        }
    };
    
    $scope.$on('httpService:getAttendReservationSuccess', function () {
        $scope.showAttendData($scope.data);
    });
    
    $scope.showAttendData = function (data) {
        var alertPopup = $ionicPopup.alert({
            title: "Success",
            template: '<div style="width:100%;text-align:center">' + data.message + "</div>" +
            '<div style="width:100%;text-align:center">' + data.reservation_detail.name + '</div>' +
            '<div style="width:100%;text-align:center">Email : ' + data.reservation_detail.email + '</div>' +
            '<div style="width:100%;text-align:center">Reservation Code : ' + data.reservation_master.order_id + '</div>' +
            '<div style="width:100%;text-align:center">Reservation Event : ' + data.post.title + '</div>',
            buttons: [
                {
                    text: 'OK',
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.doRefresh = function() {
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function(){
        
    };

    // loading fragment
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.isPhoneGap = function()
    {
        return isPhoneGap();
    };

});
