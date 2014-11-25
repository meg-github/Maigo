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
            App.homeNum = Math.floor(Math.random() * (App.kyoto.length - 1));
            console.log('Loaded JSON Data');
            console.log(data);
        })
        .error(function() {
            alert('問題が発生しました．やり直してください');
        });

    console.log('Initialize Top Page');
});

$(document).on('pageshow', '#top', function() {

});

$(document).on('pageinit', '#main', function() {
    function setGoal() {
        if (typeof App.geoClient !== 'undefined') {
            App.geoClient.clearWatchPosition();
            $('#main li[name="hint2"]').html('');
            $('#main li[name="hint3"]').html('');
        } else {
            App.geoClient = new GeoLocation();
        }

        App.geoClient.watchCurrentPosition(function(pos) {
            var currentLat = pos.coords.latitude;
            var currentLong = pos.coords.longitude;

            var distance = Math.floor(App.geoClient.getGeoDistance( // 距離
                App.kyoto[App.homeNum]['X'], App.kyoto[App.homeNum]['Y'],
                currentLat, currentLong, PRECISION
            ));
            var direction = App.geoClient.getGeoDirection( // 方向
                currentLat, currentLong,
                App.kyoto[App.homeNum]['X'], App.kyoto[App.homeNum]['Y']
            );

            if (distance <= 2000) {
                $('#main li[name="hint2"]').html('<a href="#hint" class="hintbutton" name="hint2"><img src="imgs/hint2.png" alt="" width="80"></a>');
            }
            if (distance <= 1000) {
                $('#main li[name="hint3"]').html('<a href="#hint" class="hintbutton" name="hint3"><img src="imgs/hint3.png" alt="" width="80"></a>');
            }

            if (App.distance <= 500) {
                window.location.href = '#jump';
            }

            $('div[name="destinationInfo"]').find('span[name="direct"]').html(direction);
            $('div[name="destinationInfo"]').find('span[name="dist"]').html(distance);
        });
    }
    setGoal();

    $('#main img[name="research"]').on('click', function() {
        App.homeNum = Math.floor(Math.random() * (App.kyoto.length - 1));
        setGoal();
        console.log(App.homeNum);
    });

    $(document).on('click', ".hintbutton", function() {
        var count = 1;
        var hinttxt = { //ヒントのレベル別オブジェクトを作成
            'hint1': App.kyoto[App.homeNum]['ヒント1'],
            'hint2': App.kyoto[App.homeNum]['ヒント2'],
            'hint3': App.kyoto[App.homeNum]['ヒント3']
        };

        for (var key in hinttxt) {
            if (key == $(this).attr("name")) {
                $('#hint p[name="hint"]').text('ヒント' + count);
                $('#hint div[name="description"]').html('<p>' + hinttxt[key] + '</p>');
            } else {
                count++;
            }
        }
    });

    console.log('Loaded Main Page');
});


$(document).on('pageshow', '#main', function() {

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