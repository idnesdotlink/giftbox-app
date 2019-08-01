/**
 * Created by Audy on 21-Mar-16.
 */
app.controller("RegisterRequiredCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicHistory) {

    $scope.input = {
        email: '',
        password: '',
        passwordConf: '',
        username: '',
        meta: ''
    };

    $scope.register = function () {


        $scope.show();

        var url = register_url;
        var input = $scope.input;
        console.log(input);
        var tempString = JSON.stringify($scope.input.meta);

        var obj = serializeData({email: input.email, password: input.password, username: input.username, company_id: company_id, meta: tempString});

        httpService.post($scope, $http, url, obj, 'register');

    };

    // if get token success, request profile data
    $scope.$on('httpService:postUserRegisterSuccess', function () {
        console.log($scope.data);
        $scope.hide();
        if($scope.data.success === true)
        {
            $scope.showRegisterSuccessAlert();
            $ionicHistory.goBack();
        }
        else
        {
            $scope.showRegisterFailedAlert();
        }


    });

    // if get token success, request profile data
    $scope.$on('httpService:postUserRegisterError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.showRegisterSuccessAlert = function (username) {
        var alertPopup = $ionicPopup.alert({
            title: 'Register',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Register Success. Welcome ' + $scope.input.username + '</div>'
        });
    };

    $scope.showRegisterFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Register',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Email already existed. Please try another email</div>'
        });
    };

    $scope.showFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Register',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Register Failed. Please Check Your Internet Connection and Try Again</div>'
        });
    };

    $scope.showRequirementAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Register',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Username, Email, and Password Must be Filled</div>'
        });
    };

    $scope.register_phone_required = register_phone_required;
    $scope.register_address_required = register_address_required;
    $scope.register_message_required = register_message_required;
});

