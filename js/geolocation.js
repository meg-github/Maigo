function GeoLocation() {

}

GeoLocation.prototype.watchCurrentPosition = function(success) {
    if (navigator.geolocation) {
        this.watchID = navigator.geolocation.watchPosition(success, null, {
            enableHighAccuracy: true
        });
    } else {
        window.alert("本ブラウザではGeolocationが使えません");
    }
};

GeoLocation.prototype.clearWatchPosition = function() {
    navigator.geolocation.clearWatch(this.watchID);
};

GeoLocation.prototype.getGeoDistance = function(lat1, lng1, lat2, lng2, precision) {
    var distance = 0;
    if ((Math.abs(lat1 - lat2) < 0.00001) && (Math.abs(lng1 - lng2) < 0.00001)) {
        distance = 0;
    } else {
        lat1 = lat1 * Math.PI / 180;
        lng1 = lng1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        lng2 = lng2 * Math.PI / 180;

        var A = 6378140;
        var B = 6356755;
        var F = (A - B) / A;

        var P1 = Math.atan((B / A) * Math.tan(lat1));
        var P2 = Math.atan((B / A) * Math.tan(lat2));

        var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
        var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));

        distance = A * (X + L);
        var decimal_no = Math.pow(10, precision);
        distance = Math.round(decimal_no * distance / 1000) / decimal_no; // kmに変換するときは(1000で割る)
    }
    return distance;
};

GeoLocation.prototype.getGeoDirection = function(lat1, lng1, lat2, lng2) {
    // 緯度経度 lat1, lng1 の点を出発として、緯度経度 lat2, lng2 への方位
    // 北を０度で右回りの角度０～３６０度
    var Y = Math.cos(lng2 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    var X = Math.cos(lng1 * Math.PI / 180) * Math.sin(lng2 * Math.PI / 180) - Math.sin(lng1 * Math.PI / 180) * Math.cos(lng2 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
    if (dirE0 < 0) {
        dirE0 = dirE0 + 360; //0～360 にする。
    }
    var dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向

    var directNum = dirN0 / 45;
    var direct = "";
    var directArray = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
    for (var i = 0; i < directArray.length; i++) {
        var from = (7.5 + i) % 8;
        var to = (0.5 + i) % 8;
        if (directNum > from && directNum < to) {
            direct = directArray[i];
        }
    }
    return direct;
};