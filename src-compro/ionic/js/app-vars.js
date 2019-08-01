var app = angular.module('starter.controllers', ['ionic-audio', 'ngCordova', 'ngRoute', 'ngSanitize']);

// URLs
var app_type = 'affiliate'; // app, studio
var token = '';
var api_url = app_environment=='local'?'http://api.compro.test':app_environment=='staging'?'https://dev-api.compro.co.id':'https://api.compro.id';
var base_url = api_url + '/v1/';
var token_url = base_url + 'generate-token';
var midtrans_js_url = 'https://app.sandbox.midtrans.com/snap/snap.js';

var post_content_url = base_url + 'posts/';
var post_compressed_content_url = base_url + 'posts-compressed/';
var term_content_url = base_url + 'terms/';
var term_compressed_content_url = base_url + 'terms-compressed/';

var post_content_url_no_token = base_url + 'posts-no-token/';
var post_compressed_content_url_no_token = base_url + 'posts-compressed-no-token/';
var term_content_url_no_token = base_url + 'terms-no-token/';
var term_compressed_content_url_no_token = base_url + 'terms-compressed-no-token/';

var notification_list_content_url = base_url + 'notification/';

var term_resources_base_url = api_url + '/59a03112791d907c6cda46740ae62d04/terms/';
var post_resources_base_url = api_url + '/59a03112791d907c6cda46740ae62d04/posts/';
var post_files_base_url = api_url + '/59a03112791d907c6cda46740ae62d04/posts/';

var menu_url = base_url + 'company/' + company_id;
var options_url = base_url+ 'company/'+company_id+'/options';
var login_url = base_url + 'company-user-login';
var login_loyalty_url = base_url + 'loyalty/get-data-member';
var logout_loyalty_url = base_url + 'loyalty/disconnect';
var logout_url = base_url + 'company-user-logout';
var register_url = base_url + 'company-user-register';
var change_password_url = base_url + 'company-user-change-password';
var reset_password_url = base_url + 'company-user-forgot-password';
var user_form_url = base_url + 'user-post';
var top_up_purchase_url = base_url + 'company-user-top-up-purchase';
var save_transaction_receipt_url = base_url + 'company-user-save-transaction-receipt';

var search_url = base_url + 'companies/search';
var comments_url = base_url + 'comments';
var comments_guest_url = base_url + 'comments-guest';
var comment_list_url = base_url + 'get-post-comments/';
var edit_comment_url = base_url + 'comment/';
var likes_url = base_url + 'likes';
var send_email_url = base_url + 'companies/' + company_id + '/send-email';
var register_push_notif_url = 'register-device';   // return {success:'true/false', device:{registration_id:'<registration_id>',company_id:'<company_id>',device_id:'<device_id>'}}
var profile_url = base_url + 'company-user-profile';
var company_options_url = base_url + "companies/" + company_id + "/options";
var company_user_device_url = base_url + "get-company-user-device-id";
var company_user_expiration_url = base_url + "get-company-user-expiration";
var user_transaction_list = base_url + "transaction-list/";
var user_transaction_detail = base_url + "transaction-detail/";
var user_opsigo_transaction_list = base_url + "opsigo/transaction/";
var user_opsigo_transaction_detail = base_url + "opsigo/transactionDetail/";
var user_wishlist_transaction = base_url + "wishlist-transaction/";
var user_wishlist_transaction_detail = base_url + "wishlist-transaction-detail/";
var transaction_url = base_url + "transaction-url";
var opsigo_transaction_url = base_url + "opsigo-transaction-url";
var user_booking_history = base_url + "booking-history/";
var update_transfer_receipt = base_url + "update-transaction/" ;
var user_cancel_booking = base_url + "cancel-booking/";
var user_approve_transaction = base_url + "user-approve-transaction";
var check_version_url = base_url + 'company-check-version';
var user_reservation_list =  base_url + "get-all-reservation/";
var user_reservation_detail = base_url + 'reservation-detail/';
var user_create_reservation = base_url + "create-reservation/";
var user_reservation_admin_list = base_url + "get-all-reservation-company/";
var user_attend_reservation = base_url + "attend-reservation/";
var admin_reservation_list = base_url + "get-admin-reservation-list/";
var admin_reservation_detail = base_url + "get-admin-reservation-detail/";

