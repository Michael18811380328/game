var $User = function() {
        var a = navigator.platform,
            f = navigator.userAgent,
            c = (a == "Win32" || a == "Windows"),
            e = (a == "Mac68K" || a == "MacPPC" || a == "Macintosh"),
            b = (a == "X11" && !c && !e),
            h = c || e || b,
            g = "pvz.lonelystar.org",
            d = !!(window.attachEvent && !window.opera);
        return {
            Browser: {
                IE: d,
                IE6: d && !window.XMLHttpRequest,
                IE9: d && f.indexOf("MSIE 9.0") > 0,
                Opera: !!window.opera,
                WebKit: f.indexOf("AppleWebKit/") > -1,
                Gecko: f.indexOf("Gecko") > -1 && f.indexOf("KHTML") == -1
            },
            System: {
                Win: c,
                Mac: e,
                Unix: b
            },
            Client: {
                PC: h,
                Mobile: !h
            },
            HTTP: location.protocol.toLowerCase() == "http:" ? 1 : 0,
            AuthorWebsite: g,
            isAuthorWebsite: location.hostname === g,
            TopisAuthorWebsite: top.location.hostname === g
        }
    }(),
    oSym = {
        Init: function(b, a) {
            this.Now = 0;
            this.Timer = null;
            this.execTask = null;
            this.TQ = [{
                T: 0,
                f: b,
                ar: a || []
            }];
            this.TimeStep = 10;
            this.Start()
        },
        Clear: function() {
            this.TQ.length = 0
        },
        Start: function() {
            (function() {
                try {
                    ++oSym.Now
                } catch (a) {
                    alert("超时退出游戏");
                    location.reload()
                }
                oSym.Timer = setTimeout(arguments.callee, oSym.TimeStep)
            })();
            (function() {
                var d = oSym,
                    a = d.TQ,
                    c = a.length,
                    b, e;
                while (c--) {
                    d.Now >= (b = a[c]).T && ((e = b.f).apply(e, b.ar), d.removeTask(c))
                }
                d.execTask = setTimeout(arguments.callee, oSym.TimeStep)
            })()
        },
        Stop: function() {
            clearTimeout(this.Timer);
            clearTimeout(this.execTask);
            this.Timer = null
        },
        addTask: function(b, c, a) {
            var d = this.TQ;
            d[d.length] = {
                T: this.Now + b,
                f: c,
                ar: a
            };
            return this
        },
        removeTask: function(a) {
            this.TQ.splice(a, 1);
            return this
        }
    },
    ShadowPNG = "images/interface/plantshadow" + ($User.Browser.IE6 ? (document.execCommand("BackgroundImageCache", false, true), "8.gif") : "32.png"),
    innerText = (function() {
        return $User.Browser.IE ? ($Random = "?", function(b, a) {
            b.innerText = a
        }) : ($Random = "#", function(b, a) {
            b.textContent = a
        })
    })(),
    oS = {
        W: 900,
        H: 600,
        C: 9,
        LawnMowerX: 70,
        Lvl: 0,
        GlobalVariables: {},
        LvlVariables: {},
        SelfVariables: [],
        LvlClearFunc: null,
        Init: function(e, g, b, d) {
            var c, a = window;
            if (b != d) {
                for (c in b) {
                    a[c] != d ? (this.GlobalVariables[c] = a[c], a[c] = b[c]) : this.LvlVariables[c] = a[c] = b[c]
                }
            }
            ArCard = [];
            ArPCard = [];
            ArSun = [];
            $Pn = [];
            $Z = [];
            $P = [];
            EDAll = $("dAll");
            EDPlants = $("dPlants");
            EDZombies = $("dZombies");
            EDNewAll = EDAll.cloneNode(true);
            EDNewFlagMeter = $("dFlagMeter").cloneNode(true);
            ESSunNum = $("sSunNum");
            this.LoadAccess = null;
            this.InitLawnMower = null;
            this.StartGame = null;
            this.ChoseCard = this.MPID = "";
            this.PicNum = this.AccessNum = this.MCID = this.Chose = 0;
            this.Monitor = null;
            this.UserDefinedFlagFunc = null;
            for (c in e) {
                this.SelfVariables.push(c);
                this[c] = e[c]
            }!this.PicArr && (this.PicArr = []);
            !this.PName && (this.PName = []);
            !this.ZName && (this.ZName = []);
            !this.backgroundImage && (this.backgroundImage = "images/interface/background1.jpg");
            !this.LF && (this.LF = [0, 1, 1, 1, 1, 1]);
            !this.ZF && (this.ZF = this.LF);
            !this.LargeWaveFlag && (this.LargeWaveFlag = {});
            !this.StartGameMusic && (this.StartGameMusic = "UraniwaNi.swf");
            this.ArCard = this.CardKind == d ? e.PName : e.ZName;
            this.SunNum == d && (this.SunNum = 50);
            this.CanSelectCard == d && (this.CanSelectCard = 1);
            this.DKind == d && (this.DKind = 1);
            this.StaticCard == d && (this.StaticCard = 1);
            this.ShowScroll == d && (this.ShowScroll = true);
            this.ProduceSun == d && (this.ProduceSun = true);
            this.Coord == d && (this.Coord = 1);
            oCoord[this.Coord]();
            oP.Init(g);
            oT.Init(this.R);
            oZ.Init(this.R);
            oGd.Init();
            !this.Silence && (this.LoadMusic || function() {
                NewMusic("Look up at the.swf")
            })();
            this.LoadProgress()
        },
        LoadProgress: function(r, l, a) {
            SetVisible($("dFlagMeter"));
            SetHidden($("imgGQJC"));
            var p = oS,
                j = [],
                i = p.PicArr,
                k = p.PName,
                s = p.ZName,
                u = 0,
                d = document.createTextNode("正在准备载入游戏素材。。。"),
                t = GetX(11),
                g = oGd.$LF,
                b = oGd.$ZF,
                c = oS.R + 1,
                e = p.LoadImage,
                h = p.CheckImg,
                f = p.InitPn,
                m, q;
            innerText($("sFlagMeterTitleF"), d.data);
            $("dFlagMeterTitleB").insertBefore(d, $("sFlagMeterTitleF"));
            u += (r = k.length);
            NewImg(0, "images/interface/brain.png", "", $Pn.oBrains = NewEle(0, "div", "position:absolute"));
            switch (p.Coord) {
                case 2:
                    NewImg(0, "images/interface/PoolCleaner.png", "", $Pn.oPoolCleaner = NewEle(0, "div", "position:absolute"));
                case 1:
                    NewImg(0, "images/interface/LawnCleaner.png", "", $Pn.oLawnCleaner = NewEle(0, "div", "position:absolute"));
                    break
            }
            while (r--) {
                a = (l = k[r].prototype).PicArr.slice(0);
                j[j.length] = [l.EName, a[l.NormalGif], l.getShadow(l)];
                a.splice(l.NormalGif, 1);
                Array.prototype.push.apply(i, a)
            }
            for (r in oS.LargeWaveFlag) {
                s[s.length] = oFlagZombie;
                break
            }
            r = s.length;
            while (r--) {
                Array.prototype.push.apply(i, (l = (q = s[r]).prototype).PicArr.slice(0));
                l.Init.call(q, t, l, b, c)
            }
            p.PicNum = u += i.length;
            r = i.length;
            while (r--) {
                e(i[r], h)
            }
            r = j.length;
            while (r--) {
                e((m = j[r])[1], f, m)
            }
        },
        InitPn: function(a) {
            var b = $Pn[a[0]] = NewEle(0, "div", "position:absolute");
            NewImg(0, ShadowPNG, a[2], b);
            NewImg(0, a[1], "", b);
            oS.CheckImg()
        },
        LoadImage: $User.Browser.IE ? function(b, d, c) {
            var a = new Image();
            a.onreadystatechange = function() {
                a.readyState == "complete" && d(c)
            };
            a.onerror = function() {
                a.onreadystatechange = null;
                a.title = b;
                d(c)
            };
            a.src = b
        } : function(b, d, c) {
            var a = new Image();
            a.src = b;
            a.complete ? d(c) : (a.onload = function() {
                a.complete && d(c)
            }, a.onerror = function() {
                a.title = b;
                d(c)
            })
        },
        CheckImg: function(d, c) {
            var g = oS;
            if (g.AccessNum > g.PicNum) {
                return
            }
            d = 139 - g.AccessNum++ * 140 / g.PicNum - 11;
            $("imgFlagHead").style.left = d + "px";
            c = "载入:(" + g.AccessNum + "/" + g.PicNum + ")";
            innerText($("sFlagMeterTitleF"), c);
            $("dFlagMeterTitleB").firstChild.data = c;
            $("imgFlagMeterFull").style.clip = "rect(0,auto,21px," + (d + 11) + "px)";
            if (g.AccessNum == g.PicNum) {
                var f = oS.CenterContent;
                if (f) {
                    var a = $("dAD");
                    SetNone(a);
                    a.innerHTML = f
                }
                SetHidden($("dFlagMeterContent"), $("dFlagMeter"));
                $("dFlagMeter").style.top = "560px";
                innerText($("sFlagMeterTitleF"), $("dFlagMeterTitleB").firstChild.data = g.LevelName);
                $("imgFlagHead").style.left = "139px";
                $("imgFlagMeterFull").style.clip = "rect(0,auto,auto,157px)";
                delete g.PicArr;
                delete g.Coord;
                delete g.LF;
                delete g.ZF;
                var b = {
                    background: "url(" + g.backgroundImage + ") no-repeat",
                    visibility: "visible"
                };
                !g.ShowScroll && (b.left = "-115px");
                SetStyle($("tGround"), b);
                var e = function(h) {
                    var i = oS;
                    NewImg("imgGrowSoil", "images/interface/GrowSoil.png", "visibility:hidden;z-index:50", EDPlants);
                    NewEle("dTitle", "div", 0, 0, EDAll);
                    innerText(ESSunNum, i.SunNum);
                    InitPCard();
                    i.ShowScroll ? oSym.addTask(h == undefined ? 100 : h, function() {
                        var j = EDAll.scrollLeft += 25;
                        j < 500 ? oSym.addTask(2, arguments.callee, []) : (DisplayZombie(), SetVisible($("dMenu")), oS.CanSelectCard ? SetVisible($("dTop"), $("dSelectCard"), $("dCardList")) : (AutoSelectCard(), oSym.addTask(200, LetsGO, [])))
                    }, []) : (SetVisible($("dMenu")), AutoSelectCard(), LetsGO())
                };
                g.LoadAccess ? g.LoadAccess(e) : e()
            }
        }
    },
    oCoord = {
        1: function() {
            oS.R = 5;
            ChosePlantX = function(a) {
                return Compare(GetC(a), 1, oS.C, GetX)
            };
            ChosePlantY = function(a) {
                return $SSml(a, [86, 181, 281, 386, 476], [
                    [75, 0],
                    [175, 1],
                    [270, 2],
                    [380, 3],
                    [470, 4],
                    [575, 5]
                ])
            };
            GetC = function(a) {
                return $SSml(a, [-50, 100, 140, 220, 295, 379, 460, 540, 625, 695, 775, 855, 935], [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
            };
            GetR = function(a) {
                return $SSml(a, [86, 181, 281, 386, 476], [0, 1, 2, 3, 4, 5])
            };
            GetX = function(a) {
                return $SEql(a, {
                    "-2": -50,
                    "-1": 100,
                    0: 140,
                    1: 187,
                    2: 267,
                    3: 347,
                    4: 427,
                    5: 507,
                    6: 587,
                    7: 667,
                    8: 747,
                    9: 827,
                    10: 865,
                    11: 950
                })
            };
            GetY = function(a) {
                return $SEql(a, {
                    0: 75,
                    1: 175,
                    2: 270,
                    3: 380,
                    4: 470,
                    5: 575
                })
            };
            GetY1Y2 = function(a) {
                return $SEql(a, {
                    0: [0, 85],
                    1: [86, 180],
                    2: [181, 280],
                    3: [281, 385],
                    4: [386, 475],
                    5: [476, 600]
                })
            };
            GetX1X2 = function(a) {
                return $SEql(a, {
                    "-2": [-100, -49],
                    "-1": [-50, 99],
                    0: [100, 139],
                    1: [140, 219],
                    2: [220, 294],
                    3: [295, 378],
                    4: [379, 459],
                    5: [460, 539],
                    6: [540, 624],
                    7: [625, 694],
                    8: [695, 774],
                    9: [775, 854],
                    10: [855, 934],
                    11: [950, 1030]
                })
            };
            !oS.InitLawnMower && (oS.InitLawnMower = function() {
                var a = 6;
                while (--a) {
                    CustomSpecial(oLawnCleaner, a, -1)
                }
            })
        },
        2: function() {
            oS.R = 6;
            ChosePlantX = function(a) {
                return Compare(GetC(a), 1, oS.C, GetX)
            };
            ChosePlantY = function(a) {
                return $SSml(a, [86, 171, 264, 368, 440, 532], [
                    [75, 0],
                    [161, 1],
                    [254, 2],
                    [358, 3],
                    [430, 4],
                    [524, 5],
                    [593, 6]
                ])
            };
            GetC = function(a) {
                return $SSml(a, [-50, 100, 140, 220, 295, 379, 460, 540, 625, 695, 775, 855, 935], [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
            };
            GetR = function(a) {
                return $SSml(a, [86, 171, 264, 368, 440, 532], [0, 1, 2, 3, 4, 5, 6])
            };
            GetX = function(a) {
                return $SEql(a, {
                    "-2": -50,
                    "-1": 100,
                    0: 140,
                    1: 187,
                    2: 267,
                    3: 347,
                    4: 427,
                    5: 507,
                    6: 587,
                    7: 667,
                    8: 747,
                    9: 827,
                    10: 865,
                    11: 950
                })
            };
            GetY = function(a) {
                return $SEql(a, {
                    0: 75,
                    1: 165,
                    2: 253,
                    3: 355,
                    4: 430,
                    5: 522,
                    6: 587
                })
            };
            GetY1Y2 = function(a) {
                return $SEql(a, {
                    0: [0, 85],
                    1: [86, 170],
                    2: [171, 263],
                    3: [264, 367],
                    4: [368, 439],
                    5: [440, 531],
                    6: [532, 600]
                })
            };
            GetX1X2 = function(a) {
                return $SEql(a, {
                    "-2": [-100, -49],
                    "-1": [-50, 99],
                    0: [100, 139],
                    1: [140, 219],
                    2: [220, 294],
                    3: [295, 378],
                    4: [379, 459],
                    5: [460, 539],
                    6: [540, 624],
                    7: [625, 694],
                    8: [695, 774],
                    9: [775, 854],
                    10: [855, 934],
                    11: [950, 1030]
                })
            };
            !oS.InitLawnMower && (oS.InitLawnMower = function() {
                CustomSpecial(oLawnCleaner, 1, -1);
                CustomSpecial(oLawnCleaner, 2, -1);
                CustomSpecial(oPoolCleaner, 3, -1);
                CustomSpecial(oPoolCleaner, 4, -1);
                CustomSpecial(oLawnCleaner, 5, -1);
                CustomSpecial(oLawnCleaner, 6, -1)
            })
        }
    };
oP = {
    Init: function(a) {
        var r = this;
        r.NumZombies = r.FlagZombies = 0;
        if (a) {
            var l, k, b = {},
                g, c, q, p, d, m = [],
                h, e, n;
            for (l in a) {
                r[l] = a[l]
            }
            r.ArZ = [];
            h = ((k = r.AZ).sort(function(i, f) {
                return i[2] - f[2]
            })).length;
            while (h--) {
                c = (n = k[h])[0];
                q = n[1];
                p = n[2];
                while (q--) {
                    m.push([c, p])
                }
                if (d = n[3]) {
                    e = d.length;
                    while (e--) {
                        b[g = d[e]] ? b[g].push(c) : b[g] = [c]
                    }
                }
            }
            r.AZ = m;
            r.MustShowAtFlag = b
        }
        a && a.FlagNum ? (r.FlagHeadStep = Math.floor(140 / (a.FlagNum - 1)), r.MonPrgs = function() {
            var j = oP,
                i, f = j.FlagZombies;
            !--j.NumZombies && (f < j.FlagNum ? (j.ReadyFlag = ++f, oSym.addTask(500, j.FlagPrgs, [])) : j.FlagToEnd())
        }) : r.MonPrgs = function() {};
        (!a || !a.FlagToEnd) && (r.FlagToEnd = function() {
            NewImg("imgSF", "images/interface/trophy.png", "left:417px;top:233px;z-index:255", EDAll, {
                onclick: function() {
                    SelectModal(0)
                }
            })
        })
    },
    AddZombiesFlag: function(d) {
        var g = oP,
            c = oS.LargeWaveFlag,
            e, b = g.FlagHeadStep,
            a = g.FlagNum;
        SetVisible($("imgGQJC"), $("dFlagMeterContent"));
        for (e in c) {
            Math.floor(e) < a ? SetStyle(c[e], {
                visibility: "visible",
                left: (150 - (e - 1) * b) + "px"
            }) : SetVisible(c[e])
        }
        g.ReadyFlag = 1;
        g.FlagPrgs(d)
    },
    SelectFlagZombie: function(j, d) {
        var e = oP,
            m = e.ArZ,
            k = e.AZ,
            s = k.length,
            q, r, i = [],
            g = 0,
            n = oS.LargeWaveFlag[d],
            c = false,
            h = !n ? 150 : (n.style.top = "5px", --j, i[g++] = oFlagZombie, 30),
            p, b, f = e.MustShowAtFlag,
            a;
        while (s--) {
            if ((r = (q = k[s])[1]) > d) {
                break
            } else {
                m.push(q[0]);
                --k.length;
                c = true
            }
        }
        c && m.sort(function(t, l) {
            return t.prototype.Lvl - l.prototype.Lvl
        });
        if (a = f[d]) {
            s = a.length;
            while (s--) {
                j -= (i[g++] = a[s]).prototype.Lvl
            }
        }
        b = m[s = (p = m.length) - 1].prototype.Lvl;
        while (j > 0) {
            if (s && b > j) {
                while (--s && m[s].prototype.Lvl > j) {}
                p = s + 1;
                b = m[s].prototype.Lvl
            }
            j -= (i[g++] = m[Math.floor(Math.random() * p)]).prototype.Lvl
        }
        e.NumZombies += g;
        e.SetTimeoutZombie(i, h)
    },
    SelectFlagZombie1: function(d) {
        var h = oP,
            c = [],
            a = 0,
            g = h.ArZ,
            f = oS.LargeWaveFlag[h.FlagZombies],
            e = h.SumToZombie,
            b = !f ? 150 : (f.style.top = "5px", --d, c[a++] = oFlagZombie, 30);
        while (d > 0) {
            d -= (c[a++] = g[Math.floor(Math.random() * $SEql(d, e))]).prototype.Lvl
        }
        h.NumZombies += a;
        h.SetTimeoutZombie(c, b)
    },
    SetTimeoutTomZombie: function(c) {
        var f = [],
            d = [],
            e = 0,
            a = c.length,
            b, g;
        for (b in oGd.$Tombstones) {
            g = b.split("_");
            d[e] = (f[e] = new c[Math.floor(Math.random() * a)]).CustomBirth(g[0], g[1], 100);
            ++e
        }
        this.AppearUP(d, f, e)
    },
    SetTimeoutWaterZombie: function(j, b, e, h) {
        var f = oGd.$LF,
            l = [],
            c = f.length,
            m = [],
            k = [],
            g = h.length,
            a, d = b - j + 1;
        while (--c) {
            f[c] == 2 && l.push(c)
        }
        a = l.length;
        c = e;
        while (c--) {
            k[c] = (m[c] = new h[Math.floor(Math.random() * g)]).CustomBirth(l[Math.floor(Math.random() * a)], Math.floor(j + Math.random() * d))
        }
        this.AppearUP(k, m, e)
    },
    AppearUP: function(a, c, b) {
        oP.NumZombies += b;
        asyncInnerHTML(a.join(""), function(h, f) {
            EDZombies.appendChild(h);
            var e = f.length,
                g, d;
            while (e--) {
                g = f[e];
                g.Birth.call(g);
                SetBlock(g.Ele);
                oSym.addTask(10, function(l, k, i, j) {
                    k = Math.max(k - j, 0);
                    SetStyle(l, {
                        top: k + "px",
                        clip: "rect(0,auto," + (i += j) + "px,0)"
                    });
                    k && oSym.addTask(10, arguments.callee, [l, k, i, j])
                }, [g.EleBody, d = g.height, 0, d * 0.1])
            }
        }, c)
    },
    SetTimeoutZombie: function(b, d) {
        var f = [],
            c = [],
            e = 0,
            g = 0,
            a = b.length;
        while (e < a) {
            c[e] = (f[e] = new b[e]).prepareBirth(g);
            g += d;
            ++e
        }
        asyncInnerHTML(c.join(""), function(k, j) {
            EDZombies.appendChild(k);
            var h = j.length;
            while (h--) {
                j[h].Birth()
            }
        }, f)
    },
    FlagPrgs: function() {
        var f = oP,
            c = f.FlagZombies,
            e = f.FlagToSumNum,
            a = 139 - c * f.FlagHeadStep,
            d = $SSml(c, e.a1, e.a2),
            b;
        f.FlagNum > (c = ++f.FlagZombies) ? ($("imgFlagHead").style.left = a + "px", $("imgFlagMeterFull").style.clip = "rect(0,157px,21px," + (a + 11) + "px)", (b = $SEql(c, f.FlagToMonitor)) && oSym.addTask(1690, function(g) {
            !g[1] && (g[0](), g[1] = 1)
        }, [b]), oSym.addTask(2490, function(g) {
            var h = oP;
            h.ReadyFlag == g++ && (h.ReadyFlag = g, h.FlagPrgs())
        }, [c])) : ($("imgFlagHead").style.left = "-1px", $("imgFlagMeterFull").style.clip = "rect(0,157px,21px,0)");
        f.SelectFlagZombie.call(f, d, c);
        f.UserDefinedFlagFunc && f.UserDefinedFlagFunc()
    },
    Monitor: function(a, b) {
        a && a.f.apply(a.f, a.ar);
        b && (oP.UserDefinedFlagFunc = b);
        (function() {
            oZ.traversalOf();
            oSym.addTask(10, arguments.callee, [])
        })()
    }
}, oGd = {
    Init: function() {
        this.$ = [];
        this.$Crater = [];
        this.$Tombstones = [];
        this.$Torch = [];
        this.$LF = oS.LF;
        this.$ZF = oS.ZF;
        this.$B = []
    },
    add: function(c, a, b, d) {
        (b = (d = this.$)[a]) && b.Die();
        d[a] = c
    },
    del: function(a) {
        delete this.$[a.R + "_" + a.C + "_" + a.PKind]
    },
    MoveBullet: function() {
        var d = oGd.$B,
            a = d.length,
            c, b = oGd.$Torch;
        while (a--) {
            (c = d[a]).F(c, a, d, b)
        }
        oSym.addTask(1, arguments.callee, [])
    },
    MB1: function(e, j, m, f) {
        var d = e.id,
            k = $(d),
            h = e.Attack,
            a = e.D,
            p, q = e.X,
            c = GetC(q),
            g = e.R,
            n = e.Kind,
            l = e.ChangeC,
            b = oZ["getZ" + a](q, g);
        n < 1 && f[g + "_" + c] && l != c && ((e.Kind = ++n) && (h = e.Attack = 40), e.ChangeC = c, k.src = "images/Plants/PB" + n + a + ".gif");
        b && b.Altitude == 1 ? (b.getHurt(-1, a, h, n, 0, 0, 0), m.splice(j, 1), (SetStyle(k, {
            left: e.pixelLeft + 28 + "px"
        })).src = "images/Plants/PeaBulletHit.gif", oSym.addTask(10, ClearChild, [k])) : (e.X += (p = !a ? 5 : -5)) < oS.W && e.X > 100 ? k.style.left = (e.pixelLeft += p) + "px" : (m.splice(j, 1), ClearChild(k))
    },
    MB2: function(d, g, h) {
        var c = d.id,
            j = d.X,
            a = GetC(j),
            f = d.R,
            b = oZ.getZ0(j, f),
            e = $(c);
        b && b.Altitude == 1 ? (b.getHurt(-1, 0, 20, 0, 0, 0, 0), h.splice(g, 1), (SetStyle(e, {
            left: d.pixelLeft + 38 + "px"
        })).src = "images/Plants/ShroomBulletHit.gif", oSym.addTask(10, ClearChild, [e])) : (d.X += 5) < oS.W ? e.style.left = (d.pixelLeft += 5) + "px" : (h.splice(g, 1), ClearChild(e))
    },
    MB3: function(g, d, a) {
        var h = g.id,
            b = $(h),
            f = oZ.getZ0(g.X, g.R),
            e = g.D,
            c = g.pixelTop;
        if (f && f.Altitude == 1) {
            f.getHurt(-1, 0, 20, 0, 0, 0, 0);
            a.splice(d, 1);
            ClearChild(b)
        } else {
            switch (g.D) {
                case 4:
                    (g.X -= 5) < 100 ? (a.splice(d, 1), ClearChild(b)) : b.style.left = (g.pixelLeft -= 5) + "px";
                    break;
                case 6:
                    (c = g.pixelTop -= 5) < -15 ? (a.splice(d, 1), ClearChild(b)) : (b.style.top = c + "px", g.R = GetR(c + 15));
                    break;
                case 2:
                    (c = g.pixelTop += 5) > 600 ? (a.splice(d, 1), ClearChild(b)) : (b.style.top = c + "px", g.R = GetR(c + 15));
                    break;
                case 7:
                    (g.X += 4.3) > 900 || (c = g.pixelTop -= 5) < -15 ? (a.splice(d, 1), ClearChild(b)) : (g.R = GetR(c + 15), b.style.left = (g.pixelLeft += 9.6) + "px", b.style.top = c + "px");
                    break;
                case 1:
                    (g.X += 4.3) > 900 || (c = g.pixelTop += 5) > 600 ? (a.splice(d, 1), ClearChild(b)) : (g.R = GetR(c + 15), b.style.left = (g.pixelLeft += 9.6) + "px", b.style.top = c + "px")
            }
        }
    }
}, oZ = {
    Init: function(b) {
        this.$ = [];
        this.$R = [];
        var a;
        for (a = b; a; this.$[a] = [], this.$R[a--] = []) {}
    },
    add: function(b, a) {
        (a = this.$[b.R]).push(b);
        a.sort(function(d, c) {
            return d.AttackedLX - c.AttackedLX
        });
        a.RefreshTime = oSym.Now
    },
    getZ0: function(b, d) {
        var c = 0,
            e = this.$[d],
            f, a = e.length;
        while (c < a && (f = e[c++]).AttackedLX <= b) {
            if (f.PZ && f.HP && f.AttackedRX >= b) {
                return f
            }
        }
    },
    getZ1: function(h, b) {
        var d = 0,
            j = this.$[b],
            f = this.$R[b],
            g, c, k, e;
        (k = j.RefreshTime) == f.RefreshTime ? g = f : (g = (this.$R[b] = j.slice(0)).sort(function(l, i) {
            return i.AttackedRX - l.AttackedRX
        })).RefreshTime = k;
        e = g.length;
        while (d < e && (c = g[d++]).AttackedRX >= h) {
            if (c.PZ && c.HP && c.AttackedLX <= h) {
                return c
            }
        }
    },
    getArZ: function(e, d, b) {
        var g = 0,
            l = this.$[b],
            f = [],
            k = 0,
            c, h = l.length,
            j;
        while (g < h && (j = (c = l[g++]).AttackedLX) < d) {
            c.PZ && c.HP && (j > e || c.AttackedRX > e) && (f[k++] = c)
        }
        return f
    },
    moveTo: function(g, f, c) {
        var b = this.$[f],
            a = this.$[c],
            e = b.length,
            d;
        while (e--) {
            (o = b[e]).id == g && (b.splice(e, 1), o.R = c, a.push(o), (a.sort(function(i, h) {
                return i.AttackedLX - h.AttackedLX
            })).RefreshTime = b.RefreshTime = oSym.Now, e = 0)
        }
    },
    traversalOf: function() {
        var a, b = this.$,
            j, l = 0,
            d = 0,
            k = 1000,
            i, h, f = [
                function(n) {
                    d = 1;
                    k = i
                },
                function(n) {
                    (i = n.AttackedLX) > k && (l = d = 1);
                    k = i
                }
            ],
            e = b.length,
            m, c, g;
        (function(r) {
            var q = (j = b[r]).length,
                n = arguments.callee,
                p = oT.$[r],
                s = oT.$L[r];
            while (q--) {
                a = j[q];
                a.HP && a.PZ && a.ZX < 901 && oT["chkD" + a.WalkDirection](a, r, p, s);
                !a.HP ? (j.splice(q, 1), f[0](a)) : f[a.ChkActs(a, r, j, q)](a)
            }
            l ? (l = d = 0, j.sort(function(u, t) {
                return u.AttackedLX - t.AttackedLX
            }), j.RefreshTime = oSym.Now) : d && (d = 0, j.RefreshTime = oSym.Now);
            --r && oSym.addTask(0, n, [r])
        })(b.length - 1)
    }
}, oT = {
    Init: function(b) {
        this.$ = [];
        this.$L = [];
        for (var a = b; a;) {
            this.$[a] = [];
            this.$L[a--] = []
        }
    },
    add: function(f, c, g) {
        var e = this.$[f],
            d = c.length,
            b;
        while (d--) {
            b = c[d];
            e.push([b[0], b[1], b[2], g])
        }
        e.sort(function(i, h) {
            return h[1] - i[1]
        });
        e.RefreshTime = new Date
    },
    chkD0: function(g, e, d, h, b, a) {
        var f = g.AttackedLX,
            c = 0;
        while (c < d.length && (b = d[c])[1] >= f) {
            (a = $P[b[3]]).canTrigger && b[0] <= f && a.TriggerCheck(g, b[2], c);
            ++c
        }
    },
    chkD1: function(b, e, c, g, m, l, f, a, k) {
        var j = b.AttackedLX,
            h = b.AttackedRX,
            d = 0;
        (l = c.RefreshTime) == g.RefreshTime ? m = g : (m = (this.$L[e] = c.slice(0)).sort(function(n, i) {
            return n[0] - i[0]
        })).RefreshTime = l;
        while (d < m.length && (f = m[d])[0] <= h) {
            (a = $P[f[3]]).canTrigger && f[1] >= h && a.TriggerCheck(b, f[2], d);
            ++d
        }
    },
    delP: function(e) {
        var b = e.oTrigger,
            f = e.id,
            d, a, c;
        for (d in b) {
            for (c = (a = this.$[d]).length; c--; a[c][3] == f && a.splice(c, 1)) {}
            a.RefreshTime = new Date
        }
    },
    indexOf: function(j, d) {
        var f = new RegExp(d + ",", "g"),
            h = (j.toString() + ",").replace(f, "┢,").replace(/[^,┢]/g, ""),
            i = 0,
            g = 0,
            b = [];
        for (;
            (g = h.indexOf("┢", g)) > 0; b.push((g++-i++-2) / 3)) {}
        return b
    }
}, asyncInnerHTML = function(d, c, a) {
    var b = $n("div"),
        e = document.createDocumentFragment();
    b.innerHTML = d;
    (function(g) {
        var f = arguments.callee;
        g-- ? (e.appendChild(b.firstChild), setTimeout(function() {
            f(g)
        }, 0)) : c(e, a)
    })(b.childNodes.length)
}, WhichMouseButton = function(a) {
    a = window.event || a;
    var b = $User.Browser;
    return !b.Gecko ? $SEql(a.button, {
        1: 1,
        0: b.IE ? 2 : 1,
        2: 2,
        "default": 1
    }) : $SEql(a.which, {
        1: 1,
        3: 2,
        "default": 1
    })
}, GroundOnmousedown = function(i) {
    i = window.event || i;
    var a = i.clientX + EBody.scrollLeft || EElement.scrollLeft,
        k = i.clientY + EBody.scrollTop || EElement.scrollTop,
        g = ChosePlantX(a),
        h = ChosePlantY(k),
        d = g[0],
        c = h[0],
        f = h[1],
        b = g[1],
        j = GetAP(a, k, f, b);
    switch (oS.Chose) {
        case 1:
            WhichMouseButton(i) < 2 ? GrowPlant(j[0], d, c, f, b) : CancelPlant();
            break;
        case -1:
            WhichMouseButton(i) < 2 ? ShovelPlant(j) : CancelShovel()
    }
}, GetAP = function(a, h, d, c) {
    var f, i = oGd.$,
        e, g = [],
        b;
    for (f = 0; f < 4; g.push(e = i[d + "_" + c + "_" + f++]), e && !(a < e.pixelLeft || a > e.pixelRight || h < e.pixelTop || h > e.pixelBottom) && (b = e)) {}
    return [g, b]
}, GroundOnkeydown = function(b) {
    var a;
    if ((a = (b || event).keyCode) == 27) {
        switch (oS.Chose) {
            case 1:
                CancelPlant();
                break;
            case -1:
                CancelShovel()
        }
        return false
    } else {
        !oS.Chose && KeyBoardGrowPlant(a)
    }
}, KeyBoardGrowPlant = function(b, a) {
    a = a || 0;
    if (b > 47 && b < 58) {
        switch (a) {
            case 0:
                ChosePlant({
                    clientX: 450,
                    clientY: 300
                }, String.fromCharCode(b))
        }
    }
}, GroundOnmousemove = function() {}, GroundOnmousemove1 = function(j) {
    j = window.event || j;
    var d = j.clientX + EBody.scrollLeft || EElement.scrollLeft,
        b = j.clientY + EBody.scrollTop || EElement.scrollTop,
        k = oS.ChoseCard,
        h = ChosePlantX(d),
        i = ChosePlantY(b),
        f = h[0],
        c = i[0],
        g = i[1],
        a = h[1],
        m = GetAP(d, b, g, a);
    var l = ArCard[k].PName.prototype;
    SetStyle($("MovePlant"), {
        left: d - 0.5 * (l.beAttackedPointL + l.beAttackedPointR) + "px",
        top: b + 20 - l.height + "px"
    });
    l.CanGrow(m[0], g, a) ? SetStyle($("MovePlantAlpha"), {
        visibility: "visible",
        left: f + l.GetDX() + "px",
        top: c - l.height + l.GetDY(g, a, m[0]) + "px"
    }) : SetHidden($("MovePlantAlpha"))
}, GroundOnmousemove2 = function(k) {
    k = window.event || k;
    var d = k.clientX + EBody.scrollLeft || EElement.scrollLeft,
        b = k.clientY + EBody.scrollTop || EElement.scrollTop,
        m = oS.ChoseCard,
        h = ChosePlantX(d),
        i = ChosePlantY(b),
        f = h[0],
        c = i[0],
        g = i[1],
        a = h[1],
        n = GetAP(d, b, g, a);
    var j = n[1],
        l = j ? j.id : "",
        p = oS.MPID;
    p != l && (p && SetAlpha($(p).childNodes[1], 100, 1), (oS.MPID = l) && SetAlpha($(l).childNodes[1], 60, 0.6));
    SetStyle($("tShovel"), {
        left: d - 15 + "px",
        top: b - 16 + "px"
    })
}, DisplayZombie = function() {
    var c = oP.AZ.slice(0),
        b = l2 = c.length,
        f, g = $("dZombie"),
        e = [],
        d = [],
        a;
    while (b--) {
        e.push(Math.floor(150 + Math.random() * 444))
    }
    e.sort(function(i, h) {
        return i - h
    });
    while (l2) {
        f = c[a = Math.floor(Math.random() * l2)][0].prototype;
        c.splice(a, 1);
        d[l2--] = f.getHTML("", Math.floor(50 + Math.random() * 201) - f.width * 0.5, e[l2] - f.height, 1, "block", "auto", f.GetDTop, f.PicArr[f.StandGif])
    }
    asyncInnerHTML(d.join(""), function(h) {
        g.appendChild(h)
    })
}, AutoSelectCard = function() {
    var c = oS.ArCard,
        b = -1,
        a = c.length;
    while (++b < a) {
        SelectCard(c[b].prototype.EName)
    }
}, InitPCard = function() {
    var d = "",
        f, e = oS.ArCard,
        a = e.length,
        b = 0,
        c;
    while (b < a) {
        f = e[b];
        c = f.prototype;
        ArPCard[EName = c.EName] = {
            Select: 0,
            PName: f
        };
        d += '<div class="span1" id="Card' + EName + '" onmouseout="SetVisible($(\'dTitle\'))" onmousemove="ViewCardTitle(' + EName + ',event)" onclick="SelectCard(\'' + EName + '\')"><img src="' + c.PicArr[1] + '"><img src="' + c.PicArr[0] + '"><span class="span2">' + c.SunNum + "</span></div>";
        b++ % 6 == 5 && (d += "<br>")
    }
    $("dPCard").innerHTML = d
}, InitHandBookPCard = function() {
    var d = "",
        g, f, e = [oPeashooter, oSunFlower, oCherryBomb, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oSunShroom, oFumeShroom, oGraveBuster, oHypnoShroom, oScaredyShroom, oIceShroom, oDoomShroom, oLilyPad, oSquash, oThreepeater],
        a = e.length,
        b = 0,
        c;
    while (b < a) {
        g = e[b];
        c = g.prototype;
        f = c.EName;
        d += '<div class="span1" onclick="ViewProducePlant(' + f + ')"><img src="' + c.PicArr[1] + '"><img src="' + c.PicArr[0] + '"><span class="span2">' + c.SunNum + "</span></div>";
        b++ % 6 == 5 && (d += "<br>")
    }
    $("dHandBookPCard").innerHTML = d;
    ViewProducePlant(e[0]);
    $("dHandBookPZ").style.backgroundImage = "url(images/interface/Almanac_PlantBack.jpg)";
    SetVisible($("dHandBookPZ"));
    SetNone($("dHandBookZ"));
    SetBlock($("dHandBookP"))
}, InitHandBookZCard = function() {
    var d = "",
        g, f, e = [oZombie, oFlagZombie, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oBackupDancer, oDuckyTubeZombie1, oSnorkelZombie],
        a = e.length,
        b = 0,
        c;
    while (b < a) {
        g = e[b];
        c = g.prototype;
        f = c.EName;
        d += '<div class="span1" onclick="ViewProduceZombie(' + f + ')"><img src="' + c.PicArr[1] + '"><img src="' + c.PicArr[0] + '"><span class="span2">' + c.SunNum + "</span></div>";
        b++
    }
    $("dHandBookZCard").innerHTML = d;
    ViewProduceZombie(e[0]);
    $("dHandBookPZ").style.backgroundImage = "url(images/interface/Almanac_ZombieBack.jpg)";
    SetVisible($("dHandBookPZ"));
    SetNone($("dHandBookP"));
    SetBlock($("dHandBookZ"))
}, ViewProducePlant = function(b) {
    var a = b.prototype;
    $("pHandBookPlant").style.backgroundImage = "url(" + a.PicArr[a.NormalGif] + ")";
    $("dProducePlant").innerHTML = a.Produce;
    innerText($("dHandBookPlantName"), a.CName);
    innerText($("spSunNum"), a.SunNum);
    innerText($("spCoolTime"), a.coolTime + "秒");
    $("pPlantBack").style.backgroundPosition = -200 * a.BookHandBack + "px 0"
}, ViewProduceZombie = function(b) {
    var a = b.prototype;
    $("pHandBookZombie").style.backgroundImage = "url(" + a.PicArr[a.StandGif] + ")";
    $("dProduceZombie").innerHTML = a.Produce;
    innerText($("dHandBookZombieName"), a.CName);
    $("pZombieBack").style.backgroundPosition = -200 * a.BookHandBack + "px 0"
}, ViewCardTitle = function(b, c) {
    c = c || window.event;
    var f = $("dTitle"),
        a = b.prototype;
    f.innerHTML = a.CName + "<br>冷却时间:" + a.coolTime + "秒<br>" + (oS.DKind && a.night ? '<span style="color:#F00">夜行性的--在白天会睡觉</span><br>' + a.Tooltip : a.Tooltip);
    SetStyle(f, {
        left: c.clientX + EDAll.scrollLeft - 3 + "px",
        top: c.clientY + 18 + "px",
        visibility: "visible"
    })
}, SelectCard = function(e) {
    var i = $("Card" + e).childNodes,
        g = i[1],
        c = i[0],
        b = ArPCard[e],
        j = b.PName.prototype,
        h, a, k, f = $("btnOK");
    if (!b.Select) {
        if (!(ArPCard.SelNum |= 0)) {
            f.disabled = "";
            f.style.color = "#FC6"
        } else {
            if (ArPCard.SelNum > 9) {
                return
            }
        }++ArPCard.SelNum;
        b.Select = 1;
        oS.StaticCard && (h = NewEle("dCard" + e, "div", 0, {
            onclick: function() {
                SelectCard(e)
            }
        }, $("dCardList")), NewImg(0, c.src, 0, h), NewImg(0, g.src, 0, h), innerText(NewEle("sSunNum" + e, "span", 0, 0, h), j.SunNum), SetNone(g))
    } else {
        b.Select = 0;
        !--ArPCard.SelNum && (f.disabled = "disabled", f.style.color = "#888");
        (h = $("dCard" + e)).onclick = null;
        ClearChild(h.firstChild, h.childNodes[1], h.lastChild, h);
        SetBlock(g)
    }
}, ResetSelectCard = function() {
    var b, a = $("btnOK");
    for (b in ArPCard) {
        ArPCard[b].Select && SelectCard(b)
    }
    a.disabled = "disalbed";
    a.style.color = "#888"
}, LetsGO = function() {
    var b = $("dZombie"),
        f = $("dCardList"),
        h = 0,
        l = f.childNodes.length,
        g, j, m, e, k, a, c = document.body;
    while (b.hasChildNodes()) {
        b.removeChild(k = b.lastChild);
        k = null
    }
    SetHidden(b, $("dSelectCard"), $("dTitle"));
    $("tGround").style.left = "-115px";
    EDAll.scrollLeft = 0;
    SetStyle($("dTop"), {
        left: "105px",
        top: 0
    });
    f.style.left = 0;
    while (h < l) {
        (function(d) {
            g = (k = f.childNodes[d]).id.substr(5);
            m = (j = ArPCard[g].PName).prototype;
            k.onclick = function(i) {
                ChosePlant(i, d)
            };
            k.onmouseover = function() {
                SetVisible($("dTitle"));
                ViewPlantTitle(oS.MCID = d)
            };
            k.onmouseout = function() {
                SetHidden($("dTitle"))
            };
            (a = k.lastChild).id = "sSunNum" + d;
            innerText(a, m.SunNum);
            SetHidden(k.childNodes[1]);
            ArCard.push({
                DID: k.id,
                CDReady: 0,
                SunReady: 0,
                PName: j
            })
        })(h++)
    }
    c.onkeydown = function(d) {
        GroundOnkeydown(d)
    };
    c.onmousedown = function(d) {
        GroundOnmousedown(d)
    };
    c.onmousemove = function(d) {
        GroundOnmousemove(d)
    };
    SetVisible(f);
    !oS.BrainsNum && CustomSpecial(oBrains, oS.R - 1, -2);
    oGd.MoveBullet();
    (oS.StartGame || function() {
        !oS.Silence && NewMusic(oS.StartGameMusic);
        SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
        oS.InitLawnMower();
        PrepareGrowPlants(function() {
            oP.Monitor(oS.Monitor, oS.UserDefinedFlagFunc);
            BeginCool();
            oS.DKind && AutoProduceSun(25);
            oSym.addTask(1500, function() {
                oP.AddZombiesFlag();
                SetVisible($("dFlagMeterContent"))
            }, [])
        })
    })()
}, ViewPlantTitle = function(b) {
    var f = $("dTitle"),
        e = ArCard[b],
        c = e.PName.prototype,
        a = c.CName;
    !oS.CardKind && (a += "<br>冷却时间:" + c.coolTime + "秒<br>" + c.Tooltip, !e.CDReady && (a += '<br><span style="color:#F00">正在重新装填中...</span>'));
    !e.SunReady && (a += '<br><span style="color:#F00">阳光不足!</span>');
    f.innerHTML = a;
    SetStyle(f, {
        top: 60 * b + "px",
        left: "100px"
    })
}, BeginCool = function() {
    var b = ArCard.length,
        c, d, a, e;
    while (b--) {
        a = (c = (d = ArCard[b]).PName.prototype).coolTime;
        e = c.SunNum;
        switch (a) {
            case 0:
            case 7.5:
                d.CDReady = 1;
                e <= oS.SunNum && (d.SunReady = 1, SetVisible($(d.DID).childNodes[1]));
                break;
            case 30:
                DoCoolTimer(b, 20);
                break;
            default:
                DoCoolTimer(b, 35)
        }
    }
}, MonitorCard = function(c) {
    var a = ArCard.length,
        b;
    if (oS.Chose < 1) {
        while (a--) {
            (b = (c = ArCard[a]).PName.prototype).SunNum > oS.SunNum ? (c.SunReady && (c.SunReady = 0), SetHidden($(c.DID).childNodes[1])) : (!c.SunReady && (c.SunReady = 1), c.CDReady && (SetVisible($(c.DID).childNodes[1])))
        }
    } else {
        while (a--) {
            (b = (c = ArCard[a]).PName.prototype).SunNum > oS.SunNum ? c.SunReady && (c.SunReady = 0) : !c.SunReady && (c.SunReady = 1)
        }
    }
    ViewPlantTitle(oS.MCID)
}, DoCoolTimer = function(c, b) {
    var a = $(ArCard[c].DID);
    (function(d, g, f, e) {
        d > 0 ? (innerText(f, d), innerText(e, d), oSym.addTask(50, arguments.callee, [(d - 0.5).toFixed(1), g, f, e])) : (ClearChild(f, e), ArCard[g].CDReady = 1, MonitorCard())
    })(b, c, NewEle("dCD1" + c, "span", "position:absolute;left:22px;top:22px;font-size:18px;font-weight:500;font-family:Verdana;color:#000", "", a), NewEle("dCD2" + c, "span", "position:absolute;left:20px;top:20px;font-size:18px;font-weight:500;font-family:Verdana;color:#FF0", "", a))
}, ChosePlant = function(a, f) {
    var h = ArCard[oS.ChoseCard = f];
    if (!(h.CDReady && h.SunReady)) {
        return
    }
    a = window.event || a;
    var g = a.clientX + EBody.scrollLeft || EElement.scrollLeft,
        e = a.clientY + EBody.scrollTop || EElement.scrollTop,
        d = h.PName.prototype,
        c = ArCard.length,
        b;
    oS.Chose = 1;
    !oS.CardKind ? EditImg((EditImg($Pn[d.EName].childNodes[1].cloneNode(false), "MovePlant", "", {
        left: g - 0.5 * (d.beAttackedPointL + d.beAttackedPointR) + "px",
        top: e + 20 - d.height + "px",
        zIndex: 254
    }, EDAll)).cloneNode(false), "MovePlantAlpha", "", {
        visibility: "hidden",
        filter: "alpha(opacity=40)",
        opacity: 0.4,
        zIndex: 30
    }, EDAll) : (NewImg("MovePlant", d.PicArr[d.StandGif], "left:" + (g - 0.5 * (d.beAttackedPointL + d.beAttackedPointR)) + "px;top:" + (e + 20 - d.height) + "px;z-index:254", EDAll), NewImg("MovePlantAlpha", d.PicArr[d.StandGif], "visibility:hidden;filter:alpha(opacity=40);opacity:0.4;z-index:30", EDAll));
    while (c--) {
        SetHidden($(ArCard[c].DID).childNodes[1])
    }
    SetHidden($("dTitle"));
    GroundOnmousemove = GroundOnmousemove1
}, CancelPlant = function() {
    ClearChild($("MovePlant"), $("MovePlantAlpha"));
    oS.Chose = 0;
    MonitorCard();
    GroundOnmousemove = function() {}
}, ShovelPlant = function(a) {
    var b = a[0],
        c = a[1];
    c && (c.PKind || !(b[1] || b[2])) && (c.Die(), oS.MPID = "");
    CancelShovel()
}, ChoseShovel = function(a) {
    WhichMouseButton(a) < 2 && (SetHidden($("imgShovel")), NewImg("tShovel", "images/interface/Shovel.png", "left:" + (a.clientX - 10) + "px;top:" + (a.clientY + document.body.scrollTop - 17) + "px;z-index:1", EDAll), oS.Chose = -1, GroundOnmousemove = GroundOnmousemove2, StopBubble(a))
}, CancelShovel = function(a) {
    var b = oS.MPID;
    ClearChild($("tShovel"));
    oS.Chose = 0;
    SetVisible($("imgShovel"));
    b && SetAlpha($(b).childNodes[1], 100, 1);
    GroundOnmousemove = function() {}
}, StopBubble = function(a) {
    window.event ? event.cancelBubble = true : a.stopPropagation()
}, GrowPlant = function(k, d, c, e, b) {
    var i = oS.ChoseCard,
        f = ArCard[i],
        g = f.PName,
        j = g.prototype,
        h = j.coolTime,
        a;
    j.CanGrow(k, e, b) && (!oS.CardKind ? (new g).Birth(d, c, e, b, k) : asyncInnerHTML((a = new g).CustomBirth(e, b, 0, "auto"), function(m, l) {
        EDZombies.appendChild(m);
        l.Birth()
    }, a), innerText(ESSunNum, oS.SunNum -= j.SunNum), SetHidden($(f.DID).childNodes[1]), h && (f.CDReady = 0, DoCoolTimer(i, j.coolTime)), oSym.addTask(20, SetHidden, [SetStyle($("imgGrowSoil"), {
        left: d - 30 + "px",
        top: c - 40 + "px",
        zIndex: 3 * e,
        visibility: "visible"
    })]));
    CancelPlant()
}, AutoProduceSun = function(a) {
    AppearSun(GetX(Math.floor(1 + Math.random() * oS.C)), GetY(Math.floor(1 + Math.random() * oS.R)), a, 1);
    oSym.addTask(Math.floor(9 + Math.random() * 3) * 100, AutoProduceSun, [a])
}, AppearSun = function(h, f, e, a) {
    var b, d, g = "Sun" + Math.random(),
        c = "cursor:pointer;z-index:25;filter:alpha(opacity=80);opacity:0.8;left:" + h + "px;";
    switch (e) {
        case 25:
            c += "width:78px;height:78px";
            b = 39;
            break;
        case 15:
            c += "width:46px;height:46px";
            b = 23;
            break;
        default:
            c += "width:100px;height:100px";
            b = 55
    }
    a ? (d = 0, oSym.addTask(10, MoveDropSun, [g, f])) : (d = f - b - 20, c += ";top:" + d + "px", oSym.addTask(800, DisappearSun, [g]));
    ArSun[g] = {
        id: g,
        N: e,
        C: 1,
        left: h,
        top: d
    };
    NewImg(g, "images/interface/Sun.gif", c, EDAll, {
        onclick: function() {
            ClickSun(this.id)
        }
    });
    oS.AutoSun && oSym.addTask(100, ClickSun, [g])
}, MoveDropSun = function(c, b) {
    var a = ArSun[c];
    a && a.C && (a.top < b - 53 ? ($(c).style.top = (a.top += 3) + "px", oSym.addTask(5, MoveDropSun, [c, b])) : oSym.addTask(800, DisappearSun, [c]))
}, DisappearSun = function(b) {
    var a = ArSun[b];
    a && a.C && (delete ArSun[b], ClearChild($(b)))
}, ClickSun = function(c) {
    var a = ArSun[c],
        b = oS.SunNum;
    a && a.C && (a.C = 0, innerText(ESSunNum, oS.SunNum = Math.min(b + a.N, 9990)), oSym.addTask(0, MoveClickSun, [c]).addTask(0, MonitorCard, []))
}, MoveClickSun = function(b) {
    var a = 15,
        c = ArSun[b],
        e = 85,
        i = -20,
        d = c.left,
        h = c.top,
        g = Math.round((d - e) / a),
        f = Math.round((h - i) / a);
    (function(k, l, n, s, m, r, j, q, p) {
        (m -= q) > n ? (SetStyle($(k), {
            left: m + "px",
            top: (r -= p) + "px"
        }), oSym.addTask(j, arguments.callee, [k, l, n, s, m, r, j += 0.3, q, p])) : (SetStyle($(k), {
            left: n + "px",
            top: s + "px"
        }), delete ArSun[k], oSym.addTask(20, ClearChild, [$(k)]))
    })(b, c, e, i, d, h, 1, g, f)
}, AutoClickSun = function() {
    var a, b;
    for (b in ArSun) {
        ArSun[b].C && ClickSun(b)
    }
}, ShowLargeWave = function(a) {
    NewImg("LargeWave", "images/interface/LargeWave.gif", "left:71px;top:249px;width:858px;height:102px;z-index:50", EDAll);
    oSym.addTask(4, function(b, c, d) {
        SetStyle($("LargeWave"), {
            width: (b -= 57.2) + "px",
            height: (c -= 6.8) + "px",
            left: 500 - b * 0.5 + "px",
            top: 300 - c * 0.5 + "px"
        });
        b > 286 ? oSym.addTask(4, arguments.callee, [b, c, d]) : (oSym.addTask(460, function() {
            ClearChild($("LargeWave"))
        }, []), d && d())
    }, [858, 102, a])
}, ShowFinalWave = function() {
    var a = function(b) {
        NewImg("FinalWave", "images/interface/FinalWave.gif", "left:122px;top:194px;width:756px;height:213px;z-index:50", EDAll);
        oSym.addTask(4, function(c, e, d) {
            SetStyle($("FinalWave"), {
                width: (c -= 50.4) + "px",
                height: (e -= 14.2) + "px",
                left: 500 - c * 0.5 + "px",
                top: 300 - e * 0.5 + "px"
            });
            c > 252 ? oSym.addTask(4, arguments.callee, [c, e, d]) : oSym.addTask(d, function() {
                ClearChild($("FinalWave"))
            }, [])
        }, [756, 213, b])
    };
    (oP.FlagNum in oS.LargeWaveFlag) ? ShowLargeWave(function() {
        oSym.addTask(560, a, [150])
    }): a(500)
}, GameOver = function() {
    NewImg("iGameOver", "images/interface/ZombiesWon.png", "width:900px;height:600px;z-index:255", EDAll, {
        onclick: function() {
            SelectModal(oS.Lvl)
        }
    });
    oSym.Stop()
}, PrepareGrowPlants = function(a) {
    NewImg("PrepareGrow", "images/interface/PrepareGrowPlants.gif" + $Random + Math.random(), "z-index:50;left:" + (oS.W * 0.5 - 77) + "px;top:" + (oS.H * 0.5 - 54) + "px", EDAll);
    oSym.addTask(250, function(b) {
        ClearChild($("PrepareGrow"));
        b()
    }, [a])
}, CustomPlants = function(b, a, c) {
    (new ArCard[b].PName).Birth(GetX(c), GetY(a), a, c, [])
}, CustomSpecial = function(c, b, d, a) {
    (new c).Birth(GetX(d), GetY(b), b, d, [], a)
}, CheckAutoSun = function(a) {
    var b = a.checked ? 1 : 0;
    b != oS.AutoSun && (addCookie("JSPVZAutoSun", oS.AutoSun = b), b && AutoClickSun())
}, CheckSilence = function(a) {
    var b = a.checked ? 1 : 0;
    b != oS.Silence && (addCookie("JSPVZSilence", oS.Silence = b), b ? ClearMusic() : NewMusic(oS.StartGameMusic))
}, GetNewCard = function(a, b, c) {
    oSym.Clear();
    (SetStyle(a, {
        left: "350px",
        top: "131px",
        width: "200px",
        height: "120px",
        cursor: "default"
    })).onclick = null;
    NewEle("DivA", "div", "width:900px;height:600px;background:#FFF;z-index:255", 0, EDAll);
    oSym.Init(function(d, e) {
        ++d < 100 ? (SetAlpha(e, d, d * 0.01), oSym.addTask(1, arguments.callee, [d, e])) : function() {
            SetHidden(EDAll, $("dTop"));
            var f = b.prototype;
            $("iNewPlantCard").src = f.PicArr[f.NormalGif];
            $("iNewPlantCard").style.marginTop = 180 - f.height + "px";
            innerText($("dNewPlantName"), f.CName);
            $("dNewPlantTooltip").innerHTML = f.Tooltip;
            $("btnNextLevel").onclick = function() {
                SelectModal(c)
            };
            SetStyle($("dNewPlant"), {
                visibility: "visible",
                zIndex: 255
            });
            oSym.Stop()
        }()
    }, [0, $("DivA")])
}, getCookie = function(b) {
    var d = document.cookie,
        e = d.split(";"),
        c = e.length,
        a;
    while (c--) {
        if ((a = e[c].split("="))[0].replace(" ", "") == b) {
            return a[1]
        }
    }
    return 0
}, addCookie = function(a, c, d) {
    var b = a + "=" + escape(c);
    document.cookie = b
}, deleteCookie = function(a) {
    document.cookie = a + "=0;"
}, WordUTF8 = '<div id="dLogo" style="position:absolute;width:900px;height:600px;z-index:1"><image src="images/interface/LogoWord.jpg" style="position:absolute;left:320px;top:15px"><div id="LogoWord" style="position:absolute;color:#FF0;top:480px;width:100%;height:100px"><span style="position:absolute;width:332px;height:94px;left:90px;top:5;cursor:pointer;background:url(images/interface/LoadBar.png)" onclick="SetBlock($(\'dSurface\'),$(\'iSurfaceBackground\'))"></span><span style="position:absolute;font-size:14px;left:450px;top:50px;line-height:1.5;font-weight:bold"><span style="cursor:pointer" onclick="SetVisible($(\'dProcess\'))">关于本程序</span>&nbsp;<span id="sTime"></span><br> <a href=“http://blog.csdn.net/lihaihan" target="_blank" style="color:#FF0;font-family:verdana">作者:lihaihan</a></div></div>', SelectModal = function(g) {
    oS.LvlClearFunc && oS.LvlClearFunc();
    var b = oS.GlobalVariables,
        c = oS.LvlVariables,
        e = oS.SelfVariables,
        a = window,
        d;
    for (d in b) {
        a[d] = b[d]
    }
    for (d in c) {
        a[d] = null
    }
    for (d = e.length; d--; delete oS[e[d]]) {}
    for (d in $Pn) {
        $Pn[d] = null
    }
    oS.GlobalVariables = {};
    oS.LvlVariables = {};
    oS.SelfVariables.length = 0;
    HiddenLevel();
    HiddenMiniGame();
    HiddenRiddleGame();
    SetHidden($("dCardList"), $("tGround"), $("dSelectCard"), $("dTop"), $("dMenu"), $("dHandBook"), $("dNewPlant"), $("dProcess"));
    SetNone($("dSurface"), $("iSurfaceBackground"));
    ClearChild($("dFlagMeterTitleB").firstChild);
    EDAll = $("dBody").replaceChild(EDNewAll, EDAll);
    $("dBody").replaceChild(EDNewFlagMeter, $("dFlagMeter"));
    LoadLvl(g)
}, LoadLvl = function(d, c) {
    oSym.Timer && oSym.Stop();
    var b = oS.CenterContent,
        a = $("dAD");
    (d = d || 0) && oSym.Now == c ? (d = 0, b && (a.innerHTML = b, SetBlock(a))) : b && SetBlock(a);
    oSym.Init(function(f) {
        var e = $("JSPVZ");
        e && ClearChild(e);
        NewEle("JSPVZ", "script", "", {
            src: "level/" + (oS.Lvl = f) + ".js",
            type: "text/javascript"
        }, document.getElementsByTagName("head").item(0))
    }, [d])
}, AppearTombstones = function(m, d, l) {
    var q = oGd.$Tombstones,
        h = [],
        g = oS.R + 1,
        b, c = 0,
        p, a, f, e, r = oGd.$,
        k, n;
    while (--g) {
        f = d;
        while (f >= m) {
            !q[g + "_" + f] && (h[c++] = [g, f]);
            --f
        }
    }
    while (l--) {
        p = h[f = Math.floor(Math.random() * h.length)];
        q[n = (g = p[0]) + "_" + (b = p[1])] = 1;
        for (e = 0; e < 4; e++) {
            (k = r[n + "_" + e]) && k.Die()
        }
        h.splice(f, 1);
        a = NewEle("dTombstones" + g + "_" + b, "div", "position:absolute;width:86px;height:91px;left:" + (GetX(b) - 43) + "px;top:" + (GetY(g) - 91) + "px", 0, EDAll);
        g = Math.floor(Math.random() * 4);
        b = Math.floor(Math.random() * 2);
        NewEle("", "div", "background-position:-" + 86 * b + "px -" + 91 * g + "px", {
            className: "Tom1"
        }, a);
        NewEle("", "div", "background-position:-" + 86 * b + "px -" + 91 * g + "px", {
            className: "Tom2"
        }, a)
    }
}, PauseGame = function(b) {
    var a = oSym;
    a.Timer ? (a.Stop(), innerText(b, "回到游戏"), $("dMenu1").onclick = null, SetBlock($("dSurface"), $("dPause")), $("dPauseAD").innerHTML = oS.CenterContent ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="320" height="240" id="adPause" align="middle"><param name="allowScriptAccess" value="always"/><param name="allowFullScreen" value="false" /><param name="movie" value="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed width="320" height="240" src="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" quality="high" pluginspage="http://www.adobe.com/go/getflashplayer_cn" align="middle" play="true" loop="true" scale="showall" wmode="window" devicefont="false" bgcolor="#ffffff" name="ad" menu="true" allowfullscreen="false" allowscriptaccess="always" salign="" type="application/x-shockwave-flash"></object>' : '<img src="images/Zombies/NewspaperZombie/1.gif">') : (a.Start(), innerText(b, "暂停游戏"), $("dMenu1").onclick = ClickMenu, SetNone($("dSurface"), $("dPause")), $("dPauseAD").innerHTML = "")
}, ClickMenu = function() {
    oSym.Timer && (oSym.Stop(), SetBlock($("dSurface")), ShowOptions())
}, OptionsMenuDown = function(b, a) {
    b.className = "OptionsMenuButtonDown";
    a.style.lineHeight = "102px"
}, OptionsMenuUP = function(b, a) {
    b.className = "OptionsMenuButton";
    a.style.lineHeight = "100px"
}, ShowLevel = function() {
    SetBlock($("dSurfaceBack"), $("dOptionsMenuback"), $("dSelectLevel"), $("dTitleSmallContainer"))
}, HiddenLevel = function() {
    SetNone($("dSurfaceBack"), $("dOptionsMenuback"), $("dSelectLevel"), $("dTitleSmallContainer"))
}, ShowMiniGame = function() {
    SetBlock($("dSurfaceBack"), $("dOptionsMenuback"), $("dSelectLevel"), $("dMiniSmallContainer"))
}, HiddenMiniGame = function() {
    SetNone($("dSurfaceBack"), $("dOptionsMenuback"), $("dSelectLevel"), $("dMiniSmallContainer"))
}, ShowRiddleGame = function() {
    SetBlock($("dSurfaceBack"), $("dOptionsMenuback"), $("dSelectLevel"), $("dRiddleSmallContainer"))
}, HiddenRiddleGame = function() {
    SetNone($("dSurfaceBack"), $("dOptionsMenuback"), $("dSelectLevel"), $("dRiddleSmallContainer"))
}, ShowOptions = function() {
    SetBlock($("dSurfaceBack"), $("dOptionsMenuback"), $("dOptionsMenu"))
}, HiddenOptions = function() {
    SetNone($("dSurfaceBack"), $("dOptionsMenuback"), $("dOptionsMenu"));
    oS.Lvl && (SetNone($("dSurface")), PauseGame($("dMenu0")))
}, ShowHelp = function() {
    SetBlock($("dSurfaceBack"), $("dHelp"))
}, HiddenHelp = function() {
    SetNone($("dSurfaceBack"), $("dHelp"))
}, LoadProProcess = function() {
    var a = $("JSProcess"),
        b = $("dProcess2");
    a ? ($User.Browser.IE ? a.onreadystatechange = function() {
        a.readyState == "loaded" && ClearChild(a)
    } : a.onload = function() {
        ClearChild(a)
    }, a.onerror = function() {
        ClearChild(this)
    }, !$("dText1") && b.insertBefore(NewEle("dText1", "div", 0, {
        innerHTML: '<span style="line-height:1.5;width:524px;font-size:15px; font-family:&#x9ED1;&#x4F53;;color:#F60; top:32px">欢迎来到<span style="font-family:Verdana;font-weight:700">LonelyStar</span>&#x7684;<span style="font-family:Verdana;font-weight:700">JavaScript</span>版植物大战僵尸!<br><a style="color:#FF0;font-size:14px;text-decoration:none" href="http://www.lonelystar.org/" target="_blank">作者主页</a>&nbsp;&nbsp;&nbsp;<a style="color:#FF0;font-size:14px;text-decoration:none" href="http://www.lonelystar.org/view" target="_blank">给我留言</a>&nbsp;&nbsp;&nbsp;<a href="http://www.xiazai.com" target="_blank"  style="color:#FF0;font-size:14px;text-decoration: none">合作伙伴:A5下载</a><br>程序属于个人开发作品,与任何公司无关<br>LonelyStar保留对该JS版植物大战僵尸版权所有,素材版权归POPCAP公司所有<br></b></span><br>'
    }, 0), b.firstChild), a.src = "http://" + $User.AuthorWebsite + "/js/Process.js?" + Math.random()) : $("sTime").innerHTML = oS.Version
}, $ = function(a) {
    return document.getElementById(a)
}, $n = function(a) {
    return document.createElement(a)
}, ClearChild = function() {
    var a = arguments.length,
        c;
    while (a--) {
        try {
            c = arguments[a];
            c.parentNode.removeChild(c);
            c = null
        } catch (b) {}
    }
}, SetBlock = function() {
    var a = arguments.length;
    while (a--) {
        arguments[a].style.display = "block"
    }
}, SetNone = function() {
    var a = arguments.length;
    while (a--) {
        arguments[a].style.display = "none"
    }
}, SetHidden = function() {
    var a = arguments.length;
    while (a--) {
        arguments[a].style.visibility = "hidden"
    }
}, SetVisible = function() {
    var a = arguments.length;
    while (a--) {
        arguments[a].style.visibility = "visible"
    }
}, SetAlpha = $User.Browser.IE6 ? function(c, b, a) {
    c.style.filter = "alpha(opacity=" + b + ")"
} : function(c, b, a) {
    c.style.opacity = a
}, SetStyle = function(d, b) {
    var c = d.style,
        a;
    for (a in b) {
        c[a] = b[a]
    }
    return d
}, NewImg = function(f, e, b, c, d) {
    var a = $n("img");
    a.src = e;
    b && (a.style.cssText = b);
    if (d) {
        for (v in d) {
            a[v] = d[v]
        }
    }
    f && (a.id = f);
    c && c.appendChild(a);
    return a
}, EditImg = function(e, f, c, b, a) {
    f && (e.id = f);
    c && (e.src = c);
    b && SetStyle(e, b);
    a && a.appendChild(e);
    return e
}, NewEle = function(h, b, d, a, e, f, g, c) {
    g = $n(b);
    h && (g.id = h);
    d && (g.style.cssText = d);
    if (a) {
        for (c in a) {
            g[c] = a[c]
        }
    }
    if (f) {
        for (c in f) {
            g.setAttribute(c, f[c])
        }
    }
    e && e.appendChild(g);
    return g
}, EditEle = function(g, f, a, e, b, c) {
    if (f) {
        for (c in f) {
            g.setAttribute(c, f[c])
        }
    }
    a && SetStyle(g, a);
    if (b) {
        for (c in b) {
            g[c] = b[c]
        }
    }
    e && e.appendChild(g);
    return g
}, NewO = function(b, a) {
    return (a = function() {}).prototype = b, a
}, SetPrototype = function(d, c, a) {
    a = d.prototype;
    for (var b in c) {
        a[b] = c[b]
    }
}, InheritO = function(d, i, c, g, b, h, f, e, a) {
    var g = function() {};
    g.prototype = new d;
    i && SetPrototype(g, i);
    if (c) {
        a = g.prototype;
        for (f in c) {
            b = a[f].slice(0);
            h = c[f];
            for (e in h) {
                b[e] = h[e]
            }
            g.prototype[f] = b
        }
    }
    return g
}, Compare = function(e, b, a, c, d) {
    return d = e < b ? b : e > a ? a : e, c ? [c(d), d] : [d]
}, $Switch = function(h, d, c, a, g, b, e) {
    b = 0;
    g = d.length;
    e = c;
    while (b < g) {
        if (e(h, d[b])) {
            break
        }++b
    }
    return a[b]
}, $SEql = function(c, b, a) {
    return (c in b) ? b[c] : b["default"]
};
$SSml = function(d, c, a) {
    var b = 0;
    LX = c.length;
    while (b < LX) {
        if (d < c[b]) {
            break
        }++b
    }
    return a[b]
}, $SGrt = function(d, c, a) {
    var b = 0;
    LX = c.length;
    while (b < LX) {
        if (d > c[b]) {
            break
        }++b
    }
    return a[b]
}, ImgSpriter = function(h, c, e, f, g) {
    var b = e[f],
        d = b[2],
        a = $(h);
    a && (a.style.backgroundPosition = b[0], oSym.addTask(b[1], function(j) {
        j > -1 ? ImgSpriter(h, c, e, j, g) : g(h, c)
    }, [d]))
}, Ajax = function(a, d, c) {
    var b;
    (b = window.XMLHttpRequest ? (new XMLHttpRequest()) : new window.ActiveXObject("Microsoft.XMLHTTP")) && (b.onreadystatechange = function() {
        b.readyState == 4 && b.status == 200 && d(b.responseText)
    }, b.open("GET", a, true), b.send(c))
}, ShowAD = function(h, g) {
    var f = screen.width,
        d = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="330" height="250" id="adCenter" align="middle"><param name="allowScriptAccess" value="always"/><param name="allowFullScreen" value="false" /><param name="movie" value="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed width="330" height="250" src="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" quality="high" pluginspage="http://www.adobe.com/go/getflashplayer_cn" align="middle" play="true" loop="true" scale="showall" wmode="window" devicefont="false" bgcolor="#ffffff" name="ad" menu="true" allowfullscreen="false" allowscriptaccess="always" salign="" type="application/x-shockwave-flash"></object>',
        b = '<div><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="330" height="250" id="ad2" align="middle"><param name="allowScriptAccess" value="always"/><param name="allowFullScreen" value="false" /><param name="movie" value="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed width="330" height="250" src="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" quality="high" pluginspage="http://www.adobe.com/go/getflashplayer_cn" align="middle" play="true" loop="true" scale="showall" wmode="window" devicefont="false" bgcolor="#ffffff" name="ad" menu="true" allowfullscreen="false" allowscriptaccess="always" salign="" type="application/x-shockwave-flash"></object></div>',
        a = '<div><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="120" height="80" id="ad2" align="middle"><param name="allowScriptAccess" value="always"/><param name="allowFullScreen" value="false" /><param name="movie" value="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed width="120" height="80" src="images/link/flash.swf?pubid=ca-games-pub-8771551875705681&channels=2041779255&contentid=%ef%bf%bd%ef%bf%bd%ef%bf%bd%d0%b4&adType=graphical_fullscreen&adWidth=330&adHeight=250&descriptionUrl=http%3a%2f%2fwww.5654.com" quality="high" pluginspage="http://www.adobe.com/go/getflashplayer_cn" align="middle" play="true" loop="true" scale="showall" wmode="window" devicefont="false" bgcolor="#ffffff" name="ad" menu="true" allowfullscreen="false" allowscriptaccess="always" salign="" type="application/x-shockwave-flash"></object></div>',
        c = f > 1024 ? b : a;
    c += '<div class="a5gg"><dl style="margin: 0px;clear: both"><dt><a href="http://youxi.xiazai.com/xiao" target="_blank">更多小游戏</a></dt><dd><a href="http://youxi.xiazai.com/xiao/dongzuo" target="_blank">动作</a></dd><dd><a href="http://youxi.xiazai.com/xiao/yizhi" target="_blank">益智</a></dd><dd><a href="http://youxi.xiazai.com/xiao/xiuxian" target="_blank">休闲</a></dd><dd><a href="http://youxi.xiazai.com/xiao/pintu" target="_blank">拼图</a></dd><dd><a href="http://youxi.xiazai.com/xiao/qipai" target="_blank">棋牌</a></dd><dd><a href="http://youxi.xiazai.com/xiao/maoxian" target="_blank">冒险</a></dd><dd><a href="http://youxi.xiazai.com/xiao/jiaoyu" target="_blank">教育</a></dd><dd><a href="http://youxi.xiazai.com/xiao/xiaochu" target="_blank">消除</a></dd><dd><a href="http://youxi.xiazai.com/xiao/moni" target="_blank">模拟</a></dd><dd><a href="http://youxi.xiazai.com/xiao/tanqiu" target="_blank">弹球</a></dd><dd><a href="http://youxi.xiazai.com/xiao/jiemi" target="_blank">解谜</a></dd><dd><a href="http://youxi.xiazai.com/xiao/tiyu" target="_blank">体育</a></dd><dd><a href="http://youxi.xiazai.com/xiao/sheji" target="_blank">射击</a></dd><dd><a href="http://youxi.xiazai.com/xiao/saiche" target="_blank">赛车</a></dd><dd><a href="http://youxi.xiazai.com/xiao/meinv" target="_blank">美女</a></dd></dl></div>';
    (NewEle("dAD", "div", "position:absolute;left:285px;top:125px;z-index:200", 0, $("dAll"))).innerHTML = d;
    (NewEle("dAD2", "div", "position:absolute;left:903px;top:0;z-index:200", 0, document.body)).innerHTML = c;
    oS.CenterContent = d;
    document.write('<div id="dLink"><div><a href="http://www.xiazai.com/" target="_blank" style="color:#FF0;font-weight:bold"><img src="images/link/a5logo.png" border="0" title="非常感谢a5下载网站友情赞助的空间" height="59"></a></div><div><a href="http://www.xiaody.com" target="_blank"><img height="59" src="http://www.xiaody.com/logo.gif" alt="小电影" border="0"></a></div>');
    google_ad_client = "ca-pub-0191257348916303";
    google_ad_slot = "4641932981";
    google_ad_width = 468;
    google_ad_height = 60;
    document.write('<div><script src="http://pagead2.googlesyndication.com/pagead/show_ads.js"><\/script></div><div><script src="http://s9.cnzz.com/stat.php?id=2462431&web_id=2462431&show=pic"><\/script></div>');
    $User.TopisAuthorWebsite && (function() {
        _gaq = [];
        _gaq.push(["_setAccount", "UA-18730911-2"]);
        _gaq.push(["_trackPageview"]);
        var i = document.createElement("script"),
            e = document.getElementsByTagName("script")[0];
        i.type = "text/javascript";
        i.async = true;
        i.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
        e.parentNode.insertBefore(i, e)
    })()
}, NewMusic = function(a) {
    $("oEmbed").innerHTML = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="0" height="0" align="middle"><param name="allowScriptAccess" value="always"/><param name="allowFullScreen" value="false" /><param name="movie" value="music/' + a + '" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed width="0" height="0" src="music/' + a + '" quality="high" pluginspage="http://www.adobe.com/go/getflashplayer_cn" align="middle" play="true" loop="true" scale="showall" wmode="window" devicefont="false" bgcolor="#ffffff" name="ad" menu="true" allowfullscreen="false" allowscriptaccess="always" salign="" type="application/x-shockwave-flash"></object>'
}, ClearMusic = function() {
    $("oEmbed").innerHTML = ""
};