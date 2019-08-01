app.factory('httpService', function () { // angular $http service
    function get($scope, $http, url, optType, token, next_page, order_by, category, search) {
        $scope.status = '';
        $scope.data = '';
        $scope.data_check_version = '';
        $scope.headers = '';
        $scope.config = '';
        $scope.showResponse = false;
        optType = typeof optType !== 'undefined' ? optType : 'content';

        next_page = typeof next_page !== 'undefined' ? next_page : '0';
        //category = typeof category !== 'undefined' ? category : '';
        var user_env = typeof app_user_env !== 'undefined' ? '&env=' + app_user_env : '';
        // var language = '&lang=' + (typeof language !== 'undefined' ? language : 'english');
        // var get_url = url + (url.indexOf('?') != -1 ? '&' : '?') + 'token=' + token + user_env + language;
        
        var lang = '&lang=' + (typeof language !== 'undefined' ? language : 'english');
        var get_url = url + (url.indexOf('?') != -1 ? '&' : '?') + 'token=' + token + user_env + lang;
        //
        var content_id = url.split('/');
        var content_id = content_id[content_id.length-1];

        if (optType === 'more-data-content' || optType ==="high-res-data-content") {
            get_url += '&page=' + next_page;
        }
        if (typeof category !== 'undefined') {
            get_url += '&category=' + category;
        }
        else{
            category = '';
        }
        if (typeof order_by !== 'undefined') {
            get_url += '&order_by=' + order_by;
        }
        else{
            order_by = '';
        }
        if (optType == 'device_id' || optType == 'logout' || optType =='user_expiration') {
            get_url = url;
        }
        if (typeof search !== 'undefined') {
            get_url += '&search=' + search
        }
        else{
            search = '';
        }

        console.log('url baru: ' + get_url);

        $http.get(get_url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded, audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
                    'Accept': 'application/x.compro.v1+json'
                    //, 'Authorization': 'Bearer '+token
                },
                timeout: 60000
            })
            .then(function (response) {
                //success
                console.log("GET SUCCESS: " + optType);
                console.log(response);
                if (optType === 'length') {
                    $scope.length = 0;
                    $scope.length = response.data.COUNT;
                    $scope.$broadcast('httpService:getCountSuccess');
                }
                else {
                    $scope.showResponse = true;
                    if(optType !== 'high-res-data-content')
                    {
                        $scope.data = response.data;
                    }

                    $scope.status = response.status;
                    $scope.headers = response.headers;
                    $scope.config = response.config;
                    if (optType === 'menu') {
                        $scope.$broadcast('httpService:getMenuSuccess');
                    }
                    else if (optType === 'logout') {
                        $scope.$broadcast('httpService:logoutSuccess');
                    }
                    else if (optType === 'device_id') {
                        $scope.$broadcast('httpService:getDeviceIdSuccess');
                    }
                    else if (optType === 'user_expiration') {
                        $scope.$broadcast('httpService:getUserExpirationSuccess');
                    }
                    else if (optType === 'get_comment') {
                        $scope.$broadcast('httpService:getCommentSuccess');
                    }
                    else if (optType === 'more-data-content') {
                        $scope.$broadcast('httpService:getMoreDataSuccess', {category: category});
                    }
                    else if (optType === 'carousel-content') {
                        $scope.$broadcast('httpService:getCarouselContentSuccess');
                    }
                    else if (optType === 'company-options') {
                        $scope.$broadcast('httpService:getCompanyOptionsRequestSuccess');
                    }
                    else if (optType === 'company-admin'){
                        $scope.$broadcast('httpService:getCompanyAdminRequestSuccess');
                    }
                    else if (optType === 'high-res-data-content') {
                        $scope.$broadcast('httpService:getHighResDataSuccess',{ page: next_page, data: response.data, category: category});
                    }
                    else if (optType === 'home-post-content') {
                        $scope.$broadcast('httpService:getHomePostSuccess',{ page: next_page, data: response.data, category: category});
                    }
                    else if (optType === 'booking-cancel') {
                        $scope.$broadcast('httpService:getBookingCancelSuccess');
                    }
                    else if (optType === 'rajaongkir-province') {
                        $scope.$broadcast('httpService:getRajaOngkirProvinceSuccess');
                    }
                    else if (optType === 'shipper-details') {
                        $scope.$broadcast('httpService:getShipperDetailsSuccess');
                    }
                    else if (optType === 'shipper-cost') {
                        $scope.$broadcast('httpService:getShipperCostSuccess');
                    }
                    else if (optType === 'gosend-cost') {
                        $scope.$broadcast('httpService:getGoSendCostSuccess');
                    }
                    else if (optType === 'shipper-intl-cost') {
                        $scope.$broadcast('httpService:getShipperIntlCostSuccess');
                    }
                    else if (optType === 'shipper-country') {
                        $scope.$broadcast('httpService:getShipperCountriesSuccess');
                    }
                    else if (optType === 'shipper-provinces'){
                        $scope.$broadcast('httpService:getShipperProvincesSuccess');
                    }
                    else if (optType === 'shipper-city'){
                        $scope.$broadcast('httpService:getShipperCitySuccess');
                    }
                    else if (optType === 'shipper-suburbs'){
                        $scope.$broadcast('httpService:getShipperSuburbsSuccess');
                    }
                    else if (optType === 'shipper-area'){
                        $scope.$broadcast('httpService:getShipperAreaSuccess');
                    }
                    else if (optType === 'rajaongkir-city') {
                        $scope.$broadcast('httpService:getRajaOngkirCitySuccess');
                    }
                    else if (optType === 'rajaongkir-cost') {
                        $scope.$broadcast('httpService:getRajaOngkirCostSuccess');
                    }
                    else if (optType === 'sicepat-province') {
                        $scope.$broadcast('httpService:getSicepatProvinceSuccess');
                    }
                    else if (optType === 'sicepat-track-status') {
                        $scope.$broadcast('httpService:getSicepatTrackStatusSuccess');
                    }
                    else if (optType === 'shipper-track-status'){
                      $scope.$broadcast('httpService:getShipperTrackStatusSuccess');
                    }
                    else if (optType === 'gosend-track-status') {
                        $scope.$broadcast('httpService:getGoSendTrackStatusSuccess');
                    }
                    else if (optType === 'request-reply'){
                        $scope.$broadcast('httpService:getRequestReplySuccess');
                    }
                    else if (optType === 'booking-transaction'){
                        $scope.$broadcast('httpService:getBookingTransactionSuccess');
                    }
                    else if (optType === 'cst-delivery-rates') {
                      $scope.$broadcast('httpService:getAvailableDeliveryRatesSuccess');
                    }
                    else if (optType === 'edit-comment') {
                        $scope.$broadcast('httpService:getEditCommentSuccess');
                    }
                    else if (optType === 'reservation') {
                        $scope.$broadcast('httpService:getReservationListSuccess');
                    }
                    else if (optType === 'attend-reservation') {
                        $scope.$broadcast('httpService:getAttendReservationSuccess');
                    }
                    else if (optType === 'reservation-admin-detail') {
                        $scope.$broadcast('httpService:getReservationAdminDetailSuccess');
                    }
                    else if (optType === 'pos-malaysia-type-of-zone') {
                      $scope.$broadcast('httpService:getPosMalaysiaTypeOfZoneSuccess');
                    }
                    else if (optType === 'pos-malaysia-domestic') {
                      $scope.$broadcast('httpService:getPosMalaysiaDomesticSuccess');
                    }
                    else {
                        $scope.$broadcast('httpService:getRequestSuccess');
                    }
                }
            }, function (response) {
                //error
                console.log("GET ERROR: " + optType);
                console.log(response);
                $scope.showResponse = true;
                $scope.data = response.data;
                $scope.status = response.status;
                $scope.headers = response.headers;
                $scope.config = response.config;

                if (optType === 'menu') {
                    $scope.$broadcast('httpService:getMenuError');
                }
                else if (optType === 'get_comment') {
                    $scope.$broadcast('httpService:getCommentError');
                }
                else if (optType === 'more-data-content') {
                    $scope.$broadcast('httpService:getMoreDataError');
                }
                else if (optType === 'carousel-content') {
                    $scope.$broadcast('httpService:getCarouselContentError');
                }
                else if (optType === 'company-options') {
                    $scope.$broadcast('httpService:getCompanyOptionsRequestError');
                }
                else if (optType === 'company-admin'){
                    $scope.$broadcast('httpService:getCompanyAdminRequestError');
                }
                else if (optType === 'high-res-data-content') {
                    $scope.$broadcast('httpService:getHighResDataError',{ page: next_page});
                }
                else if (optType === 'home-post-content') {
                    $scope.$broadcast('httpService:getHomePostError',{ term_id: content_id, page: next_page});
                }
                else if (optType === 'booking-cancel') {
                    $scope.$broadcast('httpService:getBookingCancelError');
                }
                else if (optType === 'rajaongkir-province') {
                    $scope.$broadcast('httpService:getRajaOngkirProvinceError');
                }
                else if (optType === 'shipper-details') {
                    $scope.$broadcast('httpService:getShipperDetailsError');
                }
                else if (optType === 'gosend-cost') {
                    $scope.$broadcast('httpService:getGoSendCostError');
                }
                else if (optType === 'shipper-cost') {
                    $scope.$broadcast('httpService:getShipperCostError');
                }
                else if (optType === 'shipper-intl-cost') {
                    $scope.$broadcast('httpService:getShipperIntlCostError');
                }
                else if (optType === 'shipper-country') {
                    $scope.$broadcast('httpService:getShipperCountriesError');
                }
                else if (optType === 'shipper-provinces'){
                  $scope.$broadcast('httpService:getShipperProvincesError');
                }
                else if (optType === 'shipper-city'){
                  $scope.$broadcast('httpService:getShipperCityError');
                }
                else if (optType === 'shipper-suburbs'){
                  $scope.$broadcast('httpService:getShipperSuburbsError');
                }
                else if (optType === 'shipper-area'){
                  $scope.$broadcast('httpService:getShipperAreaError');
                }
                else if (optType === 'rajaongkir-city') {
                    $scope.$broadcast('httpService:getRajaOngkirCityError');
                }
                else if (optType === 'rajaongkir-cost') {
                    $scope.$broadcast('httpService:getRajaOngkirCostError');
                }
                else if (optType === 'sicepat-province') {
                    $scope.$broadcast('httpService:getSicepatProvinceError');
                }
                else if (optType === 'sicepat-track-status') {
                    $scope.$broadcast('httpService:getSicepatTrackStatusError');
                }
                else if (optType === 'shipper-track-status'){
                  $scope.$broadcast('httpService:getShipperTrackStatusError');
                }
                else if (optType === 'gosend-track-status') {
                    $scope.$broadcast('httpService:getGoSendTrackStatusError');
                }
                else if (optType === 'request-reply'){
                    $scope.$broadcast('httpService:getRequestReplyError');
                }
                else if (optType === 'booking-transaction'){
                    $scope.$broadcast('httpService:getBookingTransactionError');
                }
                else if (optType === 'cst-delivery-rates') {
                  $scope.$broadcast('httpService:getAvailableDeliveryRatesError');
                }
                else if (optType === 'edit-comment') {
                    $scope.$broadcast('httpService:getEditCommentError');
                }
                else if (optType === 'reservation') {
                    $scope.$broadcast('httpService:getReservationListError');
                }
                else if (optType === 'attend-reservation') {
                    $scope.$broadcast('httpService:getAttendReservationError');
                }
                else if (optType === 'reservation-admin-detail') {
                    $scope.$broadcast('httpService:getReservationAdminDetailError');
                }
                else if (optType === 'pos-malaysia-type-of-zone') {
                  $scope.$broadcast('httpService:getPosMalaysiaTypeOfZoneError');
                }
                else if (optType === 'pos-malaysia-domestic') {
                  $scope.$broadcast('httpService:getPosMalaysiaDomesticError');
                }
                else {
                    $scope.$broadcast('httpService:getRequestError');
                }
            });
        return $scope;
    }

    // obj -> serialized posted data (with token inside)
    function post($scope, $http, url, obj, optType) {
        $scope.status = '';
        $scope.data = '';
        $scope.data_check_version = '';
        $scope.headers = '';
        $scope.config = '';
        $scope.showResponse = false;
        optType = typeof optType !== 'undefined' ? optType : 'content';

        $http.post(url, obj, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded, audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
                    'Accept': 'application/x.compro.v1+json'
                    //, 'Authorization': 'Bearer '+token
                }
                ,timeout: 60000
            })
            .then(function (response) {
                //success
                console.log("POST SUCCESS: " + optType);
                console.log(response);
                $scope.showResponse = true;
                $scope.data = response.data;
                $scope.status = response.status;
                $scope.headers = response.headers;
                $scope.config = response.config;
                if (optType === 'post_comment') {
                    $scope.$broadcast('httpService:postCommentSuccess');
                }
                else if (optType === 'post_edit_comment') {
                    $scope.$broadcast('httpService:postEditCommentSuccess');
                }
                else if (optType === 'post_like') {
                    $scope.$broadcast('httpService:postLikeSuccess');
                }
                else if (optType === 'submit_order') {
                    $scope.$broadcast('httpService:postSubmitOrderSuccess');
                }
                else if (optType === 'push_notif') {
                    $scope.$broadcast('httpService:postRegisterPushNotifSuccess');
                }
                else if (optType === 'register') {
                    $scope.$broadcast('httpService:postUserRegisterSuccess');
                }
                else if (optType === 'user-form') {
                    $scope.$broadcast('httpService:postUserFormSuccess');
                }
                else if (optType === 'edit-profile') {
                    $scope.$broadcast('httpService:postEditProfileSuccess');
                }
                else if (optType === 'save_transaction_receipt') {
                    $scope.$broadcast('httpService:postSaveTransactionReceiptSuccess');
                }
                else if (optType === 'update_transfer_receipt') {
                    $scope.$broadcast('httpService:postUpdateTransferReceiptSuccess');
                }
                else if (optType === 'sicepat-data-by-province') {
                    $scope.$broadcast('httpService:postSicepatDataByProvinceSuccess');
                }
                else if (optType === 'sicepat-district-by-province') {
                    $scope.$broadcast('httpService:postSicepatDistrictByProvinceSuccess');
                }
                else if (optType === 'sicepat-tariff') {
                    $scope.$broadcast('httpService:postSicepatTariffSuccess');
                }
                else if (optType === 'confirm-delivery'){
                    $scope.$broadcast('httpService:postConfirmDeliverySuccess');
                }
                else if (optType === 'transaction-url'){
                    $scope.$broadcast('httpService:postTransactionURLSuccess');
                }
                else if (optType === 'redeem-item') {
                    $scope.$broadcast('httpService:postRedeemItemSuccess');
                }
                else if (optType === 'membership-redeem-password') {
                    $scope.$broadcast('httpService:postRedeemPasswordSuccess');
                }
                else if (optType === 'membership-reload-points'){
                    $scope.$broadcast('httpService:postReloadMemberPointsSuccess');
                }
                else if (optType === 'opsigo-request-flight-v3') {
                    $scope.$broadcast('httpService:postOpsigoRequestFlightV3Success');
                }
                else if (optType === 'opsigo-reserve-flight-v3') {
                    $scope.$broadcast('httpService:postOpsigoReserveFlightV3Success');
                }
                else if (optType === 'opsigo-get-reservation-by-id-v3') {
                    $scope.$broadcast('httpService:postOpsigoGetReservationByIdV3Success');
                }
                else if (optType === 'opsigo-save-flight') {
                    $scope.$broadcast('httpService:postOpsigoSaveFlightSuccess');
                }
                else if (optType === 'opsigo-pay-transaction') {
                    $scope.$broadcast('httpService:postOpsigoPayTransactionSuccess');
                }
                else if (optType === 'custom-form-reply-approve') {
                    $scope.$broadcast('httpService:postCustomFormReplyApproveSuccess');
                }
                else if (optType === 'generate-midtrans-token'){
                    $scope.$broadcast('httpService:postGenerateMidtransTokenSuccess');
                }
                else if (optType === 'ipay88-request-payment'){
                    $scope.$broadcast('httpService:postIPay88RequestPaymentSuccess');
                }
                else if (optType === 'cst-delivery-rates') {
                    $scope.$broadcast('httpService:getAvailableDeliveryRatesSuccess');
                }
                else if (optType === 'login-loyalty') {
                    $scope.$broadcast('httpService:postLoginLoyaltySuccess');
                }
                else if (optType === 'logout-loyalty') {
                    $scope.$broadcast('httpService:postLogoutLoyaltySuccess');
                }
                else if (optType === 'check-version'){
                  $scope.data_check_version = response.data;
                  $scope.$broadcast('httpService:postCheckVersionSuccess');
                }
                else if (optType === 'gosend-balance'){
                    $scope.$broadcast('httpService:gosendBalanceSuccess');
                }
                else if (optType === 'gosend-balance-alert'){
                    console.log("Success send email balance alert");
                }
                else if (optType === 'create-reservation'){
                    $scope.$broadcast('httpService:createReservationSuccess');
                }
                else if (optType === 'wishlist-transaction-add'){
                    $scope.$broadcast('httpService:postAddWishlistTransactionSuccess');
                }
                else if (optType === 'check-voucher'){
                    $scope.$broadcast('httpService:postCheckVoucherSuccess');
                }
                else if (optType === 'check-voucher-on-delete'){
                    $scope.$broadcast('httpService:postCheckVoucherOnDeleteSuccess');
                }
                else {
                    $scope.$broadcast('httpService:postRequestSuccess');
                }
                return $scope;
                // handlePostResult($scope, response.data, optType);
            }, function (response) {
                //error
                console.log("POST ERROR: " + optType);
                console.log(response);
                $scope.showResponse = true;
                $scope.data = response.data;
                $scope.status = response.status;
                $scope.headers = response.headers;
                $scope.config = response.config;

                if (optType === 'post_comment') {
                    $scope.$broadcast('httpService:postCommentError');
                }
                else if (optType === 'post_edit_comment') {
                    $scope.$broadcast('httpService:postEditCommentError');
                }
                else if (optType === 'post_like') {
                    $scope.$broadcast('httpService:postLikeError');
                }
                else if (optType === 'submit_order') {
                    $scope.$broadcast('httpService:postSubmitOrderError');
                }
                else if (optType === 'push_notif') {
                    $scope.$broadcast('httpService:postRegisterPushNotifError');
                }
                else if (optType === 'register') {
                    $scope.$broadcast('httpService:postUserRegisterError');
                }
                else if (optType === 'user-form') {
                    $scope.$broadcast('httpService:postUserFormError');
                }
                else if (optType === 'edit-profile') {
                    $scope.$broadcast('httpService:postEditProfileError');
                }
                else if (optType === 'save_transaction_receipt') {
                    $scope.$broadcast('httpService:postSaveTransactionReceiptError');
                }
                else if (optType === 'update_transfer_receipt') {
                    $scope.$broadcast('httpService:postUpdateTransferReceiptError');
                }
                else if (optType === 'sicepat-data-by-province') {
                    $scope.$broadcast('httpService:postSicepatDataByProvinceError');
                }
                else if (optType === 'sicepat-district-by-province') {
                    $scope.$broadcast('httpService:postSicepatDistrictByProvinceError');
                }
                else if (optType === 'sicepat-tariff') {
                    $scope.$broadcast('httpService:postSicepatTariffError');
                }
                else if (optType === 'confirm-delivery'){
                    $scope.$broadcast('httpService:postConfirmDeliveryError');
                }
                else if (optType === 'transaction-url'){
                    $scope.$broadcast('httpService:postTransactionURLError');
                }
                else if (optType === 'redeem-item') {
                    $scope.$broadcast('httpService:postRedeemItemError');
                }
                else if (optType === 'membership-redeem-password') {
                    $scope.$broadcast('httpService:postRedeemPasswordError');
                }
                else if (optType === 'membership-reload-points'){
                    $scope.$broadcast('httpService:postReloadMemberPointsError');
                }
                else if (optType === 'opsigo-request-flight-v3') {
                    $scope.$broadcast('httpService:postOpsigoRequestFlightV3Error');
                }
                else if (optType === 'opsigo-reserve-flight-v3') {
                    $scope.$broadcast('httpService:postOpsigoReserveFlightV3Error');
                }
                else if (optType === 'opsigo-get-reservation-by-id-v3') {
                    $scope.$broadcast('httpService:postOpsigoGetReservationByIdV3Error');
                }
                else if (optType === 'opsigo-save-flight') {
                    $scope.$broadcast('httpService:postOpsigoSaveFlightError');
                }
                else if (optType === 'opsigo-pay-transaction') {
                    $scope.$broadcast('httpService:postOpsigoPayTransactionError');
                }
                else if (optType === 'custom-form-reply-approve') {
                    $scope.$broadcast('httpService:postCustomFormReplyApproveError');
                }
                else if (optType === 'generate-midtrans-token'){
                  $scope.$broadcast('httpService:postGenerateMidtransTokenError');
                }
                else if (optType === 'ipay88-request-payment') {
                  $scope.$broadcast('httpService:postIPay88RequestPaymentError');
                }
                else if (optType === 'cst-delivery-rates') {
                  $scope.$broadcast('httpService:getAvailableDeliveryRatesError');
                }
                else if (optType === 'login-loyalty') {
                    $scope.$broadcast('httpService:postLoginLoyaltyError');
                }
                else if (optType === 'logout-loyalty') {
                    $scope.$broadcast('httpService:postLogoutLoyaltyError');
                }
                else if (optType === 'check-version'){
                  $scope.data_check_version = response.data;
                  $scope.$broadcast('httpService:postCheckVersionError');
                }
                else if (optType === 'gosend-balance'){
                    $scope.$broadcast('httpService:gosendBalanceError');
                  }
                else if (optType === 'gosend-balance-alert'){
                    console.log("Error send email balance alert");
                }
                else if (optType === 'create-reservation'){
                    $scope.$broadcast('httpService:createReservationError');
                }
                else if (optType === 'wishlist-transaction-add'){
                    $scope.$broadcast('httpService:postAddWishlistTransactionError');
                }
                else if (optType === 'check-voucher'){
                    $scope.$broadcast('httpService:postCheckVoucherError');
                }
                else if (optType === 'check-voucher-on-delete'){
                    $scope.$broadcast('httpService:postCheckVoucherOnDeleteError');
                }
                else {
                    $scope.$broadcast('httpService:postRequestError');
                }
            });
        return $scope;
    }

    function post_token($scope, $http, url, obj, optType, next_page, term_id) {
        $scope.status = '';
        $scope.data = '';
        $scope.headers = '';
        $scope.config = '';
        $scope.showResponse = false;
        optType = typeof optType !== 'undefined' ? optType : 'content';

        next_page = typeof next_page !== 'undefined' ? next_page : '0';
        console.log("term_id :"+term_id);
        $http.post(url, obj, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/x.compro.v1+json'
                }
                ,timeout: 15000
            })
            .then(function (response) {
                //success
                console.log("POST_TOKEN SUCCESS: " + optType);
                console.log(response);
                $scope.showResponse = true;
                $scope.data = response.data;
                $scope.status = response.status;
                $scope.headers = response.headers;
                $scope.config = response.config;
                if (optType === 'menu') {
                    $scope.$broadcast('httpService:postTokenMenuSuccess');
                }
                else if (optType === 'post_comment') {
                    $scope.$broadcast('httpService:postTokenCommentSuccess');
                }
                else if (optType === 'get_comment') {
                    $scope.$broadcast('httpService:postTokenGetCommentSuccess');
                }
                else if (optType === 'post_like') {
                    $scope.$broadcast('httpService:postTokenLikeSuccess');
                }
                else if (optType === 'submit_order') {
                    $scope.$broadcast('httpService:postTokenSubmitOrderSuccess');
                }
                else if (optType === 'shipper-details') {
                    $scope.$broadcast('httpService:postTokenShipperSuccess');
                }
                else if (optType === 'shipper-country') {
                    $scope.$broadcast('httpService:postTokenShipperCountriesSuccess');
                }
                else if (optType === 'shipper-provinces'){
                  $scope.$broadcast('httpService:postTokenShipperProvinceSuccess');
                }
                else if (optType === 'shipper-city'){
                  $scope.$broadcast('httpService:postTokenShipperCitySuccess');
                }
                else if (optType === 'shipper-suburbs'){
                  $scope.$broadcast('httpService:postTokenShipperSuburbsSuccess');
                }
                else if (optType === 'push_notif') {
                    $scope.$broadcast('httpService:postTokenPushNotifSuccess');
                }
                else if (optType === 'more-data-content') {
                    $scope.$broadcast('httpService:postTokenGetMoreDataSuccess');
                }
                else if (optType === 'user-form') {
                    $scope.$broadcast('httpService:postTokenUserFormSuccess');
                }
                else if (optType === 'edit-profile') {
                    $scope.$broadcast('httpService:postTokenEditProfileSuccess');
                }
                else if (optType === 'company-options') {
                    $scope.$broadcast('httpService:postTokenCompanyOptionsSuccess');
                }
                else if (optType === 'carousel-content') {
                    $scope.$broadcast('httpService:postTokenCarouselContentSuccess');
                }

                else if (optType === 'high-res-data-content') {
                    $scope.$broadcast('httpService:postTokenGetHighResDataSuccess',{ page: next_page});
                }
                else if (optType === 'home-post-content') {
                    $scope.$broadcast('httpService:postTokenGetHomePostSuccess',{ term_id: term_id,page: next_page});
                }
                else if (optType === 'booking-cancel') {
                    $scope.$broadcast('httpService:postTokenBookingCancelSuccess');
                }
                else if (optType === 'confirm-delivery'){
                    $scope.$broadcast('httpService:postTokenConfirmDeliverySuccess');
                }
                else if (optType === 'transaction-url') {
                  $scope.$broadcast('httpService:postTokenTransactionURLSuccess');
                }
                else if (optType === 'request-reply') {
                  $scope.$broadcast('httpService:postTokenRequestReplySuccess');
                }
                else if (optType === 'redeem-item'){
                    $scope.$broadcast('httpService:postTokenRedeemItemSuccess');
                }
                else if (optType === 'membership-redeem-password'){
                    $scope.$broadcast('httpService:postTokenRedeemPasswordSuccess');
                }
                else if (optType === 'membership-reload-points'){
                    $scope.$broadcast('httpService:postTokenReloadMemberPointsSuccess');
                }
                else if (optType === 'custom-form-reply-approve'){
                  $scope.$broadcast('httpService:postTokenCustomFormReplyApproveSuccess');
                }
                else if (optType === 'generate-midtrans-token'){
                  $scope.$broadcast('httpService:postTokenGenerateMidtransTokenSuccess');
                }
                else if (optType === 'check-voucher-on-delete'){
                    $scope.$broadcast('httpService:postTokenCheckVoucherOnDeleteSuccess');
                }
                else {
                    $scope.$broadcast('httpService:postTokenSuccess');
                }
            }, function (response) {
                //error
                console.log('POST_TOKEN ERROR: ' + optType);
                console.log(response);
                $scope.showResponse = true;
                $scope.data = response.data;
                $scope.status = response.status;
                $scope.headers = response.headers;
                $scope.config = response.config;
                if (optType === 'menu') {
                    $scope.$broadcast('httpService:postTokenMenuError');
                }
                else if (optType === 'post_comment') {
                    $scope.$broadcast('httpService:postTokenCommentError');
                }
                else if (optType === 'get_comment') {
                    $scope.$broadcast('httpService:postTokenGetCommentError');
                }
                else if (optType === 'post_like') {
                    $scope.$broadcast('httpService:postTokenLikeError');
                }
                else if (optType === 'submit_order') {
                    $scope.$broadcast('httpService:postTokenSubmitOrderError');
                }
                else if (optType === 'push_notif') {
                    $scope.$broadcast('httpService:postTokenPushNotifError');
                }
                else if (optType === 'more-data-content') {
                    $scope.$broadcast('httpService:postTokenGetMoreDataError');
                }
                else if (optType === 'user-form') {
                    $scope.$broadcast('httpService:postTokenUserFormError');
                }
                else if (optType === 'edit-profile') {
                    $scope.$broadcast('httpService:postTokenEditProfileError');
                }
                else if (optType === 'company-options') {
                    $scope.$broadcast('httpService:postTokenCompanyOptionsError');
                }
                else if (optType === 'shipper-provinces'){
                  $scope.$broadcast('httpService:postTokenShipperProvinceError');
                }
                else if (optType === 'shipper-city'){
                  $scope.$broadcast('httpService:postTokenShipperCityError');
                }
                else if (optType === 'shipper-suburbs'){
                  $scope.$broadcast('httpService:postTokenShipperSuburbsError');
                }
                else if (optType === 'carousel-content') {
                    $scope.$broadcast('httpService:postTokenCarouselContentError');
                }
                else if (optType === 'high-res-data-content') {
                    $scope.$broadcast('httpService:postTokenGetHighResDataError',{ page: next_page});
                }
                else if (optType === 'home-post-content') {
                    $scope.$broadcast('httpService:postTokenGetHomePostError',{  term_id: term_id, page: next_page});
                }
                else if (optType === 'booking-cancel') {
                    $scope.$broadcast('httpService:postTokenBookingCancelError');
                }
                else if (optType === 'confirm-delivery'){
                    $scope.$broadcast('httpService:postTokenConfirmDeliveryError');
                }
                else if (optType === 'transaction-url') {
                  $scope.$broadcast('httpService:postTokenTransactionURLError');
                }
                else if (optType === 'request-reply') {
                  $scope.$broadcast('httpService:postTokenRequestReplyError');
                }
                else if (optType === 'redeem-item'){
                    $scope.$broadcast('httpService:postTokenRedeemItemError');
                }
                else if (optType === 'membership-redeem-password'){
                    $scope.$broadcast('httpService:postTokenRedeemPasswordError');
                }
                else if (optType === 'membership-reload-points'){
                    $scope.$broadcast('httpService:postTokenReloadMemberPointsError');
                }
                else if (optType === 'custom-form-reply-approve'){
                  $scope.$broadcast('httpService:postTokenCustomFormReplyApproveError');
                }
                else if (optType === 'generate-midtrans-token'){
                  $scope.$broadcast('httpService:postTokenGenerateMidtransTokenError');
                }
                else if (optType === 'check-voucher-on-delete'){
                    $scope.$broadcast('httpService:postTokenCheckVoucherOnDeleteError');
                }
                else {
                    $scope.$broadcast('httpService:postTokenError');
                }
            });
        return $scope;
    }

    function post_version($scope, $http, url, obj, optType) {
        $scope.version_status = '';
        $scope.version_data = '';
        $scope.version_headers = '';
        $scope.version_config = '';
        $scope.version_showResponse = false;
        optType = typeof optType !== 'undefined' ? optType : 'content';

        $http.post(url, obj, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded, audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
                    'Accept': 'application/x.compro.v1+json'
                    //, 'Authorization': 'Bearer '+token
                }
                ,timeout: 60000
            })
            .then(function (response) {
                //success
                console.log("POST SUCCESS: " + optType);
                console.log(response);
                $scope.version_showResponse = true;
                $scope.version_data = response.data;
                $scope.version_status = response.status;
                $scope.version_headers = response.headers;
                $scope.version_config = response.config;

                if (optType === 'check-version'){
                  $scope.version_data = response.data;
                  $scope.$broadcast('httpService:postCheckVersionSuccess');
                }
                else {
                    $scope.$broadcast('httpService:postRequestSuccess');
                }
                return $scope;
                // handlePostResult($scope, response.data, optType);
            }, function (response) {
                //error
                console.log("POST ERROR: " + optType);
                console.log(response);
                $scope.version_showResponse = true;
                $scope.version_data = response.data;
                $scope.version_status = response.status;
                $scope.version_headers = response.headers;
                $scope.version_config = response.config;

                if (optType === 'check-version'){
                  $scope.data_check_version = response.data;
                  $scope.$broadcast('httpService:postCheckVersionError');
                }
                else {
                    $scope.$broadcast('httpService:postRequestError');
                }
            });
        return $scope;
    }

