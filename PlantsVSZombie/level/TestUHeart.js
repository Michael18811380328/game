oS.Init({
  PName: [oPeashooter, oPotatoMine, oSquash, oCherryBomb, oJalapeno],
  ZName: [oZombie],
  PicArr: ["images/interface/background1.jpg"],
  backgroundImage: "images/interface/background1.jpg",
  CanSelectCard: 0,
  SunNum: 100,
  LevelName: "小游戏：你的心脏够强劲吗？",
  LargeWaveFlag: {
    1: $("imgFlag1")
  },
  StartGameMusic: "Watery Graves.swf",
  StartGame: function () {
    SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
    var a = NewEle("DivTeach", "div", "line-height:40px;font-size: 14px", 0, EDAll);
    NewEle("spanT", "span", "position:absolute;left:0;width:620px;text-align: center; font-family: 幼圆; font-size: 14px;line-height:50px", 0, a);
    NewEle("btnClick1", "span", "cursor:pointer;position:absolute;left:620px;height:40px;width:40px;text-align:center;line-height:40px;font-family: 幼圆; font-size: 14px;color:#FFF;border:1px solid #888;background:#000", 0, a);
    NewEle("btnClick2", "span", "cursor:pointer;position:absolute;left:670px;height:40px;width:60px;text-align:center;line-height:40px;font-family: 幼圆; font-size: 14px;color:#FFF;border:1px solid #888;background:#000", 0, a);
    NewEle("btnClick3", "span", "cursor:pointer;position:absolute;left:740px;height:40px;width:140px;text-align:center;line-height:40px;font-family: 幼圆; font-size: 14px;color:#FFF;border:1px solid #888;background:#000", 0, a);
    innerText($("spanT"), "测试一下CPU和浏览器是否强劲(IE9以下勿试5000个)？打开任务管理器，点击开始吧！");
    innerText($("btnClick1"), "100");
    innerText($("btnClick2"), "1000");
    innerText($("btnClick3"), "翠花,上5000个!!");
    oP.Monitor({
      ar: [0],
      f: function () {
        var c = $User.Browser,
          b = function () {
            !oS.Silence && NewMusic("Watery Graves.swf");
            oS.InitLawnMower();
            PrepareGrowPlants(function () {
              BeginCool();
              AutoProduceSun(25);
              oP.AddZombiesFlag();
              SetVisible($("dFlagMeterContent"))
            })
          };
        $("btnClick1").onclick = function () {
            oP.FlagToSumNum.a2 = [100];
            innerText($("DivTeach"), "下面有请我们的100个僵尸客串演员出场！");
            b()
          };
        $("btnClick2").onclick = function () {
            oP.FlagToSumNum.a2 = [1000];
            innerText($("DivTeach"), "下面有请我们的1000个僵尸客串演员出场！");
            b()
          };
        $("btnClick3").onclick = function () {
            oP.FlagToSumNum.a2 = [5000];
            innerText($("DivTeach"), "有请5000个客串演员出场！！或许他们化妆需要一点时间，请耐心等待。。。");
            b()
          };
          (c.IE9 || !c.IE) && (oS.LvlClearFunc = function () {
            oP.SelectFlagZombie = oP.OldSelectFlagZombie
          }, oP.OldSelectFlagZombie = oP.SelectFlagZombie, oP.SelectFlagZombie = function (h) {
            var i = oP,
              g = [],
              f = 1,
              j = i.ArZ,
              m = [],
              k = [],
              e = 30,
              d = EDZombies.cloneNode(true);
            oS.LargeWaveFlag[i.FlagZombies].style.top = "5px";
            --h;
            k[0] = (m[0] = (new oFlagZombie)).prepareBirth(0);
            while (h--) {
                k[f] = (m[f++] = new oZombie).prepareBirth(e);
                e += 5
              }
            i.NumZombies += f;
            d.innerHTML = k.join("");
            EDAll.replaceChild(d, EDZombies);
            EDZombies = d;
            while (f--) {
                m[f].Birth()
              }
          })
      }
    });
    CustomPlants(0, 2, 5);
    CustomPlants(0, 3, 9);
    CustomPlants(0, 4, 1)
  }
}, {
  AZ: [
    [oZombie, 30, 1]
  ],
  FlagNum: 1,
  FlagToSumNum: {
    a1: [],
    a2: [1000]
  },
  FlagToMonitor: {
    1: [ShowFinalWave, 0]
  }
});