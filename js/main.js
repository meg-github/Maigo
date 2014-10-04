var App = {};
var PRECISION = 1;

$(document).on('pageinit', '#top', function() {

});

$(document).on('pageshow', '#top', function() {
    $.ajax({
            url: 'csvData/dummyData.csv', //ファイルの場所を指定
            type: 'get',
            dataType: 'text', //読み込む形式を指定
            // header: false, //ヘッダーの扱い
        })
        .success(function(data) {
            var currentLat = 34.701909;
            var currentLong = 135.494977;

            App.csv = $.csv.toArrays(data);
            App.homeNum = (Math.floor(Math.random() * (App.csv.length - 1)) + 1);
            App.geoLocation = new GeoLocation();
            App.distance = Math.floor(App.geoLocation.getGeoDistance(App.csv[App.homeNum][1], App.csv[App.homeNum][0], currentLat, currentLong, PRECISION));
            console.log(App.distance);

            $('#kyori').empty();
            $('#kyori').append(App.distance);
            $('#hint2').empty();
            $('#hint3').empty();

            console.log('Loaded Top Page');
        });
    console.log('Initialize Top Page');
});

$(document).on('pageinit', '#main', function() {

    console.log('Loaded Main Page');
});


$(document).on('pageshow', '#main', function() {
    $('#distance').off('click');
    $('.hintbutton').off('click');

    //ヒントの表示プログラム
    $("#distance").on('click', function() {
        console.log('click');
        $('#kyori').empty();
        App.distance = App.distance - 0.5; //500mずつ近づく
        $('#kyori').append(App.distance); //距離の表示

        if (App.distance <= 2) {
            $('#hint2').html('<a href="#hint" class="hintbutton" name="hint2">ヒント2</a>');
        }
        if (App.distance <= 1) {
            $('#hint3').html('<a href="#hint" class="hintbutton" name="hint3">ヒント3</a>');
        }

        if (App.distance <= 0.5) {
            window.location.href = '#jump';
        }
    });

    $(document).on('click', ".hintbutton", function() {

        var hinttxt = { //ヒントのレベル別オブジェクトを作成
            'hint1': App.csv[App.homeNum][5],
            'hint2': App.csv[App.homeNum][6],
            'hint3': App.csv[App.homeNum][7]
        };

        for (var key in hinttxt) {
            if (key == $(this).attr("name")) {
                $('#comment').html('<p>' + hinttxt[key] + '</p>');
            }
        }
    });

    console.log('Loaded Main Page');
});

$(document).on('pageinit', '#jump', function() {

    $(document).on('click', "#jump", function() {
        window.location.href = '#goal';
    });
});

$(document).on('pageinit', '#goal', function() {

    console.log('Loaded Goal Page');
});