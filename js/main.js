var App = {};
var PRECISION = 1;

$(document).on('pageinit', '#top', function() {
    $.ajax({
        url: 'csvData/dummyData.csv', //ファイルの場所を指定
        type: 'get',
        dataType: 'text', //読み込む形式を指定
        // header: false, //ヘッダーの扱い
    })
    .success(function(data) {
        //csvを配列に入れる
        var csv = $.csv.toArrays(data); // ← 使ってないよね…？
        console.log(csv[0][0]);
        /* 編集ここから(施設をランダム文字列にしている) */
        //csvを改行コード区切りのデータにする
        var lines = data.split(/\r\n|\r|\n/);
        //1からデータ数までの乱数を発生させる
        var random = (Math.floor(Math.random() * lines.length) + 1);
        //選ばれたデータをfactorに入れる
        var factor = lines[random];
        // console.log(factor);
        //factorに入っているデータをカンマで区切る
        var view = factor.split(",");

        //施設名ひらがなをぐちゃぐちゃに表示する
        //施設名ひらがなをsourceに入れる
        var source = view[3];
        //一文字ごとに区切る
        var gucha = source.split('');
        //適当な順番にソートする
        gucha.sort(
            function() {
                return Math.random() * 100 - Math.random() * 100;
            });
        //ソートされた文字を違う変数に仮置き
        var karioki = gucha;
        //一文字区切りのデータを結合する
        App.randomString = karioki.join("・");
        /* 編集ここまで */

        App.goalLong = view[0]; // 経度
        App.goalLat = view[1]; // 緯度
        App.geoLocation = new GeoLocation();

        console.log('Loaded Top Page');
        console.log(lines[random]); //発生した乱数の行を読み込む
    });

});

$(document).on('pageinit', '#main', function() {
    $('#random').append(App.randomString); //ランダムの文字列を入れている
    console.log(App.randomString);

    App.geoLocation.watchCurrentPosition(function(pos) {
        var currentLat = pos.coords.latitude;
        var currentLong = pos.coords.longitude;

        App.distance = App.geoLocation.getGeoDistance(App.goalLat, App.goalLong, currentLat, currentLong, PRECISION);
        $('#kyori').append(App.distance);
        console.log(App.distance + "km"); // 距離(km)

        App.direction = App.geoLocation.getGeoDirection(App.goalLat, App.goalLong, currentLat, currentLong);
        $('#hougaku').append(App.direction);
        console.log(App.direction); // 方位(e.g., 北, 南)

        // if(App.direction="北"){
        //   $('#abc').append("ほうがくううううううう");
        //   App.gazou="imgs/up_center.png";
        // }else if(App.direction="南"){
        //   $('#abc').append("ほうがく");
        //   App.gazou="imgs/low_center.png";
        // }else if(App.direction="西"){
        //   $('#abc').append("ほうがくう2344う");
        //   App.gazou="imgs/center_left.png";
        // }else if(App.direction="東"){
        //   $('#abc').append("ほうがくうう7ye4iurtcins");
        //   App.gazou="imgs/center_right.png";
        // }else if(App.direction="北東"){
        //   $('#abc').append("ほうがwwaaefawef");
        // }else if(App.direction="北西"){
        //   $('#abc').append("ほうがくljlkjl");
        // }else if(App.direction="南東"){
        //   App.gazou="imgs/up_center.png";
        // }else(App.direction="南西"){
        //   App.gazou="imgs/up_center.png";
        // }
    });
    //ヒントの表示プログラム
    $(".distance").on('click', function() {
        App.distance = App.distance - 0.5
    })
    $(".hintbutton").on('click', function() {

        var hinttxt = {//ヒントのレベル別オブジェクトを作成
            'hint1':'ヒント1',
            'hint2':'ヒント2',
            'hint3':'ヒント3'
        };

        for(var key in hinttxt){
            if(key == $(this).attr("name")) {
                $('#comment').html('<p>いま' + hinttxt[key] + 'が表示されています</p>');
            }
        if(App.distance < 1){
            $('#hint2').html('<a href="#hint" class="hintbutton" name="hint2">
                <p>ヒント2</p>')
            }
        if(App.distance < 0.5){
            $('#hint3').html('<a href="#hint" class="hintbutton" name="hint3">
                <p>ヒント3</p>')
            }
        }
    }
    });

    console.log('Loaded Main Page');
});


$(document).on('pageshow', '#main', function() {

    console.log('Loaded Main Page');
});

$(document).on('pageinit', '#goal', function() {

    console.log('Loaded Goal Page');
});