var raja_ongkir_province = base_url + 'raja-ongkir-province/';
var raja_ongkir_city = base_url + 'raja-ongkir-city/';
var raja_ongkir_cost = base_url + 'raja-ongkir-cost/';

var url_shipper_provinces = base_url + 'get-shipper-provinces';
var url_shipper_city = base_url + 'get-shipper-city/';
var url_shipper_area = base_url + 'get-shipper-area/';
var url_shipper_suburbs = base_url + 'get-shipper-suburbs/';
var url_shipper_details = base_url + 'get-shipper-details/';
var url_shipper_countries = base_url + 'get-shipper-countries';
var url_shipper_cost = base_url + 'get-shipper-domestic-rate/';
var url_shipper_intl_cost = base_url + 'get-shipper-intl-rate/';
var url_shipper_get_tracking = base_url + 'get_shipper_tracking/';

var url_delivery_available_rates = base_url + 'cst-expedition/get-available-rates';
var url_gosend_estimate_price = base_url + 'gosend/estimate-price/';

var sicepat_province = base_url + 'get-sicepat-provinces';
var sicepat_data_by_province = base_url + 'get-sicepat-data-by-province/';
var sicepat_tariff = base_url + 'get-sicepat-tariff';
var sicepat_track_waybill = base_url + 'track-sicepat-waybill/';
var sicepat_waybillNumber = base_url + 'get-sicepat-waybillNumber/';
var gosend_tracking = base_url + 'gosend/get-tracking/';
var check_gosend_balance_url = base_url + 'gosend/check-balance';
var email_gosend_balance_url = base_url + 'gosend/send-email-gosend-balance';

var pos_malaysia_zone = base_url  + 'pos-malaysia/get-type-of-zone';
var pos_malaysia_domestic = base_url  + 'pos-malaysia/get-pos-laju-domestic/';
var pos_malaysia_track_connote = base_url  + 'pos-malaysia/track-connote/';

var event_calendar_url = base_url + 'get-calendar/';

var wishlist_transaction_url = base_url + 'wishlist-transaction-add';

// Membership API URL
var url_membership_products = base_url + 'membership-products/';
var url_membership_product_detail = base_url + 'membership-product-detail/';
var url_membership_redeem_item = base_url + 'membership-redeem-item/';
var url_membership_redeem_password = base_url + 'membership-redeem-password/';
var url_membership_member_items = base_url + 'membership-member-items/';
var url_membership_member_item_detail = base_url + 'membership-member-item-detail/';
var url_membership_history = base_url + 'membership-history/';
var url_membership_history_detail = base_url + 'membership-history-detail/';
var url_membership_reload_points = base_url + 'membership-reload-points/';

// Opsigo URL
var opsigo_get_airports_by_country_codes = base_url + 'opsigo/getAirportsByCountryCodes';
var opsigo_request_flight_v3 = base_url + 'opsigo/requestFlightv3';
var opsigo_reserve_flight_v3 = base_url + 'opsigo/reserveFlightv3';
var opsigo_get_reservation_by_id = base_url + 'opsigo/getReservationByIdv3';
var opsigo_save_flight = base_url + 'opsigo/saveFlight/';
var opsigo_transaction_list = base_url + 'opsigo/transaction/';
var opsigo_transaction_detail = base_url + 'opsigo/transactionDetail/';
var opsigo_pay_transaction = base_url + 'opsigo/payTransaction';
var opsigo_e_ticket = base_url + 'opsigo/view-e-ticket/';
var opsigo_update_transfer_receipt = base_url + "opsigo-update-transaction/" ;

// Midtrans API URL
var url_midtrans_generate_token = base_url + 'generate-token-midtrans';
var url_midtrans_generate_token_opsigo = base_url + 'generate-token-midtrans-opsigo';

// iPay88 API URL
var url_ipay88_request_payment = base_url + 'ipay88-request-payment';

// Multi-language URL
var url_language = base_url + 'get-language-list';

// Studio API url
var studio_login_url = base_url + 'studio-login';
var studio_app_list_url = base_url + 'studio-app-list';
var studio_app_url = base_url + 'studio-app';
var studio_app_published_url = base_url + 'studio-app-published';


// Support API url
var support_login_url = base_url + 'support-affiliate-login';

// Voucher
var url_check_voucher_code = base_url + 'voucher/check';

