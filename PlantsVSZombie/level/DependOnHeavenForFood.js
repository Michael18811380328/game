oS.Init({
  PName: [oPeashooter, oCherryBomb, oWallNut, oPotatoMine, oSnowPea, oChomper, oSplitPea, oJalapeno, oSpikeweed, oRepeater, oTallNut, oPumpkinHead, oSquash, oFlowerPot, oTorchwood, oThreepeater, oGatlingPea, oSpikerock, oFumeShroom, oCoffeeBean, oGloomShroom, oPuffShroom, oScaredyShroom, oGarlic],
  ZName: [oZombie, oZombie2, oZombie3, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie],
  PicArr: ["images/interface/background1.jpg"],
  backgroundImage: "images/interface/background1.jpg",
  CanSelectCard: 1,
  SunNum: 100,
  LevelName: "小游戏：靠天吃饭",
  LargeWaveFlag: {
    10: $("imgFlag3"),
    20: $("imgFlag2"),
    30: $("imgFlag1")
  }
}, {
  AZ: [
    [oZombie, 2, 1],
    [oZombie2, 2, 1],
    [oZombie3, 2, 1],
    [oConeheadZombie, 2, 1],
    [oPoleVaultingZombie, 1, 1],
    [oBucketheadZombie, 1, 1]
  ],
  FlagNum: 30,
  FlagToSumNum: {
    a1: [3, 5, 9, 10, 13, 15, 19, 20, 23, 25, 29],
    a2: [1, 2, 3, 10, 4, 5, 6, 15, 7, 8, 9, 25]
  },
  FlagToMonitor: {
    9: [ShowLargeWave, 0],
    19: [ShowLargeWave, 0],
    29: [ShowFinalWave, 0]
  }
});