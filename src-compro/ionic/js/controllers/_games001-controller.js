app.controller("Games001Ctrl", function ($scope,
                                              $http,
                                              httpService,
                                              $stateParams,
                                              $ionicLoading,
                                              $ionicPopup,
                                              $ionicHistory,
                                              $ionicPlatform,
                                              $cordovaClipboard,
                                              $cordovaToast,
                                              $timeout) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.currentNumber = 0;
    $scope.panelSize = 2;
    //$scope.repetition = 2;
    $scope.numbers;
    $scope.panel_numbers;
    $scope.backgroundColor = "black";
    $scope.textColor = "white";
    $scope.timeCounter = 0;
    //$scope.maxNumber = 14;
    var timer;
    
    $scope.panelSize = parseInt($stateParams.size);
    $scope.maxNumber = $stateParams.maxNum;
    
    console.log($scope.panelSize);
    console.log($scope.maxNumber);
    
    $ionicPlatform.ready(function(){

        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
        
        var total_number = $scope.panelSize*$scope.panelSize;
        $scope.isLoading = false;
        //$scope.numbers = shuffle(populate(1,total_number));
        $scope.numbers = new Array();
        //randomize numbers
        while($scope.numbers.length < $scope.maxNumber)
        {
            var currentLength = $scope.numbers.length;
            var numberLeft = $scope.maxNumber - currentLength;
            var currentGenerateLength = total_number;
            if(numberLeft<total_number)
                currentGenerateLength = numberLeft;
            
            var new_array = shuffle(populate(currentLength+1,currentLength + currentGenerateLength));
            $scope.numbers = $scope.numbers.concat(new_array);
        }
//        for(var i=1; i<$scope.repetition+1; i++)
//        {
//            var new_array = shuffle(populate(i*total_number+1,(i+1)*total_number));
//            //console.log(i*total_number+1);
//            //console.log((i+1)*total_number);
//            //console.log(new_array);
//            $scope.numbers = $scope.numbers.concat(new_array);
//        }
        
        $scope.panel_numbers = $scope.numbers.slice(0,total_number);
        
        console.log($scope.numbers);
    });
    
    $scope.onPanelClick = function(panel_index) { 
        //if number is correct
        if($scope.panel_numbers[panel_index] == $scope.currentNumber +1)
        {
            //if last number
            if($scope.panel_numbers[panel_index] == $scope.maxNumber)
            {
                console.log($scope.panel_numbers[panel_index]+" "+$scope.maxNumber);
                $scope.stopTimer();

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Game Over',
                    css: 'cp-button',
                    template: "<div style='display:flex;justify-content:center;align-items:center;'>Your record : "+$scope.timeCounter+" Second(s)<br/>Share your score?</div>",
                    okType: 'cp-button'
                });

                //confirmation dialog
                confirmPopup.then(function (res) {
                    $scope.shareScore();
                });
            }
            //if first number
            if($scope.currentNumber==0)
                $scope.startTimer();
            
            var total_number = $scope.panelSize*$scope.panelSize;
            $scope.panel_numbers[panel_index] = $scope.numbers[$scope.currentNumber+total_number];
            $scope.currentNumber++;
            console.log($scope.panel_numbers);
        }
    };
    
    $scope.startTimer = function() {
        timer = $timeout(function() {
            $scope.timeCounter=(parseFloat($scope.timeCounter)+0.1).toFixed(2); 
            $scope.startTimer();   
        }, 100);
    };
   
    
    $scope.stopTimer = function(){
       $timeout.cancel(timer);
    } 

    
    $scope.range = function(n) {
        return new Array(n);
    };
    
    function populate(start, end){
        var n = end - start;
        var array =  new Array(n);
        for(var i=0; i<n+1;i++){
            array[i] = i+start;
        }
        return array;
    }
    
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }


    $scope.shareScore = function () {
        console.log('Social Share');
        console.log(playstore_link);
        console.log(appstore_link);
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, "I complete the game in: "+$scope.timeCounter+" SECONDS!!<br/> Download the app at:", null, null, playstore_link, null);
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, "I complete the game in: "+$scope.timeCounter+" SECONDS!!<br/> Download the app at:", null, null, appstore_link, null);
            }
        }
    };
    
    $scope.restart = function () {
        $timeout.cancel(timer);
        $scope.currentNumber = 0;
        $scope.timeCounter = 0;
        
        var total_number = $scope.panelSize*$scope.panelSize;
        $scope.isLoading = false;
        
        $scope.numbers = new Array();
        //randomize numbers
        while($scope.numbers.length < $scope.maxNumber)
        {
            var currentLength = $scope.numbers.length;
            var numberLeft = $scope.maxNumber - currentLength;
            var currentGenerateLength = total_number;
            if(numberLeft<total_number)
                currentGenerateLength = numberLeft;
            
            var new_array = shuffle(populate(currentLength+1,currentLength + currentGenerateLength));
            $scope.numbers = $scope.numbers.concat(new_array);
        }

        $scope.panel_numbers = $scope.numbers.slice(0,total_number);
    }


});
