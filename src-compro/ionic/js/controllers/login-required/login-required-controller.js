app.controller("LoginRequiredCtrl", function ($scope,
                                              $rootScope,
                                              $http,
                                              $state,
                                              httpService,
                                              $cordovaDevice,
                                              $ionicLoading,
                                              $ionicPopup,
                                              $ionicPlatform,
                                              $ionicHistory) {

    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.home_template = home_template;
    $scope.home_id = home_id;

    var translate_login_status = function(status_code)
    {
        if(status_code=="expired")
            return $scope.alert_login_failed_expired;
        else if (status_code == 'cp_expired')
            return $scope.alert_login_failed_cp_expired;
        else if(status_code=="unapproved")
            return $scope.alert_login_failed_unapproved;
        else if(status_code=="bound_device")
            return $scope.alert_login_failed_bound_device;
        else if(status_code=="wrong_email_password")
            return $scope.alert_login_failed_wrong_email_password;
        else if(status_code=="exception")
            return $scope.alert_login_failed_wrong_email_password;
        else if(status_code=="success")
            return $scope.alert_login_success;
        else if (status_code=='empty')
            return login_mode == 'username' ? $scope.alert_login_failed_requirement_username : $scope.alert_login_failed_requirement_email;
        else if (status_code=='unverified_account')
            return $scope.alert_login_failed_verify;


        return status_code;
    };

    $ionicPlatform.ready(function () {
        $scope.result = '';

        // initialize user login data, set '' for deployment
        $scope.input = {
            email: '',//'guest@compro.id',
            password: ''//'guestcompro'
        };

        $scope.username_login = username_login;

        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }

        $scope.title = login_menu;

//        $scope.login_mode = login_mode;

        var url = options_url;


        httpService.get($scope, $http, url, 'company-options');
    });

    $scope.loadUITextGeneral = function(){
      // all term list
      $scope.text_pull_to_refresh = getMenuText(ui_texts_general.text_pull_to_refresh, "Pull to refresh...");

      // comments
      $scope.text_comment_title = getMenuText(ui_texts_general.text_comment_title, "Comment");
      $scope.text_comment_alert_success = getMenuText(ui_texts_general.text_comment_alert_success, "Successfully posted comment");
      $scope.text_comment_alert_error = getMenuText(ui_texts_general.text_comment_alert_error, "Failed to post comment. Please check your internet connection and try again.");
      $scope.text_comment_btn_login = getMenuText(ui_texts_general.text_comment_btn_login, 'Login');
      $scope.text_comment_btn_login_to_comment = getMenuText(ui_texts_general.text_comment_btn_login_to_comment, 'Please Login to Comment');
      $scope.text_comment_prompt_login_content = getMenuText(ui_texts_general.text_comment_prompt_login_content, 'Please login to post your comment.');
      $scope.text_comment_you_liked_this = getMenuText(ui_texts_general.text_comment_you_liked_this, 'You liked this.');

      //input field error
      $scope.input_error_text_must_be_filled = getMenuText(ui_texts_general.input_error_text_must_be_filled, 'must be filled.');
      $scope.input_error_text_wrong_format = getMenuText(ui_texts_general.input_error_text_wrong_format, 'Wrong format for field');
      $scope.input_error_text_please_input_valid = getMenuText(ui_texts_general.input_error_text_please_input_valid, 'please input a valid');
      $scope.input_error_text_min_characters = getMenuText(ui_texts_general.input_error_text_min_characters, 'must be 6 characters minimum.');
      $scope.input_field_type_time = getMenuText(ui_texts_general.input_field_type_time, 'time');
      $scope.input_field_type_date = getMenuText(ui_texts_general.input_field_type_date, 'date');
      $scope.input_field_type_email = getMenuText(ui_texts_general.input_field_type_email, 'email');
      $scope.input_field_type_image = getMenuText(ui_texts_general.input_field_type_image, 'image');
      $scope.input_field_type_password = getMenuText(ui_texts_general.input_field_type_password, 'password');

      // general alert
      $scope.alert_title_exit_app = getMenuText(ui_texts_general.alert_title_exit_app, "Exit Application?");
      $scope.alert_content_exit_app = getMenuText(ui_texts_general.alert_content_exit_app, "Are you sure you want to exit app?");
      $scope.alert_button_ok = getMenuText(ui_texts_general.alert_button_ok, "OK");
      $scope.alert_button_cancel = getMenuText(ui_texts_general.alert_button_cancel, "Cancel");
      $scope.alert_button_try_again = getMenuText(ui_texts_general.alert_button_try_again, "Try Again");

      // logged in
      $scope.alert_logged_in_title = getMenuText(ui_texts_general.alert_logged_in_title, "Logged In");
      $scope.alert_login_failed_bound_device = getMenuText(ui_texts_general.alert_login_failed_bound_device, "You are logged in to other device. Please login again with this device.");
      $scope.alert_login_failed_expired = getMenuText(ui_texts_general.alert_login_failed_expired, "Your account has expired.");

      // exit preview
      $scope.alert_exit_preview_title = getMenuText(ui_texts_general.alert_exit_preview_title,"Exit Preview");
      $scope.alert_exit_preview_content = getMenuText(ui_texts_general.alert_exit_preview_content,"Are you sure want to exit preview?");

      // loading
      $scope.text_loading = getMenuText(ui_texts_general.text_loading, "Loading...");
      $scope.text_try_again = getMenuText(ui_texts_general.text_try_again, "Try again later.");
      $scope.text_reload = getMenuText(ui_texts_general.text_reload, "Reload");
      $scope.text_please_wait = getMenuText(ui_texts_general.text_please_wait, "Please wait a moment...");
      $scope.text_something_wrong = getMenuText(ui_texts_general.text_something_wrong, "Oops, something is wrong here...");
      $scope.text_reload_to_retry = getMenuText(ui_texts_general.text_reload_to_retry, "Tap reload to try again.");
      $scope.text_no_data_found = getMenuText(ui_texts_general.text_no_data_found, "No data found.");
      ionicLoadingTemplate = '<div style="display:flex;justify-content:center;align-items:center;">' + $scope.text_loading + '<ion-spinner></ion-spinner></div>';

      // search
      $scope.text_search_error_connection = getMenuText(ui_texts_general.text_search_error_connection,"Failed to search, please check your internet connection and try again.");
      $scope.text_keyword = getMenuText(ui_texts_general.text_keyword, "Keyword");

      // external URL
      $scope.alert_external_link_title = getMenuText(ui_texts_general.alert_external_link_title,"External URL");
      $scope.alert_external_link_content = getMenuText(ui_texts_general.alert_external_link_content, "This link contains external URL. Do you want to proceed?");

      // upload image
      $scope.button_text_take_photo = getMenuText(ui_texts_upload_image.button_text_take_photo, "Take Photo");
      $scope.button_text_browse = getMenuText(ui_texts_upload_image.button_text_browse, "Browse Image");
      $scope.button_text_back = getMenuText(ui_texts_upload_image.button_text_back, "Cancel");
      $scope.button_text_change = getMenuText(ui_texts_upload_image.button_text_change, "Change");
      $scope.text_upload_image_modal = getMenuText(ui_texts_upload_image.text_upload_image_modal, "Upload Image");
      $scope.text_upload_image_description = getMenuText(ui_texts_upload_image.text_upload_image_description, "Please upload image using one of the options below.");
      $scope.alert_upload_image_title = getMenuText(ui_texts_upload_image.alert_upload_image_title, "Image Upload");
      $scope.alert_upload_image_success = getMenuText(ui_texts_upload_image.alert_upload_image_success, "Successfully uploaded image.");
      $scope.alert_upload_image_failed_connection = getMenuText(ui_texts_upload_image.alert_upload_image_failed_connection, "Failed to upload image, please check your internet connection and try again.");
      $scope.alert_upload_image_button_try_again = getMenuText(ui_texts_upload_image.alert_upload_image_button_try_again, "Try Again");
      $scope.alert_upload_image_button_ok = getMenuText(ui_texts_upload_image.alert_upload_image_button_ok, "OK");
    };

    $scope.loadDefaultMenuTitles = function(){
        if(default_menu_titles!=false)
        {
          // default_menu_titles = JSON.parse(default_menu_titles);
          // console.log(default_menu_titles);

          $scope.button_text_login = getMenuText(default_menu_titles.login, "Login");
          $scope.button_text_register = getMenuText(default_menu_titles.register, "Register");
          $scope.ui_text_forgot_password = getMenuText(default_menu_titles.ui_text_forgot_password, "Forgot Password");
          $scope.ui_text_click_here = getMenuText(default_menu_titles.ui_text_click_here, "Click Here");
          $scope.welcome_title = getMenuText(default_menu_titles.welcome_title, "Welcome!");
          $scope.welcome_subtitle = getMenuText(default_menu_titles.welcome_subtitle, "Please login or sign up to continue.");
          $scope.ui_text_dont_have_account = getMenuText(default_menu_titles.ui_text_dont_have_account,"Don\'t have an account?");
          $scope.ui_text_sign_up_now = getMenuText(default_menu_titles.ui_text_sign_up_now, "Sign up now!");

          var default_username_title = $scope.default_register_fields == false || $scope.default_register_fields == undefined || $scope.default_register_fields.username == null || $scope.default_register_fields.username.field_name == null ? "Username" : $scope.default_register_fields.username.field_name;
          var default_email_title = $scope.default_register_fields == false || $scope.default_register_fields == undefined || $scope.default_register_fields.email == null || $scope.default_register_fields.email.field_name == null ? "Email" : $scope.default_register_fields.email.field_name;
          var default_password_title = $scope.default_register_fields == false || $scope.default_register_fields == undefined || $scope.default_register_fields.password == null || $scope.default_register_fields.password.field_name == null ? "Password" : $scope.default_register_fields.password.field_name;

          $scope.ui_text_username = getMenuText(ui_texts_login.ui_text_username, default_username_title);
          $scope.ui_text_email = getMenuText(ui_texts_login.ui_text_email, default_email_title);
          $scope.ui_text_password = getMenuText(ui_texts_login.ui_text_password, default_password_title);

          $scope.alert_login_title = getMenuText(ui_texts_login.alert_login_title, "Login");
          $scope.alert_login_failed_connection = getMenuText(ui_texts_login.alert_login_failed_connection, "Login failed, please check your internet connection and try again.");
          $scope.alert_login_failed_verify = getMenuText(ui_texts_login.alert_login_failed_verify, "Login Failed. Please verify your email account to login.");
          $scope.alert_login_failed_requirement_email = getMenuText(ui_texts_login.alert_login_failed_requirement_email, "Email and password must be filled.");
          $scope.alert_login_failed_requirement_username = getMenuText(ui_texts_login.alert_login_failed_requirement_username, "Username and password must be filled.");
          $scope.alert_login_failed_expired = getMenuText(ui_texts_login.alert_login_failed_expired, "Your account has expired, please top up first.");
          $scope.alert_login_failed_unapproved = getMenuText(ui_texts_login.alert_login_failed_unapproved, "Your account has not been approved by our Administrator.");
          $scope.alert_login_failed_bound_device = getMenuText(ui_texts_login.alert_login_failed_bound_device, "Your account is bound to another device.");
          $scope.alert_login_failed_wrong_email_password = getMenuText(ui_texts_login.alert_login_failed_wrong_email_password, "Wrong email or password!");
          $scope.alert_login_failed_wrong_username_password = getMenuText(ui_texts_login.alert_login_failed_wrong_username_password, "Wrong username or password!");
          $scope.alert_login_success = getMenuText(ui_texts_login.alert_login_success, "Login success!");
          $scope.alert_login_failed_cp_expired = getMenuText(ui_texts_login.alert_login_failed_cp_expired, "Your account is expired. Extend your membership at <a href='https://member.compro.id' class='external-link'>https://member.compro.id</a>9");
        }
        else
        {

        }

    };

    $scope.loadUITexts = function($scope){
      ui_texts_audios = loadUIMenuTexts($scope.data.options, 'ui_texts_audios',false);
      ui_texts_bookings = loadUIMenuTexts($scope.data.options, 'ui_texts_bookings',false);
      ui_texts_careers = loadUIMenuTexts($scope.data.options, 'ui_texts_careers',false);
      ui_texts_contacts = loadUIMenuTexts($scope.data.options, 'ui_texts_contacts',false);
      ui_texts_contact_forms = loadUIMenuTexts($scope.data.options, 'ui_texts_contact_forms',false);
      ui_texts_custom_forms = loadUIMenuTexts($scope.data.options, 'ui_texts_custom_forms',false);
      ui_texts_custom_form_reply_history = loadUIMenuTexts($scope.data.options, 'ui_texts_custom_form_reply_history',false);
      ui_texts_events = loadUIMenuTexts($scope.data.options, 'ui_texts_events',false);
      ui_texts_general = loadUIMenuTexts($scope.data.options, 'ui_texts_general',false);
      ui_texts_files = loadUIMenuTexts($scope.data.options, 'ui_texts_files',false);
      ui_texts_inapp_purchase = loadUIMenuTexts($scope.data.options, 'ui_texts_inapp_purchase', false);
      ui_texts_language = loadUIMenuTexts($scope.data.options, 'ui_texts_language', false);
      ui_texts_login = loadUIMenuTexts($scope.data.options, 'ui_texts_login',false);
      ui_texts_manual_payments = loadUIMenuTexts($scope.data.options, 'ui_texts_manual_payments',false);
      ui_texts_membership_menu = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_menu',false);
      ui_texts_membership_products = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_products',false);
      ui_texts_membership_member_items = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_member_items',false);
      ui_texts_membership_history = loadUIMenuTexts($scope.data.options, 'ui_texts_membership_history',false);
      ui_texts_profile = loadUIMenuTexts($scope.data.options, 'ui_texts_profile', false);
      ui_texts_products = loadUIMenuTexts($scope.data.options, 'ui_texts_products',false);
      ui_texts_register = loadUIMenuTexts($scope.data.options, 'ui_texts_register',false);
      ui_texts_reset_password = loadUIMenuTexts($scope.data.options, 'ui_texts_reset_password', false);
      ui_texts_settings = loadUIMenuTexts($scope.data.options, 'ui_texts_settings', false);
      ui_texts_shopping_cart = loadUIMenuTexts($scope.data.options, 'ui_texts_shopping_cart',false);
      ui_texts_transactions = loadUIMenuTexts($scope.data.options, 'ui_texts_transactions',false);
      ui_texts_upload_image = loadUIMenuTexts($scope.data.options, 'ui_texts_upload_image', false);
      ui_texts_webviews = loadUIMenuTexts($scope.data.options, 'ui_texts_webviews',false);

      $scope.loadUITextGeneral();
    };

    $scope.$on('httpService:getCompanyOptionsRequestSuccess', function () {
        $scope.isLoading = false;
        console.log($scope.data);

        updated_time = $scope.data.company.updated_at;
        //console.log('Updated At: ' + updated_time);
        var login_enabled = getPostMetaValueById($scope.data.options, "login_enabled");
        isLoginEnabled = login_enabled !== undefined ? (login_enabled.value == 'YES' ? true : false) : false;

        login_mode = getPostMetaValueById($scope.data.options, "login_mode");
        login_mode = login_mode !== undefined ? login_mode.value : 'email';

        register_phone_required = getPostMetaValueById($scope.data.options, "register_phone_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_phone_required").value : 'NO';
        register_address_required = getPostMetaValueById($scope.data.options, "register_address_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_address_required").value : 'NO';
        register_message_required = getPostMetaValueById($scope.data.options, "register_message_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_message_required").value : 'NO';

        audioDownloadEnabled = getPostMetaValueById($scope.data.options, "audio_download_enabled")!== undefined ? (getPostMetaValueById($scope.data.options, "audio_download_enabled").value == 'YES' ? true : false) : false;

        canAttendEvent = getPostMetaValueById($scope.data.options, "can_attend_event") !== undefined ? (getPostMetaValueById($scope.data.options, "can_attend_event").value == 'YES' ? true : false):false;

        home_share_apps = getPostMetaValueById($scope.data.options, "home_share_apps") !== undefined ? (getPostMetaValueById($scope.data.options, "home_share_apps").value == 'YES' ? true : false):false;
        home_category_text = getPostMetaValueById($scope.data.options, "home_category_text") !== undefined ? (getPostMetaValueById($scope.data.options, "home_category_text").value === 'YES'):true;

        isDeviceLogin = getPostMetaValueById($scope.data.options, "is_device_login") !== undefined ? (getPostMetaValueById($scope.data.options, "is_device_login").value == 'YES' ? true : false):false;

        shopping_enabled = getPostMetaValueById($scope.data.options, "shopping_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "shopping_enabled").value == 'YES' ? true : false):false;

        currency = getPostMetaValueById($scope.data.options, "price_currency") !== undefined ? getPostMetaValueById($scope.data.options, "price_currency").value : 'Rp';

        stock_status_visible = getPostMetaValueById($scope.data.options, "stock_status_visible") !== undefined ? getPostMetaValueById($scope.data.options, "stock_status_visible").value : 'NO';

        booking_enabled = getPostMetaValueById($scope.data.options, "booking_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "booking_enabled").value == 'YES' ? true : false):false;

        playstore_link = getPostMetaValueById($scope.data.options, "link_playstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_playstore").value : '';
        appstore_link = getPostMetaValueById($scope.data.options, "link_appstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_appstore").value : '';

        inAppPurchaseEnabled = getPostMetaValueById($scope.data.options, "in_app_purchase_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "in_app_purchase_enabled").value == 'YES' ? true : false):false;


        is_membership_enabled = getPostMetaValueById($scope.data.options, "is_membership_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "is_membership_enabled").value : 'NO';

        membership_product_data_android = getPostMetaValueById($scope.data.options, "membership_product_data_android");
        membership_product_data_android = JSON.parse(membership_product_data_android !== undefined ? membership_product_data_android.value : "[]");

        custom_register_fields  = getPostMetaValueById($scope.data.options, "custom_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_register_fields").value : false;
        $scope.default_register_fields = default_register_fields  = getPostMetaValueById($scope.data.options, "default_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "default_register_fields").value : false;
        $scope.default_register_fields = JSON.parse(default_register_fields)[0];

        vt_payment_service = getPostMetaValueById($scope.data.options, "vt_payment_service") !== undefined ? getPostMetaValueById($scope.data.options, "vt_payment_service").value : 'NO';

        rajaongkir_enabled = getPostMetaValueById($scope.data.options, "rajaongkir_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_enabled").value : 'NO';
        shipper_enabled = getPostMetaValueById($scope.data.options, "shipper_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_enabled").value : 'NO';
        shipper_intl_enabled = getPostMetaValueById($scope.data.options, "shipper_intl_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_intl_enabled").value : 'NO';

        rajaongkir_sender_city_id = getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id").value : '152';
        shipper_origin = getPostMetaValueById($scope.data.options, "shipper_origin") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_origin").value : '4773';

        rajaongkir_selected_services = getPostMetaValueById($scope.data.options, "rajaongkir_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_selected_services").value : '';
        shipper_selected_services = getPostMetaValueById($scope.data.options, "shipper_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_selected_services").value : '';

        maintenance_enabled = getPostMetaValueById($scope.data.options, "maintenance_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "maintenance_enabled").value : 'NO';

        sku_enabled = getPostMetaValueById($scope.data.options, "sku_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "sku_enabled").value : 'NO';

        verify_user_register_enabled = getPostMetaValueById($scope.data.options, "verify_user_register_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "verify_user_register_enabled").value === 'YES' : false;

        // MULTI-LANGUAGE
        multi_language = getPostMetaValueById($scope.data.options, "multi_language") !== undefined ? getPostMetaValueById($scope.data.options, "multi_language").value : 'NO';
        available_languages = getPostMetaValueById($scope.data.options, "available_languages") !== undefined ? getPostMetaValueById($scope.data.options, "available_languages").value : false;
        available_languages = JSON.parse(available_languages);

        if (!isRefreshLanguage) {
          language = getPostMetaValueById($scope.data.options, "default_language") !== undefined ? getPostMetaValueById($scope.data.options, "default_language").value : 'english';
        }
        isRefreshLanguage = false;

        default_menu_titles =  getPostMetaValueById($scope.data.options, "default_menu_titles") !== undefined ? getPostMetaValueById($scope.data.options, "default_menu_titles").value : false;
        default_menu_titles = JSON.parse(default_menu_titles);

        $scope.selectLanguage();

        // load UI Texts
        $scope.loadUITexts($scope);

        $scope.loadDefaultMenuTitles();

        // console.log(custom_feedback_message);

        $scope.login_mode = login_mode;

        $scope.register_enabled = register_enabled;

        //check if maintenance
        if (maintenance_enabled == 'YES')
        {
            $state.go('maintenance');
        }
//        var productIds = [];
//        var duration_lists = '{';
//        for (var i = 0; i < membership_product_data_android.length; i++) {
//            productIds.push(membership_product_data_android[i].productId);
//            if(i>0)
//                duration_lists+=',';
//            duration_lists+='"'+membership_product_data_android[i].productId+'":'+membership_product_data_android[i].duration;
//        }
//        duration_lists+='}';
//        duration_lists = JSON.parse(duration_lists);
//
//        console.log(duration_lists[productIds[0]]);

        if (isPhoneGap()) {
            saveTermJSONToDB(-2, 'LoginRequiredCtrl', $scope.data);
        }
    });

    $scope.$on('httpService:getCompanyOptionsRequestError', function () {
        if ($scope.status === 0 || $scope.status == '' || $scope.status == '-1') {
            console.log('NO INTERNET CONNECTION');
            if (isPhoneGap()) {
                loadTermJSONFromDB(-2, $scope);
            }
        }
        else {
            var url = options_url;
            httpService.get($scope, $http, url, 'company-options');
        }
        // httpService.post_token($scope, $http, url, obj, 'menu');


    });

    $scope.$on('SQLite:getOfflineOptionsSuccess', function () {
        //console.log($scope.data);
        main_menu = $scope.data.terms;
        console.log("GET MENU SUCCESS");
        //console.log(main_menu);

        var login_enabled = getPostMetaValueById($scope.data.options, "login_enabled");
        isLoginEnabled = login_enabled !== undefined ? (login_enabled.value == 'YES' ? true : false) : false;

        login_mode = getPostMetaValueById($scope.data.options, "login_mode");
        login_mode = login_mode !== undefined ? login_mode.value : 'email';

        register_phone_required = getPostMetaValueById($scope.data.options, "register_phone_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_phone_required").value : 'NO';
        register_address_required = getPostMetaValueById($scope.data.options, "register_address_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_address_required").value : 'NO';
        register_message_required = getPostMetaValueById($scope.data.options, "register_message_required") !== undefined ? getPostMetaValueById($scope.data.options, "register_message_required").value : 'NO';

        audioDownloadEnabled = getPostMetaValueById($scope.data.options, "audio_download_enabled")!== undefined ? (getPostMetaValueById($scope.data.options, "audio_download_enabled").value == 'YES' ? true : false) : false;

        canAttendEvent = getPostMetaValueById($scope.data.options, "can_attend_event") !== undefined ? (getPostMetaValueById($scope.data.options, "can_attend_event").value == 'YES' ? true : false):false;

        home_share_apps = getPostMetaValueById($scope.data.options, "home_share_apps") !== undefined ? (getPostMetaValueById($scope.data.options, "home_share_apps").value == 'YES' ? true : false):false;
        home_category_text = getPostMetaValueById($scope.data.options, "home_category_text") !== undefined ? (getPostMetaValueById($scope.data.options, "home_category_text").value === 'YES'):true;

        isDeviceLogin = getPostMetaValueById($scope.data.options, "is_device_login") !== undefined ? (getPostMetaValueById($scope.data.options, "is_device_login").value == 'YES' ? true : false):false;

        shopping_enabled = getPostMetaValueById($scope.data.options, "shopping_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "shopping_enabled").value == 'YES' ? true : false):false;

        currency = getPostMetaValueById($scope.data.options, "price_currency") !== undefined ? getPostMetaValueById($scope.data.options, "price_currency").value : 'Rp';

        stock_status_visible = getPostMetaValueById($scope.data.options, "stock_status_visible") !== undefined ? getPostMetaValueById($scope.data.options, "stock_status_visible").value : 'NO';

        booking_enabled = getPostMetaValueById($scope.data.options, "booking_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "booking_enabled").value == 'YES' ? true : false):false;

        playstore_link = getPostMetaValueById($scope.data.options, "link_playstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_playstore").value : '';
        appstore_link = getPostMetaValueById($scope.data.options, "link_appstore") !== undefined ? getPostMetaValueById($scope.data.options, "link_appstore").value : '';

        inAppPurchaseEnabled = getPostMetaValueById($scope.data.options, "in_app_purchase_enabled") !== undefined ? (getPostMetaValueById($scope.data.options, "in_app_purchase_enabled").value == 'YES' ? true : false):false;


        is_membership_enabled = getPostMetaValueById($scope.data.options, "is_membership_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "is_membership_enabled").value : 'NO';

        membership_product_data_android = getPostMetaValueById($scope.data.options, "membership_product_data_android");
        membership_product_data_android = JSON.parse(membership_product_data_android !== undefined ? membership_product_data_android.value : "[]");

        custom_register_fields  = getPostMetaValueById($scope.data.options, "custom_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "custom_register_fields").value : false;
        default_register_fields  = getPostMetaValueById($scope.data.options, "default_register_fields") !== undefined ? getPostMetaValueById($scope.data.options, "default_register_fields").value : false;
        $scope.default_register_fields = JSON.parse(default_register_fields)[0];

        vt_payment_service = getPostMetaValueById($scope.data.options, "vt_payment_service") !== undefined ? getPostMetaValueById($scope.data.options, "vt_payment_service").value : 'NO';

        rajaongkir_enabled = getPostMetaValueById($scope.data.options, "rajaongkir_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_enabled").value : 'NO';
        shipper_enabled = getPostMetaValueById($Scope.data.options, "shipper_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_enabled").value : 'YES';
        shipper_intl_enabled = getPostMetaValueById($Scope.data.options, "shipper_intl_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_intl_enabled").value : 'YES';

        rajaongkir_sender_city_id = getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_sender_city_id").value : '152';
        shipper_origin = getPostMetaValueById($scope.data.options, "shipper_origin") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_origin").value : '4773';

        rajaongkir_selected_services = getPostMetaValueById($scope.data.options, "rajaongkir_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "rajaongkir_selected_services").value : '';
        shipper_selected_services = getPostMetaValueById($scope.data.options, "shipper_selected_services") !== undefined ? getPostMetaValueById($scope.data.options, "shipper_selected_services").value : '';

        maintenance_enabled = getPostMetaValueById($scope.data.options, "maintenance_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "maintenance_enabled").value : 'NO';

        sku_enabled = getPostMetaValueById($scope.data.options, "sku_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "sku_enabled").value : 'NO';

        verify_user_register_enabled = getPostMetaValueById($scope.data.options, "verify_user_register_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "verify_user_register_enabled").value === 'YES' : false;

        // MULTI-LANGUAGE
        multi_language = getPostMetaValueById($scope.data.options, "multi_language") !== undefined ? getPostMetaValueById($scope.data.options, "multi_language").value : 'NO';
        available_languages = getPostMetaValueById($scope.data.options, "available_languages") !== undefined ? getPostMetaValueById($scope.data.options, "available_languages").value : false;
        available_languages = JSON.parse(available_languages);
        language = getPostMetaValueById($scope.data.options, "default_language") !== undefined ? getPostMetaValueById($scope.data.options, "default_language").value : 'english';


        default_menu_titles =  getPostMetaValueById($scope.data.options, "default_menu_titles") !== undefined ? getPostMetaValueById($scope.data.options, "default_menu_titles").value : false;
        default_menu_titles = JSON.parse(default_menu_titles);

        // MEMBERSHIP
        membership_features_enabled = getPostMetaValueById($scope.data.options,'membership_features_enabled') !== undefined ? getPostMetaValueById($scope.data.options, "membership_features_enabled").value : 'NO';
        membership_points_rule_conversion = getPostMetaValueById($scope.data.options,'membership_points_rule_conversion') !== undefined ? getPostMetaValueById($scope.data.options, "membership_points_rule_conversion").value : 'NO';

      // MULTI-LANGUAGE
        multi_language = getPostMetaValueById($scope.data.options, "multi_language") !== undefined ? getPostMetaValueById($scope.data.options, "multi_language").value : 'NO';

        $scope.loadUITexts($scope);

        $scope.loadDefaultMenuTitles();

        $scope.isloading = false;
        $scope.login_mode = login_mode;
    });
    // function for login
    $scope.login = function () {
        var checkCred = (login_mode == 'username' ? $scope.input.username : $scope.input.email) !== '' && $scope.input.password !== '';

        if (checkCred) {
            $scope.show();

            var url = login_url;
            var input = $scope.input;
            var device_id = '';
            if (isPhoneGap()) {
                device_id = $cordovaDevice.getDevice().uuid;
            }
            console.log(input);
            var obj = serializeData({
                email: input.email,
                username: input.username,
                password: input.password,
                company_id: company_id,
                device_id: device_id
            });

            httpService.post($scope, $http, url, obj);
        } else {
            $scope.showRequirementAlert();
        }

    };

    // if post login data success
    $scope.$on('httpService:postRequestSuccess', function () {
        $scope.result = $scope.data;
        console.log($scope.result);

        $scope.hide();

        if($scope.result.message == null || $scope.result.message == '' || $scope.result.message == undefined)
        {
            $scope.showFailedAlert();
        }

        // if user authentication success
        if ($scope.result.success === true) {

            var temp_user_meta = $scope.result['user']['company_user_meta'];
            for(var i=0; i<temp_user_meta.length; i++)
            {
                var key = temp_user_meta[i]['key'];
                var value = temp_user_meta[i]['value'];
                if (key.indexOf('_date') !== -1) {
                    value = new Date(value);
                }
                user_meta[key] = value;
            }

            // load points
            if (membership_features_enabled == 'YES'){
                if ($scope.result['user']['points'] != false && $scope.result['user']['points'] != null){
                    user_meta['approved_points'] = $scope.result['user']['points'].approved_points;
                    user_meta['lifetime_points'] = $scope.result['user']['points'].lifetime_points;
                }
                else {
                    user_meta['approved_points'] = 0;
                    user_meta['lifetime_points'] = 0;
                }
            }

            user_meta['u_profile_pic'] = user_meta['u_profile_pic'] == false || user_meta['u_profile_pic'] == null || user_meta['u_profile_pic'] == undefined ? '' : user_meta['u_profile_pic'];
            $scope.user_meta = user_meta;
            $scope.membership_features_enabled = membership_features_enabled;

            if (cp_mode === 'YES'){
                cp_compro_member = user_meta['cp_compro_member'];
            }

            if (isPhoneGap()) {
                // save user login to database
                console.log(db);
                if (db === '') {
                    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
                }

                db.transaction(function (tx) {
                    console.log($scope.result.user.id + ' ' + $scope.result.user.username);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + user_table + ' (id integer primary key, user text)');
                    tx.executeSql('DELETE FROM ' + user_table);
                    tx.executeSql("INSERT INTO " + user_table + " (id, user) VALUES (?,?)", [$scope.result.user.id, JSON.stringify($scope.result.user)], function (tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

                        //$scope.showAlert($scope.alert_login_title, $scope.result.message);
                        $scope.showAlert($scope.alert_login_title, translate_login_status($scope.result.status_code));
                        user_id = $scope.result.user.id;
                        username_login = $scope.result.user.username;
                        email = $scope.result.user.email;

                        if(getPostMetaValueById($scope.result.user.company_user_meta, 'address') != null && getPostMetaValueById($scope.result.user.company_user_meta, 'address') != undefined)
                        {
                            address = getPostMetaValueById($scope.result.user.company_user_meta, 'address').value;
                        }

                        if(getPostMetaValueById($scope.result.user.company_user_meta, 'phone') != null && getPostMetaValueById($scope.result.user.company_user_meta, 'phone') != undefined)
                        {
                            phone = getPostMetaValueById($scope.result.user.company_user_meta, 'phone').value;
                        }

                        console.log(username_login + ' ' + user_id + ' ' + email + ' ' + phone);
                        console.log(user_id);
                        login_menu = 'User';
                        $scope.title = login_menu;
                        $scope.username_login = username_login;
                        $scope.isLogin = true;
                        $rootScope.isLoggedIn = true;
                        main_menu['transaction_list'] = $scope.isLogin;
                        $rootScope.transaction_count = $scope.result['transaction_count'];

                        window.location.href = "#/app/" + home_template + "/" + home_id;
                        console.log("*********************");
                        console.log("LOGIN_REQ: IS LOGGED IN: " + $rootScope.isLoggedIn);
                        console.log("*********************");

                        $rootScope.user_id = user_id;
                        $scope.refreshMenu();
                    }, function (e) {
                        console.log("ERROR: " + e.message);
                        $scope.isLogin = false;
                        $rootScope.isLoggedIn = isLoggedIn = false;
                        main_menu['transaction_list'] = $scope.isLogin;
                        $rootScope.transaction_count = $scope.result['transaction_count'];
                        $scope.showAlert($scope.alert_login_title, $scope.alert_button_try_again);
                    });
                });
            }
            else {
                //$scope.showAlert($scope.alert_login_title, $scope.result.message);
                $scope.showAlert($scope.alert_login_title, translate_login_status($scope.result.status_code));
                user_id = $scope.result.user.id;
                username_login = $scope.result.user.username;
                email = $scope.result.user.email;

                if(getPostMetaValueById($scope.result.user.company_user_meta, 'address') != null && getPostMetaValueById($scope.result.user.company_user_meta, 'address') != undefined)
                {
                    address = getPostMetaValueById($scope.result.user.company_user_meta, 'address').value;
                }

                if(getPostMetaValueById($scope.result.user.company_user_meta, 'phone') != null && getPostMetaValueById($scope.result.user.company_user_meta, 'phone') != undefined)
                {
                    phone = getPostMetaValueById($scope.result.user.company_user_meta, 'phone').value;
                }
                console.log(username_login + ' ' + user_id + ' ' + email + ' ' + phone + ' ' + address);
                login_menu = 'User';
                $scope.title = login_menu;
                $scope.username_login = username_login;
                $scope.isLogin = true;
                $rootScope.isLoggedIn = isLoggedIn = true;
                main_menu['transaction_list'] = $scope.isLogin;
                $rootScope.transaction_count = $scope.result['transaction_count'];

                window.location.href = "#/app/" + home_template + "/" + home_id;

                $rootScope.user_id = user_id;
                $scope.refreshMenu();
            }

        }
        else {
            //if expired and needs top-up
            if($scope.result.status_code === 'expired' && is_membership_enabled == 'YES')
            {
                //$scope.showAlert($scope.alert_login_title, $scope.result.message);
                $scope.showAlert($scope.alert_login_title, translate_login_status($scope.result.status_code));
                user_id = $scope.result.user.id;
                username_login = $scope.result.user.username;
                email = $scope.result.user.email;
                is_expired = true;

                if(getPostMetaValueById($scope.result.user.company_user_meta, 'address') != null && getPostMetaValueById($scope.result.user.company_user_meta, 'address') != undefined)
                {
                    address = getPostMetaValueById($scope.result.user.company_user_meta, 'address').value;
                }

                if(getPostMetaValueById($scope.result.user.company_user_meta, 'phone') != null && getPostMetaValueById($scope.result.user.company_user_meta, 'phone') != undefined)
                {
                    phone = getPostMetaValueById($scope.result.user.company_user_meta, 'phone').value;
                }
                console.log(username_login + ' ' + user_id + ' ' + email + ' ' + phone + ' ' + address);
                login_menu = 'User';
                $scope.title = login_menu;
                $scope.username_login = username_login;

                window.location.href = "#/front-top-up/-6";
            }
            else
            {
                $scope.isLogin = false;
                $rootScope.isLoggedIn = false;
                main_menu['transaction_list'] = $scope.isLogin;
                $rootScope.transaction_count = $scope.result['transaction_count'];
                //$scope.showAlert($scope.alert_login_title, $scope.result.message);
                $scope.showAlert($scope.alert_login_title, translate_login_status($scope.result.status_code));
            }
        }

    });

    $scope.$on('httpService:postRequestError', function () {
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

    $scope.showAlert = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            css: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + message + '</div>',
            okType:'cp-button',
            okText: $scope.alert_button_ok
        });
    };


    $scope.showFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_login_title,
            css: 'cp-button',
            okType:'cp-button',
            okText: $scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">'+$scope.alert_login_failed_connection+'</div>'
        });
    };

    $scope.showRequirementAlert = function () {
        var message = login_mode == 'username' ? $scope.alert_login_failed_requirement_username : $scope.alert_login_failed_requirement_email;
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_login_title,
            css: 'cp-button',
            okType:'cp-button',
            okText: $scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">'+message+'</div>'
        });
    };

    // override back button

    $scope.clearHistory = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    };

    $scope.$on('$destroy', function () {
        doregisterHardBack();

    });

    var doCustomBack = function () {
        $scope.clearHistory();
        $scope.showExitConfirmation = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: $scope.alert_title_exit_app,
                css: 'cp-button',
                template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_content_exit_app + "</div>",
                okType:'cp-button'
            });

            //confirmation dialog
            confirmPopup.then(function (res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            });
        };

        $scope.showExitConfirmation();
    };

    var doregisterHardBack = $ionicPlatform.registerBackButtonAction(doCustomBack, 101);

    $scope.refreshMenu = function(){
        console.log("Root Scope: Login Refresh Menu Success");
        $rootScope.$emit('httpService:refreshMenu');
    };

    //--------- MULTI-LANGUAGE FUNCTIONS ---------

    $scope.selectLanguage = function(){
      // LOAD DEFAULT LANGUAGE ON SQLITE
      if (isPhoneGap()) {
        // deleteSpecialVarsFromDB("default_language");
        loadSpecialVarsFromDB("default_language", $scope);
      }
    };

    $scope.$on('SQLite:getSpecialVarsSuccess:default_language',function(){
      if ($scope.special_vars != null) {
        $scope.language = language = $scope.special_vars;
        reloadDefaultLanguage();
      }
      else {
        if (available_languages.length > 1) {
          // $state.go('login.setting-language');
        }
      }
    });

    $scope.$on('SQLite:getSpecialVarsError:default_language',function(){
      if (available_languages.length > 1) {
        // $state.go('login.setting-language');
      }
    });

    var reloadDefaultLanguage = function(){
      $scope.loadDefaultMenuTitles();
      // $scope.loadUITextMembership();
      $scope.loadUITextGeneral();
    };

    $rootScope.$on('ReloadDefaultLanguage',function(){
      isRefreshLanguage = true;
      reloadDefaultLanguage();

      if (isPhoneGap()) {
        // SAVE SELECTED LANGUAGES HERE...
        saveSpecialVarsToDB("default_language", "LanguageCtrl", language);
      }
    });

});