// User Variables
var user_table = 'users_001';
var username_login = '';
var user_id = '';
var is_expired = true;
var address = '';
var phone = '';
var email = '';
var isLoggedIn = false;
var isRefreshLanguage = false;

// Studio User Variables
var st_user_table = 'st_users_001';
var st_username_login = '';
var st_user_id = '';
var st_email = '';
var st_app_id = '';
var st_is_expired = true;
var st_login_menu = 'Member';
var st_sqlitedb = 'compro.comprostudio.db';
var st_menu_template = 'studio/studio-menu.html';
var st_app_package = 'id.compro.comprostudio';
var st_db = '';
var st_preview_app = true;

// VARIABLES
var language = 'english';
var default_menu_titles = false;
var custom_feedback_message = false;
var manual_payment_method_list = false;
var how_to_contribute_instruction = false;

var manual_payment_instruction = "";
var custom_tax_fields  = false;
var shopping_tnc = "";
var main_menu = '';
var db = '';
var map = null;
var currency = 'Rp ';
var shoppingCharts = new Array();
var stock_status_visible = false;
var login_menu = 'Login';
var updated_time = '';
var canAttendEvent = true;
var isLoginEnabled = false;
var login_mode = 'email';
var isDeviceLogin = false;
var shopping_enabled = false;
var pickup_enabled = false;
var no_delivery_enabled = true;
var tax_enabled = false;
var booking_enabled = false;
var curr_device_id = '';
var home_share_apps = false;
var home_category_text = true;
var showNotificationListMenu = true;
var loadCompressedImages = true;
var game001Enabled = false;
var doregisterHardBack = null;
var rajaongkir_enabled = 'NO';
var sicepat_enabled = 'NO';
var go_send_enabled = 'NO';
var shipper_enabled = 'NO';
var shipper_intl_enabled = 'NO';
var custom_delivery_enabled = 'NO';
var pos_malaysia_enabled = 'NO';
var member_card_enabled = 'NO';
var rajaongkir_sender_city_id = '152';
var sicepat_origin = 'CGK';
var shipper_origin = '4773';
var shipper_intl_origin = '228';
var rajaongkir_selected_services = '';
var shipper_selected_services = '';
var shipper_intl_selected_services = '';
var limit_per_customer_enabled = 'NO';
var register_enabled = 'YES';
var form_request_history = 'NO';
var verify_user_register_enabled = false;
var admin_login = 'NO';
var reservation_admin = [];
var reservation_enabled = 'NO';

//ui_texts
var ui_texts_products = false;
var ui_texts_events = false;
var ui_texts_bookings = false;
var ui_texts_careers = false;
var ui_texts_audios = false;
var ui_texts_custom_forms = false;
var ui_texts_files = false;
var ui_texts_webviews = false;
var ui_texts_contacts = false;
var ui_texts_contact_forms = false;
var ui_texts_transactions = false;
var ui_texts_manual_payments = false;
var ui_texts_shopping_cart = false;
var ui_texts_register = false;
var ui_texts_login = false;
var ui_texts_general = false;
var ui_texts_membership_menu = false;
var ui_texts_membership_products = false;
var ui_texts_membership_member_items = false;
var ui_texts_membership_history = false;
var ui_texts_custom_form_reply_history = false;
var ui_texts_settings = false;
var ui_texts_inapp_purchase = false;
var ui_texts_profile = false;
var ui_texts_reset_password = false;
var ui_texts_upload_image = false;
var ui_texts_language = false;

// Audio Variables
var audioTrackData = '';
var audioDetailData = '';
var audioListTemplateName = '';
var audioListTermId = '';
var audioFileLocation = '';
var audioDownloadEnabled = false;

// Custom Form Reply Variables
var url_request_for_reply = base_url + "request-for-reply/";
var url_custom_form_reply_history = base_url + "get-custom-form-reply-history/";
var url_custom_form_reply_history_detail = base_url + "get-custom-form-reply-history-detail/";
var url_custom_form_reply_approve = base_url + "approve-reply/";

// Push Notification Variables
var sender_id = "731865515138";
var registration_id = '';// di-generate setelah request OK dari GCM
var device_id = '';      // di-generate sesuai device (automatic)
var flagPushLocalNotif = false;
// flag untuk entry point apabila masuk app dari push notif
var urlPushLocalNotif = '';

