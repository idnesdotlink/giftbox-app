app.controller("Games001SettingsCtrl", function ($scope,
                                              $http,
                                              httpService,
                                              $stateParams,
                                              $state,
                                              $ionicLoading,
                                              $ionicPopup,
                                              $ionicHistory,
                                              $ionicPlatform,
                                              $cordovaClipboard,
                                              $cordovaToast,
                                              $timeout) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    
    console.log($scope.panelSize);
    console.log($scope.maxNumber);
    
    
    // initialize input text comment
    $scope.input = {
        maxNum: 25,
        panelSize: "4"
    };
    
    $ionicPlatform.ready(function(){

        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
        
        $scope.isLoading = false;
        
    });
    
    $scope.subTotal = function(command)
    {
        if(command == "add")
        {   
            $scope.input.maxNum += 1;
            $scope.basket += 1;
        }

        if(command == "substract")
        {
            $scope.input.maxNum = $scope.input.maxNum <= 0 ? 0 : $scope.input.maxNum - 1;
        }
    }
    
    $scope.playGame = function()
    {
        console.log($scope.input);
        $state.go('app.games-001', {size: $scope.input.panelSize,maxNum:$scope.input.maxNum});
    }


});
