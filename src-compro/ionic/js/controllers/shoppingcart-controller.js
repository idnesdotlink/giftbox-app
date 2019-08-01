app.controller("ShoppingCartCtrl", function ($scope,
                                             $ionicModal,
                                             $rootScope,
                                             $http,
                                             httpService,
                                             $stateParams,
                                             $ionicLoading,
                                             $ionicPopup,
                                             $ionicPlatform,
                                             $ionicHistory,
                                             $state,
                                             $ionicScrollDelegate,
                                             filterFilter,
                                             $location,
                                             $anchorScroll,
                                             $timeout,
                                             $cordovaLaunchNavigator,
                                             $cordovaGeolocation) {

    var payment_url = 'payment_url';
    var myLocation = {lat: -34.397, lng: 150.644};
    $scope.provinces = [];
    $scope.cities = [];
    $scope.costs = [];
    $scope.tariff = {};
    $scope.payment = {};
    $scope.payment.selectedPaymentType = '';
    $scope.tariff.selectedProvince = '';
    $scope.tariff.selectedCity = '';
    $scope.tariff.selectedService = '';
    $scope.tariff.selectedCost = 'null;0';
    $scope.payment_type = [];
    $scope.cost_value = 0;
    $scope.tempFinalTotal = 0;
    $scope.finalTotal = 0;
    $scope.deliveryPrice = 0;
    $scope.deliveryCourier = '';
    $scope.deliveryMethod = 'No Service';
    //$scope.deliveryMeta = {};
    $scope.otherCosts = [];
    $scope.courier_available = false;
    $scope.pos_malaysia_valid = true;
    $scope.promocode_enabled = promocode_enabled;                                           
    $scope.costsSicepat = [];
    $scope.sicepat = [];
    $scope.sicepat_city = [];
    $scope.tariff.selectedProvinceSicepat = '';
    $scope.tariff.selectedCitySicepat = '';
    $scope.tariff.selectedSubdistrictSicepat = '';
    $scope.gosend = [];                                             
    $scope.shipper = [];
    $scope.shipperCountry = [];
    $scope.shipperCost = [];
    $scope.shipperCostReg = [];
    $scope.shipperCostExp = [];
    $scope.shipperCostintl = [];
    $scope.shipperCostDesti = [];
    $scope.shipperCostDestiIntl = [];
    $scope.selectedShipperSearch = '';
    $scope.selectedDestination = '';
    $scope.selectedDestinationIntl = '';
    $scope.shipper = {};
    $scope.shipper.cost = '';
    $scope.selectedShipperCountry = '';
    $scope.selectedShipperInterCost = '';
    $scope.selectedShipperCountry = '';
    $scope.minDays = '-';
    $scope.maxDays = '-';

    $scope.posmalaysia = {};
    $scope.posmalaysia.selectedZone = '';
    $scope.posmalaysiaZones = [];

    $scope.provinceId = -1;
    $scope.cityId = -1;
    $scope.suburbId = -1;
    $scope.areaId = -1;

    $scope.membership_features_enabled = membership_features_enabled;
    $scope.shipper_enabled = shipper_enabled;
    $scope.custom_delivery_enabled = custom_delivery_enabled;
    $scope.loyalty_integration_active = loyalty_integration_active;
    $scope.isLoadingPoints = false;
    $scope.isPointsTryAgain = false;
    $scope.gosend_default_lat = gosend_default_lat;
    $scope.gosend_default_lng = gosend_default_lng;

    var currentRajaOngkirLoad = '';

    $scope.cp_mode = cp_mode;
    $scope.login_mode = login_mode;
    

    $scope.showShoppingCartFirstPopup = function() {
        if (cp_mode === 'YES' && user_meta.cp_compro_member == 'YES') {
            $scope.showCPShoppingCartFirstPopup();
        }
    };

    $scope.showShoppingCartSubmitOrderPopup = function() {
        if (cp_mode === 'YES' && user_meta.cp_compro_member == 'YES') {
            $scope.showCPShoppingCartSubmitOrderPopup();
        }
    };
    $scope.showCPShoppingCartFirstPopup = function() {
        var cpFirstPurchase = user_meta.cp_first_purchase;
        var cpCreditStatus = user_meta.cp_credit_status;
        var cpCredit = user_meta.cp_credit;
        var cpCreditExpiryDate = user_meta.cp_credit_expiry_date;

        var timeOffset = cpCreditExpiryDate.getTimezoneOffset() * 60000;

        var currentDate = Date.now();
        var expiryDate = Date.parse(cpCreditExpiryDate) - timeOffset; // perlu di-offset karena tanggalnya dianggap +7 atau locale lain dari sananya.

        var timeToExpire = (expiryDate - currentDate) / 1000;

        var totalPrice = $scope.totalPrice + $scope.deliveryPrice;
        var diff = cpCredit - totalPrice;

        if (cpFirstPurchase === 'TRUE' && cpCredit > 0 && diff > 0 &&
            cpCreditStatus === 'ACTIVE' && timeToExpire > 0) {
            var titlePopupCreditUsage = "<b>NOTICE</b>";
            var msgPopupCreditUsage = "You still have <span style='font-weight:bold;'>Rp" + diff.toFixed(2) + "</span> worth of product value to claim. This value will be voided if not used.";
            var txtPopupConfirmCreditUsage = 'OK';

            /* show expire notification here... */
            $scope.alertCreditUsage = function() {
                var confirmPopup = $ionicPopup.alert({
                    title: titlePopupCreditUsage,
                    css: 'cp-button',
                    template: "<div style='text-align:center;justify-content:center;align-items:center;'>" + msgPopupCreditUsage + "</div>",
                    okType: 'cp-button',
                    okText: $scope.alert_button_ok,
                });
            };
            registerPopup($scope.alertCreditUsage); // app-functions.js
            showNextPopup();
        }
    };

    $scope.showCPShoppingCartSubmitOrderPopup = function() {
        var cpFirstPurchase = user_meta.cp_first_purchase;
        var cpCreditStatus = user_meta.cp_credit_status;
        var cpCredit = user_meta.cp_credit;
        var cpCreditExpiryDate = user_meta.cp_credit_expiry_date;

        var timeOffset = cpCreditExpiryDate.getTimezoneOffset() * 60000;

        var currentDate = Date.now();
        var expiryDate = Date.parse(cpCreditExpiryDate) - timeOffset; // perlu di-offset karena tanggalnya dianggap +7 atau locale lain dari sananya.

        var timeToExpire = (expiryDate - currentDate) / 1000;

        var totalPrice = $scope.tempFinalTotal; //$scope.finalTotal > 0 ? $scope.finalTotal : $scope.totalPrice;
        var diff = cpCredit - totalPrice;

        if (cpFirstPurchase === 'TRUE' && cpCredit > 0 && diff > 0 &&
            cpCreditStatus === 'ACTIVE' && timeToExpire > 0) {
            var titlePopupConfirmOrder = "<b>NOTICE</b>";
            var msgPopupConfirmOrder = "You still have <span style='font-weight:bold;'>Rp" + diff.toFixed(2) + "</span> worth of product value to claim, this value will be voided if not used.  <span style=font-weight>Are you sure you want to continue?</span>";
            var txtPopupConfirmOrderYes = 'Yes';
            var txtPopupConfirmOrderNo = 'No';

            /* show expire notification here... */
            $scope.alertConfirmOrder = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: titlePopupConfirmOrder,
                    css: 'cp-button',
                    template: "<div style='text-align:center;justify-content:center;align-items:center;'>" + msgPopupConfirmOrder + "</div>",
                    okType: 'cp-button',
                    buttons: [{
                            text: txtPopupConfirmOrderNo
                        },
                        {
                            text: txtPopupConfirmOrderYes,
                            type: 'cp-button',
                            onTap: function(e) {
                                $scope.execSubmitOrder();
                            }
                        }
                    ]
                });

                //                confirmPopup.then(function (res) {
                //                    if (res) {
                //                        $scope.execSubmitOrder();
                //                    }
                //                });
            };
            registerPopup($scope.alertConfirmOrder); // app-functions.js
            showNextPopup();
        } else {
            $scope.execSubmitOrder();
        }
    };

    $scope.calculateOtherCosts = function() {
        $scope.otherCosts = [];
        $scope.tempFinalTotal = $scope.finalTotal;
        if ($scope.cp_mode === 'YES' && $scope.isLogin && user_meta.cp_compro_member == 'YES') {
            console.log(user_meta);
            var cpFirstPurchase = user_meta.cp_first_purchase;
            var cpCreditStatus = user_meta.cp_credit_status;
            var cpCredit = user_meta.cp_credit;
            var cpCreditExpiryDate = user_meta.cp_credit_expiry_date;

            var timeOffset = cpCreditExpiryDate.getTimezoneOffset() * 60000;

            var currentDate = Date.now();
            var expiryDate = Date.parse(cpCreditExpiryDate) - timeOffset; // perlu di-offset karena tanggalnya dianggap +7 atau locale lain dari sananya.

            var timeToExpire = (expiryDate - currentDate) / 1000;

            // first purchase price reduction.
            if (cpFirstPurchase === 'TRUE' && cpCredit > 0 && cpCreditStatus === 'ACTIVE' && timeToExpire > 0) {
                // declare some details to be viewed.
                var firstPurchase = {
                    label: $scope.text_cp_first_purchase,
                    value: -cpCredit
                };
                $scope.otherCosts.push(firstPurchase);

                // calculate new total price.
                $scope.finalTotal -= cpCredit;
                $scope.finalTotal = $scope.finalTotal < 0 ? 0 : $scope.finalTotal;
            }

            // rounding to 10000 if finalTotal > 0 & < 10000
            if ($scope.finalTotal < cp_total_rounding && $scope.finalTotal > 0) {
                var rounding = cp_total_rounding - $scope.finalTotal;
                var roundingOff = {
                    label: $scope.text_cp_total_rounding,
                    value: rounding
                };
                $scope.otherCosts.push(roundingOff);
                $scope.finalTotal = cp_total_rounding;
            }
        }
    };

    $scope.showAlertNoItemInCart = function() {
        $scope.alertNoItem = function() {
            var confirmPopup = $ionicPopup.alert({
                title: $scope.text_no_item_popup_title,
                css: 'cp-button',
                template: "<div style='text-align:center;justify-content:center;align-items:center;'>" + $scope.text_no_item_popup_message + "</div>",
                okType: 'cp-button',
                buttons: [{
                    text: $scope.alert_button_ok,
                    type: 'cp-button',
                    onTap: function(e) {
                        if (($ionicHistory.backView() === null || $ionicHistory.backView() === undefined) && $ionicHistory.currentStateName() !== ("app." + home_template)) {
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicHistory.clearHistory();
                            $state.go('app.' + home_template, {
                                id: home_id
                            });
                            $ionicHistory.clearHistory();
                        } else {
                            $ionicHistory.goBack();
                        }
                    }
                }]
            });
        };
        registerPopup($scope.alertNoItem); // app-functions.js
        showNextPopup();
    };

    var defaultModalTemplate = 'templates/gosend-map-modal.html';

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl(defaultModalTemplate, {
        id: 'mapModal',
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        //success
    }, {
        //error
    });

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    function gosendMap(action) {
        $ionicModal.fromTemplateUrl(defaultModalTemplate, {
            id:'mapModal',
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
            if(action == 'open') {
                $scope.modal.show();
            }
        }, {
            //error
        });
    }

    $scope.$on('modal.shown', function() {
        console.log('Modal is shown!');
        initializeMap();
    });

    $scope.$on('modal.hidden', function() {
        $scope.modal.remove();
        gosendMap('');
    });

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
        console.log("shopping cart");
        console.log($rootScope.destination_gosend_lat +" "+ $rootScope.destination_gosend_lng);
        console.log($rootScope.gosend_instant_price + " "+ $rootScope.gosend_sameday_price);
        $rootScope.destination_gosend_lat = 0;
        $rootScope.destination_gosend_lng = 0;
        $rootScope.gosend_instant_price = 0;
        $rootScope.gosend_sameday_price = 0;
        $rootScope.totalVoucher = 0;
        $rootScope.voucher_id = 0;
        $rootScope.voucher_price = 0;
        $rootScope.voucher_code = "";
        //$scope.getCostGoSend();
        $scope.voucher = {
            data: ''
        };
        if(user_id != '')
        {
            $scope.isLogin = true;
            $scope.input = {
                name: username_login,
                email: email,
                phone: phone,
                address: address,
                comments: '',
                meta: user_meta
            };
        } else {
            $scope.isLogin = false;
            $scope.input = {
                name: '',
                email: '',
                phone: '',
                address: '',
                comments: '',
                meta: ''
            };
        }

        $scope.payment_type = JSON.parse(payment_type)[0];
        $scope.payment_channel = JSON.parse(payment_channel);
        $scope.custom_transaction_fields = JSON.parse(custom_transaction_fields);
        $scope.default_transaction_fields = JSON.parse(default_transaction_fields)[0];

        $scope.unavailable_product = [];
        // $scope.rajaongkir_enabled = "YES";
        // $scope.sicepat_enabled ="YES";
        if (rajaongkir_selected_services != '')
            $scope.rajaongkir_selected_services = JSON.parse(rajaongkir_selected_services);
        else
            $scope.rajaongkir_selected_services = JSON.parse('{"jne":true,"tiki":true,"pos":true}');

        $scope.tax_enabled = tax_enabled;
        $scope.limit_per_customer_enabled = limit_per_customer_enabled;
        $scope.pickup_enabled = pickup_enabled;
        $scope.no_delivery_enabled = no_delivery_enabled;
        $scope.go_send_enabled = go_send_enabled;
        $scope.gosend_display_city = gosend_display_city;

        if (custom_tax_fields != false) {
            $scope.custom_tax_fields = JSON.parse(custom_tax_fields);
        } else {
            $scope.custom_tax_fields = JSON.parse("[]");
        }

        var loadCustomText = function() {
            $scope.title = getMenuText(default_menu_titles.cart, "Shopping Cart");
            $scope.items_in_cart = getMenuText(default_menu_titles.items_in_cart, "Items in Cart");
            $scope.remove_item_hint = getMenuText(default_menu_titles.remove_item_hint, "Swipe left to remove item.");
            $scope.button_text_checkout = getMenuText(default_menu_titles.button_text_checkout, "Checkout");
            $scope.button_text_check = getMenuText(default_menu_titles.button_text_check, "Check");
            $scope.no_cart_item = getMenuText(default_menu_titles.no_cart_item, "No item in shopping cart.");

            $scope.text_volumetric_weight = getMenuText(ui_texts_shopping_cart.text_volumetric_weight, "Volumetric Weight");
            $scope.text_rajaongkir_province = getMenuText(ui_texts_shopping_cart.text_rajaongkir_province, "Province");
            $scope.text_rajaongkir_city = getMenuText(ui_texts_shopping_cart.text_rajaongkir_city, "City");
            $scope.text_rajaongkir_service = getMenuText(ui_texts_shopping_cart.text_rajaongkir_service, "Service");
            $scope.text_rajaongkir_select_province = getMenuText(ui_texts_shopping_cart.text_rajaongkir_select_province, "SELECT PROVINCE");
            $scope.text_rajaongkir_select_city = getMenuText(ui_texts_shopping_cart.text_rajaongkir_select_city, "SELECT CITY");
            $scope.text_rajaongkir_select_service = getMenuText(ui_texts_shopping_cart.text_rajaongkir_select_service, "SELECT SERVICE");
            $scope.text_rajaongkir_total_ongkir = getMenuText(ui_texts_shopping_cart.text_rajaongkir_total_ongkir, "Ongkir");
            $scope.button_text_rajaongkir_check_cost = getMenuText(ui_texts_shopping_cart.button_text_rajaongkir_check_cost, "Check Cost");
            $scope.text_tnc_agree = getMenuText(ui_texts_shopping_cart.text_tnc_agree, "By clicking this button below, you have accepted our");
            $scope.text_tnc_agree_alert = getMenuText(ui_texts_shopping_cart.text_tnc_agree_alert, "you must agree to terms and conditions");
            $scope.text_view_tnc = getMenuText(ui_texts_shopping_cart.text_view_tnc, "Terms and Conditions");
            $scope.text_qty = getMenuText(ui_texts_shopping_cart.text_qty, "Qty");
            $scope.text_subtotal = getMenuText(ui_texts_shopping_cart.text_subtotal, "Subtotal");
            $scope.text_summary = getMenuText(ui_texts_shopping_cart.text_summary, "Summary");
            $scope.text_remove = getMenuText(ui_texts_shopping_cart.text_remove, "Remove");

            $scope.text_popup_title_no_expedition = getMenuText(ui_texts_membership_history.text_popup_title_no_expedition, "No Expedition");
            $scope.text_points_get = getMenuText(ui_texts_membership_menu.text_points_get, "Get");
            $scope.text_points_points = getMenuText(ui_texts_membership_menu.text_points_points, "Points");
            $scope.text_payment_success_title = getMenuText(ui_texts_shopping_cart.text_payment_success_title, 'Payment Success!');
            $scope.text_payment_pending_title = getMenuText(ui_texts_shopping_cart.text_payment_pending_title, 'Payment Pending');
            $scope.text_payment_error_title = getMenuText(ui_texts_shopping_cart.text_payment_error_title, 'Payment Error');
            $scope.text_payment_close_title = getMenuText(ui_texts_shopping_cart.text_payment_close_title, 'Payment Unfinished');
            $scope.text_payment_success_content = getMenuText(ui_texts_shopping_cart.text_payment_success_content, 'Thank you for the purchase. We will process your order immediately.');
            $scope.text_payment_pending_content = getMenuText(ui_texts_shopping_cart.text_payment_pending_content, 'We are currently processing your payment. You will be notified soon.');
            $scope.text_payment_error_content = getMenuText(ui_texts_shopping_cart.text_payment_error_content, 'Please contact our developer to solve this problem.');
            $scope.text_payment_close_content = getMenuText(ui_texts_shopping_cart.text_payment_close_content, 'Your payment is not finished yet. To continue, navigate to "Transaction History" and find the pending payment.');

            $scope.alert_loading_failed_title = getMenuText(ui_texts_shopping_cart.alert_loading_failed_title, "Loading Failed");
            $scope.alert_loading_failed_content = getMenuText(ui_texts_shopping_cart.alert_loading_failed_content, "Failed to load data, would you like to try again?");
            $scope.alert_checkout_title = getMenuText(ui_texts_shopping_cart.alert_checkout_title, "Checkout");
            $scope.alert_unavailable_product_content_info = getMenuText(ui_texts_shopping_cart.alert_unavailable_product_content_info, "Some items are unavailable or limited per customer. Tap 'Remove' to clear these items:");
            $scope.alert_unavailable_product_content_unavailable_items = getMenuText(ui_texts_shopping_cart.alert_unavailable_product_content_unavailable_items, "Unavailable items:");
            $scope.alert_unavailable_product_content_limited = getMenuText(ui_texts_shopping_cart.alert_unavailable_product_content_limited, "Limited per customer:");
            $scope.alert_unavailable_product_content_apologize = getMenuText(ui_texts_shopping_cart.alert_unavailable_product_content_apologize, "We apologize for the inconvenience caused.");
            $scope.alert_unavailable_product_button_remove = getMenuText(ui_texts_shopping_cart.alert_unavailable_product_button_remove, "Remove");
            $scope.alert_button_pay_now = getMenuText(ui_texts_shopping_cart.alert_button_pay_now, "Pay Now");
            $scope.alert_button_pay_later = getMenuText(ui_texts_shopping_cart.alert_button_pay_later, "Pay Later");
            $scope.alert_button_view_detail = getMenuText(ui_texts_shopping_cart.alert_button_view_detail, "View Detail");
            $scope.alert_check_cost_sicepat_content = getMenuText(ui_texts_shopping_cart.alert_check_cost_sicepat_content, "Please select courier, province, city and sub district.");
            $scope.alert_check_cost_pos_malaysia_content = getMenuText(ui_texts_shopping_cart.alert_check_cost_pos_malaysia_content, "Please select zone.");
            $scope.button_text_login = getMenuText(ui_texts_login.button_text_login, "Log in");

            $scope.text_no_cost_found_alert = getMenuText(ui_texts_shopping_cart.text_no_cost_found_alert, "No delivery service available to your area.");
            $scope.text_check_cost_alert = getMenuText(ui_texts_shopping_cart.text_check_cost_alert, "Please select courier, province, and city.");
            $scope.text_login_alert = getMenuText(ui_texts_shopping_cart.text_login_alert, "Please login first before checkout");
            $scope.text_success_alert = getMenuText(ui_texts_shopping_cart.text_success_alert, "Your Order Submitted Successfully");
            $scope.text_failed_alert = getMenuText(ui_texts_shopping_cart.text_failed_alert, "Failed to Submit Your Order. Make sure You have the item(s) you want to order and check your internet connection.");
            $scope.text_delivery_alert = getMenuText(ui_texts_shopping_cart.text_delivery_alert, "Please choose delivery method");

            $scope.text_payment_type_alert = getMenuText(ui_texts_shopping_cart.text_payment_type_alert, "Please choose payment type");
            $scope.text_grand_total = getMenuText(ui_texts_shopping_cart.text_grand_total, "Grand Total");
            $scope.text_cp_first_purchase = getMenuText(ui_texts_shopping_cart.text_cp_first_purchase, "First Purchase");
            $scope.text_cp_total_rounding = getMenuText(ui_texts_shopping_cart.text_cp_total_rounding, "Rounding");
            $scope.text_no_item_popup_title = getMenuText(ui_texts_shopping_cart.text_no_item_popup_title, "No Item In Cart");
            $scope.text_no_item_popup_message = getMenuText(ui_texts_shopping_cart.text_no_item_popup_message, "No items added to cart, please add at least one item.");

            $scope.alert_no_expedition_title = getMenuText(ui_texts_shopping_cart.alert_no_expedition_title, "No Expedition Found");
            $scope.alert_no_expedition_content = getMenuText(ui_texts_shopping_cart.alert_no_expedition_content, "No expedition available for this country.");
            $scope.alert_no_expedition_content_area = getMenuText(ui_texts_shopping_cart.alert_no_expedition_content_area, "No expedition available for this area.");
            $scope.text_pos_malaysia_no_result_alert = getMenuText(ui_texts_shopping_cart.text_pos_malaysia_no_result_alert, "Expedition not available.");

            $scope.ui_text_payment_type = getMenuText(ui_texts_transactions.ui_text_payment_type, "Payment Type");
            $scope.ui_text_select_payment_type = getMenuText(ui_texts_transactions.ui_text_select_payment_type, "SELECT PAYMENT TYPE");
            $scope.ui_text_payment_bank_transfer = getMenuText(ui_texts_transactions.ui_text_payment_bank_transfer, "Bank Transfer");
            $scope.ui_text_payment_online_payment = getMenuText(ui_texts_transactions.ui_text_payment_online_payment, "Online Payment");
            $scope.ui_text_payment_cod = getMenuText(ui_texts_transactions.ui_text_payment_cod, "Cash on Delivery");
            $scope.ui_text_payment_espay = getMenuText(ui_texts_transactions.ui_text_payment_espay, "Pay with ESPAY");
            //$scope.ui_text_payment_loyalty = getMenuText(ui_texts_transactions.ui_text_payment_loyalty, "Loyalty");
            $scope.ui_text_payment_loyalty = "Pay with " + $scope.loyalty_app_integration_apps_loyalty;

            $scope.ui_text_delivery_no_delivery = getMenuText(ui_texts_transactions.ui_text_delivery_no_delivery, "No Delivery");
            $scope.ui_text_delivery_pick_up = getMenuText(ui_texts_transactions.ui_text_delivery_pick_up, "Pick Up");
            $scope.ui_text_delivery_domestic = getMenuText(ui_texts_transactions.ui_text_delivery_domestic, "Domestic");
            $scope.ui_text_delivery_international = getMenuText(ui_texts_transactions.ui_text_delivery_international, "International");

            $scope.ui_text_delivery_select_province = getMenuText(ui_texts_shopping_cart.ui_text_delivery_select_province, "Select Province");
            $scope.ui_text_delivery_select_city = getMenuText(ui_texts_shopping_cart.ui_text_delivery_select_city, "Select City");
            $scope.ui_text_delivery_select_suburb = getMenuText(ui_texts_shopping_cart.ui_text_delivery_select_suburb, "Select Suburb");
            $scope.ui_text_delivery_select_area = getMenuText(ui_texts_shopping_cart.ui_text_delivery_select_area, "Select Area");
            $scope.ui_text_delivery_pick_service = getMenuText(ui_texts_shopping_cart.ui_text_delivery_pick_service, "Pick Delivery Service");
            $scope.ui_text_delivery_destination_area = getMenuText(ui_texts_shopping_cart.ui_text_delivery_destination_area, "Destination Area");
            $scope.ui_text_delivery_delivery_charge = getMenuText(ui_texts_shopping_cart.ui_text_delivery_delivery_charge, "Delivery Charge");
            $scope.ui_text_delivery_total_price = getMenuText(ui_texts_shopping_cart.ui_text_delivery_total_price, "Total Price");
            $scope.ui_text_delivery_select_country = getMenuText(ui_texts_shopping_cart.ui_text_delivery_select_country, "Select Country");
            $scope.ui_text_delivery_select_expedition = getMenuText(ui_texts_shopping_cart.ui_text_delivery_select_expedition, "Select Expedition");
            $scope.ui_text_delivery_destination_country = getMenuText(ui_texts_shopping_cart.ui_text_delivery_destination_country, "Destination Country");
            $scope.ui_text_delivery_no_service = getMenuText(ui_texts_shopping_cart.ui_text_delivery_no_service, "No Delivery Service");
            $scope.ui_text_delivery_delivery_time = getMenuText(ui_texts_shopping_cart.ui_text_delivery_delivery_time, "Estimated Time");
            $scope.ui_text_delivery_delivery_days = getMenuText(ui_texts_shopping_cart.ui_text_delivery_delivery_days, "days");
            //$scope.ui_text_loyalty_balance = getMenuText(ui_texts_shopping_cart.ui_text_loyalty_balance, "Your Loyalti Balance:");
            $scope.ui_text_loyalty_balance = "Your " + $scope.loyalty_app_integration_apps_loyalty + " Balance";
            $scope.ui_text_loading = getMenuText(ui_texts_shopping_cart.ui_text_loading, "Loading...");
            $scope.ui_text_try_again = getMenuText(ui_texts_shopping_cart.ui_text_try_again, "Try Again");
            //$scope.ui_text_please_connect_to_loyalty = getMenuText(ui_texts_shopping_cart.ui_text_please_connect_to_loyalty, "Please connect to loyalty");
            $scope.ui_text_please_connect_to_loyalty = "Please connect to " + $scope.loyalty_app_integration_apps_loyalty;
            //$scope.ui_text_warning_loyalty = getMenuText(ui_texts_shopping_cart.ui_text_warning_loyalty, "Your loyalty balance is not enough, please change your payment type");
            $scope.ui_text_warning_loyalty = "Your " + $scope.loyalty_app_integration_apps_loyalty + " balance is not enough, please change your payment type";
        };

        loadCustomText();

        $scope.shoppingCarts = shoppingCharts;

        $scope.currency = currency + ' ';
        //console.log("currency : " + $scope.currency );
        //console.log(shoppingCharts.length);
        $scope.totalPrice = 0;
        $scope.totalQty = 0;
        $scope.totalWeight = 0;


        $scope.calculateWeight = function() {
            if (shoppingCharts.length > 0) {
                $scope.totalWeight = 0;
                $scope.totalPrice = 0;
                for (var i = 0; i < shoppingCharts.length; i++) {
                    $scope.totalPrice += (shoppingCharts[i].price * shoppingCharts[i].qty);
                    $scope.totalQty += shoppingCharts[i].qty;
                    var max_weight_value = 0;

                    var itemVolumeValue = parseFloat(shoppingCharts[i].volume == undefined ? 1 : shoppingCharts[i].volume);
                    var itemWeightValue = parseFloat(shoppingCharts[i].weight == undefined ? 1 : shoppingCharts[i].weight);

                    var volumetricWeight = (itemVolumeValue / 6000 * 1000);
                    var itemWeight = itemWeightValue;

                    if (shipper_enabled == 'YES') {
                        max_weight_value = itemWeight;
                    } else {
                        max_weight_value = itemWeight > volumetricWeight ? itemWeight : volumetricWeight;
                    }
                    $scope.totalWeight += max_weight_value * shoppingCharts[i].qty;

                    // console.log(volumetricWeight);
                    // console.log(itemWeight);
                    //
                    // console.log(max_weight_value);
                    // console.log(shoppingCharts[i].qty);
                    //
                    // console.log("TOTAL WEIGHT " + i);
                    // console.log($scope.totalWeight);
                    //
                    // console.log("***********************");
                    // console.log(shoppingCharts[i]);
                    // console.log("***********************");
                }
            } else {
                $scope.totalWeight = 0;
            }
            console.log($scope.totalWeight);
            $scope.totalWeight = (parseFloat($scope.totalWeight)).toFixed(2);
            console.log("TOTAL WEIGHT:" + $scope.totalWeight);
        };

        $scope.calculateDimensions = function() {
            if (shoppingCharts.length > 0) {
                $scope.dimensionMax = 0;
                $scope.dimensionSecond = 0;
                $scope.dimensionMinSum = 0;

                // algorithm to count max width, height, length
                for (var i = 0; i < shoppingCharts.length; i++) {
                    var dim = [
                        parseFloat(shoppingCharts[i].width),
                        parseFloat(shoppingCharts[i].height),
                        parseFloat(shoppingCharts[i].length)
                    ];

                    console.log("ITEM " + i + ": " + dim[0] + 'x' + dim[1] + 'x' + dim[2] + ' QTY:' + shoppingCharts[i].qty);

                    var tempMax = dim[0];
                    var tempMin = dim[0];
                    var tempSecond = dim[0];

                    for (var d = 1; d < dim.length; d++) {
                        tempMax = dim[d] > tempMax ? dim[d] : tempMax;
                        tempMin = dim[d] < tempMin ? dim[d] : tempMin;
                    }
                    for (var d = 0; d < dim.length; d++) {
                        tempSecond = dim[d] > tempMin && dim[d] < tempMax ? dim[d] : tempSecond;
                    }
                    
                    var temp;

                    tempMin *= shoppingCharts[i].qty;
                    if (tempMin > tempSecond){
                        temp = tempSecond
                    }
                    else {
                        temp = tempMin;
                    }
                    var tempMaxBefore = $scope.dimensionMax;
                    if(tempMax > $scope.dimensionMax){
                        $scope.dimensionMax = tempMax;
                        $scope.dimensionSecond = tempSecond > tempMaxBefore ? tempSecond : tempMaxBefore;
                    }
                    else if(tempMax == $scope.dimensionMax){
                        $scope.dimensionSecond = tempSecond > $scope.dimensionSecond ? tempSecond : $scope.dimensionSecond;
                    }
                    else{
                        $scope.dimensionSecond = tempMax > $scope.dimensionSecond ? tempMax : $scope.dimensionSecond;
                    }
                    $scope.dimensionMinSum += temp;
                    console.log("TOTAL "+i+": " + $scope.dimensionMax + "x" + $scope.dimensionSecond + "x" + $scope.dimensionMinSum);
                }
                $scope.dimensionMax = Math.ceil($scope.dimensionMax);
                $scope.dimensionSecond = Math.ceil($scope.dimensionSecond);
                $scope.dimensionMinSum = Math.ceil($scope.dimensionMinSum);
                console.log("TOTAL: " + $scope.dimensionMax + "x" + $scope.dimensionSecond + "x" + $scope.dimensionMinSum);
            }
        };

        $scope.calculateWeight();
        $scope.calculateDimensions();
        $rootScope.totalQty = $scope.totalQty;
        
        //calculating taxes
        $scope.subTotal = $scope.finalTotal = $scope.totalPrice;
        $scope.calculateOtherCosts();
        $scope.taxes = new Array();
        $scope.totalPriceBeforeTax = $scope.totalPrice;
        if ($scope.tax_enabled == 'YES') {
            var previous_order_number = 0;
            var previous_total_value = $scope.totalPrice;
            for (var i = 0; i < $scope.custom_tax_fields.length; i++) {
                if ($scope.custom_tax_fields[i].order_no != previous_order_number) {
                    previous_order_number = $scope.custom_tax_fields[i].order_no;
                    previous_total_value = $scope.totalPrice;
                }

                $scope.taxes[i] = JSON.parse('{"label":"","value":0}');

                $scope.taxes[i].label = $scope.custom_tax_fields[i].field_name;
                if ($scope.custom_tax_fields[i].value_type == "percentage") {
                    $scope.taxes[i].value = previous_total_value * $scope.custom_tax_fields[i].value / 100;
                } else if ($scope.custom_tax_fields[i].value_type == "sum") {
                    $scope.taxes[i].value = parseInt($scope.custom_tax_fields[i].value);
                }

                $scope.totalPrice += $scope.taxes[i].value;

                console.log(previous_order_number);
                console.log(previous_total_value);

            }
        }

        console.log($scope.taxes);

        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;
        $scope.onItemDelete = function(index, id) {
            shoppingCharts.splice(index, 1);
            if (isPhoneGap()) clearCartById(id);
            $scope.totalPrice = 0;
            $scope.totalQty = 0;
            for (var i = 0; i < shoppingCharts.length; i++) {
                $scope.totalPrice += (shoppingCharts[i].price * shoppingCharts[i].qty);
                $scope.totalQty += shoppingCharts[i].qty;
            }
            $rootScope.totalQty = $scope.totalQty;
            $scope.subTotal = $scope.totalPrice;

            $scope.recalculateTotal();
            $scope.calculateWeight();

            if($rootScope.totalVoucher == 1 && shoppingCharts.length !== 0){
                $scope.showLoading();
                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                httpService.post_token($scope, $http, url, obj,'check-voucher-on-delete');
            }

            if (shoppingCharts.length === 0) {
                $rootScope.totalVoucher = 0;
                $rootScope.voucher_id = 0;
                $rootScope.voucher_price = 0;
                $rootScope.voucher_code = "";
                $scope.showAlertNoItemInCart();
            }

            if (user_id != '') {
                $scope.showShoppingCartFirstPopup();
            }

        };

        // MEMBERSHIP
        $scope.calculatePurchasePoints = function() {
            $scope.totalPoints = parseInt($scope.totalPriceBeforeTax / membership_points_rule_conversion);

        };

        //comment this

        if (shipper_enabled == 'NO') {
            if (rajaongkir_enabled == 'YES') {
                $scope.finalTotal = $scope.totalPrice;
                url = raja_ongkir_province + '0';
                httpService.get($scope, $http, url, 'rajaongkir-province', token);
            }

            if (sicepat_enabled == 'YES') {
                url = sicepat_province;
                httpService.get($scope, $http, url, 'sicepat-province', token);
            }
        }

        // if(shipper_enabled == 'YES'){
        //     var url = token_url;
        //     var obj = serializeData({email: username, password: password, company_id: company_id});
        //     httpService.post_token($scope, $http, url, obj, 'shipper-provinces');
        // }

        if (user_id != '') {
            $scope.showShoppingCartFirstPopup();
        }

        if (shoppingCharts.length === 0) {
            $scope.showAlertNoItemInCart();
        }

        // MEMBERSHIP POINTS
        if (membership_features_enabled == 'YES') {
            $scope.calculatePurchasePoints();
        }

        $scope.finalTotal = $scope.totalPrice;
    });

    $scope.cancelUseVoucher = function(){
        $scope.totalPrice = $rootScope.voucher_price + $scope.totalPrice;
        $scope.finalTotal = $rootScope.voucher_price + $scope.finalTotal;
        $rootScope.totalVoucher = 0;
        $rootScope.voucher_id = 0;
        $rootScope.voucher_price = 0;
        $rootScope.voucher_code = "";
    };

    $scope.checkVoucher = function(){
        console.log($rootScope.totalVoucher);
        if($rootScope.totalVoucher == 0){
            $scope.showLoading();
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj);
        }
        else{
            var alertPopup = $ionicPopup.alert({
                title: "Warning",
                template: '<div style="width:100%;text-align:center">Only Can Provide One Promo Code At Time, Please Click Icon <i class="ion-ios-close"></i> To Use Another Promo Code</div>',
                buttons: [{
                    text: $scope.alert_button_ok
                }]
            });
        }
    };

    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        console.log("Promo Code DATA");
        console.log($scope.voucher);
        url = url_check_voucher_code + '/' + company_id + '/' + user_id;
        console.log(url);
        var ids = new Array();
        var qtys = new Array();
        for (var i = 0; i < shoppingCharts.length; i++) {
            ids.push(shoppingCharts[i].id);
            qtys.push(shoppingCharts[i].qty);
        }
        var obj = serializeData({
            _method: 'POST',
            code: $scope.voucher.data.toUpperCase(),
            product_ids: ids,
            qtys: qtys,
            total_price: $scope.totalPrice
        });
        console.log(ids);
        console.log(qtys);
        console.log(obj);
        httpService.post($scope, $http, url + '?token=' + token, obj, 'check-voucher');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB('-1'+user_id, $scope);
            }
        }
        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    $scope.$on('httpService:postTokenCheckVoucherOnDeleteSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        console.log("Promo Code DATA");
        console.log($scope.voucher);
        url = url_check_voucher_code + '/' + company_id + '/' + user_id;
        console.log(url);
        var ids = new Array();
        var qtys = new Array();
        for (var i = 0; i < shoppingCharts.length; i++) {
            ids.push(shoppingCharts[i].id);
            qtys.push(shoppingCharts[i].qty);
        }
        var obj = serializeData({
            _method: 'POST',
            code: $scope.voucher.data.toUpperCase(),
            product_ids: ids,
            qtys: qtys,
            total_price: $scope.totalPrice
        });
        console.log(ids);
        console.log(obj);
        httpService.post($scope, $http, url + '?token=' + token, obj, 'check-voucher-on-delete');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenCheckVoucherOnDeleteError', function () {
        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB('-1'+user_id, $scope);
            }
        }
        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'check-voucher-on-delete');
        }
    });

    $scope.$on('httpService:postCheckVoucherSuccess', function() {
        console.log("HASIL");
        console.log($scope.data);
        $scope.hideLoading();
        $scope.isLoading = false;
        $scope.result = $scope.data;
        if($scope.data.success == 'true'){
            $rootScope.voucher_id = $scope.data.voucher.id;
            $rootScope.voucher_price = $scope.data.value;
            $rootScope.voucher_code = $scope.data.voucher.code;
            console.log($rootScope.voucher_id+" "+$rootScope.voucher_price+" "+$rootScope.voucher_code);
            if($scope.subTotal < $scope.data.value && $scope.deliveryPrice == 0){
                $scope.totalPrice = 0;
                $scope.finalTotal = 0;
            }
            else if($scope.subTotal < $scope.data.value && $scope.deliveryPrice != 0){
                $scope.totalPrice = 0;
                var priceBarang = 0;
                for (var i = 0; i < shoppingCharts.length; i++) {
                    priceBarang += (shoppingCharts[i].price * shoppingCharts[i].qty);
                }
                $scope.finalTotal = $scope.finalTotal - priceBarang;
                console.log(priceBarang);
            }
            else{
                $scope.totalPrice = $scope.totalPrice - $scope.data.value;
                $scope.finalTotal = $scope.finalTotal - $scope.data.value;
            }
            $rootScope.totalVoucher = 1;

            var alertPopup = $ionicPopup.alert({
                title: "Check Result Promo Code",
                template: '<div style="width:100%;text-align:center">'+ $scope.data.message +'</div>',
                buttons: [{
                    text: $scope.alert_button_ok
                }]
            });
        }
        else{
            var alertPopup = $ionicPopup.alert({
                title: "Error Check Result Promo Code",
                template: '<div style="width:100%;text-align:center">'+ $scope.data.message +'</div>',
                buttons: [{
                    text: $scope.alert_button_ok
                }]
            });
        }
    });

    $scope.$on('httpService:postCheckVoucherError', function() {
        $scope.hideLoading();
        console.log("Error Check Result Promo Code");
        console.log($scope.data);
        $scope.isLoading = false;
    });

    $scope.$on('httpService:postCheckVoucherOnDeleteSuccess', function(){
        console.log("HASIL CHECK PROMO CODE");
        console.log($scope.data);
        $scope.hideLoading();
        $scope.isLoading = false;
        $scope.result = $scope.data;
        if($scope.data.success == 'true'){
            $rootScope.voucher_id = $scope.data.voucher.id;
            $rootScope.voucher_price = $scope.data.value;
            $rootScope.voucher_code = $scope.data.voucher.code;
            console.log($rootScope.voucher_id+" "+$rootScope.voucher_price+" "+$rootScope.voucher_code);
            if($scope.subTotal < $scope.data.value && $scope.deliveryPrice == 0){
                $scope.totalPrice = 0;
                $scope.finalTotal = 0;
            }
            else if($scope.subTotal < $scope.data.value && $scope.deliveryPrice != 0){
                $scope.totalPrice = 0;
                var priceBarang = 0;
                for (var i = 0; i < shoppingCharts.length; i++) {
                    priceBarang += (shoppingCharts[i].price * shoppingCharts[i].qty);
                }
                $scope.finalTotal = $scope.finalTotal - priceBarang;
                console.log(priceBarang);
            }
            else{
                $scope.totalPrice = $scope.totalPrice - $scope.data.value;
                $scope.finalTotal = $scope.finalTotal - $scope.data.value;
            }
            $rootScope.totalVoucher = 1;

            var alertPopup = $ionicPopup.alert({
                title: "Check Result Promo Code",
                template: '<div style="width:100%;text-align:center">'+ $scope.data.message +'</div>',
                buttons: [{
                    text: $scope.alert_button_ok
                }]
            });
        }
        else{
            $rootScope.voucher_id = 0;
            $rootScope.voucher_price = 0;
            $rootScope.voucher_code = "";
            var alertPopup = $ionicPopup.alert({
                title: "Error Check Result Promo Code",
                template: '<div style="width:100%;text-align:center">'+ $scope.data.message +'</div>',
                buttons: [{
                    text: $scope.alert_button_ok
                }]
            });
        }
    });

    $scope.$on('httpService:postCheckVoucherOnDeleteError', function(){
        $scope.hideLoading();
        console.log("Error Check Result Promo Code");
        console.log($scope.data);
        $scope.isLoading = false;
    });

    $scope.$on('httpService:getRajaOngkirProvinceSuccess', function () {

        $scope.hideLoading();
        $scope.provinces = $scope.data.rajaongkir.results;
        //url = raja_ongkir_city + '0/' + $scope.tariff.selectedProvince;
        //httpService.get($scope, $http, url, 'rajaongkir-city', token)
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getSicepatProvinceSuccess', function() {
        $scope.hideLoading();
        $scope.provincesSicepat = $scope.data.sicepat;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, request token again
    $scope.$on('httpService:getRajaOngkirProvinceError', function() {
        url = raja_ongkir_province + '0';
        httpService.get($scope, $http, url, 'rajaongkir-province', token);
    });

    // if get data list article error, request token again
    $scope.$on('httpService:getSicepatProvinceError', function() {
        url = sicepat_province;
        httpService.get($scope, $http, url, 'sicepat-province', token);
    });

    $scope.$on('httpService:getRajaOngkirCitySuccess', function() {
        $scope.hideLoading();
        $scope.cities = $scope.data.rajaongkir.results;
        //$scope.tariff.selectedCity = $scope.data.rajaongkir.results[0].city_id;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, request token again
    $scope.$on('httpService:getRajaOngkirCityError', function() {
        url = raja_ongkir_city + '0/' + $scope.tariff.selectedProvince;
        httpService.get($scope, $http, url, 'rajaongkir-city', token);
    });

    $scope.$on('httpService:postSicepatDataByProvinceSuccess', function() {
        $scope.hideLoading();
        $scope.sicepat = $scope.data.sicepat;
        $scope.sicepat_city = $scope.data.sicepat_city;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, request token again
    $scope.$on('httpService:postSicepatDataByProvinceError', function() {
        url = sicepat_data_by_province + $scope.tariff.selectedProvinceSicepat;
        if ($scope.tariff.selectedCitySicepat != '') var obj = serializeData({
            _method: 'POST',
            city: $scope.tariff.selectedCitySicepat
        });
        else var obj = serializeData({
            _method: 'POST'
        });
        $scope.result = httpService.post($scope, $http, url, obj, 'sicepat-data-by-province');
    });

    $scope.$on('httpService:getRajaOngkirCostSuccess', function() {
        console.log($scope.data);
        $scope.hideLoading();
        if ($scope.data.rajaongkir != undefined) {
            $scope.costs = $scope.data.rajaongkir.results;

            if ($scope.data.rajaongkir.results[0].costs.length <= 0) {
                $scope.courier_available = false;
                $scope.showNoCostFoundAlert();
            } else $scope.courier_available = true;
        } else {
            $scope.courier_available = false;
            $scope.showNoCostFoundAlert();
        }
        $scope.gosend_instant_active = false;
        $scope.gosend_sameday_active = false;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, request token again
    $scope.$on('httpService:getRajaOngkirCostError', function() {
        url = raja_ongkir_cost + $scope.selectCity + '/' + $scope.selectCity + '/100/jne';
        httpService.get($scope, $http, url, 'rajaongkir-cost', token);
    });

    $scope.$on('httpService:postSicepatTariffSuccess', function() {
        console.log($scope.data);
        $scope.hideLoading();
        if ($scope.data.sicepat != undefined) {
            $scope.costsSicepat = $scope.data.sicepat;

            if ($scope.costsSicepat.length <= 0) {
                $scope.courier_available = false;
                $scope.showNoCostFoundAlert();
            } else $scope.courier_available = true;
        } else {
            $scope.courier_available = false;
            $scope.showNoCostFoundAlert();
        }
        $scope.gosend_instant_active = false;
        $scope.gosend_sameday_active = false;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // if get data list article error, request token again
    $scope.$on('httpService:postSicepatTariffError', function() {
        var origin = sicepat_origin;
        var weight = $scope.totalWeight <= 0 ? 0 : $scope.totalWeight;
        var obj = serializeData({
            _method: 'POST',
            origin: sicepat_origin,
            weight: weight,
            destination: $scope.tariff.selectedSubdistrictSicepat
        });

        url = sicepat_tariff;
        httpService.post($scope, $http, url, obj, 'sicepat-tariff');
    });

    $scope.selectCity = function(city) {
        $scope.courier_available = false;
        $scope.tariff.selectedCity = city;
        $scope.tariff.selectedCost = 'null;0';
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
    };

    $scope.selectSubdistrictSicepat = function(city) {
        $scope.courier_available = false;
        $scope.tariff.selectedSubdistrictSicepat = city;
        $scope.tariff.selectedCost = 'null;0';
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
    };

    $scope.selectService = function(service) {
        $scope.tariff.selectedService = service;
        $scope.tariff.selectedCost = 'null;0';
        $scope.costs = [];
        $scope.costsSicepat = [];
        // $scope.sicepat = [];
        // $scope.sicepat_city = [];
        // $scope.provinces = [];
        // $scope.provincesSicepat = [];
        // $scope.cities = [];
        // $scope.tariff.
        $scope.tariff.selectedProvince = [];
        $scope.tariff.selectedCity = [];
        $scope.tariff.selectedProvinceSicepat = {};
        $scope.tariff.selectedCitySicepat = [];
        $scope.tariff.selectedSubdistrictSicepat = [];

        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.deliveryMethod = '';
        $scope.finalTotal = parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
    };

    $scope.selectPaymentType = function(payment) {
        $scope.payment_type.selectedPaymentType = payment;
        console.log("*************");
        console.log("PAYMENT TYPE");
        console.log($scope.payment_type);
        console.log(payment);
        console.log("*************");
        $scope.tariff.selectedService = '';
        $scope.tariff.selectedCost = 'null;0';
        $scope.costs = [];
        $scope.costsSicepat = [];
        // $scope.sicepat = [];
        // $scope.sicepat_city = [];
        // $scope.provinces = [];
        // $scope.provincesSicepat = [];
        // $scope.cities = [];

        $scope.tariff.selectedProvince = [];
        $scope.tariff.selectedCity = [];
        $scope.tariff.selectedProvinceSicepat = {};
        $scope.tariff.selectedCitySicepat = [];
        $scope.tariff.selectedSubdistrictSicepat = [];
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;

        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        if (payment == 'loyalty') $scope.reloadMemberPoints();
        if (payment == 'cod') $scope.tariff.selectedService = 'no_service';
        $scope.calculateOtherCosts();
    };

    $scope.loadProvinceSicepat = function(province) {
        $scope.showLoading();
        $scope.tariff.selectedProvince = province;
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
        console.log(province);
        console.log('selected :' + province);
        //url = raja_ongkir_city + '0/' + province;
    };

    $scope.loadCities = function(province) {
        $scope.showLoading();
        $scope.tariff.selectedProvince = province;
        console.log(province);
        console.log('selected :' + province);
        url = raja_ongkir_city + '0/' + province;
        httpService.get($scope, $http, url, 'rajaongkir-city', token);
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
    };

    $scope.loadCitiesSicepat = function(province) {
        $scope.showLoading();
        $scope.courier_available = false;
        $scope.tariff.selectedProvinceSicepat = province;
        console.log(province);
        console.log('selected :' + province);
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
        url = sicepat_data_by_province + province;
        var obj = serializeData({
            _method: 'POST'
        });
        $scope.result = httpService.post($scope, $http, url, obj, 'sicepat-data-by-province');
    };

    $scope.loadSubdistrictSicepat = function(district) {
        $scope.showLoading();
        $scope.courier_available = false;
        $scope.deliveryCourier = 0;
        $scope.deliveryPrice = 0;
        $scope.finalTotal = parseInt($scope.deliveryCourier) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
        console.log('selected :' + district);
        url = sicepat_data_by_province + $scope.tariff.selectedProvinceSicepat;
        console.log(url);
        var obj = serializeData({
            _method: 'POST',
            city: district
        });
        console.log(obj);
        $scope.result = httpService.post($scope, $http, url, obj, 'sicepat-data-by-province');
    };

    $scope.checkCost = function(province) {
        console.log($scope.tariff);
        if ($scope.tariff.selectedCity != '' && $scope.tariff.selectedCity != null && $scope.tariff.selectedService != '' && $scope.tariff.selectedService != null) {
            $scope.showLoading();
            var weight = $scope.totalWeight <= 100 ? 100 : $scope.totalWeight;
            weight = parseInt(weight);
            currentRajaOngkirLoad = 'check_cost';
            url = raja_ongkir_cost + $scope.tariff.selectedCity + '/' + rajaongkir_sender_city_id + '/' + weight + '/' + $scope.tariff.selectedService;
            httpService.get($scope, $http, url, 'rajaongkir-cost', token);
        } else {
            $scope.showCheckCostAlert();
        }
    };

    $scope.checkCostSicepat = function(province) {
        console.log($scope.tariff);
        if ($scope.tariff.selectedSubdistrictSicepat != '' && $scope.tariff.selectedSubdistrictSicepat != null) {
            $scope.showLoading();
            var origin = sicepat_origin;
            var weight = $scope.totalWeight <= 0 ? 1 : $scope.totalWeight / 1000; //totalWeight yang ada dihitung dalam gram.
            console.log(weight);
            var obj = serializeData({
                _method: 'POST',
                origin: sicepat_origin,
                weight: weight,
                destination: $scope.tariff.selectedSubdistrictSicepat
            });

            url = sicepat_tariff;
            httpService.post($scope, $http, url, obj, 'sicepat-tariff');
        } else {
            $scope.showCheckCostAlertSicepat();
        }
    };

    $scope.calculateTotal = function(cost) {
        courier = cost.split(";")[0];
        method_value = cost.split(";")[1];
        cost_value = cost.split(";")[2];
        $scope.deliveryCourier = courier;
        $scope.deliveryPrice = cost_value;
        $scope.deliveryMethod = method_value;
        $scope.cost_value = parseInt(cost_value);
        $scope.finalTotal = parseInt(cost_value) + parseInt($scope.totalPrice);

        if($scope.tariff.selectedService == 'gosend'){
            var url = check_gosend_balance_url;
            var obj = serializeData({company_id: company_id, value_go_send: parseInt(cost_value)});
            console.log("gosend subtract");
            console.log(obj);
            $scope.result = httpService.post($scope, $http, url, obj, 'gosend-balance');
        }

        $scope.calculateOtherCosts();
        // MEMBERSHIP POINTS
        if (membership_features_enabled == 'YES') {
            $scope.calculatePurchasePoints();
        }
    };


    $scope.recalculateTotal = function() {
        $scope.finalTotal = parseInt($scope.cost_value) + parseInt($scope.totalPrice);
        $scope.calculateOtherCosts();
    };

    $scope.showLoginAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_login_alert + '</div>',
            buttons: [{
                    text: $scope.alert_button_ok
                },
                {
                    text: $scope.button_text_login,
                    type: 'cp-button',
                    onTap: function(e) {
                        $rootScope.login_redirect_location = '#/app/shopping-cart-1/-3';
                        window.location.href = "#/app/login/-1";
                    }
                }
            ]
        });
    };

    $scope.showNoCostFoundAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_no_cost_found_alert + '</div>',
            buttons: [{
                text: $scope.alert_button_ok
            }]
        });
    };

    $scope.showPickDeliveryServiceAreaAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_check_cost_alert + '</div>',
            buttons: [{
                text: $scope.alert_button_ok
            }]
        });
    };
    $scope.showPosMalaysiaNoResultAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">'+ $scope.text_pos_malaysia_no_result_alert +'</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                }
            ]
        });
    };

    $scope.showCheckCostAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_check_cost_alert + '</div>',
            buttons: [{
                text: $scope.alert_button_ok
            }]
        });
    };

    $scope.showCheckCostAlertSicepat = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_check_cost_sicepat_content + '</div>',
            buttons: [{
                text: $scope.alert_button_ok
            }]
        });
    };

    $scope.showPaymentLoyaltyAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_payment_type_alert + '</div>',
            buttons: [{
                text: "View Transaction"
            }]
        });
    };

    $scope.showPaymentTypeAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_payment_type_alert + '</div>',
            buttons: [{
                text: $scope.alert_button_ok
            }]
        });
    };

    $scope.showDeliveryAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            template: '<div style="width:100%;text-align:center">' + $scope.text_delivery_alert + '</div>',
            buttons: [{
                text: $scope.alert_button_ok
            }]
        });
    };

    $scope.showLoading = function() {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hideLoading = function() {
        $ionicLoading.hide();
    };

    // function submit comment
    $scope.submitOrder = function() {
        console.log($scope.tariff.selectedService);
        if (!$scope.isLogin) {
            $scope.showLoginAlert();
        } else {
            if($scope.tariff.selectedService == 'domestic' || $scope.tariff.selectedService == 'international'){
                console.log($scope.deliveryPrice);
                if($scope.deliveryPrice != 0){
                    if (cp_mode === 'YES' && user_meta.cp_compro_member == 'YES') {
                        $scope.showShoppingCartSubmitOrderPopup();
                    } else {
                        $scope.execSubmitOrder();
                    }
                }
                else{
                    $scope.showPickDeliveryServiceAreaAlert();
                }
            }
            else{
                if (cp_mode === 'YES' && user_meta.cp_compro_member == 'YES') {
                    $scope.showShoppingCartSubmitOrderPopup();
                } else {
                    $scope.execSubmitOrder();
                }
            }
        }
    };

    $scope.execSubmitOrder = function() {
        if ($scope.payment.selectedPaymentType != 'cod') {
            if ($scope.tariff.selectedService == 'no_service') {
                $scope.deliveryCourier = "-";
                $scope.deliveryMethod = "No Service";
                $scope.deliveryPrice = 0;
                $scope.show();
                var url = token_url;
                var obj = serializeData({
                    email: username,
                    password: password,
                    company_id: company_id
                });

                // get token for posting comment
                httpService.post_token($scope, $http, url, obj, 'submit_order');
            } else if ($scope.tariff.selectedService == 'pickup') {
                $scope.deliveryCourier = "-";
                $scope.deliveryMethod = "Pick Up";
                $scope.deliveryPrice = 0;
                $scope.show();
                var url = token_url;
                var obj = serializeData({
                    email: username,
                    password: password,
                    company_id: company_id
                });

                // get token for posting comment
                httpService.post_token($scope, $http, url, obj, 'submit_order');
            } else if (rajaongkir_enabled == 'YES' || sicepat_enabled == 'YES') {
                if ($scope.deliveryCourier == '' || $scope.deliveryMethod == '') {
                    $scope.showDeliveryAlert();
                } else {
                    $scope.show();
                    var url = token_url;
                    var obj = serializeData({
                        email: username,
                        password: password,
                        company_id: company_id
                    });

                    // get token for posting comment
                    httpService.post_token($scope, $http, url, obj, 'submit_order');
                }
            } else {
                $scope.show();
                var url = token_url;
                var obj = serializeData({
                    email: username,
                    password: password,
                    company_id: company_id
                });

                // get token for posting comment
                httpService.post_token($scope, $http, url, obj, 'submit_order');
            }
        } else if ($scope.payment.selectedPaymentType == 'cod') {
            $scope.deliveryCourier = 0;
            $scope.deliveryMethod = "Cash On Delivery (COD)";
            $scope.deliveryPrice = 0;
            $scope.show();
            var url = token_url;
            var obj = serializeData({
                email: username,
                password: password,
                company_id: company_id
            });

            // get token for posting comment
            httpService.post_token($scope, $http, url, obj, 'submit_order');
        } else if ($scope.payment.selectedPaymentType == 'loyalty') {
            $scope.showPaymentLoyaltyAlert();
        } else {
            $scope.showPaymentTypeAlert();
        }
    };

    $scope.$on('httpService:gosendBalanceSuccess',function (){
        console.log("Get Balance");
        console.log($scope.data);
        $success = $scope.data.success;
        if($success == false){
            $scope.showGosendBalanceAlert($scope.data.message);
        }
    });

    // if token for post comment success
    $scope.$on('httpService:postTokenSubmitOrderSuccess', function() {
        token = $scope.data.token;
        var ids = new Array();
        var qtys = new Array();
        var variants = new Array();
        var input = $scope.input;

        for (var i = 0; i < shoppingCharts.length; i++) {
            ids.push(shoppingCharts[i].id);
            qtys.push(shoppingCharts[i].qty);
            variants.push(shoppingCharts[i].variants);
        }

        for (var i in input.meta) {
            if (i.indexOf('_date') !== -1) {
                input.meta[i] = new Date(input.meta[i]);
            }
        }
        if ($scope.tariff.selectedService == 'jne' || $scope.tariff.selectedService == 'tiki' || $scope.tariff.selectedService == 'pos') {
            for (var i in $scope.provinces) {
                if ($scope.provinces[i].province_id == $scope.tariff.selectedProvince) {
                    $scope.input.meta._delivery_province = $scope.provinces[i].province;
                }
            }
            for (var i in $scope.cities) {
                if ($scope.cities[i].city_id == $scope.tariff.selectedCity) {
                    $scope.input.meta._delivery_city = $scope.cities[i].city_name;
                }
            }
        } else if ($scope.tariff.selectedService == 'sicepat') {
            $scope.input.meta._delivery_province = $scope.tariff.selectedProvinceSicepat;
            $scope.input.meta._delivery_city = $scope.tariff.selectedCitySicepat;
            //$scope.deliveryMeta["_delivery_subdistrict"] = $scope.sicepat[$scope.tariff.selectedSubdistrictSicepat].subdistrict;
            for (var i in $scope.sicepat) {
                if ($scope.sicepat[i].destination_code == $scope.tariff.selectedSubdistrictSicepat) {
                    $scope.input.meta._delivery_subdistrict = $scope.sicepat[i].subdistrict;
                }
            }
        } else if ($scope.tariff.selectedService == 'domestic') {
            for (var i in $scope.shipperProvinces) {
                if ($scope.shipperProvinces[i].id == $scope.shipperAddress.province) {
                    $scope.input.meta._delivery_province = $scope.shipperProvinces[i].name;
                }
            }
            for (var i in $scope.shipperCities) {
                if ($scope.shipperCities[i].id == $scope.shipperAddress.city) {
                    $scope.input.meta._delivery_city = $scope.shipperCities[i].name;
                }
            }
            for (var i in $scope.shipperSuburbs) {
                if ($scope.shipperSuburbs[i].id == $scope.shipperAddress.suburb) {
                    $scope.input.meta._delivery_subdistrict = $scope.shipperSuburbs[i].name;
                }
            }
            for (var i in $scope.shipperArea) {
                if ($scope.shipperArea[i].id == $scope.shipperAddress.area) {
                    $scope.input.meta._delivery_area = $scope.shipperArea[i].name;
                }
            }
        }
        if($rootScope.totalVoucher == 1){
            console.log("Voucher ID");
            console.log($rootScope.voucher_id);
            console.log($rootScope.voucher_price);
            console.log($rootScope.voucher_code);
            $scope.input.meta.voucher = $rootScope.voucher_id;
            $scope.input.meta.voucher_price = $rootScope.voucher_price;
            $scope.input.meta.voucher_code = $rootScope.voucher_code.toUpperCase();
        }
        console.log("MASUK META TRANSACTION");
        //console.log($scope.deliveryMeta);
        console.log($scope.input.meta);
        $rootScope.totalVoucher = 0;
        $rootScope.voucher_id = 0;
        var obj = serializeData({
            _method: 'POST',
            product_ids: ids,
            qtys: qtys,
            variants: JSON.stringify(variants),
            name: $scope.input.name,
            email: $scope.input.email,
            phone: $scope.input.phone,
            address: $scope.input.address,
            comments: $scope.input.comments,
            payment_type: $scope.payment.selectedPaymentType,
            meta: JSON.stringify($scope.input.meta),
            delivery_service: $scope.selectedService,
            delivery_courier: $scope.deliveryCourier,
            delivery_method: $scope.deliveryMethod,
            delivery_price: $scope.deliveryPrice,
            delivery_min_day: $scope.minDays,
            delivery_max_day: $scope.maxDays,
            delivery_shipper_destination_id: ($scope.selectedService == 'domestic' ? $scope.areaId : $scope.shipper_destination_intl_id),
            delivery_shipper_destination_name: ($scope.selectedService == 'domestic' ? $scope.areaName : $scope.shipper_destination_intl_name),
            delivery_shipper_rate_id: $scope.rateId,
            delivery_gosend_lat : ($scope.go_send_enabled == 'YES' ? $scope.destination_gosend_lat : 0),
            delivery_gosend_lng : ($scope.go_send_enabled == 'YES' ? $scope.destination_gosend_lng : 0)
          });

        // submit order
        console.log("******************");
        console.log(obj);
        console.log("******************");
        $scope.result = httpService.post($scope, $http, send_email_url + '?token=' + token, obj, 'submit_order');
    });

    // if post comment success, show notification
    $scope.$on('httpService:postSubmitOrderSuccess', function() {
        //        console.log($scope.result.data.payment_url);
        //        console.log($scope.result.data.unavailable_product);
        console.log($scope.result.data.cp_user_data);
        console.log(user_meta);
        $rootScope.totalVoucher = 0;
        $rootScope.voucher_id = 0;
        $rootScope.voucher_price = 0;
        $rootScope.voucher_code = "";
        trans_id = $scope.result.data.return_trans_id;
        order_id = $scope.result.data.return_order_id;
        if ($scope.result.data.success === true) {
            $scope.hide();
            $scope.showSuccessAlert(trans_id, order_id, $scope.result.data);

            shoppingCharts.splice(0, shoppingCharts.length);
            if (isPhoneGap()) {
                clearCart();
            }

            $scope.totalPrice = 0;
            $scope.totalPoints = 0;

            $scope.input = {
                name: '',
                email: '',
                phone: '',
                address: '',
                comments: ''
            };

            if ($scope.result.data.cp_user_data && typeof $scope.result.data.cp_user_data.length === 'undefined') {
                user_meta.cp_first_purchase = $scope.result.data.cp_user_data.cp_first_purchase;
                user_meta.cp_credit_status = $scope.result.data.cp_user_data.cp_credit_status;
                user_meta.cp_credit = $scope.result.data.cp_user_data.cp_credit;

                var updateMeta = [];
                updateMeta.push({
                    key: 'cp_first_purchase',
                    value: user_meta.cp_first_purchase
                });
                updateMeta.push({
                    key: 'cp_credit_status',
                    value: user_meta.cp_credit_status
                });
                updateMeta.push({
                    key: 'cp_credit',
                    value: user_meta.cp_credit
                });

                if (isPhoneGap()) {
                    updateLocalCompanyUserMeta(updateMeta);
                }
            }

            payment_url = $scope.result.data.payment_url;

        } else {
            $scope.hide();

            if ($scope.result.data.unavailable_product == undefined || $scope.result.data.limited_product == undefined) {
                $scope.showFailedAlert();
            } else if ($scope.result.data.unavailable_product.length > 0 || $scope.result.data.limited_product.length > 0) {
                $scope.unavailable_product = $scope.result.data.unavailable_product;
                $scope.limited_product = $scope.result.data.limited_product;
                $scope.showUnavailableAlert($scope.unavailable_product, $scope.limited_product);
            } else {
                $scope.showFailedAlert();
            }
        }

    });

    $scope.$on('httpService:postSubmitOrderError', function() {
        console.log("*****************");
        console.log("$scope.result.data");
        console.log($scope.result.data);
        console.log("*****************");
        $scope.hide();
        $scope.showFailedAlert();
    });

    // loading fragment
    $scope.show = function() {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function() {
        $ionicLoading.hide();
    };

    // alert fragment
    $scope.showSuccessAlert = function(trans_id, order_id, data) {
        console.log(trans_id);
        console.log(vt_payment_service);
        var paymentType = $scope.payment.selectedPaymentType;
        $scope.trans_id = trans_id;
        if ((paymentType == 'vt' && vt_payment_service == 'YES') ||
            (paymentType == 'ipay88') ||
            (paymentType == 'senangpay') ||
            (paymentType == 'espay') ||
            paymentType.indexOf('sa') > -1 ||
            paymentType.indexOf('ij') > -1) {
            var btnPriceZero = [{
                text: $scope.alert_button_view_detail,
                type: 'cp-button',
                onTap: function(e) {
                    $rootScope.transaction_count += 1;
                    if (trans_id != -1) {
                        $ionicHistory.removeBackView();
                        $ionicHistory.clearHistory();
                        window.location.href = "#/app/transaction-detail/" + trans_id;
                    } else {
                        $ionicHistory.removeBackView();
                        $ionicHistory.clearHistory();
                        window.location.href = "#/app/manual-payment";
                    }
                }

            }];
            var btnPrice = [{
                text: $scope.alert_button_pay_now,
                type: 'cp-button',
                onTap: function(e) {
                    $rootScope.transaction_count += 1;

                    // var url = token_url;
                    // var obj = serializeData({email: username, password: password, company_id: company_id});
                    // httpService.post_token($scope, $http, url, obj, 'generate-midtrans-token');

                    $scope.showLoading();


                    var obj = serializeData({
                        _method: 'POST',
                        orderID: order_id
                    });
                    switch (paymentType) {
                        case 'vt':
                            var url = url_midtrans_generate_token;
                            httpService.post($scope, $http, url, obj, 'generate-midtrans-token');
                            break;
                        case 'ipay88':
                            var url = url_ipay88_request_payment;
                            httpService.post($scope, $http, url, obj, 'ipay88-request-payment');
                            // openBrowser(payment_url);
                            break;
                        case 'senangpay':
                            console.log('senangpay');
                            var senangpay_result = data.data.senangpay_result;
                            $ionicHistory.removeBackView();
                            $ionicHistory.clearHistory();
                            window.location.href = "#/app/transaction-detail/" + trans_id;
                            openBrowser(senangpay_result.endpoint_url);
                            $scope.hideLoading();
                            break;
                        case 'espay':
                            console.log('espay');
                            $ionicHistory.removeBackView();
                            $ionicHistory.clearHistory();
                            window.location.href = "#/app/transaction-detail/" + trans_id;
                            openBrowser(espay_payment_url + order_id);
                            $scope.hideLoading();
                            break;
                    }


                    // openBrowser(payment_url);
                }

            }];
            var popupButtons = $scope.finalTotal > 0 ? btnPrice : btnPriceZero;

            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_checkout_title,
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.text_success_alert + '</div>',
                buttons: popupButtons
            });
        } else if ($scope.payment.selectedPaymentType == 'manual') {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_checkout_title,
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.text_success_alert + '</div>',
                buttons: [
                    // {
                    //     text: $scope.alert_button_pay_later,
                    //     onTap: function(e)
                    //     {
                    //         $rootScope.transaction_count += 1;
                    //         $ionicHistory.removeBackView();
                    //         $ionicHistory.clearHistory();
                    //         window.location.href= "#/app/transaction-list" ;
                    //     }
                    // },
                    {
                        text: $scope.alert_button_pay_now,
                        type: 'cp-button',
                        onTap: function(e) {
                            $rootScope.transaction_count += 1;
                            if (trans_id != -1) {
                                $ionicHistory.removeBackView();
                                $ionicHistory.clearHistory();
                                window.location.href = "#/app/transaction-detail/" + trans_id;
                            } else {
                                $ionicHistory.removeBackView();
                                $ionicHistory.clearHistory();
                                window.location.href = "#/app/manual-payment";
                            }
                        }

                    }
                ]
            });
        } else if ($scope.payment.selectedPaymentType == 'cod') {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_checkout_title,
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.text_success_alert + '</div>',
                buttons: [{
                        text: $scope.alert_button_pay_later,
                        onTap: function(e) {
                            $rootScope.transaction_count += 1;
                            $ionicHistory.removeBackView();
                            $ionicHistory.clearHistory();
                            window.location.href = "#/app/transaction-list";
                        }
                    },
                    {
                        text: $scope.alert_button_pay_now,
                        type: 'cp-button',
                        onTap: function(e) {
                            $rootScope.transaction_count += 1;
                            if (trans_id != -1) {
                                $ionicHistory.removeBackView();
                                $ionicHistory.clearHistory();
                                window.location.href = "#/app/transaction-detail/" + trans_id;
                            } else {
                                $ionicHistory.removeBackView();
                                $ionicHistory.clearHistory();
                                window.location.href = "#/app/cod-payment";
                            }
                        }

                    }
                ]
            });
        } else {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_checkout_title,
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.text_success_alert + '</div>',
                buttons: [
                    // {
                    //     text: $scope.alert_button_pay_later,
                    //     onTap: function(e)
                    //     {
                    //         $rootScope.transaction_count += 1;
                    //         window.location.href= "#/app/transaction-list" ;
                    //     }
                    // },
                    {
                        text: $scope.alert_button_pay_now,
                        type: 'cp-button',
                        onTap: function(e) {
                            $rootScope.transaction_count += 1;
                            if (trans_id != -1) {
                                $ionicHistory.removeBackView();
                                $ionicHistory.clearHistory();
                                window.location.href = "#/app/transaction-detail/" + trans_id;
                            } else {
                                $ionicHistory.removeBackView();
                                $ionicHistory.clearHistory();
                                window.location.href = "#/app/manual-payment";
                            }
                        }

                    }
                ]
            });
        }
    };

    $scope.$on('httpService:postTokenGenerateMidtransTokenSuccess', function() {
        var trans_id = $scope.trans_id;
        var token = $scope.data.token;
        console.log("Successfully called SNAP.");
        var url = url_midtrans_generate_token + '?token=' + token;
        var obj = serializeData({
            orderID: trans_id
        });
        console.log(obj);
        httpService.post($scope, $http, url, obj, 'generate-midtrans-token');
        snap.show();
    });

    $scope.$on('httpService:postTokenGenerateMidtransTokenError', function() {
        $scope.showFailedAlert();
        snap.hide();
    });

    var showPopupPGTransactionResult = function(title, text) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            css: 'cp-button',
            okType: 'cp-button',
            okText: $scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + text + '</div>',
            buttons: [{
                text: $scope.alert_button_ok,
                type: 'cp-button',
                onTap: function(e) {
                    if ($scope.trans_id != -1) {
                        $ionicHistory.removeBackView();
                        $ionicHistory.clearHistory();
                        window.location.href = "#/app/transaction-detail/" + $scope.trans_id;
                    }
                }
            }]
        });
    };

    $scope.$on('httpService:postGenerateMidtransTokenSuccess', function() {
        var token = $scope.data.token;
        snap.hide();

        if ($scope.data.status == 'valid') {
            snap.pay(token, {
                onSuccess: function(result) {
                    console.log('success');
                    console.log(result);
                    showPopupPGTransactionResult($scope.text_payment_success_title, $scope.text_payment_success_content);
                },
                onPending: function(result) {
                    console.log('pending');
                    console.log(result);
                    showPopupPGTransactionResult($scope.text_payment_pending_title, $scope.text_payment_pending_content);
                },
                onError: function(result) {
                    console.log('error');
                    console.log(result);
                    showPopupPGTransactionResult($scope.text_payment_error_title, $scope.text_payment_error_content);
                },
                onClose: function() {
                    console.log('customer closed the popup without finishing the payment');
                    showPopupPGTransactionResult($scope.text_payment_close_title, $scope.text_payment_close_content);
                },
                gopayMode: "deeplink"
            });
        } else if ($scope.data.status == 'invalid') {
            showPopupPGTransactionResult($scope.text_payment_error_title, $scope.text_payment_error_content + "<br><br>" + $scope.data.message);
        }

        $scope.hideLoading();

    });

    $scope.$on('httpService:postGenerateMidtransTokenError', function() {
        $scope.hideLoading();
        $scope.showFailedAlert();

        snap.hide();
    });

    $scope.showFailedAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            css: 'cp-button',
            okType: 'cp-button',
            okText: $scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.text_failed_alert + '</div>'
        });
    };

    $scope.$on('httpService:postIPay88RequestPaymentSuccess', function() {
        var data = {
            amount: parseInt(parseFloat($scope.data.Amount * 100)),
            name: $scope.data.UserName,
            email: $scope.data.UserEmail,
            phone: $scope.data.UserContact,
            refNo: $scope.data.RefNo,
            currency: $scope.data.Currency,
            lang: $scope.data.Lang,
            country: "MY",
            description: $scope.data.ProdDesc,
            remark: $scope.data.Remark,
            paymentId: $scope.data.PaymentId,
            merchantKey: $scope.data.MerchantKey,
            merchantCode: $scope.data.MerchantCode,
            backendPostUrl: $scope.data.BackendURL
        };

        if (isPhoneGap()) {
            cloudSky.iPay88.makePayment(data,
                function(resp) {
                    console.log(resp);
                    $scope.hideLoading();
                    showPopupPGTransactionResult($scope.text_payment_success_title, $scope.text_payment_success_content);
                },
                function(err) {
                    console.log(err);
                    $scope.hideLoading();
                    if (err.err == 'canceled') {
                        showPopupPGTransactionResult($scope.text_payment_close_title, $scope.text_payment_close_content);
                    } else {
                        showPopupPGTransactionResult($scope.text_payment_error_title, $scope.text_payment_error_content);
                    }
                }
            );
        } else {
            $scope.hideLoading();

            function showErrorDeviceOnly() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Not Supported',
                    css: 'cp-button',
                    okType: 'cp-button',
                    okText: $scope.alert_button_ok,
                    template: '<div style="width:100%;text-align:center">' + "Please view this feature from the device. You can request an installer for Android to view this feature." + '</div>',
                    buttons: [{
                        text: $scope.alert_button_ok,
                        type: 'cp-button',
                        onTap: function(e) {
                            $ionicHistory.removeBackView();
                            $ionicHistory.clearHistory();
                            window.location.href = "#/app/transaction-detail/" + $scope.trans_id;
                        }
                    }]
                });
            }

            showErrorDeviceOnly();
        }
    });

    $scope.$on('httpService:postIPay88RequestPaymentError', function() {
        var html = $scope.data;
        $scope.showFailedAlert();
    });

    //COMPRO TODO: custom feedback massage untuk barang yang gak available

    $scope.showUnavailableAlert = function(unavailable_product, limited_product) {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            css: 'cp-button',
            okType: 'cp-button',
            okText: $scope.alert_button_ok,
            templateUrl: 'templates/unavailable-shopping-cart.html',
            scope: $scope,
            buttons: [{
                text: $scope.alert_unavailable_product_button_remove,
                type: 'cp-button',
                onTap: function(e) {
                    for (var i = 0; i < unavailable_product.length; i++) {
                        for (var j = 0; j < shoppingCharts.length; j++) {
                            if (unavailable_product[i]['id'] == shoppingCharts[j].id) {
                                if (isPhoneGap()) clearCartById(shoppingCharts[j].id);
                                shoppingCharts.splice(j, 1);
                                continue;
                            }
                        }
                    }
                    for (var i = 0; i < limited_product.length; i++) {
                        for (var j = 0; j < shoppingCharts.length; j++) {
                            if (limited_product[i]['id'] == shoppingCharts[j].id) {
                                if (isPhoneGap()) clearCartById(shoppingCharts[j].id);
                                shoppingCharts.splice(j, 1);
                                continue;
                            }
                        }
                    }
                    $scope.totalPrice = 0;
                    $scope.totalQty = 0;
                    for (var i = 0; i < shoppingCharts.length; i++) {
                        $scope.totalPrice += (shoppingCharts[i].price * shoppingCharts[i].qty);
                        $scope.totalQty += shoppingCharts[i].qty;
                    }
                    $rootScope.totalQty = $scope.totalQty;
                    $scope.subTotal = $scope.totalPrice;
                    $scope.recalculateTotal();
                    $scope.calculateWeight();

                    if (shoppingCharts.length === 0) {
                        $scope.showAlertNoItemInCart();
                    }
                }

            }]
        });
    };

    if (shipper_selected_services != '')
        $scope.shipper_selected_services = JSON.parse(shipper_selected_services);
    else
        $scope.shipper_selected_services = JSON.parse('{"jne":true,"tiki":true,"pos":true,"wahana":true,"grab":true,"rpx":true,"rex":true,"sicepat":true,"ninja":true,"jnt":true,"popbox":true,"lion_parcel":true,"acommerce":true}');

    $scope.checkAvailable = function(name, isCustomRate) {
        if (isCustomRate)
            return true;

        var str = name;
        var res = str.toLowerCase().replace(' ', '_');
        if (res == "j&t") {
            res = "jnt";
        }

        for (var key in $scope.shipper_selected_services) {
            if (res.indexOf(key) > -1) {
                return $scope.shipper_selected_services[key];
            }
        }

        return false;
    };

    var resetShipperDeliveryUI = function() {
        // INTERNATIONAL
        $scope.selectedDestinationIntl = '-';
        $scope.selectedShipperCountry = '';
        $scope.shipper.interCost = '';
        $scope.minDays = '-';
        $scope.maxDays = '-';

        // DOMESTIC
        $scope.selectedDestination = '-';
        $scope.deliveryPrice = 0;
        $scope.shipper.cost = '';
        $scope.selectedShipperSearch = '';

        $scope.finalTotal = $scope.totalPrice;
    };

    var resetPosMalaysiaDeliveryUI = function() {
        $scope.pos_malaysia_valid = true;
        $scope.deliveryPrice = 0;
        $scope.posmalaysia.selectedZone = '';
        $scope.finalTotal = $scope.totalPrice;
    }

    $scope.loadShipperProvinces = function(service){
        $scope.tariff.selectedService = service;
        $scope.selectedService = service;
        $scope.shipperAddress = {};

        $scope.shipperAddress.province = '';
        $scope.shipperAddress.city = '';
        $scope.shipperAddress.suburb = '';
        $scope.shipperAddress.area = '';

        resetShipperDeliveryUI();
        resetPosMalaysiaDeliveryUI();

        if (service == 'international' && shipper_intl_enabled == 'YES') {
            $scope.showLoading();
            url = url_shipper_countries;
            httpService.get($scope, $http, url, 'shipper-country', token);
        } else if (service == 'domestic') {
            $scope.showLoading();
            var url = url_shipper_provinces;
            httpService.get($scope, $http, url, 'shipper-provinces');
        } else if (service == 'no_service') {
            // $scope.finalTotal = parseInt($scope.selectedShipperInterCost) + parseInt($scope.totalPrice);
            $scope.finalTotal = parseInt($scope.totalPrice);
        }
        else if (service == 'pos_malaysia') {
            $scope.showLoading();
            $scope.pos_malaysia_valid = false;
            var url = pos_malaysia_zone;
            httpService.get($scope, $http, url, 'pos-malaysia-type-of-zone', token);   
        }
    };

    $scope.loadCostPosMalaysia = function() {
        var weight = $scope.totalWeight <= 0 ? 1 : $scope.totalWeight / 1000; //totalWeight yang ada dihitung dalam gram.
        console.log("Total weight Pos malaysia: " + weight);
        $scope.showLoading();
        var url = pos_malaysia_domestic + weight + '/' + $scope.posmalaysia.selectedZone;
        httpService.get($scope, $http, url, 'pos-malaysia-domestic', token);
    }

    $scope.$on('httpService:getPosMalaysiaDomesticSuccess', function() {
        $scope.hideLoading();
        if($scope.data.result!=undefined) {
            var data = JSON.parse($scope.data.result);
            $scope.deliveryMethod = 'Pos Malaysia';
            $scope.deliveryCourier = 'Pos Malaysia';
            if(data[0]!=undefined) {
                $scope.deliveryPrice = data[0].totalAmount;
                $scope.finalTotal = parseFloat($scope.deliveryPrice) + parseFloat($scope.totalPrice);
                console.log(JSON.parse($scope.data.result));
                $scope.pos_malaysia_valid = true;
            }
            else {
                resetPosMalaysiaDeliveryUI();
                $scope.pos_malaysia_valid = false;
                $scope.showPosMalaysiaNoResultAlert();
            }
        }
    });

    $scope.$on('httpService:getPosMalaysiaTypeOfZoneSuccess', function() {
        $scope.hideLoading();
        if($scope.data.result!=undefined) {
            $scope.posmalaysiaZones = JSON.parse($scope.data.result);
            console.log($scope.posmalaysiaZones);
        }
        else {
            $scope.posmalaysiaZones = [];   
        }
    });

    $scope.$on('httpService:getPosMalaysiaTypeOfZoneError', function() {
        var url = pos_malaysia_zone;
        httpService.get($scope, $http, url, 'pos-malaysia-type-of-zone', token);   
    });

    $scope.$on('httpService:postTokenShipperProvinceSuccess',function(){
        var url = url_shipper_provinces;
        $scope.shipperAddress = {};
        httpService.get($scope, $http, url, 'shipper-provinces', token);
    });

    $scope.$on('httpService:postTokenShipperProvinceError', function() {
        $scope.hideLoading();
        var url = token_url;
        var obj = serializeData({
            email: username,
            password: password,
            company_id: company_id
        });
        httpService.post_token($scope, $http, url, obj, 'shipper-provinces');
    });


    $scope.loadShipperCities = function(provinceId) {
        $scope.shipperAddress.city = '';
        $scope.shipperAddress.suburb = '';
        $scope.shipperAddress.area = '';
        $scope.provinceId = provinceId;
        resetShipperDeliveryUI();
        resetPosMalaysiaDeliveryUI();

        $scope.showLoading();

        var url = url_shipper_city + provinceId;
        httpService.get($scope, $http, url, 'shipper-city');
    };

    $scope.loadShipperSuburbs = function(cityId) {
        $scope.shipperAddress.suburb = '';
        $scope.shipperAddress.area = '';
        $scope.cityId = cityId;
        resetShipperDeliveryUI();
        resetPosMalaysiaDeliveryUI();

        $scope.showLoading();
        var url = url_shipper_suburbs + cityId;
        httpService.get($scope, $http, url, 'shipper-suburbs');
    };

    $scope.loadShipperArea = function(suburbId) {
        $scope.shipperAddress.area = '';
        $scope.suburbId = suburbId;
        resetShipperDeliveryUI();
        resetPosMalaysiaDeliveryUI();

        $scope.showLoading();
        var url = url_shipper_area + suburbId;
        httpService.get($scope, $http, url, 'shipper-area');
    };

    $scope.$on('httpService:getShipperProvincesSuccess', function() {
        $scope.hideLoading();
        $scope.shipperProvinces = $scope.data.shipper.data.rows;

        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    var confirmPopupLoadingFailed = function(funcOK) {
        var confirmPopup = $ionicPopup.confirm({
            title: $scope.alert_loading_failed_title,
            css: 'cp-button',
            template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_loading_failed_content + "</div>",
            okType: 'cp-button',
            okText: $scope.alert_button_ok,
            cancelText: $scope.alert_button_cancel
        });
        confirmPopup.then(function(res) {
            if (res) {
                funcOK();
            }
        });
    };

    $scope.$on('httpService:getShipperProvincesError', function() {
        $scope.hideLoading();
        $scope.isLoading = false;

        var reloadFunc = function() {
            var url = url_shipper_provinces;
            httpService.get($scope, $http, url, 'shipper-provinces');
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.$on('httpService:getShipperCitySuccess', function() {
        $scope.hideLoading();
        $scope.shipperCities = $scope.data.shipper.data.rows;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getShipperCityError', function() {
        $scope.hideLoading();
        $scope.isLoading = false;

        var reloadFunc = function() {
            var url = url_shipper_city + $scope.cityId;
            httpService.get($scope, $http, url, 'shipper-city');
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.$on('httpService:getShipperSuburbsSuccess', function() {
        $scope.hideLoading();
        $scope.shipperSuburbs = $scope.data.shipper.data.rows;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getShipperSuburbsError', function() {
        $scope.hideLoading();
        $scope.isLoading = false;

        var reloadFunc = function() {
            var url = url_shipper_suburbs + $scope.suburbId;
            httpService.get($scope, $http, url, 'shipper-suburbs');
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.$on('httpService:getShipperAreaSuccess', function() {
        $scope.hideLoading();
        $scope.shipperArea = $scope.data.shipper.data.rows;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getShipperAreaError', function() {
        $scope.hideLoading();
        $scope.isLoading = false;

        var reloadFunc = function() {
            var url = url_shipper_area;
            httpService.get($scope, $http, url, 'shipper-area');
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.$on('httpService:getShipperDetailsSuccess', function() {
        $scope.hideLoading();
        $scope.shipper = $scope.data.shipper.data.rows;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getShipperDetailsError', function() {
        // url = url_shipper_details;
        $scope.hideLoading();
        // httpService.get($scope, $http, url, 'shipper-details', token);
        var reloadFunc = function() {
            var token = $scope.data.token;
            var url = url_shipper_details + $scope.query;
            httpService.get($scope, $http, url, 'shipper-details', token);
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.$on('httpService:postTokenShipperSuccess', function() {
        token = $scope.data.token;
        url = url_shipper_details + $scope.query;
        httpService.get($scope, $http, url, 'shipper-details', token);
    });

    $scope.reloadMemberPoints = function() {
        if (membership_features_enabled === 'YES' && $scope.isLoggedIn) {
            $scope.isLoadingPoints = true;
            $scope.isPointsTryAgain = false;

            var url = token_url;
            var obj = serializeData({
                email: username,
                password: password,
                company_id: company_id
            });
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'membership-reload-points');
        }
    };

    $scope.$on('httpService:postTokenReloadMemberPointsError', function() {
        // show try again.
        $scope.isLoadingPoints = false;
        $scope.isPointsTryAgain = true;
    });

    $scope.$on('httpService:postTokenReloadMemberPointsSuccess', function() {
        var token = $scope.data.token;
        var obj = serializeData({
            _method: 'POST',
            user_id: user_id
        });

        httpService.post($scope, $http, url_membership_reload_points + company_id + '?token=' + token, obj, 'membership-reload-points');
    });

    $scope.$on('httpService:postReloadMemberPointsSuccess', function() {
        $scope.isLoadingPoints = false;
        var pts = $scope.data.points;
        if ($scope.data.success) {
            user_meta['approved_points'] = pts.approved_points;
            user_meta['lifetime_points'] = pts.lifetime_points;
            if ($scope.loyalty_integration_active == 'YES') {
                user_meta['loyalty_balance'] = pts.loyalty_balance;
                user_meta['loyalty_reward'] = pts.loyalty_reward;
                user_meta['loyalty_connect'] = pts.loyalty_connect;
            }
            $scope.user_meta = user_meta;
        } else if (!$scope.data.success) {
            $scope.isPointsTryAgain = true;
        }
    });

    $scope.$on('httpService:postReloadMemberPointsError', function() {
        $scope.isLoadingPoints = false;
        $scope.isPointsTryAgain = true;
    });

    var lastQueryLength = 0;
    $scope.getShipperDetails = function(query) {
        $scope.query = query;
        $scope.shipper.cost = '';
        if (token == '' || token == undefined || token == false) {
            var url = token_url;
            var obj = serializeData({
                email: username,
                password: password,
                company_id: company_id
            });
            httpService.post_token($scope, $http, url, obj, 'shipper-details');
        } else {
            if (query.length >= 3) {
                $timeout(function() {
                    if (lastQueryLength == query.length) {
                        $scope.hideLoading();
                        if ($scope.shipper != null) {
                            $scope.showLoading();
                            url = url_shipper_details + $scope.query;
                            var res = httpService.get($scope, $http, url, 'shipper-details', token);
                            return res;
                        }
                    }
                }, 500);
                lastQueryLength = query.length;
            } else {
                $scope.showLoading();
                $scope.shipper = [''];
                $scope.hideLoading();
            }
        }
    };

    $scope.$on('httpService:getShipperCostSuccess', function() {
        $scope.hideLoading();
        $scope.shipperCostReg = $scope.data.shipper.data.rates.logistic.regular;
        $scope.shipperCostExp = $scope.data.shipper.data.rates.logistic.express;
        $scope.shipperCost = $scope.shipperCostReg.concat($scope.shipperCostExp);
        $scope.shipperCostDesti = $scope.data.shipper.data.destinationArea;
        $scope.gosend_instant_active = false;
        $scope.gosend_sameday_active = false;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
    });

    // $scope.$on('httpService:getGoSendCostSuccess', function () {
    //     //$rootScope.hideLoading();
    //     console.log("Berhasil");
    //     if($scope.data.content.Instant.active == true){
    //         $scope.gosend_instant_price = $scope.data.content.Instant.price.total_price;
    //         $scope.gosend_sameday_price = $scope.data.content.SameDay.price.total_price;
    //         $scope.gosend_instant_description = $scope.data.content.Instant.shipment_method_description;
    //         $scope.gosend_sameday_description = $scope.data.content.SameDay.shipment_method_description;
    //         console.log($scope.gosend_instant_price);
    //         console.log($scope.gosend_sameday_price);
    //     }
    //     else{
    //         $scope.showGosendErrorAlert($scope.data.content);
    //     }
    //     $scope.isLoading = false;
    //     $scope.$broadcast('scroll.refreshComplete');
    // });

    // $scope.$on('httpService:getGoSendCostError', function () {
    //     $scope.hideLoading();
    //     console.log("Error");
    //     $scope.gosend_instant_price = $scope.data.content.Instant.price.total_price;
    //     $scope.gosend_sameday_price = $scope.data.content.SameDay.price.total_price;
    //     $scope.gosend_instant_description = $scope.data.content.Instant.shipment_method_description;
    //     $scope.gosend_sameday_description = $scope.data.content.SameDay.shipment_method_description;
    //     console.log($scope.gosend_instant_price);
    //     console.log($scope.gosend_sameday_price);
    //     $scope.isLoading = false;
    //     $scope.$broadcast('scroll.refreshComplete');
    // });

    $scope.showGosendErrorAlert = function (data) {
        var alertPopup = $ionicPopup.alert({
            title: "GO-SEND Warning",
            template: '<div style="width:100%;text-align:center">'+data.Instant.errors.shipment_method_description+' and '+data.SameDay.errors.shipment_method_description+'</div><br>'+
                        '<div style="width:100%;text-align:center"><b>Silahkan mengganti destinasi perjalanan</b></div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                }
            ]
        });
    };

    $scope.showGosendBalanceAlert = function (data) {
        var alertPopup = $ionicPopup.alert({
            title: "GO-SEND Warning",
            template: '<div style="width:100%;text-align:center">GO-SEND method is not available right now. Please try another courier</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        var obj = serializeData({company_id: company_id});
                        var url = email_gosend_balance_url;
                        httpService.post($scope, $http, url, obj, 'gosend-balance-alert');
                        if (($ionicHistory.backView() === null || $ionicHistory.backView() === undefined) && $ionicHistory.currentStateName() !== ("app." + home_template)){
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicHistory.clearHistory();
                            $state.go('app.' + home_template, {id: home_id});
                            $ionicHistory.clearHistory();
                        }
                        else {
                            $ionicHistory.goBack();
                        }
                    }
                }
            ]
        });
    };

    $scope.$on('httpService:getShipperCostError', function () {
        // url = url_shipper_cost;
        $scope.hideLoading();

        var reloadFunc = function() {
            // var token = $scope.data.token;
            var url = $scope.urlGetShipperCost;
            httpService.get($scope, $http, url, 'shipper-cost', token);
        };
        confirmPopupLoadingFailed(reloadFunc);
        //httpService.get($scope, $http, url, 'shipper-cost', token);
    });

    

    $scope.getCostShipper = function (selectedShipperSearch){
        $scope.areaId = selectedShipperSearch;
        var areaName = '';
        for (var a = 0; a < $scope.shipperArea.length; a++) {
            var areaID = $scope.shipperArea[a].id;
            if ($scope.areaId == areaID) {
                areaName = $scope.shipperArea[a].name;
            }
        }
        $scope.areaName = areaName;

        $scope.shipper.cost = '';
        $scope.showLoading();
        var origin = shipper_origin.split("|");
        var weight = $scope.totalWeight; //$scope.totalWeight <= 1000 ? 1000 : $scope.totalWeight;
        weight = weight / 1000;

        var res = selectedShipperSearch;

        // var url = url_shipper_cost + origin[1] + '/'+ res + '/' + weight + '/' + $scope.dimensionMax +'/' + $scope.dimensionSecond + '/' + $scope.dimensionMinSum + '/' + $scope.totalPriceBeforeTax + '/2/0';
        // $scope.urlGetShipperCost = url;
        // console.log(url);
        // var cost = httpService.get($scope, $http, url, 'shipper-cost', token);
        // return cost;

        var obj = serializeData({
            cid: company_id,
            origin_area_id: origin[1],
            destination_area_id: $scope.areaId,
            origin_suburb_id: origin[2],
            destination_suburb_id: $scope.suburbId,
            wt: weight,
            l: $scope.dimensionMax,
            w: $scope.dimensionSecond,
            h: $scope.dimensionMinSum,
            v: $scope.totalPriceBeforeTax,
            type: 2,
            cod: 0
        });

        $scope.getCostObj = obj;
        console.log("*********** DELIVERY RATES **************");
        console.log(obj);
        console.log("*****************************************");

        var url = url_delivery_available_rates + "?" + obj;
        $scope.urlGetDeliveryAvailableRates = url;
        httpService.get($scope, $http, url, 'cst-delivery-rates', $scope.data.token);

    };    

    $scope.getCostShipperDetail = function(selectedShipperCost) {
        $scope.showLoading();
        $scope.selectedDestination = $scope.shipperCostDesti;
        $scope.rateId = $scope.shipperCost[selectedShipperCost].rate_id;
        $scope.deliveryMethod = $scope.shipperCost[selectedShipperCost].name;
        $scope.deliveryCourier = $scope.shipperCost[selectedShipperCost].rate_name;
        $scope.deliveryPrice = $scope.shipperCost[selectedShipperCost].finalRate;
        $scope.minDays = $scope.shipperCost[selectedShipperCost].min_day;
        $scope.maxDays = $scope.shipperCost[selectedShipperCost].max_day;
        var shipperCost = parseInt($scope.shipperCost[selectedShipperCost].finalRate);
        $scope.finalTotal = parseInt(shipperCost) + parseInt($scope.totalPrice);
        $scope.hideLoading();
    };

    $scope.$on('httpService:getAvailableDeliveryRatesSuccess', function() {
        $scope.gosend_instant_active = false;
        $scope.gosend_sameday_active = false;
        $scope.hideLoading();
        $scope.customRates = $scope.custom_delivery_enabled == 'YES' ? $scope.data.custom_rates.custom_rates : [];
        $scope.shipperCostReg = $scope.shipper_enabled == 'YES' ? $scope.data.shipper.shipper.data.rates.logistic.regular : [];
        $scope.shipperCostExp = $scope.shipper_enabled == 'YES' ? $scope.data.shipper.shipper.data.rates.logistic.express : [];
        $scope.shipperCost = $scope.customRates.concat($scope.shipperCostReg).concat($scope.shipperCostExp);
        $scope.shipperCostDesti = $scope.data.shipper.shipper.data.destinationArea;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');

        console.log($scope.shipperCost.length);
        if ($scope.shipperCost.length == 0) {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_no_expedition_title,
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_no_expedition_content_area + '</div>'
            });
        }
    });

    $scope.$on('httpService:getAvailableDeliveryRatesError', function() {
        // url = url_shipper_cost;
        $scope.hideLoading();

        var reloadFunc = function() {
            var url = $scope.urlGetDeliveryAvailableRates;
            httpService.get($scope, $http, url, 'cst-delivery-rates', token);
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.$on('httpService:getShipperCountriesSuccess', function() {
        $scope.hideLoading();
        $scope.shipperCountry = $scope.data.shipper.data.rows;
        $scope.isLoading = false;
        $scope.$broadcast('scroll.refreshComplete');

    });

    $scope.$on('httpService:getShipperCountriesError', function() {
        url = url_shipper_countries;
        $scope.hideLoading();

        var reloadFunc = function() {
            var url = url_shipper_area;
            httpService.get($scope, $http, url, 'shipper-country');
        };
        confirmPopupLoadingFailed(reloadFunc);
        //httpService.get($scope, $http, url, 'shipper-country', token);
    });

    $scope.$on('httpService:postTokenShipperCountriesSuccess', function() {
        token = $scope.data.token;
        url = url_shipper_countries;
        httpService.get($scope, $http, url, 'shipper-country', token);
    });

    // $scope.getShipperCountries = function(selectedShipperCountry)
    // {
    //     $scope.selectedShipperCountry = selectedShipperCountry;
    //
    //     if(token == '' || token == undefined || token == false){
    //         var url = token_url;
    //         var obj = serializeData({email: username, password: password, company_id: company_id});
    //         httpService.post_token($scope, $http, url, obj, 'shipper-country');
    //     }else{
    //         $scope.showLoading();
    //         url = url_shipper_countries;
    //         httpService.get($scope, $http, url, 'shipper-country', token);
    //         $scope.hideLoading();
    //     }
    //
    //     resetShipperDeliveryUI();
    // };

    $scope.$on('httpService:getShipperIntlCostSuccess', function() {
        $scope.hideLoading();
        $scope.shipper.interCost = '';
        $scope.shipperCostIntl = [];
        $scope.shipperCostIntl = $scope.data.shipper.data.rates.logistic.international;

        if ($scope.shipperCostIntl.length == 0) {
            console.log("No Expedition Found");
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_no_expedition_title,
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_no_expedition_content + '</div>'
            });
        }
        $scope.shipperCostDestiIntl = $scope.data.shipper.data.destinationCountry;
        $scope.isLoading = false;
        // $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.$on('httpService:getShipperIntlCostError', function() {
        // url = url_shipper_intl_cost;
        $scope.hideLoading();
        //httpService.get($scope, $http, url, 'shipper-intl-cost', token);
        var reloadFunc = function() {
            var token = $scope.data.token;
            var url = $scope.urlGetShipperIntlCost;
            httpService.get($scope, $http, url, 'shipper-intl-cost', token);
        };
        confirmPopupLoadingFailed(reloadFunc);
    });

    $scope.getIntlCostShipper = function(selectedShipperCountry) {
        $scope.showLoading();

        $scope.shipper_destination_intl_id = $scope.shipperCountry[selectedShipperCountry].country_id;
        $scope.shipper_destination_intl_name = $scope.shipperCountry[selectedShipperCountry].country_name;

        $scope.shipper.interCost = '';
        var weight = $scope.totalWeight; // $scope.totalWeight <= 1000 ? 1000 : $scope.totalWeight;
        weight = weight / 1000;
        var origin = shipper_origin.split("|");
        var area_id = origin[1];
        var url = url_shipper_intl_cost + area_id + '/' + $scope.shipper_destination_intl_id + '/' + weight + '/' + $scope.dimensionMax + '/' + $scope.dimensionSecond + '/' + $scope.dimensionMinSum + '/' + $scope.totalPriceBeforeTax + '/2';
        $scope.urlGetShipperIntlCost = url;
        console.log(url);
        httpService.get($scope, $http, url, 'shipper-intl-cost', token);

        resetShipperDeliveryUI();
        resetPosMalaysiaDeliveryUI();
    };

    $scope.getCostShipperIntlDetail = function(selectedShipperInterCost) {
        $scope.showLoading();
        $scope.selectedDestinationIntl = $scope.shipper_destination_intl_name;
        $scope.deliveryMethod = $scope.shipperCostIntl[selectedShipperInterCost].name;
        $scope.deliveryCourier = $scope.shipperCostIntl[selectedShipperInterCost].rate_name;
        $scope.deliveryPrice = Math.ceil($scope.shipperCostIntl[selectedShipperInterCost].finalRate);
        $scope.selectedShipperInterCost = parseInt(Math.ceil($scope.shipperCostIntl[selectedShipperInterCost].finalRate));
        $scope.minDays = $scope.shipperCostIntl[selectedShipperInterCost].min_day;
        $scope.maxDays = $scope.shipperCostIntl[selectedShipperInterCost].max_day;
        $scope.rateId = $scope.shipperCostIntl[selectedShipperInterCost].rate_id;

        // console.log("1234567890123456789012345678901234567890");
        // console.log(selectedShipperInterCost);
        // console.log($scope.selectedDestinationIntl);
        // console.log($scope.deliveryMethod);
        // console.log($scope.deliveryCourier);
        // console.log($scope.selectedShipperInterCost);
        // console.log("1234567890123456789012345678901234567890");

        $scope.finalTotal = parseInt($scope.selectedShipperInterCost) + parseInt($scope.totalPrice);
        $scope.hideLoading();
    };

    $scope.showFailedAlert = function() {
        $ionicPopup.alert({
            title: $scope.alert_loading_failed_title,
            css: 'cp-button',
            okType: 'cp-button',
            okText: $scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_loading_failed_content + '</div>'
        });
    };

    function openBrowser(url) {
        if (!isPhoneGap()) {
            window.open(url, '_blank', 'location=yes');
        } else {
            screen.unlockOrientation();
            cordova.ThemeableBrowser.open(url, '_blank', {
                statusbar: {
                    color: '#ffffffff'
                },
                toolbar: {
                    height: 44,
                    color: '#ffffffff'
                },
                title: {
                    color: '#212121ff',
                    showPageTitle: true
                },
                backButton: {
                    wwwImage: 'images/drawable-xhdpi/back.png',
                    wwwImagePressed: 'images/drawable-xhdpi/back_pressed.png',
                    wwwImageDensity: 2,
                    align: 'left',
                    event: 'backPressed'
                },
                forwardButton: {
                    wwwImage: 'images/drawable-xhdpi/forward.png',
                    wwwImagePressed: 'images/drawable-xhdpi/forward_pressed.png',
                    wwwImageDensity: 2,
                    align: 'left',
                    event: 'forwardPressed'
                },
                closeButton: {
                    wwwImage: 'images/drawable-xhdpi/close.png',
                    wwwImagePressed: 'images/drawable-xhdpi/close_pressed.png',
                    wwwImageDensity: 2,
                    align: 'right',
                    event: 'closePressed'
                },
                backButtonCanClose: true
            }).addEventListener('closePressed', function(e) {
                if (screen != null)
                    screen.lockOrientation('portrait-primary');
            });
        }
    }

    $scope.$on('httpService:getGoSendCostSuccess', function () {
        //$rootScope.hideLoading();
        console.log("Berhasil");
        if($scope.data.content.Instant.active == false && $scope.data.content.SameDay.active == false){
            $rootScope.gosend_instant_price = 0;
            $rootScope.gosend_sameday_price = 0;
            $scope.gosend_instant_active = false;
            $scope.gosend_sameday_active = false;
            $scope.showGosendErrorAlert($scope.data.content);
        }
        else if($scope.data.content.Instant.active == true && $scope.data.content.SameDay.active == true){
            $rootScope.gosend_instant_price = $scope.data.content.Instant.price.total_price;
            $rootScope.gosend_sameday_price = $scope.data.content.SameDay.price.total_price;
            $rootScope.gosend_instant_description = $scope.data.content.Instant.shipment_method_description;
            $rootScope.gosend_sameday_description = $scope.data.content.SameDay.shipment_method_description;
            $scope.gosend_instant_active = true;
            $scope.gosend_sameday_active = true;
            console.log($rootScope.gosend_instant_price);
            console.log($rootScope.gosend_sameday_price);
        }
        else if($scope.data.content.Instant.active == true && $scope.data.content.SameDay.active == false){
            $rootScope.gosend_instant_price = $scope.data.content.Instant.price.total_price;
            $rootScope.gosend_instant_description = $scope.data.content.Instant.shipment_method_description;
            $rootScope.gosend_sameday_price = 0;
            $rootScope.gosend_sameday_description = "";
            $scope.gosend_instant_active = true;
            $scope.gosend_sameday_active = false;
            console.log("Only GO-SEND Instant can be used");
            console.log($rootScope.gosend_instant_price);
        }
        else if($scope.data.content.Instant.active == false && $scope.data.content.SameDay.active == true){
            $rootScope.gosend_sameday_price = $scope.data.content.SameDay.price.total_price;
            $rootScope.gosend_sameday_description = $scope.data.content.SameDay.shipment_method_description;
            $rootScope.gosend_instant_price = 0;
            $rootScope.gosend_instant_description = "";
            $scope.gosend_instant_active = false;
            $scope.gosend_sameday_active = true;
            console.log("Only GO-SEND SameDay can be used");
            console.log($rootScope.gosend_sameday_price);
        }
        console.log($scope.gosend_instant_active);
        console.log($scope.gosend_sameday_active);
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
            template: '<div style="width:100%;text-align:center">Layanan Instant courier dan Layanan SameDay belum tersedia di wilayah anda karena '+data.Instant.errors[0].message+'</div><br>'+
                        '<div style="width:100%;text-align:center"><b>Silahkan mengganti destinasi perjalanan</b></div>',
            buttons:[
                {
                    text: $scope.alert_button_ok
                }
            ]
        });
    };

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

    function initializeMap() {
        var mapOptions = {
            center: { lat: $scope.gosend_default_lat, lng: $scope.gosend_default_lng },
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

        var map = new google.maps.Map(document.getElementById('map_gosend'),
            mapOptions);

        var input = /** @type {HTMLInputElement} */ (
            document.getElementById('pac-input'));

        // Create the autocomplete helper, and associate it with
        // an HTML text input box.
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var marker;
        var markers;
        if($rootScope.destination_gosend_lat != 0 || $rootScope.destination_gosend_lng != 0){
            var pos = {
                lat: $rootScope.destination_gosend_lat,
                lng: $rootScope.destination_gosend_lng
            };
            myLocation.lat = $rootScope.destination_gosend_lat;
            myLocation.lng = $rootScope.destination_gosend_lng;
            console.log("gosend-map-geolocation");
            console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
            $scope.getCostGoSend();
            var myLatlng = new google.maps.LatLng($rootScope.destination_gosend_lat,$rootScope.destination_gosend_lng);
            marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                draggable:true
            });
            infowindow.setPosition(pos);
            infowindow.setContent('Location found.');
            infowindow.open(map,marker);
            map.setCenter(pos);
            google.maps.event.addListener(marker, 'dragend', function(event){
                console.log("drag marker end");
                var latLng = event.latLng; 
                currentLatitude = latLng.lat();
                currentLongitude = latLng.lng();
                $rootScope.destination_gosend_lat = currentLatitude;
                $rootScope.destination_gosend_lng = currentLongitude;
                myLocation.lat = currentLatitude;
                myLocation.lng = currentLongitude;
                $scope.getCostGoSend();
                console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
            });
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                 console.log("place changed");
                infowindow.close();
                var place = autocomplete.getPlace();
                $rootScope.destination_gosend_lat = place.geometry.location.lat();
                $rootScope.destination_gosend_lng = place.geometry.location.lng();
                myLocation.lat = place.geometry.location.lat();
                myLocation.lng = place.geometry.location.lng();
                $scope.getCostGoSend();
                console.log("gosend-map");
                console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                console.log(place.geometry.location);
                if (!place.geometry) {
                    return;
                }
    
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }
                myLatlng = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                marker.setPosition(myLatlng);
                // Set the position of the marker using the place ID and location.
                // marker.setPlace( /** @type {!google.maps.Place} */ ({
                //     placeId: place.place_id,
                //     location: place.geometry.location
                // }));
                // marker.setVisible(true);
    
                infowindow.setContent('Location found.');
                infowindow.open(map, marker);
                google.maps.event.addListener(marker, 'dragend', function(event){
                    console.log("drag marker end");
                    var latLng = event.latLng; 
                    currentLatitude = latLng.lat();
                    currentLongitude = latLng.lng();
                    $rootScope.destination_gosend_lat = currentLatitude;
                    $rootScope.destination_gosend_lng = currentLongitude;
                    myLocation.lat = currentLatitude;
                    myLocation.lng = currentLongitude;
                    $scope.getCostGoSend();
                    console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                 });
            });
            marker.addListener('click', toggleBounce);
        }
        else{
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
                    console.log(position);
                    $scope.getCostGoSend();
                    var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        draggable:true
                    });
                    // infowindow.setPosition(pos);
                    infowindow.setContent('Location found.');
                    infowindow.open(map,marker);
                    map.setCenter(pos);
                    google.maps.event.addListener(marker, 'dragend', function(event){
                        console.log("drag marker end");
                        var latLng = event.latLng; 
                        currentLatitude = latLng.lat();
                        currentLongitude = latLng.lng();
                        $rootScope.destination_gosend_lat = currentLatitude;
                        $rootScope.destination_gosend_lng = currentLongitude;
                        myLocation.lat = currentLatitude;
                        myLocation.lng = currentLongitude;
                        $scope.getCostGoSend();
                        console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                    });
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                         console.log("place changed");
                        infowindow.close();
                        var place = autocomplete.getPlace();
                        $rootScope.destination_gosend_lat = place.geometry.location.lat();
                        $rootScope.destination_gosend_lng = place.geometry.location.lng();
                        myLocation.lat = place.geometry.location.lat();
                        myLocation.lng = place.geometry.location.lng();
                        $scope.getCostGoSend();
                        console.log("gosend-map");
                        console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                        console.log(place.geometry.location);
                        if (!place.geometry) {
                            return;
                        }
            
                        if (place.geometry.viewport) {
                            map.fitBounds(place.geometry.viewport);
                        } else {
                            map.setCenter(place.geometry.location);
                            map.setZoom(17);
                        }
                        myLatlng = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                        marker.setPosition(myLatlng);
                        // Set the position of the marker using the place ID and location.
                        // marker.setPlace( /** @type {!google.maps.Place} */ ({
                        //     placeId: place.place_id,
                        //     location: place.geometry.location
                        // }));
                        // marker.setVisible(true);
            
                        infowindow.setContent('Location found.');
                        infowindow.open(map, marker);
                        google.maps.event.addListener(marker, 'dragend', function(event){
                            console.log("drag marker end");
                            var latLng = event.latLng; 
                            currentLatitude = latLng.lat();
                            currentLongitude = latLng.lng();
                            $rootScope.destination_gosend_lat = currentLatitude;
                            $rootScope.destination_gosend_lng = currentLongitude;
                            myLocation.lat = currentLatitude;
                            myLocation.lng = currentLongitude;
                            $scope.getCostGoSend();
                            console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                         });
                    });
                    marker.addListener('click', toggleBounce);
                }, function() {
                    console.log("Error geolocation");
                    var pos = {
                        lat: parseFloat($scope.gosend_origin_lat),
                        lng: parseFloat($scope.gosend_origin_lng)
                    };
                    $rootScope.destination_gosend_lat = parseFloat($scope.gosend_origin_lat);
                    $rootScope.destination_gosend_lng = parseFloat($scope.gosend_origin_lng);
                    myLocation.lat = parseFloat($scope.gosend_origin_lat);
                    myLocation.lng = parseFloat($scope.gosend_origin_lng);
                    console.log("gosend-map-geolocation");
                    console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                    $scope.getCostGoSend();
                    var myLatlng = new google.maps.LatLng(parseFloat($scope.gosend_origin_lat),parseFloat($scope.gosend_origin_lng));
                    marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        draggable:true
                    });
                    infowindow.setPosition(pos);
                    infowindow.setContent('Location found.');
                    infowindow.open(map,marker);
                    map.setCenter(pos);
                    google.maps.event.addListener(marker, 'dragend', function(event){
                        console.log("drag marker end");
                        var latLng = event.latLng; 
                        currentLatitude = latLng.lat();
                        currentLongitude = latLng.lng();
                        $rootScope.destination_gosend_lat = currentLatitude;
                        $rootScope.destination_gosend_lng = currentLongitude;
                        myLocation.lat = currentLatitude;
                        myLocation.lng = currentLongitude;
                        $scope.getCostGoSend();
                        console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                    });
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                         console.log("place changed");
                        infowindow.close();
                        var place = autocomplete.getPlace();
                        $rootScope.destination_gosend_lat = place.geometry.location.lat();
                        $rootScope.destination_gosend_lng = place.geometry.location.lng();
                        myLocation.lat = place.geometry.location.lat();
                        myLocation.lng = place.geometry.location.lng();
                        $scope.getCostGoSend();
                        console.log("gosend-map");
                        console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                        console.log(place.geometry.location);
                        if (!place.geometry) {
                            return;
                        }
            
                        if (place.geometry.viewport) {
                            map.fitBounds(place.geometry.viewport);
                        } else {
                            map.setCenter(place.geometry.location);
                            map.setZoom(17);
                        }
                        myLatlng = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                        marker.setPosition(myLatlng);
                        // Set the position of the marker using the place ID and location.
                        // marker.setPlace( /** @type {!google.maps.Place} */ ({
                        //     placeId: place.place_id,
                        //     location: place.geometry.location
                        // }));
                        // marker.setVisible(true);
            
                        infowindow.setContent('Location found.');
                        infowindow.open(map, marker);
                        google.maps.event.addListener(marker, 'dragend', function(event){
                            console.log("drag marker end");
                            var latLng = event.latLng; 
                            currentLatitude = latLng.lat();
                            currentLongitude = latLng.lng();
                            $rootScope.destination_gosend_lat = currentLatitude;
                            $rootScope.destination_gosend_lng = currentLongitude;
                            myLocation.lat = currentLatitude;
                            myLocation.lng = currentLongitude;
                            $scope.getCostGoSend();
                            console.log($rootScope.destination_gosend_lat+" "+$rootScope.destination_gosend_lng);
                         });
                    });
                    marker.addListener('click', toggleBounce);
                    handleLocationError(true, infowindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infowindow, map.getCenter());
            }
        }

        function handleLocationError(browserHasGeolocation, infowindow, pos) {
            infowindow.setPosition(pos);
            infowindow.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
            infowindow.open(map);
        }

        function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }
    }

    $scope.gosendMap = function(action) {
        gosendMap(action);
    }

});