// Publish Links
var market_playstore_link = 'market://details?id=id.compro.' + package_name;
var market_appstore_link = 'market://details?id=id.compro.' + package_name;
var playstore_link = 'https://play.google.com/store/apps/details?id=id.compro.' + package_name;
var appstore_link = 'https://itunes.apple.com';

var ionicLoadingTemplate = '<div style="display:flex;justify-content:center;align-items:center;">Loading.. <ion-spinner></ion-spinner></div>';
//var timeout_value = 500;

// Register Variables
var user_meta = {}; //buat nampung user_meta setelah login
var register_phone_required = 'YES';
var register_address_required = 'NO';
var register_message_required = 'NO';
var field_title_register_additional_message = "";
var custom_register_fields  = false;
var default_register_fields  = false;
var custom_transaction_fields = false;
var default_transaction_fields = false;
var custom_form_fields = false;
var member_card_fields = false;
var sku_enabled = 'NO';
var origin_gosend_lat = 0;
var origin_gosend_lng = 0;
var destination_gosend_lat = 0;
var destination_gosend_lng = 0;
var gosend_instant_description = "";
var gosend_sameday_description = "";
var gosend_instant_price = 0;
var gosend_sameday_price = 0;
var gosend_display_city = "";
var gosend_instant_active = false;
var gosend_sameday_active = false;
//default compro duta merlin
var gosend_default_lat = -6.1659947;
var gosend_default_lng = 106.81543;
var voucher = "";
var totalVoucher = 0;
var voucher_id = 0;
var voucher_price = 0;
var voucher_code = "";

var inAppPurchaseEnabled = false;

var is_membership_enabled = 'NO';

var membership_product_data_android = [];
var vt_payment_service = 'NO';
var vt_production = 'NO';
var vt_client_key = '';
var payment_type = '[{"manual":"YES","vt":"NO","sa":"NO","ij":"NO","cod":"NO"}]';
var payment_channel = '[\n\
    {"gateway_id":"sa", "key":"cc", "active":"NO", "text":"Credit Card" },\n\
    { "gateway_id":"sa", "key":"bca_va", "active": "NO", "text":"BCA Virtual Account" },\n\
    {"gateway_id":"ij", "key":"cc", "active":"NO", "text":"Credit Card" },\n\
    { "gateway_id":"ij", "key":"va", "active": "NO", "text":"Virtual Account" }\n\
]';

var maintenance_enabled = 'NO';
var opsigo_enabled = 'NO';
var opsigo_list = [];

var wishlist_enabled = 'NO';
var promocode_enabled = 'NO';

var hotline_chat_enabled = false;

// Compro Products & Member Variables
var cp_mode = "NO";
var cp_compro_member = "NO";
var cp_credit_notice_redirect_link = '#';
var cp_total_rounding = 10000;

// Opsigo Airline Booking
var flight = "";
var booking_price = 0;
var origin = "";
var destination = "";
var origin_airline = "";
var origin_flight_number = "";
var destination_airline = "";
var destination_flight_number = "";
var origin_depart_date = "";
var origin_depart_time = "";
var origin_arrival_date = "";
var origin_arrival_time = "";
var destination_depart_date = "";
var destination_depart_time = "";
var destination_arrival_date = "";
var destination_arrival_time = "";
var index_search_result = -999;
var index_search_return_result = -999;

// MEMBERSHIP FEATURES
var membership_features_enabled = 'NO';
var membership_points_rule_conversion = 1;

// Loyalty Integration
var loyalty_integration_active = 'NO';
var loyalty_email = '';
var loyalty_balance = 0;
var loyalty_member_code = '';
var loyalty_member_id = '';
var loyalty_name = '';
var loyalty_phone = '';
var loyalty_domain = '';
var loyalty_merchant_code = '';
var loyalty_app_integration = '';
var loyalty_app_integration_apps_loyalty = '';
var loyalty_link_play_store = '';
var loyalty_link_app_store = '';

// CUSTOM FORM REPLY
var custom_form_reply_enabled = 'NO';

// MULTI-LANGUAGE
var multi_language = "NO";
var available_languages = false;
var key_google_maps = "";

var post_id = '';

//var productIds = [
//    'id.compro.po1toolbox.product1',
//    'id.compro.po1toolbox.product2',
//    'id.compro.po1toolbox.product3'];
// ESPAY
var espay_payment_url = api_url + '/v1/espay/payment/';
