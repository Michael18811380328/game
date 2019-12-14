oS.Init({
  PName: [oPeashooter, oSunFlower, oCherryBomb, oWallNut, oPotatoMine, oSnowPea, oChomper, oSplitPea, oJalapeno, oSpikeweed, oRepeater, oTallNut, oPumpkinHead, oSquash, oFlowerPot, oTorchwood, oThreepeater, oGatlingPea, oTwinSunflower, oSpikerock, oFumeShroom, oCoffeeBean, oGloomShroom, oSunShroom, oPuffShroom, oScaredyShroom, oGarlic],
  ZName: [oZombie, oZombie2, oZombie3, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie],
  PicArr: ["images/interface/background1.jpg"],
  backgroundImage: "images/interface/background1.jpg",
  CanSelectCard: 1,
  LevelName: "小游戏：超乎寻常的压力!",
  LargeWaveFlag: {
    10: $("imgFlag1")
  },
  StartGameMusic: "Watery Graves.swf",
  StartGame: function () {
    !oS.Silence && NewMusic("Watery Graves.swf");
    SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
    oS.InitLawnMower();
    PrepareGrowPlants(function () {
      oP.Monitor();
      BeginCool();
      AutoProduceSun(25);
      oSym.addTask(2000, function () {
        oP.AddZombiesFlag();
        SetVisible($("dFlagMeterContent"))
      }, [])
    })
  }
}, {
  AZ: [
    [oZombie, 1, 1],
    [oZombie2, 1, 1],
    [oZombie3, 1, 1],
    [oConeheadZombie, 5, 1],
    [oPoleVaultingZombie, 4, 1],
    [oBucketheadZombie, 4, 1]
  ],
  FlagNum: 10,
  FlagToSumNum: {
    a1: [3, 4, 5, 9],
    a2: [1, 5, 8, 12, 40]
  },
  FlagToMonitor: {
    9: [ShowFinalWave, 0]
  }
});