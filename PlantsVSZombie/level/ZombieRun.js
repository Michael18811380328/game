oS.Init({
  PName: [oPeashooter, oSunFlower, oCherryBomb, oWallNut, oPotatoMine, oSnowPea, oChomper, oSplitPea, oJalapeno, oSpikeweed, oRepeater, oTallNut, oPumpkinHead, oSquash, oFlowerPot, oTorchwood, oThreepeater, oGatlingPea, oTwinSunflower, oSpikerock, oFumeShroom, oCoffeeBean, oGloomShroom, oSunShroom, oPuffShroom, oScaredyShroom, oGarlic],
  ZName: [oZombie, oZombie2, oZombie3, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie],
  PicArr: ["images/interface/background1.jpg"],
  backgroundImage: "images/interface/background1.jpg",
  CanSelectCard: 1,
  LevelName: "小游戏：僵尸快跑!(IE6-8无加速)",
  LvlClearFunc: function () {
    oSym.TimeStep = 10
  },
  LargeWaveFlag: {
    10: $("imgFlag3"),
    20: $("imgFlag1")
  },
  StartGameMusic: "Watery Graves.swf",
  StartGame: function () {
    !oS.Silence && NewMusic("Watery Graves.swf");
    SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
    oS.InitLawnMower();
    PrepareGrowPlants(function () {
      oP.Monitor({
        ar: [],
        f: function () {
          oSym.TimeStep = 2
        }
      });
      BeginCool();
      AutoProduceSun(25);
      oSym.addTask(1500, function () {
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
  FlagNum: 20,
  FlagToSumNum: {
    a1: [3, 5, 9, 10, 13, 15, 19],
    a2: [1, 3, 5, 20, 10, 15, 20, 30]
  },
  FlagToMonitor: {
    9: [ShowLargeWave, 0],
    19: [ShowFinalWave, 0]
  }
});