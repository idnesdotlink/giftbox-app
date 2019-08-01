app.controller("TransactionDetailCtrl", function ($scope,
                                                  $cordovaCamera,
                                                  $http,
                                                  httpService,
                                                  $stateParams,
                                                  $ionicLoading,
                                                  $ionicPopup,
                                                  $ionicHistory,
                                                  $ionicPlatform) {

    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.vt_payment_service = vt_payment_service;
    $scope.rajaongkir_enabled = rajaongkir_enabled;
    $scope.shipper_enabled = shipper_enabled;
    $scope.shipper_intl_enabled = shipper_intl_enabled;
    $scope.custom_delivery_enabled = custom_delivery_enabled;
    $scope.trans_id = -1;
    $scope.custom_transaction_fields = JSON.parse(custom_transaction_fields);
    $scope.default_transaction_fields = JSON.parse(default_transaction_fields)[0];

    $scope.tax_enabled = tax_enabled;
    $scope.has_taxes = false;
    $scope.has_others = false;
    $scope.resi_number = '-';

    var loadCustomText = function() {
        $scope.button_text_track_sicepat_status = getMenuText(ui_texts_transactions.button_text_track_sicepat_status, "Track Sicepat Status");
        $scope.button_text_confirm_delivery = getMenuText(ui_texts_transactions.button_text_confirm_delivery, "Confirm Delivery");
        $scope.subtitle_text_delivery_status = getMenuText(ui_texts_transactions.subtitle_text_delivery_status, "Delivery Status");
        $scope.subtitle_text_delivery_status_completed = getMenuText(ui_texts_transactions.subtitle_text_delivery_status_completed, "Completed");
        $scope.ui_text_sent_by = getMenuText(ui_texts_transactions.ui_text_sent_by, "Delivered By");
        $scope.ui_text_received_by = getMenuText(ui_texts_transactions.ui_text_received_by, "Received By");
        $scope.ui_placeholder_text_sent_by = getMenuText(ui_texts_transactions.ui_placeholder_text_sent_by,"Who delivered these items?");
        $scope.ui_placeholder_text_received_by = getMenuText(ui_texts_transactions.ui_placeholder_text_received_by,"Who received these items?");
        $scope.ui_popup_confirm_delivery_success = getMenuText(ui_texts_transactions.ui_popup_confirm_delivery_success, "Thank you for confirming the delivery!");
        $scope.ui_popup_confirm_delivery_failed = getMenuText(ui_texts_transactions.ui_popup_confirm_delivery_failed, "Failed to confirm delivery, please try again!");
        $scope.ui_popup_title_confirm_delivery = getMenuText(ui_texts_transactions.ui_popup_title_confirm_delivery, "Confirm Delivery");
        $scope.ui_popup_title_transaction_url = getMenuText(ui_texts_transactions.ui_popup_title_transaction_url, "Loading Payment Page");
        $scope.ui_popup_transaction_url_failed = getMenuText(ui_texts_transactions.ui_popup_transaction_url_failed, "Failed to load payment page, please try again!");

        $scope.button_text_pay_now = getMenuText(ui_texts_transactions.button_text_pay_now, "Pay Now");
        $scope.button_text_how_to_pay = getMenuText(ui_texts_transactions.button_text_how_to_pay, "How to Pay");
        $scope.button_text_how_to_contribute = getMenuText(ui_texts_transactions.button_text_how_to_contribute, "How to Contribute");
        $scope.button_text_take_photo = getMenuText(ui_texts_transactions.button_text_take_photo, "Take Photo");
        $scope.button_text_choose_photo = getMenuText(ui_texts_transactions.button_text_choose_photo, "Choose Photo");
        $scope.button_text_track_jne = getMenuText(ui_texts_transactions.button_text_track_jne, "Track JNE Status");

        $scope.ui_text_payment_type = getMenuText(ui_texts_transactions.ui_text_payment_type, "Payment Type");
        $scope.ui_text_transaction_code = getMenuText(ui_texts_transactions.ui_text_transaction_code, "Transaction Code");
        $scope.ui_text_date = getMenuText(ui_texts_transactions.ui_text_date, "Date");
        $scope.ui_text_status = getMenuText(ui_texts_transactions.ui_text_status, "Status");
        $scope.ui_text_comments = getMenuText(ui_texts_transactions.ui_text_comments, "Comments");
        $scope.ui_text_admin_notes = getMenuText(ui_texts_transactions.ui_text_admin_notes,"Admin Notes");
        $scope.ui_text_product_name = getMenuText(ui_texts_transactions.ui_text_product_name, "Product Name");
        $scope.ui_text_product_price = getMenuText(ui_texts_transactions.ui_text_product_price,"Product Price");
        $scope.ui_text_quantity = getMenuText(ui_texts_transactions.ui_text_quantity,"Quantity");
        $scope.ui_text_subtotal = getMenuText(ui_texts_transactions.ui_text_subtotal,"Subtotal");
        $scope.ui_text_carrier = getMenuText(ui_texts_transactions.ui_text_carrier,"Carrier");
        $scope.ui_text_service = getMenuText(ui_texts_transactions.ui_text_service,"Service");
        $scope.ui_text_price = getMenuText(ui_texts_transactions.ui_text_price, "Price");
        $scope.ui_text_receipt_save_success = getMenuText(ui_texts_transactions.ui_text_receipt_save_success,"Your transaction receipt has been saved successfully.");
        $scope.ui_text_receipt_save_failed = getMenuText(ui_texts_transactions.ui_text_receipt_save_failed,"Failed to upload transaction receipt. Please check your internet connection and try again.");
        $scope.delivery_button_track_status = getMenuText(ui_texts_transactions.delivery_button_track_status, "Track Status");

        $scope.status_pending = getMenuText(ui_texts_transactions.status_pending, "Pending");
        $scope.status_capture = getMenuText(ui_texts_transactions.status_capture, "Capture");
        $scope.status_settlement = getMenuText(ui_texts_transactions.status_settlement, "Settlement");
        $scope.status_challenge = getMenuText(ui_texts_transactions.status_challenge, "Challenge");
        $scope.status_in_process = getMenuText(ui_texts_transactions.status_in_process, "In Process");
        $scope.status_delivery = getMenuText(ui_texts_transactions.status_delivery, "Delivery");
        $scope.status_completed = getMenuText(ui_texts_transactions.status_completed, "Completed");
        $scope.status_cancelled = getMenuText(ui_texts_transactions.status_cancelled, "Cancelled");
        $scope.status_payment_in_process = getMenuText(ui_texts_transactions.status_payment_in_process, "Payment In Process");

        $scope.subtitle_text_total = getMenuText(ui_texts_transactions.subtitle_text_total, "Total");
        $scope.subtitle_text_payment = getMenuText(ui_texts_transactions.subtitle_text_payment,"Payment");
        $scope.subtitle_text_transaction_receipt = getMenuText(ui_texts_transactions.subtitle_text_transaction_receipt,"Transaction Receipt");
        $scope.subtitle_text_transaction_detail = getMenuText(ui_texts_transactions.subtitle_text_transaction_detail, "Transaction Detail");
        $scope.subtitle_text_product_detail = getMenuText(ui_texts_transactions.subtitle_text_product_detail, "Product Detail")
        $scope.subtitle_text_delivery_price = getMenuText(ui_texts_transactions.subtitle_text_delivery_price, "Delivery Price");
        $scope.subtitle_text_taxes = getMenuText(ui_texts_transactions.subtitle_text_taxes, "Taxes");
        $scope.subtitle_text_others = getMenuText(ui_texts_transactions.subtitle_text_others, "Other Details");
        $scope.subtitle_text_contribute = getMenuText(ui_texts_transactions.subtitle_text_contribute,"Contribute");

        $scope.text_payment_success_title = getMenuText(ui_texts_shopping_cart.text_payment_success_title,'Payment Success!');
        $scope.text_payment_pending_title = getMenuText(ui_texts_shopping_cart.text_payment_pending_title,'Payment Pending');
        $scope.text_payment_error_title = getMenuText(ui_texts_shopping_cart.text_payment_error_title,'Payment Error');
        $scope.text_payment_close_title = getMenuText(ui_texts_shopping_cart.text_payment_close_title,'Payment Unfinished');
        $scope.text_payment_success_content = getMenuText(ui_texts_shopping_cart.text_payment_success_content,'Thank you for the purchase. We will process your order immediately.');
        $scope.text_payment_pending_content = getMenuText(ui_texts_shopping_cart.text_payment_pending_content,'We are currently processing your payment. You will be notified soon.');
        $scope.text_payment_error_content = getMenuText(ui_texts_shopping_cart.text_payment_error_content,'Please contact our developer to solve this problem.');
        $scope.text_payment_close_content = getMenuText(ui_texts_shopping_cart.text_payment_close_content,'Your payment is not finished yet. To continue, navigate to "Transaction History" and find the pending payment.');

        $scope.alert_jne_status_title = getMenuText(ui_texts_transactions.alert_jne_status_title, "JNE Status");
        $scope.alert_jne_status_content = getMenuText(ui_texts_transactions.alert_jne_status_content, "Your tracking status is in process");
        $scope.alert_sicepat_status_title = getMenuText(ui_texts_transactions.alert_sicepat_status_title, "Sicepat Resi Status");
        $scope.alert_sicepat_status_tracking = getMenuText(ui_texts_transactions.alert_sicepat_status_tracking, "Your tracking status:");
        $scope.alert_sicepat_status_receiver = getMenuText(ui_texts_transactions.alert_sicepat_status_receiver, "Receiver Name:");
        $scope.alert_sicepat_status_invalid = getMenuText(ui_texts_transactions.alert_sicepat_status_invalid, "Invalid Resi Number");
        $scope.alert_sicepat_status_error_connection = getMenuText(ui_texts_transactions.alert_sicepat_status_error_connection, "Failed to get resi number. Please check your internet connection and try again.");
        $scope.payment_type_online = getMenuText(ui_texts_transactions.payment_type_online, "Online Payment");
        $scope.payment_type_bank_transfer = getMenuText(ui_texts_transactions.payment_type_bank_transfer, "Bank Transfer");
        $scope.payment_type_cod = getMenuText(ui_texts_transactions.payment_type_cod, "Cash on Delivery");
        // $scope.payment_type_loyalty = getMenuText(ui_texts_transactions.payment_type_loyalty, "Loyalty");
        $scope.payment_type_loyalty = $scope.loyalty_app_integration_apps_loyalty;
        $scope.alert_transaction_receipt_title = getMenuText(ui_texts_transactions.alert_transaction_receipt_title, "Transaction Receipt");
        $scope.alert_transaction_receipt_content = getMenuText(ui_texts_transactions.alert_transaction_receipt_content, "Please upload the receipt by one of the options below");

        $scope.ui_text_delivery_delivery_days = getMenuText(ui_texts_shopping_cart.ui_text_delivery_delivery_days, "days");
        $scope.ui_text_delivery_delivery_time = getMenuText(ui_texts_shopping_cart.ui_text_delivery_delivery_time, "Estimated Time");
        $scope.ui_text_delivery_airway_bill = getMenuText(ui_texts_shopping_cart.ui_text_delivery_airway_bill,"Airway Bill");
    };

    loadCustomText();

    $ionicPlatform.ready(function () {

        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
        $scope.isTimeout = false;

        $scope.input = {
            delivery_sent_by: '',
            delivery_received_by: ''
        };

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
        $scope.currency = currency;

    });

    $scope.makePayment = function () {
        // TODO: Open InAppBrowser to this link: $scope.content_data.payment_url
        $scope.show();

        if ($scope.content_data.trans_master.payment_type === 'vt'){
          var url = url_midtrans_generate_token;
          var obj = serializeData({ _method:'POST', orderID: $scope.content_data.trans_master.order_id });
          httpService.post($scope,$http,url,obj,'generate-midtrans-token');
        }
        else if ($scope.content_data.trans_master.payment_type === 'ipay88'){
          // do requery here...
          if (isPhoneGap()){
            var obj = serializeData({ _method:'POST', orderID: $scope.content_data.trans_master.order_id });
            var url = url_ipay88_request_payment;
            httpService.post($scope,$http,url,obj,'ipay88-request-payment');
          }
          else {
            $scope.hide();
            function showErrorDeviceOnly() {
              var alertPopup = $ionicPopup.alert({
                title: 'Not Supported',
                css: 'cp-button',
                okType: 'cp-button',
                okText: $scope.alert_button_ok,
                template: '<div style="width:100%;text-align:center">' + "Please view this feature from the device. You can request an installer for Android to view this feature." + '</div>'
              });
            }

            showErrorDeviceOnly();
          }
        }
        else if($scope.content_data.trans_master.payment_type === 'senangpay'){
            $scope.hide();
            openBrowser($scope.content_data.payment_url);
        }
        else if($scope.content_data.trans_master.payment_type === 'espay'){
            $scope.hide();
            openBrowser(espay_payment_url + $scope.content_data.trans_master.order_id);
        }
        else {
          var url = token_url;
          var obj = serializeData({email: username, password: password, company_id: company_id});
          httpService.post_token($scope, $http, url, obj, 'transaction-url');
        }
    };

    $scope.$on('httpService:postIPay88RequestPaymentSuccess',function(){
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
          function (resp) {
            console.log(resp);
            $scope.hideLoading();
            showPopupPGTransactionResult($scope.text_payment_success_title, $scope.text_payment_success_content);
          },
          function (err) {
            console.log(err);
            $scope.hideLoading();
            if (err.err == 'canceled'){
              showPopupPGTransactionResult($scope.text_payment_close_title, $scope.text_payment_close_content);
            }
            else {
              showPopupPGTransactionResult($scope.text_payment_error_title, $scope.text_payment_error_content);
            }
          }
        );
      }
      else {
        $scope.hideLoading();

        function showErrorDeviceOnly() {
          var alertPopup = $ionicPopup.alert({
            title: 'Not Supported',
            css: 'cp-button',
            okType: 'cp-button',
            okText: $scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + "Please view this feature from the device. You can request an installer for Android to view this feature." + '</div>',
            buttons: [
              {
                text: $scope.alert_button_ok,
                type: 'cp-button',
                onTap: function (e) {
                  $ionicHistory.removeBackView();
                  $ionicHistory.clearHistory();
                  window.location.href = "#/app/transaction-detail/" + $scope.trans_id;
                }
              }
            ]
          });
        }

        showErrorDeviceOnly();
      }
    });

    $scope.$on('httpService:postIPay88RequestPaymentError',function(){
      var html = $scope.data;
      $scope.showFailedAlert();
    });

    $scope.$on('httpService:postTokenTransactionURLSuccess', function () {
        var obj = serializeData({
            _method: 'POST',
            transaction_id: $scope.content_data.trans_master.id
        });
        // submit order
        console.log(obj);
        $scope.result = httpService.post($scope, $http, transaction_url + '?token=' + token, obj, 'transaction-url');
    });

    $scope.$on('httpService:postTokenTransactionURLError', function () {
        $scope.hide();
        $scope.getTransactionURLFailed();
    });

    $scope.$on('httpService:postTransactionURLSuccess', function(){
        $scope.hide();
        console.log("********************");
        console.log($scope.data);
        console.log("********************");
        if ($scope.data.result === 'success'){
            openBrowser($scope.data.url);
        }
        else {
            $scope.getTransactionURLFailed();
        }
    });

    $scope.$on('httpService:postTransactionURLError', function(){
        $scope.hide();
        $scope.getTransactionURLFailed();
    });

    $scope.trackJNEStatus = function () {
        //TODO: perlu request ke api ga tiap pencet? ato langsung pas masuk detail di kasi datanya?
        $scope.showJNEAlert();
    };

    $scope.trackGoSendStatus = function (resi_number_gosend){
        $scope.show();
        if(resi_number_gosend == null){
            $scope.showGoSendAlert(false,false);
        }
        else{
            $scope.resi_number = resi_number_gosend;
            var url = gosend_tracking + "gojek/" + resi_number_gosend;
            httpService.get($scope, $http, url, 'gosend-track-status');
        }
    };

    $scope.trackSicepatStatus = function (resi_number) {
        $scope.show();
        if(resi_number == null)
        {
            $scope.showSicepatAlert(false, false);
        }
        else
        {
            $scope.resi_number = resi_number;
            var url = sicepat_track_waybill + resi_number;
            httpService.get($scope, $http, url, 'sicepat-track-status');
        }
    };

    $scope.showJNEAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scsope.alert_jne_status_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_jne_status_content + '</div>',
            buttons: [
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.showSicepatAlert = function (valid, result) {
        console.log(valid);
        console.log(result);
        if(valid == "success")
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_sicepat_status_title,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_sicepat_status_tracking + " " + result.last_status.status + '<br>' + $scope.alert_sicepat_status_receiver + " " + result.receiver_name +' </div>',
                buttons: [
                    {
                        text: $scope.alert_button_ok,
                        type: 'cp-button'
                    }
                ]
            });
        }
        else if(!valid)
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_sicepat_status_title,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_sicepat_status_invalid + '</div>',
                buttons: [
                    {
                        text: $scope.alert_button_ok,
                        type: 'cp-button'
                    }
                ]
            });
        }
        else if(valid == "error")
        {
            var alertPopup = $ionicPopup.alert({
                title: $scope.alert_sicepat_status_title,
                template: '<div style="width:100%;text-align:center">' + $scope.alert_sicepat_status_error_connection + '</div>',
                buttons: [
                    {
                        text: $scope.alert_button_ok
                    },
                    {
                        text: $scope.alert_button_try_again,
                        type: 'cp-button',
                        onTap: function(){
                            $scope.show();
                            var url = sicepat_track_waybill + $scope.resi_number;
                            httpService.get($scope, $http, url, 'sicepat-track-status');
                        }
                    }
                ]
            });
        }
        $scope.hide();
    };

    $scope.showGoSendAlert = function (valid, result) {
        console.log(valid);
        console.log(result);
        if(valid == "success")
        {
            var alertPopup = $ionicPopup.alert({
                title: "GO-SEND Tracking Status",
                template: '<div style="width:100%;text-align:center">Booking Type : '+ result.bookingType +' </div>'+
                          '<div style="width:100%;text-align:center">Tracking Status : '+ result.status +' </div>'+
                          '<div style="width:100%;text-align:center">Tracking Code : '+ result.orderNo +'</div>'+
                          '<div style="width:100%;text-align:center">Total Price : Rp '+ result.totalPrice +'</div>',
                buttons: [
                    {
                        text: "Live Tracking",
                        type: 'cp-button',
                        onTap: function(){
                            openBrowser(result.liveTrackingUrl);
                        }
                    },
                    {
                        text: $scope.alert_button_ok,
                        type: 'cp-button'
                    }                    
                ]
            });
        }
        else if(!valid)
        {
            var alertPopup = $ionicPopup.alert({
                title: "GO-SEND Tracking Invalid",
                template: '<div style="width:100%;text-align:center">' + "Tracking Resi is Invalid" + '</div>',
                buttons: [
                    {
                        text: $scope.alert_button_ok,
                        type: 'cp-button'
                    }
                ]
            });
        }
        else if(valid == "error")
        {
            var alertPopup = $ionicPopup.alert({
                title: "Error Connection",
                template: '<div style="width:100%;text-align:center">' + "Error Connection" + '</div>',
                buttons: [
                    {
                        text: $scope.alert_button_ok
                    },
                    {
                        text: $scope.alert_button_try_again,
                        type: 'cp-button',
                        onTap: function(){
                            $scope.show();
                            var url = gosend_tracking + $scope.resi_number;
                            httpService.get($scope, $http, url, 'gosend-track-status');
                        }
                    }
                ]
            });
        }
        $scope.hide();
    };

    $scope.$on('httpService:getSicepatTrackStatusSuccess', function () {
        $scope.hide();
        $scope.sicepat = $scope.data.sicepat;
        if(typeof $scope.sicepat.status.code !== 'undefined' && $scope.sicepat.status.code == 200)
        {
            $scope.showSicepatAlert("success", $scope.sicepat.result);
        }
        else if(typeof $scope.sicepat.status.code == 'undefined')
        {
            $scope.showSicepatAlert("error", false);
        }
        else
        {
            $scope.showSicepatAlert(false, false);
        }
    });

    $scope.$on('httpService:getSicepatTrackStatusError', function () {
        $scope.hide();
        $scope.showSicepatAlert("error", false);
    });

    $scope.$on('httpService:getGoSendTrackStatusSuccess', function () {
        $scope.hide();
        console.log("GOSEND");
        console.log($scope.data);
        $scope.gosend = $scope.data;
        if(typeof $scope.gosend.status !== 'undefined' && $scope.gosend.status == 200)
        {
            $scope.showGoSendAlert("success", $scope.gosend.content);
        }
        else if(typeof $scope.gosend.status == 'undefined')
        {
            $scope.showGoSendAlert("error", false);
        }
        else
        {
            $scope.showGoSendAlert(false, false);
        }
    });

    $scope.$on('httpService:getGoSendTrackStatusError', function () {
        $scope.hide();
        $scope.showGoSendAlert("error", false);
    });

    $scope.switchToggleConfirmDelivery = function(){
        $scope.toggleConfirmDelivery = !$scope.toggleConfirmDelivery;
    };

    $scope.confirmDelivery = function(){
        $scope.show();
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'confirm-delivery');
    };

    $scope.$on('httpService:postTokenConfirmDeliverySuccess',function(){
        var obj = serializeData({
            _method: 'POST',
            transaction_id: $scope.content_data.trans_master.id,
            delivery_sent_by: $scope.input.delivery_sent_by,
            delivery_received_by: $scope.input.delivery_received_by
        });
        // submit order
        console.log(obj);
        $scope.result = httpService.post($scope, $http, user_approve_transaction + '?token=' + token, obj, 'confirm-delivery');
    });

    $scope.$on('httpService:postTokenConfirmDeliveryError',function(){
//        if ($scope.status === 0) {
//            // if(isPhoneGap())
//            // {
//            //     loadPostJSONFromDB($stateParams.id, $scope);
//            // }
//        }
//        else {
//            var url = token_url;
//            var obj = serializeData({email: username, password: password, company_id: company_id});
//            httpService.post_token($scope, $http, url, obj, 'confirm-delivery');
//        }
        $scope.hide();
        $scope.confirmDeliveryFailed();
    });

    $scope.$on('httpService:postConfirmDeliverySuccess',function(){
        // popup success, say thank you.
        console.log("Post Confirm Delivery Success");
        console.log($scope.data);
        $scope.hide();
        if ($scope.data.status == 'success'){
            $scope.confirmDeliverySuccess();

            // update data

            $scope.content_data.delivery_sent_by = $scope.input.delivery_sent_by;
            $scope.content_data.delivery_received_by = $scope.input.deilvery_received_by;
        }
        else {
            $scope.confirmDeliveryFailed();
        }
    });

    $scope.$on('httpService:postConfirmDeliveryError',function(){
        // popup error please try again.
        console.log($scope.data);
        $scope.confirmDeliveryFailed();
        console.log("Post Confirm Delivery Error");
        $scope.hide();
    });

    // get token for getting detail data success
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = user_transaction_detail + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);
        console.log('TransactionDetailCtrl');

    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
