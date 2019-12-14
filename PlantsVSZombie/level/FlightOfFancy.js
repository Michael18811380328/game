oS.Init({
  PName: [oPeashooter, oSunFlower, oCherryBomb, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oSunShroom, oFumeShroom, oGraveBuster, oHypnoShroom, oScaredyShroom, oIceShroom, oSquash, oCoffeeBean, oTallNut],
  ZName: [oPoleVaultingZombie],
  PicArr: ["images/interface/background1.jpg"],
  backgroundImage: "images/interface/background1.jpg",
  CanSelectCard: 1,
  SunNum: 175,
  LevelName: "小游戏：我心飞翔",
  LargeWaveFlag: {
    10: $("imgFlag1")
  },
  StartGameMusic: "Ultimate battle.swf"
}, {
  AZ: [
    [oPoleVaultingZombie, 9, 1]
  ],
  FlagNum: 10,
  FlagToSumNum: {
    a1: [3, 5, 9],
    a2: [3, 4, 5, 10]
  },
  FlagToMonitor: {
    9: [ShowFinalWave, 0]
  }
});