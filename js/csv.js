$(function() {
//searchボタンをクリックするとresultスペースを初期化
    $('#search').on('click', function() {
        $('#result').empty();

//ajax形式でcsvを読み込む
        $.ajax({
           url: 'csvData/data-new1.csv',  //ファイルの場所を指定
           type: 'get',
            dataType:'text',  //読み込む形式を指定
            // header: false, //ヘッダーの扱い
           async: false
       })

       .success(function(data){
          //csvを配列に入れる
          var csv = $.csv.toArrays(data);
          //csvを改行コード区切りのデータにする
          var lines = data.split(/\r\n|\r|\n/);
          //1からデータ数までの乱数を発生させる
          var random = (Math.floor(Math.random()*lines.length)+1);
          //選ばれたデータをfactorに入れる
          var factor = lines[random];
          //factorに入っているデータをカンマで区切る
          var view = factor.split(",");


//施設名ひらがなをぐちゃぐちゃに表示する
          //施設名ひらがなをsourceに入れる
          var source = view[3];
          //一文字ごとに区切る
          var gucha = source.split('');
          //適当な順番にソートする
          gucha.sort(
            function(){
              return Math.random()*100 - Math.random()*100;
            });
          //ソートされた文字を違う変数に仮置き
          var karioki = gucha
          //一文字区切りのデータを結合する
          var RandomString = karioki.join(); 

//コンソールに読み込む
              console.log(lines[random]); //発生した乱数の行を読み込む
              console.log(view[0]); //X座標
              console.log(view[1]); //Y座標
              console.log(view[2]); //施設名(ふりがな)
              console.log(view[3]); //施設名ひらがな
              console.log(view[4]); //詳細情報
              console.log(RandomString);  //ランダムひらがな


            });
      });
    })