//    function get_raja_ongkir($scope, $http, url, optType) {
//        $scope.status = '';
//        $scope.data = '';
//        $scope.headers = '';
//        $scope.config = '';
//        $scope.showResponse = false;
//
//        var get_url = url+"/"+optType;
//
//        console.log('url baru: ' + get_url);
//
//        $http.get(get_url, {
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded',
//                    'key': '5bb065400ccefa381031ba7a2840160e'
//                    //, 'Authorization': 'Bearer '+token
//                },
//                timeout: 60000
//            })
//            .then(function (response) {
//                //success
//                console.log("GET SUCCESS: " + optType);
//                console.log(response);
//                $scope.showResponse = true;
//                if(optType !== 'high-res-data-content')
//                {
//                    $scope.data = response.data;
//                }
//
//                $scope.status = response.status;
//                $scope.headers = response.headers;
//                $scope.config = response.config;
//
//                $scope.$broadcast('httpService:getRequestRajaOngkirSuccess');
//
//            }, function (response) {
//                //error
//                console.log("GET ERROR: " + optType);
//                console.log(response);
//                $scope.showResponse = true;
//                $scope.data = response.data;
//                $scope.status = response.status;
//                $scope.headers = response.headers;
//                $scope.config = response.config;
//
//                $scope.$broadcast('httpService:getRequestRajaOngkirError');
//            });
//        return $scope;
//    }
//
    return {get: get, post: post, post_version: post_version, post_token: post_token};
});

