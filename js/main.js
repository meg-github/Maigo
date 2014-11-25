var App = {};
var PRECISION = 1;

$(document).on('pageinit', '#top', function() {
    $.ajax({
            url: 'csvData/kyoto.json',
            type: 'GET',
            dataType: 'json'
        })
        .success(function(data) {
            App.kyoto = data;
            console.log('Loaded JSON Data');
        })
        .error(function() {
            alert('問題が発生しました．やり直してください');
        });

    console.log('Initialize Top Page');
});

$(document).on('pageshow', '#top', function() {

});

$(document).on('pageinit', '#main', function() {

    console.log('Loaded Main Page');
});


$(document).on('pageshow', '#main', function() {
    var currentLat = 34.701909; // TODO: 現在地取得
    var currentLong = 135.494977; // TODO: 現在地取得

    // App.homeNum = (Math.floor(Math.random() * (App.kyoto.length - 1)) + 1);
    var geoLocation = new GeoLocation();
    geoLocation.watchCurrentPosition(function(pos) {
        currentLat = pos.coords.latitude;
        currentLong = pos.coords.longitude;

        var distance = Math.floor(geoLocation.getGeoDistance( // 距離
            App.kyoto[0]['X'], App.kyoto[0]['Y'],
            currentLat, currentLong, PRECISION
        ));
        var direction = geoLocation.getGeoDirection( // 方向
            currentLat, currentLong,
            App.kyoto[0]['X'], App.kyoto[0]['Y']
        );

        $('div[name="destinationInfo"]').find('span[name="direct"]').html(direction);
        $('div[name="destinationInfo"]').find('span[name="dist"]').html(distance);
    });

    // $('#distance').off('click');
    // $('.hintbutton').off('click');

    /* TODO: クリックではなく，一定間隔で現在地を取得 */
    $("#distance").on('click', function() {
        // $('#kyori').empty();
        // App.distance = App.distance - 0.5; //500mずつ近づく
        // $('#kyori').append(App.distance); //距離の表示


        /* キロではなくメートルで */
        if (App.distance <= 2) {
            $('#hint2').html('<a href="#hint" class="hintbutton" name="hint2"><img src="imgs/hint2.png" alt="" width="80"></a>');
        }
        if (App.distance <= 1) {
            $('#hint3').html('<a href="#hint" class="hintbutton" name="hint3"><img src="imgs/hint3.png" alt="" width="80"></a>');
        }

        if (App.distance <= 0.5) {
            window.location.href = '#jump';
        }
    });

    /* TODO: 細かい修正が必要 */
    $(document).on('click', ".hintbutton", function() {
        var count = 1;
        var hinttxt = { //ヒントのレベル別オブジェクトを作成
            'hint1': App.csv[App.homeNum][5],
            'hint2': App.csv[App.homeNum][6],
            'hint3': App.csv[App.homeNum][7]
        };

        for (var key in hinttxt) {
            if (key == $(this).attr("name")) {
                $('#level').html(count);
                $('#comment').html('<p>' + hinttxt[key] + '</p>');
            } else {
                count++;
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

$(document).on('pageshow', '#goal', function() {
    $(this).find('div[name="description"]').html('<p>' + App.csv[App.homeNum][4] + '</p>');
    console.log('Loaded Goal Page');
});