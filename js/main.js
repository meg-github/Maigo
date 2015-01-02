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
            App.arriveGoals = [];

            console.log('Loaded JSON Data');
            console.log(data);
        })
        .error(function() {
            alert('問題が発生しました．アプリを再起動してください．');
        });
    $('#main li[name="hint2"]').css('visibility', 'hidden');

    console.log('Initialize Top Page');
});

$(document).on('pageshow', '#top', function() {

});

$(document).on('pageinit', '#main', function() {
    App.setGoal = function() {
        App.homeNum = Math.floor(Math.random() * App.kyoto.length);

        for (var i = 0; i < App.arriveGoals.length; i++) {
            if (App.homeNum == App.arriveGoals[i]) {
                App.homeNum = Math.floor(Math.random() * App.kyoto.length);
                i = -1;
            }
        }
        console.log(App.homeNum);

        if (typeof App.geoClient !== 'undefined') {
            App.geoClient.clearWatchPosition();
            $('#main li[name="hint2"]').css('visibility', 'hidden');

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

            /* TODO: このままでは条件を満たす度に毎回生成されるので対策を考える */
            if (distance <= 2000) {
                $('#main li[name="hint2"]').css('visibility', 'visible');
            }

            if (App.distance <= 500) {
                App.geoClient.clearWatchPosition();
                window.location.href = '#jump';
            }

            $('div[name="destinationInfo"]').find('span[name="direct"]').html(direction);
            $('div[name="destinationInfo"]').find('span[name="dist"]').html(distance);
        });
    };
    App.setGoal();

    $('#main img[name="research"], #top div[name="startButton"]').on('click', function() {
        if (App.arriveGoals.length == App.kyoto.length) {
            alert('全ての施設を回りました！おめでとうございます！');
        } else {
            App.setGoal();
        }
    });

    $(document).on('click', ".hintbutton", function() {
        var count = 1;
        var hinttxt = { //ヒントのレベル別オブジェクトを作成
            'hint1': App.kyoto[App.homeNum]['ヒント1'],
            'hint2': App.kyoto[App.homeNum]['ヒント3'],
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
        var template = '<li name="place' + App.homeNum + '">' +
            '<a href="#detailFootprint">' +
            '<img src="imgs/camera.jpg">' + // TODO: 画像パスに変える
            '<h2>' + App.kyoto[App.homeNum]['施設名'] + '</h2>' +
            '</a></li>';
        $('#footprints').find('ul').append(template);

        App.arriveGoals.push(App.homeNum);

        window.location.href = '#goal';
    });
});

$(document).on('pageinit', '#goal', function() {
    $('#titleDialog a[href="#detailFootprint"]').on('click', function() {
        var activity = new MozActivity({
            name: 'pick',
            data: {
                type: 'image/jpeg'
            }
        });

        activity.onsuccess = function() {
            console.log('SUCCESS(activity): ', this.result);
            var imgSrc = window.URL.createObjectURL(this.result.blob);
            $('#detailFootprint div[name="placeImg"]').html('<img src="' + imgSrc + '" height="120">');
        };

        activity.onerror = function() {
            console.error('ERROR(activity):', this.error);
        };
    });

    console.log('Loaded Goal Page');
});

$(document).on('pageshow', '#goal', function() {
    $(this).find('div[name="placeImg"]').html('<img src="imgs/01.jpg" width="138px" height="172">'); // TODO: App.kyotoの画像パスに変更
    $(this).find('div[name="description"]').html('<p>' + App.kyoto[App.homeNum]['説明文'] + '</p>');

    console.log('Loaded Goal Page');
});

$(document).on('pageinit', '#footprints', function() {
    // for (var i = 0; i < App.goalCount; i++) {
    //     var template = '<li name="place' + i + '">' +
    //         '<a href="#detailFootprint">' +
    //         '<img src="imgs/camera.jpg">' + // TODO: 画像パスに変える
    //         '<h2>' + App.kyoto[i]['施設名'] + '</h2>' +
    //         '</a></li>';
    //     $(this).find('ul').append(template);
    // }
    // $(this).find('ul').listview('refresh');

    $(document).on('click', '#footprints ul li', function() {
        var currentPlace = $(this).attr('name').split('place')[1] - 0;
        $('#detailFootprint div[name="placeImg"]').html('<img src="./imgs/01.jpg" alt="カメラ" height="120">'); // TODO: App.kyotoの画像パスに変更
        $('#detailFootprint div[name="description"]').html('<p>' + App.kyoto[currentPlace]['説明文'] + '</p>');
    });
});

$(document).on('pageshow', '#footprints', function() {
    $(this).find('ul').listview('refresh');
    $(this).find('span[name="rate"]').text(Math.floor(App.arriveGoals.length / App.kyoto.length * 100));
});

$(document).on('pageinit', '#detailFootprint', function() {
    $('#commentDialog a').on('click', function() {
        var comment = $('#commentDialog textarea').val();
        $('#detailFootprint div[name="comment"]').html('<p>' + comment + '</p>');
    });
});