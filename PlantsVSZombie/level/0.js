oS.Init({
  PicArr: function () {
    var b = $User.Browser.IE6 ? 8 : 32,
      a = "images/interface/";
    return [ShadowPNG, a + "Sun.gif", a + "LogoWord.jpg", a + "OptionsMenuback" + b + ".png", a + "OptionsBackButton" + b + ".png", a + "Surface.png", a + "Almanac_Ground.jpg", a + "Help.png", a + "SelectorScreenStartAdventur.png", a + "SelectorScreenSurvival.png", a + "SelectorScreenChallenges.png", a + "Logo.jpg", a + "LawnCleaner.png", a + "ZombiesWon.png", a + "LargeWave.gif", a + "FinalWave.gif", a + "PrepareGrowPlants.gif", a + "PointerUP.gif", a + "PointerDown.gif", a + "Shovel.png", a + "SunBack.png", a + "ShovelBack.png", a + "GrowSoil.png", a + "SeedChooser_Background.png", a + "Button.png", a + "LoadBar.png", a + "SelectorScreen_Almanac.png", a + "Almanac_IndexBack.jpg", a + "Almanac_IndexButton.png", a + "Almanac_CloseButton.png", a + "Almanac_PlantBack.jpg", a + "Almanac_PlantCard.png", a + "Almanac_ZombieBack.jpg", a + "Almanac_ZombieCard.png", a + "AwardScreen_Back.jpg", a + "trophy.png", a + "splash.png", a + "dialog_header.png", a + "dialog_topleft.png", a + "dialog_topmiddle.png", a + "dialog_topright.png", a + "dialog_centerleft.png", a + "dialog_centerright.png", a + "dialog_bottomleft.png", a + "dialog_bottommiddle.png", a + "dialog_bottomright.png", a + "brain.png", "images/Zombies/NewspaperZombie/1.gif"]
  }(),
  LevelName: "JSPVZ",
  ShowScroll: 1,
  LoadMusic: function () {
    NewMusic("Faster.swf")
  },
  StartGameMusic: "Faster.swf",
  backgroundImage: "images/interface/Logo.jpg",
  LoadAccess: function (a) {
    EBody = document.body;
    EElement = document.documentElement;
    EDAll.scrollLeft = 0;
    EDAll.innerHTML += WordUTF8;
    LoadProProcess();
    oSym.Stop()
  }
});