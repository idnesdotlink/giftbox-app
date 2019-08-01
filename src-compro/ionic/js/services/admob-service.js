app.factory('adMobService', function () { // angular $http service
    
    // Configuration object holding keys
    // TODO: Change admobid banner_key to SQ1 key instead of DW
    var adMobId = {};
    if (isAndroid()) {
        admobid = {// for Android
            banner_key: 'ca-app-pub-3460267881749835/3476549706',
            interstitial_key: ''
        };
    } else if (isIOS()) {
        admobid = {// for iOS
            banner_key: 'ca-app-pub-3460267881749835/3476549706',
            interstitial_key: ''
        };
    } else {
        admobid = {// for Windows Phone
            banner_key: 'ca-app-pub-3460267881749835/3476549706',
            interstitial_key: ''
        };
    }

    var initBannerAd = function () {

        try {

            console.log('Init Banner Ad');

            AdMob.createBanner({
                adId: adMobId.banner_key,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                isTesting: false,
                autoShow: false
            });

        } catch (e) {
            alert(e);
        }
    };

    var initInterstitialAd = function () {

        try {

            console.log('Init Interstitial Ad');

            AdMob.prepareInterstitial({
                adId: adMobId.interstitial_key,
                isTesting: false,
                autoShow: false
            });

        } catch (e) {
            alert(e);
        }
    };
    
    var showBannerAd = function () {

        try {

            console.log('Show Banner Ad');

            AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);

        } catch (e) {
            alert(e);
        }
    };
    
    var showInterstitialAd = function () {

        try {

            console.log('Show Interstitial Ad');

            AdMob.showInterstitial();

        } catch (e) {
            alert(e);
        }
    };

    return {
        showBannerAd: showBannerAd, 
        initBannerAd: initBannerAd, 
        showInterstitialAd: showInterstitialAd, 
        initInterstitialAd: initInterstitialAd
    };
});