(function() {
var Main = arc.Class.create(arc.Game, {
        shape:null,
        line:null,
        numArr:null,
        checkArr:null,
        count:0,
	hide:null,
   	hide_text:null,

    	start_time:null,
    	end_time:null,
      
        _def_x:0,
        _def_y:20,

	initialize:function()
	{
		//下地
		this.shape = new arc.display.Shape();
		this.shape.beginFill(0x333333, 1.0);
		this.shape.drawRect(this._def_x, this._def_y, 270, 270);
		this.shape.endFill();
		this.addChild(this.shape);

		this.line = new arc.display.Shape();
		this.line.beginStroke(2.0,0xffffff,1.0);

		//格子ライン
		for(x = 0; x < 5; x++) {
			this.line.moveTo(this._def_x+(this.shape.getWidth() / 5 * x), this._def_y);
			this.line.lineTo(this._def_x+(this.shape.getWidth() / 5 * x), this._def_y+this.shape.getHeight());
		}

		for(y = 0; y < 5; y++) {
			this.line.moveTo(this._def_x, this._def_y+(this.shape.getHeight() / 5 * y));
			this.line.lineTo(this._def_x+this.shape.getWidth(), this._def_y+(this.shape.getHeight() / 5 * y));
		}

		this.line.endStroke();
		this.addChild(this.line);

		//ランダム数取得
		numArr = getRandomNumArray();
		this.checkArr = new Array();

		//数字配置
		for(x = 0; x < 5; x++) {
			var tmp_tf = new Array();
			for(y = 0; y < 5; y++) {
				tf_num = new arc.display.TextField();
				tf_num.setFont("メイリオ", 20, true);
				tf_num.setColor(0xffffff);
				tf_num.setX(this._def_x+this.shape.getWidth() * x /5 + 20);
				tf_num.setY(this._def_y+this.shape.getHeight() * y / 5 + 20);

				tf_num.setText(numArr[x][y]);
				this.addChild(tf_num);
				var tmp2_tf = new Array();
				tmp2_tf['number'] = numArr[x][y];
				tmp2_tf['start_x'] = this._def_x+this.shape.getWidth() * x /5;
				tmp2_tf['start_y'] = this._def_y+this.shape.getHeight() * y /5;
				tmp2_tf['end_x'] = this._def_x+this.shape.getWidth() * (x+1) /5;
				tmp2_tf['end_y'] = this._def_y+this.shape.getHeight() * (y+1) /5;

				this.checkArr[numArr[x][y]] = tmp2_tf;
			}
		}

		//タッチする数字表示用
		this.tf = new arc.display.TextField();
		this.tf.setFont("メイリオ",28,true);
		this.tf.setColor(0x0000ff);
		this.tf.setX(10);
		this.tf.setY(300);
		this.tf.setText("Touch Number:"+(this.count+1));
		this.tf.setVisible(false);
		this.addChild(this.tf);

		//開始前のマスク
		this.hide = new arc.display.Shape();
		this.hide.beginFill(0x000000, 1.0);
		this.hide.drawRect(this._def_x, this._def_y, 270, 270);
		this.hide.endFill();
		this.addChild(this.hide);

		this.hide_text = new arc.display.TextField();
		this.hide_text.setFont("メイリオ", "40", true);
		this.hide_text.setColor(0xffff00);
		this.hide_text.setX(70);
		this.hide_text.setY(140);
		this.hide_text.setText('Start!');
		this.addChild(this.hide_text);

		//タイマー
		this.start_time = new arc.Timer();

		this.addEventListener(arc.Event.TOUCH_START, this.touchStartHandler);
		this.addEventListener(arc.Event.TOUCH_MOVE, this.touchMoveHandler);
		this.addEventListener(arc.Event.TOUCH_END, this.touchEndHandler);
	},
 
	touchStartHandler:function(event)
	{
	}, 

	touchMoveHandler:function(event)
	{
	},
 
	touchEndHandler:function(event)
	{
		//マスク表示時
		if (this.hide.getVisible() == true) {
			this.hide.setVisible(false);
			this.hide_text.setVisible(false);
			this.tf.setVisible(true);
			this.start_time.start();	//タイマースタート
		} else {
			var check_num = this.count+1;

			//タッチ場所判定
			if(this.checkArr[check_num]['start_x'] <= event.x && this.checkArr[check_num]['end_x'] >= event.x &&
			   this.checkArr[check_num]['start_y'] <= event.y && this.checkArr[check_num]['end_y'] >= event.y) {

			   //該当の数字をタッチしたら非活性のように見せる
			   mask = new arc.display.Shape();
			   mask.beginFill(0xffffff,0.7);
			   mask.drawRect(this.checkArr[check_num]['start_x'], 
					 this.checkArr[check_num]['start_y'],
					 this.checkArr[check_num]['end_x'] - this.checkArr[check_num]['start_x'],
					 this.checkArr[check_num]['end_y'] - this.checkArr[check_num]['start_y']);
			   mask.endFill();
			   this.addChild(mask);
			   this.count += 1;
		           this.tf.setX(10);
			   this.tf.setY(300);

			   //最後までタッチしたら経過秒数表示
		           if(this.count == 25) {
				   this.start_time.stop();
				   this.tf.setColor(0xff0000);
				   this.tf.setText('Finish!:'+ this.start_time.getElapsed()/1000+'sec');
			   } else {
			  	this.tf.setText("Touch Number:"+(this.count+1));
			   }
		}
	}
});
 
window.addEventListener("DOMContentLoaded", function(event) {
	var system = new arc.System(320, 480, "test");
	//system.setFullScreen();
	system.setGameClass(Main);
	system.start();
}, false);
})();

//ランダム数取得用
function getRandomNumArray() {
	arr = new Array(25);
	var ret_arr = new Array();
	for(i = 0; i < 25 ; i++) {
		arr[i] = i+1;
	}

	var i = arr.length;
	while(i){
       	    var j = Math.floor(Math.random()*i);
            var t = arr[--i];
            arr[i] = arr[j];
            arr[j] = t;
        }

	for(var i = 0; i < 5; i++) {
		var tmp_arr = new Array();
		for(var j = 0; j < 5; j++){
			tmp_arr[j] = arr[(i*5)+j];
		}
		ret_arr[i] = tmp_arr;
	}
    return ret_arr;
};

