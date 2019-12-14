oS.Init({
  PName: [oSunFlower, oCherryBomb, oWallNut, oPotatoMine, oJalapeno, oTallNut, oPumpkinHead, oSquash, oFlowerPot, oTwinSunflower, oCoffeeBean, oGarlic, oHypnoShroom, oIceShroom],
  ZName: [oZombie, oZombie2, oZombie3, oConeheadZombie, oBucketheadZombie],
  PicArr: ["images/interface/background1.jpg"],
  backgroundImage: "images/interface/background1.jpg",
  CanSelectCard: 1,
  LevelName: "小游戏：一次性消费",
  LargeWaveFlag: {
    15: $("imgFlag1")
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
    [oBucketheadZombie, 4, 1]
  ],
  FlagNum: 15,
  FlagToSumNum: {
    a1: [3, 5, 9, 10, 13],
    a2: [1, 2, 3, 4, 5, 6, 10]
  },
  FlagToMonitor: {
    14: [ShowFinalWave, 0]
  }
});