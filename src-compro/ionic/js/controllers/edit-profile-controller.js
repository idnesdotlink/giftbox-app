/**
 * Created by Audy on 21-Mar-16.
 */
app.controller("EditProfileCtrl", function ($scope,
                                            $http,
                                            httpService,
                                            $stateParams,
                                            $ionicPlatform,
                                            $ionicPopup,
                                            $ionicLoading) {

    $scope.input = {
        username: '',
        meta:{}
    };

    $scope.expired_required = false;
    $scope.phone_required = false;
    $scope.address_required = false;
    $scope.register_message_required = false;
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.field_title_register_additional_message = field_title_register_additional_message !== '' ? field_title_register_additional_message : 'Additional Message';
       
    
    $scope.title = "Edit Profile";
    $scope.save_changes = "Save Changes";
    
    menu_text_edit_profile = default_menu_titles.edit_profile !== undefined && default_menu_titles.edit_profile[language]!==undefined ? default_menu_titles.edit_profile[language] : "Edit Profile";
    $scope.title = menu_text_edit_profile;
    
    menu_text_save_changes = default_menu_titles.save_changes !== undefined && default_menu_titles.save_changes[language]!==undefined ? default_menu_titles.save_changes[language] : "Save Changes";
    $scope.save_changes = menu_text_save_changes;
    console.log(default_menu_titles.save_changes);

    var url = token_url;
    var obj = serializeData({email: username, password: password, company_id: company_id});

    httpService.post_token($scope, $http, url, obj);


    // if get token success, request for book detail
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        httpService.get($scope, $http, profile_url, 'content', token + '&user_id=' + encodeURIComponent(user_id));
        console.log('EditProfileCtrl');
    });

    // if get detail book success, set detail book
    $scope.$on('httpService:getRequestSuccess', function () {
        console.log("Profile Success");
        //console.log($scope.data);

        $scope.input.username = $scope.data.user.username;
        var length = $scope.data.user.company_user_meta.length;

        for(var i =0 ;i < length; i++)
        {
            var key = $scope.data.user.company_user_meta[i].key;
            var value = getPostMetaValueById($scope.data.user.company_user_meta, key).value;

            $scope.input.meta[key] = value;

            if(key === 'phone')
            {
                //$scope.input.meta.phone = value;
                $scope.phone_required = true;
            }
            else if(key === 'address')
            {
                //$scope.input.meta.address = value;
                $scope.address_required = true;
            }
            
            if(key === 'expired_date' && is_membership_enabled == 'YES')
            {
                //$scope.input.meta.phone = value;
                $scope.expired_required = true;
            }
            
            if(key == 'message' && register_message_required)
            {
                $scope.register_message_required = register_message_required;
            }
            
        }

        $scope.isLoading = false;


        //console.log($scope.input);
    });

    // if get token failed, request token again
    $scope.$on('httpService:postTokenError', function () {
        $scope.showEditProfileError();
    });

    //if get data failed, request token again
    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
//        httpService.post_token($scope, $http, url, obj, 'content');

    });




    $scope.saveProfile = function () {
        $scope.showExitConfirmation = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Save Changes Confirmation',
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>Are you sure want save this changes?</div>",
                okType:'cp-button'
            });

            //confirmation dialog
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.show();
                    var url = token_url;
                    var obj = serializeData({email: username, password: password, company_id: company_id});

                    httpService.post_token($scope, $http, url, obj, 'edit-profile');
                }
            });
        };

        $scope.showExitConfirmation();



    };

    $scope.$on('httpService:postTokenEditProfileSuccess', function () {

        var input = $scope.input;
        var token = $scope.data.token;

        var tempString = JSON.stringify($scope.input.meta);

        var obj = serializeData({_method: 'POST', user_id:user_id, username: input.username, company_id: company_id, meta: tempString});
        httpService.post($scope, $http, profile_url + '?token=' + token, obj, 'edit-profile');

    });
    $scope.$on('httpService:postTokenEditProfileError', function () {
        $scope.hide();
        $scope.showEditProfileError();
    });

    $scope.$on('httpService:postEditProfileSuccess', function () {
        //console.log('edit profile baruuuuu');
        //console.log($scope.data);
        $scope.hide();
        if($scope.data.success === true)
        {
            $scope.showEditProfileSuccess();
            username_login = $scope.input.username;

            if (isPhoneGap()) {
                // save user login to database
                console.log(db);
                if (db === '') {
                    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
                }

                db.transaction(function (tx) {
                    tx.executeSql("DELETE FROM " + user_table + " WHERE id = ?",[user_id]);
                    tx.executeSql("INSERT INTO " + user_table + " (id, user) VALUES (?,?)", [$scope.data.user.id, JSON.stringify($scope.data.user)], function (tx, res) {
                        //console.log("insertId: " + res.insertId + " -- probably 1");
                        //console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

                        user_id = $scope.data.user.id;
                        username_login = $scope.data.user.username;
                        email = $scope.data.user.email;

                        if(getPostMetaValueById($scope.data.user.company_user_meta, 'address') != null && getPostMetaValueById($scope.data.user.company_user_meta, 'address') != undefined)
                        {
                            address = getPostMetaValueById($scope.data.user.company_user_meta, 'address').value;
                        }

                        if(getPostMetaValueById($scope.data.user.company_user_meta, 'phone') != null && getPostMetaValueById($scope.data.user.company_user_meta, 'phone') != undefined)
                        {
                            phone = getPostMetaValueById($scope.data.user.company_user_meta, 'phone').value;
                        }

                        //console.log('edit profile save db');
                        //console.log(username_login + ' ' + user_id + ' ' + email + ' ' + phone);

                    }, function (e) {

                    });
                });
            }
            else {
                user_id = $scope.data.user.id;
                username_login = $scope.data.user.username;
                email = $scope.data.user.email;

                if(getPostMetaValueById($scope.data.user.company_user_meta, 'address') != null && getPostMetaValueById($scope.data.user.company_user_meta, 'address') != undefined)
                {
                    address = getPostMetaValueById($scope.data.user.company_user_meta, 'address').value;
                }

                if(getPostMetaValueById($scope.data.user.company_user_meta, 'phone') != null && getPostMetaValueById($scope.data.user.company_user_meta, 'phone') != undefined)
                {
                    phone = getPostMetaValueById($scope.data.user.company_user_meta, 'phone').value;
                }
            }

        }
        else
        {
            $scope.showEditProfileError();
        }
    });

    $scope.$on('httpService:postEditProfileError', function () {
        $scope.hide();
        $scope.showEditProfileError();

    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.showEditProfileSuccess = function (username) {
        var alertPopup = $ionicPopup.alert({
            title: 'Update Profile',
            template: '<div style="width:100%;text-align:center">Profile Updated Successfully</div>'
        });
    };
    $scope.showEditProfileError = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Update Profile',
            template: '<div style="width:100%;text-align:center">Update Profile Failed. Please Check Your Internet Connection and Try Again</div>'
        });
    };

    $scope.showRequirementAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Update Profile',
            template: '<div style="width:100%;text-align:center">Username, Email, and Password Must be Filled</div>'
        });
    };
    
    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        
        $scope.isTimeout = false;
        
        httpService.post_token($scope, $http, url, obj, 'content');
    };
});

