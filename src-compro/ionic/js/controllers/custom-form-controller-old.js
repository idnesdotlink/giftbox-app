/**
 * Created by Audy on 21-Mar-16.
 */
app.controller("CustomFormCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading) {

    $scope.input = {
        'meta' : {}
    };

    var url = token_url;
    var obj = serializeData({email: username, password: password, company_id: company_id});
    // call angular http service
    httpService.post_token($scope, $http, url, obj);
    var company_form_id = '';
    $scope.isLoading = true;
    $scope.isTimeout = false;

    var loadCustomText = function() {
        $scope.title_text_form = "Please fill this form";
        $scope.input_text_required = "Required";
        $scope.button_text_submit = "Submit Form";

        title_text_form = ui_texts_custom_forms.title_text_form !== undefined && ui_texts_custom_forms.title_text_form[language]!==undefined ? ui_texts_custom_forms.title_text_form[language] : "Please fill this form";
        $scope.title_text_form = title_text_form;

        input_text_required = ui_texts_custom_forms.input_text_required !== undefined && ui_texts_custom_forms.input_text_required[language]!==undefined ? ui_texts_custom_forms.input_text_required[language] : "Required";
        $scope.input_text_required = input_text_required;

        button_text_submit = ui_texts_custom_forms.button_text_submit !== undefined && ui_texts_custom_forms.button_text_submit[language]!==undefined ? ui_texts_custom_forms.button_text_submit[language] : "Submit Form";
        $scope.button_text_submit = button_text_submit;
    }
    
    loadCustomText();

    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = post_content_url + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('CustomFormCtrl');

    });
    
    $scope.$on('httpService:getRequestSuccess', function () {
        //console.log($scope.data);
        $scope.content_data = {
            id: $stateParams.id,
            fields: $scope.data.fields,
            title: getPostMetaValueById($scope.data.post.post_meta, 'form_title').value
        };
        company_form_id = $scope.content_data.fields[0].company_form_id;

        $scope.isLoading = false;

        //console.log($scope.data);


    });
    
    $scope.$on('httpService:getRequestError',function(){
       $scope.isTimeout = true; 
    });

    $scope.submitForm = function () {
        //console.log($scope.input.meta);
        $scope.show();
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'user-form');


        //console.log(JSON.stringify($scope.input.meta));
    };

    // if get token success, request profile data
    $scope.$on('httpService:postTokenUserFormSuccess', function () {
        //console.log($scope.data);
        token = $scope.data.token;
        var tempString = JSON.stringify($scope.input.meta);

        var obj = serializeData({_method: 'POST', content: '', post_id: $stateParams.id, company_form_id: company_form_id, meta: tempString});

        // post comment
        //console.log(obj);
        httpService.post($scope, $http, user_form_url + '?token=' + token, obj, 'user-form');
    });


    $scope.$on('httpService:postUserFormSuccess', function () {
        $scope.hide();
        if($scope.data.success === true)
        {
            $scope.showSubmitFormSuccessAlert();
        }
        else
        {
            $scope.showSubmitFormFailedAlert();
        }
    });

    $scope.$on('httpService:postTokenUserFormFailed', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    $scope.$on('httpService:postUserFormError', function () {
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

    $scope.showSubmitFormSuccessAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Form',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Submit Form Success</div>'
        });
    };

    $scope.showSubmitFormFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Form',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Submit Form Failed. Please Check Your Internet Connection and Try Again</div>'
        });
    };

    $scope.showFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Login',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Submit Form Failed. Please Check Your Internet Connection and Try Again</div>'
        });
    };
    
    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        
        $scope.isTimeout = false;
        
        httpService.post_token($scope, $http, url, obj, 'content');
    };



});


