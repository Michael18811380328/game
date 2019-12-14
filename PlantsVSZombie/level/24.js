//关卡页面10波强度最大为10
oS.Init({
		PName:[oPeashooter,oSunFlower,oCherryBomb,oWallNut,oPotatoMine,oSnowPea,oChomper,oRepeater,oPuffShroom,oSunShroom,oFumeShroom,oGraveBuster,oHypnoShroom,oScaredyShroom,oIceShroom,oDoomShroom,oLilyPad,oSquash,oThreepeater,'水草'],
		ZName:[oZombie,oZombie2,oZombie3,oDuckyTubeZombie1,oConeheadZombie,oNewspaperZombie,oBucketheadZombie,oPoleVaultingZombie,'潜水僵尸'], //本关所有的僵尸类名
		//储存本关除了僵尸和植物以外的其他图片地址，比如背景、奖杯等，常用的其他图片比如阳光、界面等都在0关缓存了
		PicArr:function(){
			var Pro=oThreepeater.prototype,PicArr=Pro.PicArr;
			return ['images/interface/background3.jpg',
				PicArr[Pro.CardGif],PicArr[Pro.NormalGif]]
		}(),
		Coord:2, //水池坐标系
		SunNum:50,
		LF:[0,1,1,2,2,1,1], //水池地形
		backgroundImage:'images/interface/background3.jpg', //本关的背景图片
		CanSelectCard:1, //是否可以选卡
		LevelName:'关卡 3-4', //关卡名
		LargeWaveFlag:{10:$('imgFlag3'),20:$('imgFlag1')}, //第几波使用哪个旗子
		UserDefinedFlagFunc:function($T){ //最后一波时从水里6-9列出来3僵尸
			oP.FlagNum==oP.FlagZombies&&oP.SetTimeoutWaterZombie(6,9,3,[oDuckyTubeZombie1])
		},
		StartGameMusic:'Kitanai Sekai.swf'
	},{
		AZ:[[oZombie,3,1],[oZombie2,1,1],[oZombie3,1,1],[oDuckyTubeZombie1,1,6,[6,7,8,10]],[oConeheadZombie,2,1],[oBucketheadZombie,1,1],['潜水僵尸',1,1],[oNewspaperZombie,1,1],[oPoleVaultingZombie,1,1]],
		FlagNum:20, //僵尸波数
		FlagToSumNum:{a1:[3,5,9,10,13,15,19],a2:[1,2,3,10,4,5,6,15]}, //代表第1-3波强度是1，4-5是2，6-9是3，其余是10
		FlagToMonitor:{9:[ShowLargeWave,0],19:[ShowFinalWave,0]},
		FlagToEnd:function(){
			NewImg('imgSF','images/Card/Plants/Threepeater.png','left:627px;top:325px',EDAll,{onclick:function(){SelectModal(0)}});
			NewImg('PointerUD','images/interface/PointerDown.gif','top:290px;left:636px',EDAll); //上下箭头图片
		}
});