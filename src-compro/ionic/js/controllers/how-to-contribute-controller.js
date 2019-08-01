app.controller("HowToContributeCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.user_id = user_id;

    var isLoadingMoreData = false;

    var loadCustomText = function() {
        $scope.ui_text_title = getMenuText(ui_texts_manual_payments.ui_text_contribute_title, "Contribute");
        $scope.ui_text_subtitle = getMenuText(ui_texts_manual_payments.ui_text_contribute_subtitle, "HOW TO CONTRIBUTE");
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.how_to_contribute_instruction = how_to_contribute_instruction;
    });


    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };

});
