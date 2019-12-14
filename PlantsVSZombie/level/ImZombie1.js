oS.Init({
  PName: [oPeashooter, oSunFlower, oSnowPea, oSquash],
  ZName: [oZombie, oBucketheadZombie, oFootballZombie],
  PicArr: ["images/interface/background2.jpg", "images/interface/trophy.png", "images/interface/Dave.gif", "images/interface/Dave2.gif", "images/interface/Stripe.png"],
  backgroundImage: "images/interface/background2.jpg",
  ShowScroll: false,
  SunNum: 150,
  BrainsNum: 5,
  ProduceSun: false,
  CardKind: 1,
  LevelName: "解谜模式：我是僵尸！",
  LoadMusic: function () {
    NewMusic("Mountains")
  },
  StartGameMusic: "Mountains.swf",
  InitLawnMower: function () {
    var a = 6;
    while (--a) {
      CustomSpecial(oBrains, a, -1)
    }
  },
  ArP: {
    ArC: [1, 4],
    ArR: [1, 5],
    Auto: 1,
    P: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3]
  },
  RiddleAutoGrow: function () {
    var k = oS.ArP,
      f = k.ArC,
      j = k.ArR,
      e = k.P,
      d = oS.PName,
      c, g = f[0],
      b = f[1],
      i = j[0],
      h = j[1],
      a;
    if (k.Auto) {
        while (i <= h) {
          CustomSpecial(oBrains, i, 0);
          for (a = g; a <= b; a++) {
            CustomSpecial(d[e[c = Math.floor(Math.random() * e.length)]], i, a);
            e.splice(c, 1)
          }++i
        }
      }
    NewImg("iStripe", "images/interface/Stripe.png", "left:" + (GetX1X2(5)[0] - 11) + "px;top:65px", EDAll)
  },
  LoadAccess: function (a) {
    EDAll.scrollLeft = 0;
    NewImg("dDave", "images/interface/Dave.gif", "left:0;top:81px;z-index:20", EDAll);
    NewEle("DivTeach", "div", 0, 0, EDAll);
    (function (d) {
      var b = arguments.callee,
        c = $("DivTeach");
      switch (d) {
        case 0:
          innerText(c, "僵尸们想要我帮他们练习入侵房子(点击继续)");
          c.onclick = function () {
            oSym.addTask(10, b, [1])
          };
          break;
        case 1:
          innerText(c, "我告诉他们只要植物不被破坏就没问题(点击继续)");
          c.onclick = function () {
            oSym.addTask(10, b, [2])
          };
          break;
        case 2:
          innerText(c, "所以我用硬纸板把你的草坪隔开了(点击继续)");
          c.onclick = function () {
            oSym.addTask(10, b, [3])
          };
          break;
        case 3:
          innerText(c, "祝你玩得愉快！(点击继续)");
          c.onclick = function () {
            oSym.addTask(10, b, [4])
          };
          break;
        case 4:
          c.onclick = null;
          $("dDave").src = "images/interface/Dave2.gif";
          oSym.addTask(50, function () {
            ClearChild($("dDave"));
            b(5)
          }, []);
          break;
        case 5:
          innerText(c, "通过这关需要吃掉所有的大脑！");
          oSym.addTask(500, function () {
            SetHidden(c)
          }, []);
          a(0)
        }
    })(0);
    oS.RiddleAutoGrow()
  },
  StartGame: function () {
    oP.Monitor();
    BeginCool();
    SetVisible($("dFlagMeter"), $("dFlagMeterContent"), $("dTop"));
    !oS.Silence && NewMusic("Mountains.swf")
  }
});