//        $scope.data.taxes_data = '[{"label":"Tax (10%)","value":100},{"label":"test","value":"1000"},{"label":"Tax 2","value":525},{"label":"Tax 3","value":525},{"label":"Tax 4","value":1575}]';
        $scope.parsed_taxes_data = JSON.parse($scope.data.taxes_data);
        $scope.has_taxes = $scope.parsed_taxes_data.length > 0? true : false;
        $scope.toggle_confirm_delivery = false;

        var other_data = $scope.data.other_data;
        $scope.has_others = $scope.data.other_data != '[]' ? other_data.length > 0 : false;

        $scope.content_data = {
            id: $stateParams.id,
            trans_master: $scope.data.trans_master,
            trans_details: $scope.data.trans_details,
            payment_url: $scope.data.payment_url,
            trans_meta: $scope.data.trans_meta,
            delivery_data: $scope.data.delivery_data,
            delivery_status_data: $scope.data.delivery_status_data,
            taxes_data: $scope.parsed_taxes_data,
            other_data: $scope.data.other_data
        };

        $scope.delivery_status = $scope.data.delivery_data;

        var payment_type = '-';
        switch ($scope.content_data.trans_master.payment_type){
            case 'vt': payment_type = $scope.payment_type_online; break;
            case 'manual': payment_type = $scope.payment_type_bank_transfer; break;
            case 'cod': payment_type = $scope.payment_type_cod; break;
            case 'loyalty' : payment_type = $scope.payment_type_loyalty; break;
        }
        if ($scope.content_data.trans_master.payment_type.indexOf('cc') > -1){
            payment_type = 'Credit Card';
        }
        else if ($scope.content_data.trans_master.payment_type.indexOf('va') > -1){
            payment_type = 'Virtual Account';
        }
        else if ($scope.content_data.trans_master.payment_type.indexOf('bca_va') > -1){
            payment_type = 'BCA Virtual Account';
        }

        $scope.content_data.trans_master.payment_type_description = payment_type;
        $scope.wishlist = false;
        $scope.voucher_price_detail = 0;
        $scope.is_voucher = 0;
        $scope.voucher_code = "";
        console.log ($scope.content_data.trans_meta);
        for($i = 0; $i < $scope.content_data.trans_meta.length;$i++){
            if($scope.content_data.trans_meta[$i].key == "wishlist"){
                $scope.wishlist = true;
            }
            else if($scope.content_data.trans_meta[$i].key == "voucher"){
                $scope.is_voucher = 1;
            }
            else if($scope.content_data.trans_meta[$i].key == "voucher_price"){
                $scope.voucher_price_detail = $scope.content_data.trans_meta[$i].value;
            }
            else if($scope.content_data.trans_meta[$i].key == "voucher_code"){
                $scope.voucher_code = $scope.content_data.trans_meta[$i].value;
            }
        }
        console.log($scope.is_voucher);
        console.log($scope.voucher_price_detail);
        console.log($scope.voucher_code);
        console.log($scope.wishlist);
        $scope.imgURI = $scope.content_data.trans_master.transfer_receipt;

        if($scope.content_data.trans_master.payment_type == 'manual')
        {
            if(($scope.imgURI==undefined || $scope.imgURI == '') &&  vt_payment_service === 'NO')
            {
                $scope.uploadPhotoReminder();
            }
        }

        $scope.isLoading = false;
        // if(isPhoneGap())
        // {
        //     //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'TransactionDetailCtrl' + " " + $scope.data);
        //     savePostJSONToDB($stateParams.id, user_id, 'TransactionDetailCtrl', $scope.data);
        //     //console.log('saved');
        // }
    });

    // if get token detail data Error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if ($scope.status === 0) {
            // if(isPhoneGap())
            // {
            //     loadPostJSONFromDB($stateParams.id, $scope);
            // }
        }
        else {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    // if get detail data Error, request token again
    $scope.$on('httpService:getRequestError', function () {
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
        // httpService.post_token($scope, $http, url, obj, 'content');

    });

    // loading fragment
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.isPhoneGap = function () {
        return isPhoneGap();
    };

    // $scope.$on('SQLite:getOfflineDataSuccess', function () {
    //     //console.log($scope.data);
    //     $scope.isLoading = false;
    //
    //     $scope.content_data = {
    //         id: $stateParams.id,
    //         trans_master: $scope.data.trans_master,
    //         trans_details: $scope.data.trans_details
    //     };
    //
    // });

    $scope.retryLoadContent = function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

    function openBrowser(url) {
        console.log("WOI")
        if (!isPhoneGap()) {
            window.open(url, '_blank', 'location=yes');
        }
        else {
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
                screen.lockOrientation('portrait-primary');
            });
        }
    }

    $scope.takePhoto = function (trans_id) {
        $scope.trans_id = trans_id;
        if (!isPhoneGap()) {
            console.log("Not in a mobile device");
            return;
        }
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 640,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;

            var obj = serializeData({_method: 'POST', transfer_receipt: $scope.imgURI});
            $scope.result = httpService.post($scope, $http, update_transfer_receipt + $scope.trans_id, obj, 'update_transfer_receipt');
            $scope.show();
        }, function (err) {
            if(err == "Selection cancelled.") {
                //do Nothing
            }
            else if(err == "Camera cancelled.") {
                // do Nothing
            }
            else {
                $scope.hide();
                $scope.uploadPhotoFailed();
            }
        });
    };

    $scope.choosePhoto = function (trans_id) {
        $scope.trans_id = trans_id;
        if (!isPhoneGap()) {
            console.log("Not in a mobile device");
            return;
        }
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 640,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;

            var obj = serializeData({_method: 'POST', transfer_receipt: $scope.imgURI});
            $scope.result = httpService.post($scope, $http, update_transfer_receipt + $scope.trans_id, obj, 'update_transfer_receipt');
            $scope.show();
        }, function (err) {
            if(err == "Selection cancelled.") {
                //do Nothing
            }
            else if(err == "Camera cancelled.") {
                // do Nothing
            }
            else {
                $scope.hide();
                $scope.uploadPhotoFailed();
            }
        });
    };

    $scope.uploadPhotoReminder = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Transaction Receipt',
            template: '<div style="width:100%;text-align:center">' + $scope.alert_transaction_receipt_content + '</div>',
            cssClass: 'popup-vertical-buttons',
            buttons: [
                {
                    text: $scope.button_text_take_photo,
                    type: 'cp-button button-block',
                    onTap: function (e) {
                        $scope.takePhoto($scope.content_data.trans_master.id);
                    }
                },
                {
                    text: $scope.button_text_choose_photo,
                    type: 'cp-button button-block',
                    onTap: function (e) {
                        $scope.choosePhoto($scope.content_data.trans_master.id);
                    }

                },
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button button-block'
                }
            ]
        });
    };

    $scope.uploadPhotoSuccess = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_transaction_receipt_title,
            template: '<div style="width:100%;text-align:center">'+$scope.ui_text_receipt_save_success+'</div>',
            buttons: [
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.uploadPhotoFailed = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_transaction_receipt_title,
            template: '<div style="width:100%;text-align:center">'+$scope.ui_text_receipt_save_failed+'</div>',
            buttons: [
                {
                    text: $scope.alert_button_try_again,
                    type: 'cp-button'
                    // onTap: function(e) {
                    //     $scope.choosePhoto($scope.trans_id);
                    // }
                }
            ]
        });
    };

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.confirmDeliverySuccess = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.ui_popup_title_confirm_delivery,
            template: '<div style="width:100%;text-align:center">'+$scope.ui_popup_confirm_delivery_success+'</div>',
            buttons: [
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        $scope.isLoading = true;
                        var url = token_url;
                        var obj = serializeData({email: username, password: password, company_id: company_id});
                        httpService.post_token($scope, $http, url, obj);
                    }
                }
            ]
        });
    };

    $scope.confirmDeliveryFailed = function(){
        var alertPopup = $ionicPopup.alert({
            title: $scope.ui_popup_title_confirm_delivery,
            template: '<div style="width:100%;text-align:center">'+$scope.ui_popup_confirm_delivery_failed+'</div>',
            buttons: [
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.getTransactionURLFailed = function(){
        var alertPopup = $ionicPopup.alert({
            title: $scope.ui_popup_title_transaction_url,
            template: '<div style="width:100%;text-align:center">'+$scope.ui_popup_transaction_url_failed+'</div>',
            buttons: [
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button'
                }
            ]
        });
    };

    $scope.$on('httpService:postUpdateTransferReceiptError', function () {
        $scope.hide();
        $scope.uploadPhotoFailed();
    });

    $scope.$on('httpService:postUpdateTransferReceiptSuccess', function () {
        $scope.hide();
        $scope.uploadPhotoSuccess();
    });

  $scope.$on('httpService:postTokenGenerateMidtransTokenSuccess',function(){
    var trans_id = $scope.trans_id;
    var token = $scope.data.token;
    console.log("Successfully called SNAP.");
    var url = url_midtrans_generate_token + '?token=' + token;
    var obj = serializeData({ orderID: trans_id });
    console.log(obj);
    httpService.post($scope,$http,url, obj,'generate-midtrans-token');
    snap.show();
  });

  $scope.$on('httpService:postTokenGenerateMidtransTokenError',function(){
    $scope.showFailedAlert();
    snap.hide();
  });

  var showPopupPGTransactionResult = function(title,text){
    var alertPopup = $ionicPopup.alert({
      title: title,
      css: 'cp-button',
      okType:'cp-button',
      template: '<div style="width:100%;text-align:center">'+text+'</div>',
      buttons: [
        {
          text: $scope.alert_button_ok,
          type: 'cp-button',
          onTap: function(e){
            if($scope.content_data.trans_master.order_id != -1) {
              $ionicHistory.removeBackView();
              $ionicHistory.clearHistory();
              // window.location.href= "#/app/transaction-detail/" + $scope.content_data.trans_master.id;
              window.location.href = "#/app/transaction-list";
            }
          }
        }
      ]
    });
  };

  $scope.$on('httpService:postGenerateMidtransTokenSuccess', function () {
    var token = $scope.data.token;

    snap.hide();

    if ($scope.data.status == 'valid') {
      snap.pay(token, {
        onSuccess: function (result) {
          console.log('success');
          console.log(result);
          showPopupPGTransactionResult($scope.text_payment_success_title, $scope.text_payment_success_content);
        },
        onPending: function (result) {
          console.log('pending');
          console.log(result);
          showPopupPGTransactionResult($scope.text_payment_pending_title, $scope.text_payment_pending_content);
        },
        onError: function (result) {
          console.log('error');
          console.log(result);
          showPopupPGTransactionResult($scope.text_payment_error_title, $scope.text_payment_error_content);
        },
        onClose: function () {
          console.log('customer closed the popup without finishing the payment');
          showPopupPGTransactionResult($scope.text_payment_close_title, $scope.text_payment_close_content);
        },
        gopayMode: "deeplink"
      });
    }
    else if ($scope.data.status == 'invalid'){
      showPopupPGTransactionResult($scope.text_payment_error_title, $scope.text_payment_error_content + "<br><br>Error:<br>" + $scope.data.message);
    }

    $scope.hide();

  });

  $scope.$on('httpService:postGenerateMidtransTokenError', function () {
    // $scope.showFailedAlert();
    showPopupPGTransactionResult($scope.text_payment_error_title,$scope.text_payment_error_content);
    snap.hide();
  });

});
