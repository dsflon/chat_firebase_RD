/*

MeganeTemplate

Version: 4.1.0
Website: http://megane-template.com/
License: Dentsu Isobar All Rights Reserved.

*/

const LaunchApp = ( option ) => {

    const IOS_SCHEME = option.ios_scheme; //iOSのURLスキーム
    const IOS_LINK = option.ios_link; //なかった場合のリンク
    const ANDROID_SCHEME = option.android_scheme; //AndroidのURLスキーム
    const ANDROID_PACKAGE = option.android_package; //なかった場合のリンク
    const ANDROID_INTENT = option.android_intent ? option.android_intent : ""; //なかった場合のリンク
    const PC_SITE = option.site_url ? option.site_url : ""; //その他・不明・PCなどの場合のリンク

    if( !IOS_SCHEME ) {
        console.error("ios_scheme is not set");
        return false;
    } else if ( !IOS_LINK ) {
        console.error("ios_link is not set");
        return false;
    } else if ( !ANDROID_SCHEME ) {
        console.error("android_scheme is not set");
        return false;
    } else if ( !ANDROID_PACKAGE ) {
        console.error("android_package is not set");
        return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // iPhone端末ならアプリを開くかApp Storeを開く。
    if (userAgent.search(/iphone|ipad|ipod/) > -1) {
        location.href = IOS_SCHEME;
        setTimeout(function() { location.href = IOS_LINK; }, 500);
    }

    // Android端末ならアプリを開くかGoogle Playを開く。
    else if (userAgent.search(/android/) > -1) {
        location = 'intent://' + ANDROID_INTENT + '#Intent;scheme=' + ANDROID_SCHEME
        + ';package=' + ANDROID_PACKAGE + ';end';
    }

    // その他・不明・PCなどの場合はサイトを開く。
    else {
        window.open().location = PC_SITE;
    }
}

export default LaunchApp;
