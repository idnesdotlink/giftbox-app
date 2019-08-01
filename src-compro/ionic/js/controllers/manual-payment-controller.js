app.controller("ManualPaymentCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.user_id = user_id;

    var isLoadingMoreData = false;

    var loadCustomText = function() {
        $scope.ui_text_title = getMenuText(ui_texts_manual_payments.ui_text_title, "Payment Method List");
        $scope.ui_text_subtitle = getMenuText(ui_texts_manual_payments.ui_text_subtitle, "HOW TO PAY");
        $scope.ui_text_account_number = getMenuText(ui_texts_manual_payments.ui_text_account_number, "Account Number");
        $scope.ui_text_account_owner_name = getMenuText(ui_texts_manual_payments.ui_text_account_owner_name, "Account Owner Name");
        $scope.ui_text_message = getMenuText(ui_texts_manual_payments.ui_text_message, "Message");
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.groups = [];

        if(manual_payment_method_list!=false)
        {
            var method_list = JSON.parse(manual_payment_method_list);
            console.log(method_list);

            for (var i=0; i<method_list.length; i++) {
                $scope.groups[i] = {
                  name: method_list[i].bank_name,
                  items: []
                };

                $scope.groups[i].items.push($scope.ui_text_account_number+':<br/>'+method_list[i].number);
                $scope.groups[i].items.push($scope.ui_text_account_owner_name+':<br/>'+method_list[i].name);
                $scope.groups[i].items.push($scope.ui_text_message+':<br/> '+method_list[i].message);
            }
        }

        $scope.manual_payment_instruction = manual_payment_instruction;
    });


    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

});
