var CZombies = function(b, a) {
        return (a = function() {}).prototype = {
            name: "Zombies",
            HP: 270,
            Lvl: 1,
            NormalGif: 2,
            CardGif: 0,
            BookHandBack: 0,
            AttackGif: 3,
            LostHeadGif: 4,
            LostHeadAttackGif: 5,
            HeadGif: 6,
            DieGif: 7,
            BoomDieGif: 8,
            width: 166,
            height: 144,
            beAttackedPointL: 82,
            beAttackedPointR: 156,
            BreakPoint: 90,
            SunNum: 50,
            coolTime: 0,
            Ornaments: 0,
            OrnHP: 0,
            OSpeed: 1.6,
            Speed: 1.6,
            CSS_fliph: "",
            CSS_alpha: "",
            AKind: 0,
            beAttacked: 1,
            isAttacking: 0,
            Attack: 100,
            WalkDirection: 0,
            Altitude: 1,
            FreeSetbodyTime: 0,
            FreeFreezeTime: 0,
            FreeSlowTime: 0,
            CanPass: function(d, c) {
                return c && c != 2
            },
            CanGrow: function(d, c, e) {
                return this.CanPass(c, oGd.$LF[c]) && e > oS.ArP.ArC[1]
            },
            ChkActs: function(h, f, j, e) {
                var d, c, g;
                !(h.FreeFreezeTime || h.FreeSetbodyTime) ? (h.beAttacked && !h.isAttacking && h.JudgeAttack(), !h.isAttacking ? ((c = h.AttackedRX -= (d = h.Speed)) < -50 ? (j.splice(e, 1), h.Die(2), g = 0) : (c < 100 && !h.PointZombie && (h.PointZombie = 1, h.ChangeR({
                    R: f,
                    ar: [oS.R - 1],
                    CustomTop: 400 - h.height + h.GetDY()
                })), h.ZX = h.AttackedLX -= d, h.Ele.style.left = Math.floor(h.X -= d) + "px", g = 1)) : g = 1) : g = 1;
                return g
            },
            ChkActs1: function(g, e, h, d) {
                var c, f;
                !(g.FreeFreezeTime || g.FreeSetbodyTime) ? (g.beAttacked && !g.isAttacking && g.JudgeAttack(), !g.isAttacking ? (g.AttackedLX += (c = g.Speed)) > oS.W ? (h.splice(d, 1), g.Die(2), f = 0) : (g.ZX = g.AttackedRX += c, g.Ele.style.left = Math.ceil(g.X += c) + "px", f = 1) : f = 1) : f = 1;
                return f
            },
            GetDX: function() {
                return -110
            },
            GetDY: function() {
                return -10
            },
            GetDTop: 0,
            getRaven: function(c) {
                return this.Die(2), 1
            },
            getFireball: function(h, e, g) {
                h.FreeSlowTime = 0;
                h.Attack = 100;
                !(h.FreeFreezeTime || h.FreeSetbodyTime) && (h.Speed = h.OSpeed);
                var f = h.AttackedLX,
                    j = h.AttackedRX,
                    c = !g ? oZ.getArZ(f, f + 40, h.R) : oZ.getArZ(j - 40, j, h.R),
                    d = c.length;
                while (d--) {
                    c[d].getSputtering()
                }
            },
            getSputtering: function() {
                this.getHurt(1, 0, 13)
            },
            getSlow: function(h, f, g) {
                var d = oSym.Now + g,
                    e = h.FreeSlowTime,
                    c = 0;
                switch (true) {
                    case !e:
                        !(h.FreeFreezeTime || h.FreeSetbodyTime) && (h.Speed = 0.5 * h.OSpeed);
                        h.Attack = 50;
                    case e < d:
                        h.FreeSlowTime = d;
                        c = 1
                }
                c && oSym.addTask(g, function(j, i) {
                    var k = $Z[j];
                    k && k.FreeSlowTime == i && (k.FreeSlowTime = 0, k.Attack = 100, k.Speed && (k.Speed = k.OSpeed))
                }, [f, d])
            },
            getFreeze: function(d, c) {
                d.beAttacked && d.getHurt(-1, 0, 20);
                d.Speed = 0;
                oSym.addTask(400, function(g, f, e) {
                    ClearChild(e);
                    var h = $Z[g];
                    h && h.FreeFreezeTime == f && (h.FreeFreezeTime = 0, h.Attack = 50, !h.FreeSetbodyTime && (h.Speed = 0.5 * h.OSpeed, h.isAttacking && h.JudgeAttack()), oSym.addTask(1500, function(j, i) {
                        var k = $Z[j];
                        k && k.FreeSlowTime == i && (k.FreeSlowTime = 0, k.Attack = 100, !k.FreeSetbodyTime && (k.Speed = k.OSpeed))
                    }, [g, h.FreeSlowTime = oSym.Now + 1500]))
                }, [c, d.FreeFreezeTime = oSym.Now + 400, NewImg("icetrap_" + Math.random(), "images/Plants/IceShroom/icetrap.gif", d.getShadow(d), d.Ele)])
            },
            ChangeR: function(e) {
                var h = e.R,
                    g = e.ar || [],
                    j = e.CustomTop,
                    d = this,
                    q = h - 1,
                    l, k = d.id,
                    m = -1,
                    f = d.Ele,
                    n = d.EleBody,
                    i = oGd.$LF,
                    c;
                !g.length && (d.CanPass(q, i[q]) && (g[++m] = q), d.CanPass(q += 2, i[q]) && (g[++m] = q));
                g.length ? (l = !d.WalkDirection ? -5 : 5, d.ZX += l, d.AttackedLX += l, d.AttackedRX += l, d.X += l, q = g[Math.floor(Math.random() * g.length)], SetStyle(f, {
                    left: d.X + "px",
                    top: (d.pixelTop = j == undefined ? GetY(q) - d.height + d.GetDY() : j) + "px",
                    zIndex: d.zIndex = 3 * q + 1
                }), d.isAttacking && (n.src = d.PicArr[d.NormalGif]), oZ.moveTo(k, h, q)) : n.src = d.PicArr[d.NormalGif];
                d.isAttacking = 0
            },
            getShadow: function(c) {
                return "left:" + (c.beAttackedPointL - 10) + "px;top:" + (c.height - 22) + "px"
            },
            Init: function(g, i, e, d) {
                var c = 0,
                    h = this,
                    f = [];
                i.AttackedRX = (i.X = (i.ZX = i.AttackedLX = g) - i.beAttackedPointL) + i.beAttackedPointR;
                while (--d) {
                    i.CanPass(d, e[d]) && (f[c++] = d)
                }
                i.ArR = f;
                i.ArHTML = ['<div id="', '" style="position:absolute;display:', ";left:", "px;top:", "px;z-index:", '"><img src="' + ShadowPNG + '" style="' + i.getShadow(i) + '"><img style="position:absolute;clip:rect(0,auto,', ",0);top:", 'px" src="', '"></div>']
            },
            getHTML: function(d, g, i, h, f, k, j, c) {
                var e = this.ArHTML;
                return e[0] + d + e[1] + f + e[2] + g + e[3] + i + e[4] + h + e[5] + k + e[6] + j + e[7] + c + e[8]
            },
            prepareBirth: function(f) {
                var h = this,
                    e = h.ArR,
                    d = e[Math.floor(Math.random() * e.length)],
                    g = GetY(d) + h.GetDY(),
                    c = g - h.height,
                    j = 3 * d + 1,
                    i = h.id = "Z_" + Math.random();
                h.R = d;
                h.pixelTop = c;
                h.zIndex = j;
                (h.delayT = f) && (h.FreeSetbodyTime = oSym.Now);
                return h.getHTML(i, h.X, c, j, "none", "auto", h.GetDTop, h.PicArr[h.NormalGif])
            },
            CustomBirth: function(i, c, d, m) {
                var g = this,
                    f = GetY(i) + g.GetDY(),
                    h = f - g.height,
                    k = 3 * i + 1,
                    e = g.id = "Z_" + Math.random(),
                    l = g.beAttackedPointL,
                    j = g.beAttackedPointR;
                g.AttackedRX = (g.X = (g.ZX = g.AttackedLX = GetX(c) - (j - l) * 0.5) - l) + j;
                g.R = i;
                g.pixelTop = h;
                g.zIndex = k;
                (g.delayT = d) && (g.FreeSetbodyTime = oSym.Now);
                return g.getHTML(e, g.X, h, k, "none", m || 0, g.GetDTop, g.PicArr[g.NormalGif])
            },
            BirthCallBack: function(f) {
                var e = f.delayT,
                    d = f.id,
                    c = f.Ele = $(d);
                f.EleShadow = c.firstChild;
                f.EleBody = c.childNodes[1];
                e ? oSym.addTask(e, function(h, g) {
                    var i = $Z[h];
                    i && (i.FreeSetbodyTime = 0, SetBlock(g))
                }, [d, c]) : SetBlock(c)
            },
            Birth: function() {
                var c = this;
                oZ.add($Z[c.id] = c);
                c.BirthCallBack(c)
            },
            Die: function(d) {
                var e = this,
                    f = e.id,
                    c = e.Ele;
                !d ? (e.EleBody.src = e.PicArr[e.DieGif] + Math.random(), oSym.addTask(250, ClearChild, [c])) : d < 2 ? (e.EleBody.src = e.PicArr[e.BoomDieGif] + Math.random(), oSym.addTask(300, ClearChild, [c])) : ClearChild(c);
                e.HP = 0;
                delete $Z[f];
                e.PZ && oP.MonPrgs()
            },
            GoingDieHead: function(e, c, d) {
                oSym.addTask(200, ClearChild, [NewImg(0, c[d.HeadGif] + Math.random(), "left:" + d.AttackedLX + "px;top:" + (d.pixelTop - 20) + "px;z-index:" + d.zIndex, EDZombies)])
            },
            GoingDie: function(d) {
                var c = this,
                    e = c.id;
                c.EleBody.src = d;
                c.GoingDieHead(e, c.PicArr, c);
                c.beAttacked = 0;
                c.FreeFreezeTime = c.FreeSetbodyTime = c.FreeSlowTime = 0;
                c.AutoReduceHP(e)
            },
            AutoReduceHP: function(c) {
                oSym.addTask(100, function(e) {
                    var d = $Z[e];
                    d && ((d.HP -= 60) < 1 ? d.Die(0) : d.AutoReduceHP(e))
                }, [c])
            },
            JudgeAttack: function() {
                var g = this,
                    d = g.ZX,
                    e = g.R + "_",
                    f = GetC(d),
                    h = oGd.$,
                    c;
                (c = g.JudgeLR(g, e, f, d, h) || g.JudgeSR(g, e, f, d, h)) ? (!g.isAttacking && (g.isAttacking = 1, g.EleBody.src = g.PicArr[g.AttackGif]), g.NormalAttack(c[0], c[1])) : g.isAttacking && (g.isAttacking = 0, g.EleBody.src = g.PicArr[g.NormalGif])
            },
            JudgeLR: function(f, d, e, c, g) {
                return e > 10 || e < 1 ? false : function() {
                    d += --e + "_";
                    var h = 3,
                        i;
                    while (h--) {
                        if ((i = g[d + h]) && i.canEat) {
                            return i.AttackedRX >= c && i.AttackedLX <= c ? [f.id, i.id] : false
                        }
                    }
                }()
            },
            JudgeSR: function(f, d, e, c, g) {
                return e > 9 ? false : function() {
                    d += e + "_";
                    var h = 3,
                        i;
                    while (h--) {
                        if ((i = g[d + h]) && i.canEat) {
                            return i.AttackedRX >= c && i.AttackedLX <= c ? [f.id, i.id] : false
                        }
                    }
                }()
            },
            JudgeAttackH1: function() {
                var e = this,
                    d = oZ.getZ0(e.ZX, e.R),
                    c = e.id;
                d && d.beAttacked && d.AttackedLX < 900 && d.Altitude == 1 && (e.AttackZombie(d.id), !d.isAttacking && d.AttackZombie(c))
            },
            JudgeAttackH: function() {
                var e = this,
                    d = oZ.getZ0(e.ZX, e.R),
                    f = e.id,
                    c;
                d && d.beAttacked && d.AttackedLX < 900 && d.Altitude == 1 ? (!e.isAttacking ? (e.isAttacking = 1, e.EleBody.src = e.PicArr[e.AttackGif], e.AttackZombie(f, c = d.id), !d.isAttacking && d.AttackZombie2(d, c, f)) : e.AttackZombie(f, d.id, 1)) : e.isAttacking && (e.isAttacking = 0, e.EleBody.src = e.PicArr[e.NormalGif])
            },
            AttackZombie: function(d, c) {
                oSym.addTask(10, function(f, e) {
                    var h = $Z[f],
                        g;
                    h && h.beAttacked && !h.FreeFreezeTime && !h.FreeSetbodyTime && ((g = $Z[e]) && g.getHurt(-1, 0, 10), h.JudgeAttackH())
                }, [d, c])
            },
            AttackZombie2: function(e, d, c) {
                e.isAttacking = 1;
                e.EleBody.src = e.PicArr[e.AttackGif];
                oSym.addTask(10, function(g, f) {
                    var i = $Z[g],
                        h;
                    i && i.beAttacked && !i.FreeFreezeTime && !i.FreeSetbodyTime && ((h = $Z[f]) ? (h.getHurt(-1, 0, 10), oSym.addTask(10, arguments.callee, [g, f])) : (i.isAttacking = 0, i.EleBody.src = i.PicArr[i.NormalGif]))
                }, [d, c])
            },
            NormalAttack: function(d, c) {
                oSym.addTask(100, function(f, e) {
                    var h = $Z[f],
                        g;
                    h && h.beAttacked && !h.FreeFreezeTime && !h.FreeSetbodyTime && ((g = $P[e]) && g.getHurt(h, h.AKind, h.Attack), h.JudgeAttack())
                }, [d, c])
            },
            PZ: 1,
            ExchangeLR: function(f, d) {
                var e = f.width,
                    h = f.beAttackedPointL,
                    c = f.beAttackedPointR,
                    g = f.Ele;
                g.style.left = (f.X = f.AttackedLX - (f.beAttackedPointL = e - c)) + "px";
                f.beAttackedPointR = e - h;
                f.EleShadow.style.cssText = f.getShadow(f);
                f.ExchangeLR2(f, f.EleBody, d)
            },
            ExchangeLR2: $User.Browser.IE ? function(e, c, d) {
                c.style.filter = e.CSS_alpha + (e.CSS_fliph = d ? " fliph" : "")
            } : function(e, c, d) {
                c.className = d ? "fliph" : ""
            },
            bedevil: function(c) {
                c.ExchangeLR(c, 1);
                c.JudgeAttack = c.JudgeAttackH;
                c.PZ = 0;
                c.WalkDirection = 1;
                c.ZX = c.AttackedRX;
                c.ChkActs = c.ChkActs1;
                oP.MonPrgs()
            },
            SetAlpha: $User.Browser.IE ? function(f, d, e, c) {
                d.style.filter = (f.CSS_alpha = "alpha(opacity=" + e + ")") + f.CSS_fliph
            } : function(f, d, e, c) {
                d.style.opacity = c
            }
        }, a
    }(),
    OrnNoneZombies = InheritO(CZombies, {
        getHurt: function(i, a, g, l, c, k, j) {
            var e = this;
            if (!e.beAttacked) {
                j && e.Die(2);
                return
            }
            var b = e.id,
                h = e.HP,
                d = e.PicArr,
                f = e.isAttacking;
            switch (true) {
                case (h -= g) < 1:
                    e.HP = 0;
                    e.Die(j);
                    return;
                case h < 91:
                    e.HP = h;
                    e.GoingDie(d[[e.LostHeadGif, e.LostHeadAttackGif][f]]);
                    return
            }
            e.HP = h;
            switch (l) {
                case -1:
                    e.getSlow(e, b, 1000);
                    break;
                case 1:
                    e.getFireball(e, b, a)
            }
            e.SetAlpha(e, e.EleBody, 50, 0.5);
            oSym.addTask(10, function(n) {
                var m = $Z[n];
                m && m.SetAlpha(m, m.EleBody, 100, 1)
            }, [b])
        }
    }),
    oBackupDancer = InheritO(OrnNoneZombies, {
        EName: "oBackupDancer",
        CName: "伴舞僵尸",
        OSpeed: 3.5,
        Speed: 3.5,
        Lvl: 1,
        StandGif: 9,
        width: 126,
        height: 152,
        beAttackedPointL: 50,
        beAttackedPointR: 95,
        Speed: 3.5,
        OSpeed: 3.5,
        PicArr: (function() {
            var a = "images/Zombies/BackupDancer/";
            return ["images/Card/Zombies/BackupDancer.png", "images/Card/Zombies/BackupDancerG.png", a + "BackupDancer.gif", a + "Attack.gif", a + "LostHead.gif", a + "LostHeadAttack.gif", a + "Head.gif" + $Random, a + "Die.gif" + $Random, a + "BoomDie.gif" + $Random, a + "Dancing.gif" + $Random, a + "LostHeadDancing.gif" + $Random, a + "Mound.gif" + $Random]
        })(),
        bedevil: function(a) {
            a.ExchangeLR(a, 1);
            a.JudgeAttack = a.JudgeAttackH;
            a.PZ = 0;
            a.WalkDirection = 1;
            a.ZX = a.AttackedRX;
            a.ChkActs = a.ChkActs1;
            a.Speed = 3.5;
            a.ChangeChkActsTo1(a, a.id, a.EleBody);
            oP.MonPrgs()
        },
        getSlow: function(f, d, e) {
            var b = oSym.Now + e,
                c = f.FreeSlowTime,
                a = 0;
            switch (true) {
                case !c:
                    f.Attack = 50;
                case c < b:
                    f.FreeSlowTime = b;
                    a = 1
            }
            a && oSym.addTask(e, function(h, g) {
                var i = $Z[h];
                i && i.FreeSlowTime == g && (i.FreeSlowTime = 0, i.Attack = 100)
            }, [d, b])
        },
        getFreeze: function(b, a) {
            b.beAttacked && b.getHurt(-1, 0, 20);
            oSym.addTask(400, function(e, d, c) {
                ClearChild(c);
                var f = $Z[e];
                f && f.FreeFreezeTime == d && (f.FreeFreezeTime = 0, f.Attack = 50, !f.FreeSetbodyTime && f.isAttacking && f.JudgeAttack(), oSym.addTask(1500, function(h, g) {
                    var i = $Z[h];
                    i && i.FreeSlowTime == g && (i.FreeSlowTime = 0, i.Attack = 100)
                }, [e, f.FreeSlowTime = oSym.Now + 1500]))
            }, [a, b.FreeFreezeTime = oSym.Now + 400, NewImg("icetrap_" + Math.random(), "images/Plants/IceShroom/icetrap.gif", b.getShadow(b), b.Ele)])
        },
        CustomBirth: function(g, d, a, b, j) {
            var e = this,
                c = GetY(g) + e.GetDY(),
                f = c - e.height,
                i = e.beAttackedPointL,
                h = e.beAttackedPointR;
            e.AttackedRX = (e.X = (e.ZX = e.AttackedLX = d - (h - i) * 0.5) - i) + h;
            e.R = g;
            (e.delayT = a) && (e.FreeSetbodyTime = oSym.Now);
            return e.getHTML(e.id = b, e.X, e.pixelTop = f, e.zIndex = 3 * g + 1, "none", j || 0, e.height + "px", e.PicArr[e.StandGif])
        },
        Produce: '当舞王僵尸摇摆时，这种僵尸四个结伙出现。</p><p>韧性：<font color="#FF0000">低</font><br>伴舞僵尸曾在位于僵尸纽约城的“咀利牙”表演艺术学院钻研过六年的舞技。',
        BirthCallBack: function(e) {
            var d = e.delayT,
                c = e.id,
                b = e.Ele = $(c),
                a = e.EleBody = b.childNodes[1];
            e.EleShadow = b.firstChild;
            oSym.addTask(d, function(g, f) {
                var h = $Z[g];
                h && (h.FreeSetbodyTime = 0, SetBlock(f))
            }, [c, b])
        },
        ChangeChkActsTo0: function(c, b, a) {
            if (!c.PZ) {
                c.ChangeChkActsTo1(c, b, a);
                return
            }
            c.LostHeadGif = 10;
            c.NormalGif = 9;
            !c.isAttacking && (a.src = c.PicArr[9]);
            c.Speed = c.DZStep = 0;
            oSym.addTask(200, function(e, d) {
                var f = $Z[e];
                f && f.beAttacked && f.ChangeChkActsTo1(f, e, d)
            }, [b, a])
        },
        ChangeChkActsTo1: function(c, b, a) {
            c.LostHeadGif = 4;
            c.NormalGif = 2;
            c.DZStep = 1;
            !c.isAttacking && (a.src = c.PicArr[2]);
            c.PZ && oSym.addTask(220, function(e, d) {
                var f = $Z[e];
                f && f.beAttacked && f.ChangeChkActsTo0(f, e, d)
            }, [b, a])
        },
        ChkActs: function(g, d, h, c) {
            var e, b, a, f;
            !(g.FreeFreezeTime || g.FreeSetbodyTime) ? (g.beAttacked && !g.isAttacking && g.JudgeAttack(), e = g.id, !g.isAttacking ? ((a = g.AttackedRX -= (b = g.Speed)) < -50 ? (h.splice(c, 1), g.Die(2), f = 0) : (a < 100 && !g.PointZombie && (g.PointZombie = 1, g.ChangeR({
                R: d,
                ar: [oS.R - 1],
                CustomTop: 400 - g.height + g.GetDY()
            })), g.ZX = g.AttackedLX -= b, g.Ele.style.left = Math.floor(g.X -= b) + "px", f = 1)) : f = 1) : f = 1;
            g.ChkSpeed(g);
            return f
        },
        ChkSpeed: function(b) {
            if (!b.DZStep) {
                return
            }
            var a = b.Speed;
            switch (true) {
                case (b.FreeFreezeTime || b.FreeSetbodyTime) == 1:
                    a && (b.Speed = 0);
                    break;
                case b.FreeSlowTime > 0:
                    a != 1.75 && (b.Speed = 1.75);
                    break;
                default:
                    a != 3.5 && (b.Speed = 3.5)
            }
        }
    }),
    oDancingZombie = InheritO(OrnNoneZombies, {
        EName: "oDancingZombie",
        CName: "舞王僵尸",
        HP: 500,
        BreakPoint: 166,
        Lvl: 3,
        StandGif: 9,
        SunNum: 350,
        beAttackedPointL: 40,
        beAttackedPointR: 85,
        width: 184,
        height: 176,
        OSpeed: 7.2,
        Speed: 7.2,
        NormalGif: 9,
        GetDTop: 0,
        GetDTop: 5,
        getShadow: function(a) {
            return "left:" + (a.beAttackedPointL - 10) + "px;top:" + (a.height - 30) + "px"
        },
        GetDX: function() {
            return -50
        },
        GetDY: function() {
            return -5
        },
        LostHeadGif: 14,
        addSpotlight: (function() {
            var a, b;
            $User.Browser.IE6 ? (a = "_8", b = "filter:alpha(opacity=30)") : a = b = "";
            return function(d, f, c) {
                var g = $Z[d],
                    e;
                NewEle(d + "_spotlightCon", "div", "position:absolute;left:-30px;top:-400px;width:184px;height:600px;overflow:hidden", 0, c).appendChild(g.spotlight = NewImg(d + "_spotlight", "images/Zombies/DancingZombie/spotlight" + a + ".png", "left:0;top:0;width:920px;height:600px;" + b));
                e = NewEle(d + "_spotlight2Con", "div", "position:absolute;left:-25px;top:135px;width:184px;height:60px;overflow:hidden", 0);
                c.insertBefore(e, f.EleShadow);
                e.appendChild(g.spotlight2 = NewImg(d + "_spotlight2", "images/Zombies/DancingZombie/spotlight2" + a + ".png", "left:0;top:0;width:920px;height:60px;" + b))
            }
        })(),
        PicArr: (function() {
            var d = "images/Zombies/DancingZombie/",
                c = $User.Browser.IE6 ? "_8" : "",
                a = d + "spotlight" + c + ".png" + $Random,
                b = d + "spotlight2" + c + ".png" + $Random;
            return ["images/Card/Zombies/DancingZombie.png", "images/Card/Zombies/DancingZombieG.png", d + "DancingZombie.gif", d + "Attack.gif", d + "LostHead.gif", d + "LostHeadAttack.gif", d + "Head.gif" + $Random, d + "Die.gif" + $Random, d + "BoomDie.gif" + $Random, d + "SlidingStep.gif" + $Random, d + "Dancing.gif" + $Random, d + "Summon1.gif", d + "Summon2.gif", d + "Summon3.gif", d + "LostHeadSlidingStep.gif" + $Random, d + "LostHeadDancing.gif" + $Random, d + "LostHeadSummon.gif" + $Random, a, b]
        })(),
        Produce: '舞王僵尸和人类(在世或者死去的)如有雷同，纯属巧合。</p><p>韧性：<font color="#FF0000">中</font><br>特点：<font color="#FF0000">召唤伴舞僵尸</font></p>舞王僵尸的最新唱片“抓住脑子啃啊啃”在僵尸界的人气正急速飙升。',
        getSlow: function() {},
        Die: function(b) {
            var c = this,
                d = c.id,
                a = c.Ele;
            !b ? (c.EleBody.src = c.PicArr[c.DieGif] + Math.random(), oSym.addTask(250, ClearChild, [a])) : b < 2 ? (c.EleBody.src = c.PicArr[c.BoomDieGif] + Math.random(), oSym.addTask(300, ClearChild, [a])) : ClearChild(a);
            c.HP = 0;
            delete $Z[d];
            c.PZ && oP.MonPrgs();
            c.ResetBackupDancer(c)
        },
        bedevil: function(b) {
            var a = b.id;
            b.ExchangeLR(b, 1);
            b.JudgeAttack = b.JudgeAttackH;
            b.PZ = 0;
            b.WalkDirection = 1;
            b.ZX = b.AttackedRX;
            b.ChkActs = b.ChkActs1;
            b.ChangeChkActsTo1(b, a, b.EleBody);
            b.ResetBackupDancer(b);
            $(a + "_spotlightCon").style.left = "20px", $(a + "_spotlight2Con").style.left = "25px";
            oP.MonPrgs()
        },
        ResetBackupDancer: function(f) {
            var g = f.ArDZ,
                d = 4,
                c, b, e, a = f.DZStep;
            while (d--) {
                if ((c = g[d]) && (b = c[0]) && (e = $Z[b]) && e.beAttacked) {
                    if (a > 0) {
                        switch (true) {
                            case (e.FreeFreezeTime || e.FreeSetbodyTime) == 1:
                                e.Speed = 0;
                                break;
                            case e.FreeSlowTime > 0:
                                e.Speed = 1.75;
                                break;
                            default:
                                e.Speed = 3.5
                        }
                    }
                }
            }
            a > -1 && oSym.addTask(f.DZStepT - oSym.Now, function(o, j) {
                var m = 4,
                    l, k, n, h = "ChangeChkActsTo" + j;
                while (m--) {
                    (l = o[m]) && (k = l[0]) && (n = $Z[k]) && n.beAttacked && (n.DZStep = j, n[h](n, k, n.EleBody))
                }
            }, [g, [1, 0][a]])
        },
        BirthCallBack: function(d) {
            var b = d.delayT,
                l = d.id,
                a = d.Ele = $(l),
                c = 320,
                i = oGd.$LF,
                g = d.R,
                s = g - 1,
                n = g + 1,
                e, r, q = LX - 60,
                m = LX + 100,
                k = LX - 130,
                j = LX - 70,
                h = LX + 30,
                f = d.ArDZ = [0, 0, 0, 0];
            d.EleShadow = a.firstChild;
            d.EleBody = a.childNodes[1];
            s > 0 && (e = i[s]) && e != 2 && (f[0] = ["", s,
                function(o) {
                    return o
                },
                3 * s + 2,
                function(o) {
                    return o - 70
                },
                GetY(s) - 155
            ]);
            n <= oS.R && (e = i[n]) && e != 2 && (f[2] = ["", n,
                function(o) {
                    return o
                },
                3 * n + 2,
                function(o) {
                    return o - 70
                },
                GetY(n) - 155
            ]);
            e = 3 * g + 2;
            r = GetY(g) - 155;
            f[3] = ["", g,
                function(o) {
                    return o - 60
                },
                e,
                function(o) {
                    return o - 130
                },
                r
            ];
            f[1] = ["", g,
                function(o) {
                    return o + 100
                },
                e,
                function(o) {
                    return o + 30
                },
                r
            ];
            func = function(t, o) {
                var u = $Z[t];
                u && (u.ExchangeLR(d, 1), u.DZMSpeed = 7.2, u.DZStep = -1, u.DZStepT = oSym.Now + 220, u.FreeSetbodyTime = 0, SetBlock(o))
            };
            b ? (oSym.addTask(b, func, [l, a]), c += b) : func(l, a);
            oSym.addTask(c, function(o) {
                var t = $Z[o];
                t && t.beAttacked && !t.isAttacking && t.NormalAttack(o)
            }, [d.id])
        },
        ChkActs1: function(e, b, f, a) {
            var c, d;
            !(e.FreeFreezeTime || e.FreeSetbodyTime) ? (e.beAttacked && !e.isAttacking && e.JudgeAttack(), c = e.id, !e.isAttacking ? (e.AttackedLX += 3.5) > oS.W ? (f.splice(a, 1), e.Die(2), d = 0) : (e.ZX = e.AttackedRX += 3.5, e.Ele.style.left = Math.ceil(e.X += 3.5) + "px", d = 1) : d = 1) : d = 1;
            return d
        },
        ChkTmp: function(c, b, d, a) {
            c.ChkSpeed(c);
            return 0
        },
        ChkActs: function(g, d, h, c) {
            var e, b, a, f;
            !(g.FreeFreezeTime || g.FreeSetbodyTime) ? (g.beAttacked && !g.isAttacking && g.JudgeAttack(), e = g.id, !g.isAttacking ? ((a = g.AttackedRX -= (b = g.Speed)) < -50 ? (h.splice(c, 1), g.Die(2), f = 0) : (a < 100 && !g.PointZombie && (g.PointZombie = 1, g.ChangeR({
                R: d,
                ar: [oS.R - 1],
                CustomTop: 400 - g.height + g.GetDY()
            })), g.ZX = g.AttackedLX -= b, g.Ele.style.left = Math.floor(g.X -= b) + "px", f = 1)) : f = 1) : f = 1;
            g.ChkSpeed(g);
            return f
        },
        ChkSpeed: function(g) {
            if (!g.DZStep) {
                return
            }
            var h = g.ArDZ,
                d = 4,
                c, b, e, a = g.OSpeed,
                f = [];
            switch (true) {
                case (g.isAttacking || g.FreeFreezeTime || g.FreeSetbodyTime) == 1:
                    a = 0;
                    break;
                case g.FreeSlowTime > 0:
                    a != 1.75 && (a = 1.75)
            }
            while (d--) {
                if ((c = h[d]) && (b = c[0]) && (e = $Z[b]) && e.beAttacked) {
                    f.push(e);
                    switch (true) {
                        case (e.isAttacking || e.FreeFreezeTime || e.FreeSetbodyTime) == 1:
                            a = 0;
                            break;
                        case e.FreeSlowTime > 0:
                            a != 1.75 && (a = 1.75)
                    }
                }
            }
            if (a != g.DZMSpeed) {
                g.DZMSpeed = a;
                d = f.length;
                while (d--) {
                    (e = f[d]).Speed != a && (e.Speed = a)
                }
                g.Speed != a && (g.Speed = a)
            }
        },
        AttackZombie: function(a) {
            this.ExchangeLR(this, 0);
            var b = this.id;
            this.isAttacking = 1;
            this.EleBody.src = this.PicArr[this.AttackGif];
            oSym.addTask(10, function(d, c) {
                var f = $Z[d],
                    e;
                f && f.beAttacked && !f.FreeFreezeTime && !f.FreeSetbodyTime && ((e = $Z[c]) ? (e.getHurt(-1, 0, 10), oSym.addTask(10, arguments.callee, [d, c])) : (f.isAttacking = 0, f.EleBody.src = f.PicArr[f.NormalGif], f.TurnLeft(f)))
            }, [b, a])
        },
        ChkBackupDancer: function(h, g, f) {
            if (!h.PZ) {
                h.ChangeChkActsTo1(h, g, f);
                return
            }
            var b = h.ArDZ,
                d = 4,
                j = 1,
                c, e, a;
            while (d--) {
                (e = b[d]) && (!(c = e[0]) || !(a = $Z[c]) || (a.PZ ? false : (e[0] = "", true))) && (d = j = 0)
            }!h.isAttacking && j ? f.src = h.PicArr[10] : h.Summon(h, g);
            h.ChangeChkActsTo0(h, g, f)
        },
        ChangeChkActsTo0: function(g, e, a) {
            if (!g.PZ) {
                g.ChangeChkActsTo1(g, e, a);
                return
            }
            var d = 4,
                h = g.ArDZ,
                c, b, f;
            while (d--) {
                (b = h[d]) && (c = b[0]) && (f = $Z[c]) && f.beAttacked && (f.LostHeadGif = 10, f.NormalGif = 9, !f.isAttacking && (f.EleBody.src = f.PicArr[9]), f.Speed = 0)
            }
            g.LostHeadGif = 15;
            g.NormalGif = 10;
            g.Speed = g.DZMSpeed = g.DZStep = 0;
            g.DZStepT = oSym.Now + 200;
            oSym.addTask(200, function(j, i) {
                var k = $Z[j];
                k && k.beAttacked && k.ChangeChkActsTo1(k, j, i)
            }, [e, a])
        },
        ChangeChkActsTo1: function(g, e, a) {
            var d = 4,
                h = g.ArDZ,
                c, b, f;
            while (d--) {
                (b = h[d]) && (c = b[0]) && (f = $Z[c]) && f.beAttacked && (f.LostHeadGif = 4, f.NormalGif = 2, !f.isAttacking && (f.EleBody.src = f.PicArr[2]))
            }
            g.LostHeadGif = 4;
            g.NormalGif = 2;
            g.DZStep = 1;
            g.DZStepT = oSym.Now + 220;
            !g.isAttacking && (a.src = g.PicArr[2]);
            g.PZ && oSym.addTask(220, function(j, i) {
                var k = $Z[j];
                k && k.beAttacked && k.ChkBackupDancer(k, j, i)
            }, [e, a])
        },
        TurnLeft: function(c) {
            var a = CZombies.prototype,
                b = c.id;
            c.AttackZombie = a.AttackZombie;
            c.NormalAttack = a.NormalAttack;
            c.OSpeed = 3.5;
            !(c.FreeSlowTime || c.FreeFreezeTime || c.FreeSetbodyTime) && (c.Speed = 3.5);
            c.getSlow = function(i, g, h) {
                var e = oSym.Now + h,
                    f = i.FreeSlowTime,
                    d = 0;
                switch (true) {
                    case !f:
                        i.Attack = 50;
                    case f < e:
                        i.FreeSlowTime = e;
                        d = 1
                }
                d && oSym.addTask(h, function(k, j) {
                    var l = $Z[k];
                    l && l.FreeSlowTime == j && (l.FreeSlowTime = 0, l.Attack = 100)
                }, [g, e])
            };
            c.getFreeze = function(e, d) {
                e.beAttacked && e.getHurt(-1, 0, 20);
                oSym.addTask(400, function(h, g, f) {
                    ClearChild(f);
                    var i = $Z[h];
                    i && i.FreeFreezeTime == g && (i.FreeFreezeTime = 0, i.Attack = 50, !i.FreeSetbodyTime && i.isAttacking && i.JudgeAttack(), oSym.addTask(1500, function(k, j) {
                        var l = $Z[k];
                        l && l.FreeSlowTime == j && (l.FreeSlowTime = 0, l.Attack = 100)
                    }, [h, i.FreeSlowTime = oSym.Now + 1500]))
                }, [d, e.FreeFreezeTime = oSym.Now + 400, NewImg("icetrap_" + Math.random(), "images/Plants/IceShroom/icetrap.gif", e.getShadow(e), e.Ele)])
            };
            oSym.addTask(20, function(d, e) {
                $Z[d] && e.beAttacked && (e.addSpotlight(d, e, e.Ele), oSym.addTask(200, function(g, f, i, h, k) {
                    var j = $Z[g];
                    j && (h > -736 ? h -= 184 : h = 0, f.style.left = h + "px", k > -736 ? k -= 184 : k = 0, i.style.left = k + "px", oSym.addTask(100, arguments.callee, [g, f, i, h, k]))
                }, [d, e.spotlight, e.spotlight2, 0, 0]), oSym.addTask(200, function(h, g) {
                    var f;
                    $Z[g] && h.beAttacked && (f = h.EleBody, !h.isAttacking && (f.src = h.PicArr[10]), h.ChangeChkActsTo0(h, g, f))
                }, [e, d]))
            }, [b, c]);
            c.Summon(c, b)
        },
        NormalAttack: function(a) {
            var b = $Z[a];
            b.ExchangeLR(b, 0);
            b.TurnLeft(b)
        },
        Summon: function(d, c) {
            d.LostHeadGif = 16;
            var a = d.EleBody,
                b = d.ChkActs;
            d.ChkActs = d.ChkTmp;
            d.ChkTmp = b;
            a.src = "images/Zombies/DancingZombie/Summon1.gif";
            oSym.addTask(10, function(f, e) {
                var g = $Z[f];
                g && g.beAttacked && (e.src = "images/Zombies/DancingZombie/Summon2.gif", oSym.addTask(10, function(t, s, x) {
                    var h = $Z[t],
                        v = h.ZX,
                        m = h.ArDZ,
                        n = [],
                        k = "images/Zombies/BackupDancer/Mound.gif" + $Random + Math.random(),
                        r = 4,
                        w = [],
                        u = [],
                        o = 0,
                        q, l;
                    if (h && h.beAttacked) {
                        s.src = "images/Zombies/DancingZombie/Summon3.gif";
                        while (r--) {
                            (q = m[r]) && (!(l = q[0]) || !$Z[l]) && (u[o] = (w[o] = new oBackupDancer).CustomBirth(q[1], q[2](v), 100, q[0] = "Z_" + Math.random()), n.push(NewImg("", k, "z-index:" + q[3] + ";left:" + q[4](v) + "px;top:" + q[5] + "px", EDZombies)), ++o)
                        }
                        oSym.addTask(220, function() {
                            var i = arguments.length;
                            while (i--) {
                                ClearChild(arguments[i])
                            }
                        }, n);
                        oSym.addTask(110, function(A, y, z, i) {
                            var B = $Z[A];
                            B && B.beAttacked && (oP.AppearUP(y, z, i), oSym.addTask(100, function(D, C) {
                                var E = $Z[D];
                                if (E && E.beAttacked) {
                                    return
                                }
                                var j = C.length,
                                    E;
                                while (j--) {
                                    (E = C[j]).ChangeChkActsTo0(E, E.id, E.EleBody)
                                }
                            }, [A, z]))
                        }, [t, u, w, o]);
                        oSym.addTask(200, function(y, i) {
                            var z = $Z[y],
                                j;
                            z && z.beAttacked && (j = z.ChkActs, z.ChkActs = z.ChkTmp, z.ChkTmp = j)
                        }, [t, s])
                    }
                }, [f, e]))
            }, [c, a])
        }
    }),
    oZombie = InheritO(OrnNoneZombies, {
        EName: "oZombie",
        CName: "领带僵尸",
        StandGif: 9,
        PicArr: (function() {
            var a = "images/Zombies/Zombie/";
            return ["images/Card/Zombies/Zombie.png", "images/Card/Zombies/ZombieG.png", a + "Zombie.gif", a + "ZombieAttack.gif", a + "ZombieLostHead.gif", a + "ZombieLostHeadAttack.gif", a + "ZombieHead.gif" + $Random, a + "ZombieDie.gif" + $Random, a + "BoomDie.gif" + $Random, a + "1.gif"]
        })(),
        Produce: '韧性：<font color="#FF0000">低</font></p>这种僵尸喜爱脑髓，贪婪而不知足。脑髓，脑髓，脑髓，夜以继日地追求着。老而臭的脑髓？腐烂的脑髓？都没关系。僵尸需要它们。'
    }),
    oZombie2 = InheritO(oZombie, {
        EName: "oZombie2"
    }, {
        PicArr: {
            2: "images/Zombies/Zombie/Zombie2.gif",
            9: "images/Zombies/Zombie/2.gif"
        }
    }),
    oZombie3 = InheritO(oZombie, {
        EName: "oZombie3"
    }, {
        PicArr: {
            2: "images/Zombies/Zombie/Zombie3.gif",
            9: "images/Zombies/Zombie/3.gif"
        }
    }),
    oFlagZombie = InheritO(oZombie, {
        PicArr: (function() {
            var a = "images/Zombies/FlagZombie/";
            return ["images/Card/Zombies/FlagZombie.png", "images/Card/Zombies/FlagZombieG.png", a + "FlagZombie.gif", a + "FlagZombieAttack.gif", a + "FlagZombieLostHead.gif", a + "FlagZombieLostHeadAttack.gif", "images/Zombies/Zombie/ZombieHead.gif" + $Random, "images/Zombies/Zombie/ZombieDie.gif" + $Random, "images/Zombies/Zombie/BoomDie.gif" + $Random, a + "1.gif"]
        })(),
        EName: "oFlagZombie",
        CName: "旗帜僵尸",
        OSpeed: 2.2,
        Speed: 2.2,
        beAttackedPointR: 101,
        Produce: '旗帜僵尸标志着即将来袭的一大堆僵尸"流"。<p>韧性：<font color="#FF0000">低</font></p>毫无疑问，摇旗僵尸喜爱脑髓。但在私下里他也迷恋旗帜。也许是因为旗帜上也画有脑子吧，这很难说。'
    }),
    OrnIZombies = InheritO(CZombies, {
        Ornaments: 1,
        OrnLostNormalGif: 9,
        OrnLostAttackGif: 10,
        getHurt: function(i, a, g, m, c, k, j) {
            var e = this;
            if (!e.beAttacked) {
                j && e.Die(2);
                return
            }
            var b = e.id,
                l = e.OrnHP,
                h = e.HP,
                f = e.isAttacking,
                d = e.PicArr;
            switch (true) {
                case (l -= g) > 0:
                    e.OrnHP = l;
                    break;
                case l < 0:
                    switch (true) {
                        case (h += l) < 1:
                            e.HP = 0;
                            e.Die(j);
                            return;
                        case h < 91:
                            e.HP = h;
                            e.GoingDie(d[[e.LostHeadGif, e.LostHeadAttackGif][f]]);
                            return
                    }
                    e.HP = h;
                default:
                    e.OrnHP = 0;
                    e.EleBody.src = d[[e.NormalGif = e.OrnLostNormalGif, e.AttackGif = e.OrnLostAttackGif][f]];
                    e.getHurt = OrnNoneZombies.prototype.getHurt
            }
            switch (m) {
                case -1:
                    e.getSlow(e, b, 1000);
                    break;
                case 1:
                    e.getFireball(e, b, a)
            }
            e.SetAlpha(e, e.EleBody, 50, 0.5);
            oSym.addTask(10, function(q) {
                var n = $Z[q];
                n && n.SetAlpha(n, n.EleBody, 100, 1)
            }, [b])
        }
    }),
    oConeheadZombie = InheritO(OrnIZombies, {
        EName: "oConeheadZombie",
        CName: "路障僵尸",
        OrnHP: 370,
        Lvl: 2,
        SunNum: 75,
        StandGif: 11,
        PicArr: (function() {
            var b = "images/Zombies/ConeheadZombie/",
                a = "images/Zombies/Zombie/";
            return ["images/Card/Zombies/ConeheadZombie.png", "images/Card/Zombies/ConeheadZombieG.png", b + "ConeheadZombie.gif", b + "ConeheadZombieAttack.gif", a + "ZombieLostHead.gif", a + "ZombieLostHeadAttack.gif", a + "ZombieHead.gif" + $Random, a + "ZombieDie.gif" + $Random, a + "BoomDie.gif" + $Random, a + "Zombie.gif", a + "ZombieAttack.gif", b + "1.gif"]
        })(),
        Produce: '他的路障头盔，使他两倍坚韧于普通僵尸。<p>韧性：<font color="#FF0000">中</font></p>和其他僵尸一样，路障头僵尸盲目地向前。但某些事物却使他停下脚步，捡起一个交通路障，并固实在自己的脑袋上。是的，他很喜欢参加聚会。'
    }),
    oBucketheadZombie = InheritO(oConeheadZombie, {
        EName: "oBucketheadZombie",
        CName: "铁桶僵尸",
        OrnHP: 1100,
        Lvl: 3,
        SunNum: 125,
        Produce: '他的铁桶头盔，能极大程度的承受伤害。<p>韧性：<font color="#FF0000">高</font><br>弱点：<font color="#FF0000">磁力菇</font></p>铁桶头僵尸经常戴着水桶，在冷漠的世界里显得独一无二。但事实上，他只是忘记了，那铁桶还在他头上而已。'
    }, {
        PicArr: {
            0: "images/Card/Zombies/BucketheadZombie.png",
            1: "images/Card/Zombies/BucketheadZombieG.png",
            2: "images/Zombies/BucketheadZombie/BucketheadZombie.gif",
            3: "images/Zombies/BucketheadZombie/BucketheadZombieAttack.gif",
            9: "images/Zombies/Zombie/Zombie2.gif",
            11: "images/Zombies/BucketheadZombie/1.gif"
        }
    }),
    oFootballZombie = InheritO(oConeheadZombie, {
        EName: "oFootballZombie",
        CName: "橄榄球僵尸",
        OrnHP: 1400,
        Lvl: 3,
        SunNum: 175,
        StandGif: 11,
        width: 154,
        height: 160,
        OSpeed: 3.2,
        Speed: 3.2,
        beAttackedPointL: 40,
        beAttackedPointR: 134,
        PicArr: (function() {
            var a = "images/Zombies/FootballZombie/";
            return ["images/Card/Zombies/FootballZombie.png", "images/Card/Zombies/FootballZombieG.png", a + "FootballZombie.gif", a + "Attack.gif", a + "LostHead.gif", a + "LostHeadAttack.gif", "images/Zombies/Zombie/ZombieHead.gif" + $Random, a + "Die.gif" + $Random, a + "BoomDie.gif" + $Random, a + "OrnLost.gif", a + "OrnLostAttack.gif", a + "1.gif"]
        })(),
        getShadow: function(a) {
            return "left:" + (a.beAttackedPointL + 15) + "px;top:" + (a.height - 22) + "px"
        },
        Produce: '橄榄球僵尸的表演秀。<p>韧性：<font color="#FF0000">极高</font><br>速度：<font color="#FF0000">快</font><br>弱点：<font color="#FF0000">磁力菇</font></p>在球场上，橄榄球僵尸表现出110%的激情，他进攻防守样样在行。虽然他完全不知道橄榄球是什么。'
    }),
    oPoleVaultingZombie = InheritO(OrnNoneZombies, {
        EName: "oPoleVaultingZombie",
        CName: "撑杆僵尸",
        HP: 500,
        width: 348,
        height: 218,
        OSpeed: 3.2,
        Speed: 3.2,
        beAttackedPointL: 215,
        beAttackedPointR: 260,
        StandGif: 13,
        GetDX: function() {
            return -238
        },
        GetDY: function() {
            return 2
        },
        Lvl: 2,
        SunNum: 75,
        PicArr: (function() {
            var a = "images/Zombies/PoleVaultingZombie/";
            return ["images/Card/Zombies/PoleVaultingZombie.png", "images/Card/Zombies/PoleVaultingZombieG.png", a + "PoleVaultingZombie.gif", a + "PoleVaultingZombieAttack.gif", a + "PoleVaultingZombieLostHead.gif", a + "PoleVaultingZombieLostHeadAttack.gif", a + "PoleVaultingZombieHead.gif" + $Random, a + "PoleVaultingZombieDie.gif" + $Random, a + "BoomDie.gif" + $Random, a + "PoleVaultingZombieWalk.gif", a + "PoleVaultingZombieLostHeadWalk.gif", a + "PoleVaultingZombieJump.gif", a + "PoleVaultingZombieJump2.gif", a + "1.gif"]
        })(),
        Produce: '撑杆僵尸运用标杆高高地跃过障碍物。<p>韧性：<font color="#FF0000">中</font><Br>速度：<font color="#FF0000">快,而后慢(跳跃后)</font><BR>特点：<font color="#FF0000">跃过他所碰到的第一筑植物</font></p>一些僵尸渴望走得更远、得到更多，这也促使他们由普通成为非凡。那就是撑杆僵尸。',
        getShadow: function(a) {
            return "left:" + (a.beAttackedPointL - 20) + "px;top:" + (a.height - 35) + "px"
        },
        GoingDieHead: function(c, a, b) {
            oSym.addTask(200, ClearChild, [NewImg(0, a[b.HeadGif] + Math.random(), "left:" + b.X + "px;top:" + (b.pixelTop - 20) + "px;z-index:" + b.zIndex, EDZombies)])
        },
        JudgeAttack: function() {
            var g = this,
                b = g.ZX,
                d = g.R + "_",
                c = GetC(b),
                h = oGd.$,
                f, a, e = b - 74;
            for (f = c - 2; f <= c; f++) {
                if (f > 9) {
                    continue
                }
                for (a = 2; a > -1;
                    (p = h[d + f + "_" + a--]) && (p.EName != "oBrains" ? p.AttackedRX >= e && p.AttackedLX < b && p.canEat && (a = -1, g.JudgeAttack = CZombies.prototype.JudgeAttack, g.NormalAttack(g.id, p.id)) : p.AttackedRX >= b && p.AttackedLX < b && (a = -1, g.JudgeAttack = CZombies.prototype.JudgeAttack, (g.NormalAttack = CZombies.prototype.NormalAttack)(g.id, p.id)))) {}
            }
        },
        getRaven: function(a) {
            return !this.isAttacking && this.NormalAttack(this.id, a), 0
        },
        NormalAttack: function(d, b) {
            var g = $Z[d],
                f = $P[b].AttackedLX,
                a = g.Ele,
                c = g.EleShadow,
                e = g.EleBody;
            e.src = "images/Zombies/PoleVaultingZombie/PoleVaultingZombieJump.gif" + $Random + Math.random();
            SetHidden(c);
            g.isAttacking = 1;
            g.Altitude = 2;
            g.getFreeze = function() {
                g.getSlow(g, d, 1000)
            };
            oSym.addTask(100, function(m, j, i, l, n) {
                var h = $Z[m],
                    k, q, r;
                h && ((k = $P[j]) && k.Stature > 0 ? (h.AttackedRX = (h.X = (h.AttackedLX = h.ZX = q = k.AttackedRX) - h.beAttackedPointL) + h.beAttackedPointR, SetStyle(i, {
                    left: h.X + "px"
                }), n.src = "images/Zombies/PoleVaultingZombie/PoleVaultingZombieWalk.gif", SetVisible(l), h.isAttacking = 0, h.Altitude = 1, h.OSpeed = h.Speed = 1.6, h.NormalGif = 9, h.LostHeadGif = 10, h.NormalAttack = (r = CZombies.prototype).NormalAttack, h.getFreeze = r.getFreeze, h.getRaven = r.getRaven) : (h.ZX = h.AttackedLX = (h.X = (h.AttackedRX = f) - h.beAttackedPointR) + h.beAttackedPointL, SetStyle(i, {
                    left: h.X + "px"
                }), n.src = "images/Zombies/PoleVaultingZombie/PoleVaultingZombieJump2.gif" + $Random + Math.random(), SetVisible(l), oSym.addTask(80, function(s, v) {
                    var u = $Z[s],
                        t;
                    u && (v.src = "images/Zombies/PoleVaultingZombie/PoleVaultingZombieWalk.gif", u.isAttacking = 0, u.Altitude = 1, u.OSpeed = u.Speed = 1.6, u.NormalGif = 9, u.LostHeadGif = 10, u.NormalAttack = (t = CZombies.prototype).NormalAttack, u.getFreeze = t.getFreeze, u.getRaven = t.getRaven)
                }, [m, n])))
            }, [d, b, a, c, e])
        }
    }),
    OrnIIZombies = InheritO(CZombies, {
        Ornaments: 2,
        BreakPoint: 91,
        NormalGif: 2,
        AttackGif: 3,
        LostHeadGif: 4,
        LostHeadAttackGif: 5,
        OrnLostNormalGif: 6,
        OrnLostAttackGif: 7,
        OrnLostHeadNormalGif: 8,
        OrnLostHeadAttackGif: 9,
        HeadGif: 10,
        DieGif: 11,
        BoomDieGif: 12
    }),
    oNewspaperZombie = InheritO(OrnIIZombies, {
        EName: "oNewspaperZombie",
        CName: "读报僵尸",
        OrnHP: 150,
        Lvl: 2,
        LostPaperGif: 13,
        StandGif: 14,
        width: 216,
        height: 164,
        beAttackedPointL: 60,
        beAttackedPointR: 130,
        LostPaperSpeed: 4.8,
        PicArr: (function() {
            var a = "images/Zombies/NewspaperZombie/";
            return ["images/Card/Zombies/NewspaperZombie.png", "images/Card/Zombies/NewspaperZombieG.png", a + "HeadWalk1.gif", a + "HeadAttack1.gif", a + "LostHeadWalk1.gif", a + "LostHeadAttack1.gif", a + "HeadWalk0.gif", a + "HeadAttack0.gif", a + "LostHeadWalk0.gif", a + "LostHeadAttack0.gif", a + "Head.gif" + $Random, a + "Die.gif" + $Random, a + "BoomDie.gif" + $Random, a + "LostNewspaper.gif", a + "1.gif"]
        })(),
        Produce: '他的报纸只能提供有限的防御。<p>韧性：<font color="#FF0000">低</font><p>报纸韧性：<font color="#FF0000">低</font></p><p>速度：正常，而后快(失去报纸后)</p>读报僵尸，他正痴迷于完成他的数独难题。难怪他这么反常。',
        getShadow: function(a) {
            return "left:75px;top:" + (a.height - 25) + "px"
        },
        GoingDie: function(b) {
            var a = this,
                c = a.id;
            a.EleBody.src = b;
            oSym.addTask(200, ClearChild, [NewImg(0, a.PicArr[a.HeadGif] + Math.random(), "left:" + a.AttackedLX + "px;top:" + (a.pixelTop - 20) + "px;z-index:" + a.zIndex, EDZombies)]);
            a.beAttacked = 0;
            a.FreeFreezeTime = a.FreeSetbodyTime = a.FreeSlowTime = 0;
            a.AutoReduceHP(c)
        },
        getHurtOrnLost: function(i, a, g, l, c, k, j) {
            var e = this;
            if (!e.beAttacked) {
                j && e.Die(2);
                return
            }
            var b = e.id,
                h = e.HP,
                d = e.PicArr,
                f = e.isAttacking;
            switch (true) {
                case (h -= g) < 1:
                    e.HP = 0;
                    e.Die(j);
                    return;
                case h < 91:
                    e.HP = h;
                    e.GoingDie(d[[e.OrnLostHeadNormalGif, e.OrnLostHeadAttackGif][f]]);
                    return
            }
            e.HP = h;
            switch (l) {
                case -1:
                    e.getSlow(e, b, 1000);
                    break;
                case 1:
                    e.getFireball(e, b, a)
            }
            SetAlpha(e.EleBody, 50, 0.5);
            oSym.addTask(10, function(n) {
                var m = $Z[n];
                m && SetAlpha(m.EleBody, 100, 1)
            }, [b])
        },
        CheckPaper: function(e, f, c, b, d, a) {
            !(e.OrnHP = Math.max(c - b, 0)) && (e.isAttacking = 1, e.EleBody.src = d[e.LostPaperGif] + $Random + Math.random(), e.getHurt = e.getHurtOrnLost, oSym.addTask(150, function(k, j, h) {
                var i = $Z[k];
                if (!i) {
                    return
                }
                i.isAttacking = h;
                var g = i.OSpeed = i.LostPaperSpeed;
                i.Speed && (i.Speed = !i.FreeSlowTime ? g : 0.5 * g);
                i.EleBody.src = j
            }, [f, d[[e.NormalGif = e.OrnLostNormalGif, e.AttackGif = e.OrnLostAttackGif][a]], a]))
        },
        getHurt: function(i, a, g, m, c, k, j) {
            var e = this;
            if (!e.beAttacked) {
                j && e.Die(2);
                return
            }
            var b = e.id,
                l = e.OrnHP,
                h = e.HP,
                f = e.isAttacking,
                d = e.PicArr;
            if (!i || m == 1) {
                switch (true) {
                    case (h = e.HP -= g) < 1:
                        e.Die(j);
                        return;
                    case h < 91:
                        e.GoingDie(d[[e.LostHeadGif, e.LostHeadAttackGif][f]]);
                        return;
                    default:
                        l && e.CheckPaper(e, b, l, g, d, f)
                }
            } else {
                if (i == -1 && a == e.WalkDirection) {
                    e.CheckPaper(e, b, l, g, d, f)
                } else {
                    switch (true) {
                        case (h -= g) < 1:
                            e.HP = 0;
                            e.Die(j);
                            return;
                        case h < 91:
                            e.HP = h;
                            e.GoingDie(d[[e.LostHeadGif, e.LostHeadAttackGif][f]]);
                            return
                    }
                    e.HP = h
                }
            }
            switch (m) {
                case -1:
                    e.getSlow(e, b, 1000);
                    break;
                case 1:
                    e.getFireball(e, b, a)
            }
            e.SetAlpha(e, e.EleBody, 50, 0.5);
            oSym.addTask(10, function(q) {
                var n = $Z[q];
                n && n.SetAlpha(n, n.EleBody, 100, 1)
            }, [b])
        }
    }),
    oScreenDoorZombie = InheritO(oNewspaperZombie, {
        EName: "oScreenDoorZombie",
        CName: "铁栅门僵尸",
        OrnHP: 1100,
        Lvl: 3,
        SunNum: 100,
        StandGif: 13,
        width: 166,
        height: 144,
        beAttackedPointL: 60,
        beAttackedPointR: 116,
        PicArr: (function() {
            var a = "images/Zombies/ScreenDoorZombie/",
                b = "images/Zombies/Zombie/";
            return ["images/Card/Zombies/ScreenDoorZombie.png", "images/Card/Zombies/ScreenDoorZombieG.png", a + "HeadWalk1.gif", a + "HeadAttack1.gif", a + "LostHeadWalk1.gif", a + "LostHeadAttack1.gif", b + "Zombie2.gif", b + "ZombieAttack.gif", b + "ZombieLostHead.gif", b + "ZombieLostHeadAttack.gif", b + "ZombieHead.gif" + $Random, b + "ZombieDie.gif" + $Random, b + "BoomDie.gif" + $Random, a + "1.gif"]
        })(),
        Produce: '他的铁栅门是有效的盾牌。<p>韧性：<font color="#FF0000">低</font><p>铁栅门韧性：<font color="#FF0000">高</font></p><p>弱点：大喷菇和磁力菇</p>门板僵尸上次拜访过的房主防守并不专业，在吃掉房主的脑子后拿走了他家的铁栅门。',
        GoingDie: CZombies.prototype.GoingDie,
        getHurt: function(i, a, g, m, c, k, j) {
            var e = this;
            if (!e.beAttacked) {
                j && e.Die(2);
                return
            }
            var b = e.id,
                l = e.OrnHP,
                h = e.HP,
                f = e.isAttacking,
                d = e.PicArr;
            if (!i) {
                switch (true) {
                    case (h = e.HP -= g) < 1:
                        e.Die(j);
                        return;
                    case h < 91:
                        e.GoingDie(d[[e.LostHeadGif, e.LostHeadAttackGif][f]]);
                        return;
                    default:
                        e.CheckOrnHP(e, b, l, g, d, f)
                }
            } else {
                if (i == -1 && a == e.WalkDirection) {
                    e.CheckOrnHP(e, b, l, g, d, f)
                } else {
                    switch (true) {
                        case (h = e.HP -= g) < 1:
                            e.Die(j);
                            return;
                        case h < 91:
                            e.GoingDie(d[[e.LostHeadGif, e.LostHeadAttackGif][f]]);
                            return
                    }
                }
            }
            switch (m) {
                case -1:
                    e.getSlow(e, b, 1000, a, i);
                    break;
                case 1:
                    e.getFireball(e, b, a)
            }
            e.SetAlpha(e, e.EleBody, 50, 0.5);
            oSym.addTask(10, function(q) {
                var n = $Z[q];
                n && n.SetAlpha(n, n.EleBody, 100, 1)
            }, [b])
        },
        CheckOrnHP: function(f, g, c, b, e, a) {
            var d;
            !(c = f.OrnHP = Math.max(c - b, 0)) && (f.EleBody.src = e[[f.NormalGif = f.OrnLostNormalGif, f.AttackGif = f.OrnLostAttackGif][a]], f.getSlow = (d = CZombies.prototype).getSlow, f.getSputtering = d.getSputtering, f.getFireball = d.getFireball, f.getHurt = f.getHurtOrnLost)
        },
        getFireball: function(c, a, b) {
            b != c.WalkDirection && (c.FreeSlowTime = 0, c.Attack = 100, c.Speed && (c.Speed = c.OSpeed))
        },
        getSputtering: function() {},
        getSlow: function(d, a, c, b, e) {
            (b != d.WalkDirection || e != -1) && CZombies.prototype.getSlow(d, a, c)
        }
    }),
    oAquaticZombie = InheritO(OrnNoneZombies, {
        StandGif: 4,
        AttackGif: 5,
        HeadGif: 6,
        DieGif: 7,
        WalkGif0: 2,
        WalkGif1: 3,
        CanPass: function(b, a) {
            return a == 2
        },
        BirthCallBack: function(g) {
            var e = g.delayT,
                c = g.id,
                b = g.Ele = $(c),
                d = g.AttackedLX,
                f, a, h;
            f = g.EleShadow = b.firstChild;
            g.EleBody = b.childNodes[1];
            switch (true) {
                case d > GetX(9):
                    g.ChkActs = g.ChkActsL1;
                    g.WalkStatus = 0;
                    break;
                case d < GetX(0):
                    g.ChkActs = g.ChkActsL3;
                    g.WalkStatus = 0;
                    break;
                default:
                    g.ChkActs = g.ChkActsL2;
                    g.WalkStatus = 1;
                    g.EleBody.src = g.PicArr[g.NormalGif = g.WalkGif1];
                    SetHidden(f);
                    NewEle(a = c + "_splash", "div", "position:absolute;background:url(images/interface/splash.png);left:61px;top:62px;width:97px;height:88px;over-flow:hidden", 0, b);
                    ImgSpriter(a, c, [
                        ["0 0", 9, 1],
                        ["-97px 0", 9, 2],
                        ["-194px 0", 9, 3],
                        ["-291px 0", 9, 4],
                        ["-388px 0", 9, 5],
                        ["-485px 0", 9, 6],
                        ["-582px 0", 9, 7],
                        ["-679px 0", 9, -1]
                    ], 0, function(i, j) {
                        ClearChild($(i))
                    })
            }
            e ? oSym.addTask(e, function(j, i) {
                var k = $Z[j];
                k && (k.FreeSetbodyTime = 0, SetBlock(i))
            }, [c, b]) : SetBlock(b)
        },
        ChkActsL1: function(f, e, g, d) {
            var c, a, b = f.id;
            !(f.FreeFreezeTime || f.FreeSetbodyTime) && (f.AttackedRX -= (c = f.Speed), LX = f.ZX = f.AttackedLX -= c, f.Ele.style.left = Math.floor(f.X -= c) + "px");
            f.AttackedLX < GetX(9) && (f.WalkStatus = 1, f.EleBody.src = f.PicArr[f.NormalGif = f.WalkGif1], SetHidden(f.EleShadow), NewEle(a = b + "_splash", "div", "position:absolute;background:url(images/interface/splash.png);left:61px;top:62px;width:97px;height:88px;over-flow:hidden", 0, f.Ele), f.ChkActs = f.ChkActsL2, ImgSpriter(a, b, [
                ["0 0", 9, 1],
                ["-97px 0", 9, 2],
                ["-194px 0", 9, 3],
                ["-291px 0", 9, 4],
                ["-388px 0", 9, 5],
                ["-485px 0", 9, 6],
                ["-582px 0", 9, 7],
                ["-679px 0", 9, -1]
            ], 0, function(h, i) {
                ClearChild($(h))
            }));
            return 1
        },
        ChkActsL2: function(d, c, e, b) {
            var a;
            !(d.FreeFreezeTime || d.FreeSetbodyTime) && (d.beAttacked && !d.isAttacking && d.JudgeAttack(), !d.isAttacking && (d.AttackedRX -= (a = d.Speed), d.ZX = d.AttackedLX -= a, d.Ele.style.left = Math.floor(d.X -= a) + "px"));
            d.AttackedLX < GetX(0) && (d.WalkStatus = 0, d.EleBody.src = d.PicArr[d.NormalGif = d.WalkGif0], SetVisible(d.EleShadow), d.ChkActs = d.ChkActsL3);
            return 1
        },
        ChkActsL3: CZombies.prototype.ChkActs,
        ChkActs1: function(d, c, e, b) {
            var a;
            !(d.FreeFreezeTime || d.FreeSetbodyTime) && (d.beAttacked && !d.isAttacking && d.JudgeAttack(), !d.isAttacking && (d.AttackedLX += (a = d.Speed), d.ZX = d.AttackedRX += a, d.Ele.style.left = Math.ceil(d.X += a) + "px"));
            d.AttackedLX > GetX(9) && (d.WalkStatus = 0, d.EleBody.src = d.PicArr[d.NormalGif = d.WalkGif0], SetVisible(d.EleShadow), d.ChkActs = d.ChkActs2);
            return 1
        },
        ChkActs2: function(e, c, f, b) {
            var a, d;
            !(e.FreeFreezeTime || e.FreeSetbodyTime) ? (e.beAttacked && !e.isAttacking && e.JudgeAttack(), !e.isAttacking ? (e.AttackedLX += (a = e.Speed)) > oS.W ? (f.splice(b, 1), e.Die(2), d = 0) : (e.ZX = e.AttackedRX += a, e.Ele.style.left = Math.ceil(e.X += a) + "px", d = 1) : d = 1) : d = 1;
            return d
        }
    }),
    oDuckyTubeZombie1 = InheritO(oAquaticZombie, {
        EName: "oDuckyTubeZombie1",
        CName: "鸭子救生圈僵尸",
        beAttackedPointR: 145,
        GetDY: function() {
            return 5
        },
        Produce: '鸭子救生圈能让僵尸能浮在水面上。<p>韧性：<font color="#FF0000">低</font><br>只在水池关卡出现</font></p>只有特定的僵尸才能成为救生圈僵尸。并不是每个僵尸都能胜任的。<br>有些救生圈有点漏气，但他们没能注意到，所以他们离开并放弃了对脑子的渴求。',
        PicArr: (function() {
            var a = "images/Zombies/DuckyTubeZombie1/";
            return ["images/Card/Zombies/DuckyTubeZombie1.png", "images/Card/Zombies/DuckyTubeZombie1G.png", a + "Walk1.gif", a + "Walk2.gif", a + "1.gif", a + "Attack.gif", "images/Zombies/Zombie/ZombieHead.gif" + $Random, a + "Die.gif" + $Random]
        })(),
        GoingDie: function() {
            var b = this,
                c = b.id,
                a = b.PicArr;
            b.EleBody.src = a[7] + Math.random();
            b.GoingDieHead(c, a, b);
            b.beAttacked = 0;
            b.FreeFreezeTime = b.FreeSetbodyTime = b.FreeSlowTime = 0;
            b.AutoReduceHP(c)
        },
        AutoReduceHP: function(a) {
            oSym.addTask(150, ClearChild, [this.Ele]);
            oSym.addTask(100, function(c) {
                var b = $Z[c];
                b && ((b.HP -= 60) < 1 ? b.Die(0) : oSym.addTask(100, arguments.callee, [c]))
            }, [a])
        },
        Die: function(b) {
            var c = this,
                d = c.id,
                a = c.Ele;
            b && ClearChild(a);
            c.HP = 0;
            delete $Z[d];
            c.PZ && oP.MonPrgs()
        },
        ExchangeLR: function(d, b) {
            var c = d.width,
                f = d.beAttackedPointL,
                a = d.beAttackedPointR,
                e = d.Ele;
            e.style.left = (d.X = d.AttackedLX - (d.beAttackedPointL = c - a)) + "px";
            d.beAttackedPointR = c - f;
            d.EleShadow.style.cssText = "visibility:hidden;left:" + (d.beAttackedPointL - 10) + "px;top:" + (d.height - 22) + "px";
            d.ExchangeLR2(d, d.EleBody, b)
        }
    }),
    oDuckyTubeZombie2 = InheritO(oDuckyTubeZombie1, {
        EName: "oDuckyTubeZombie2",
        CName: "路障鸭子救生圈僵尸",
        OrnHP: 370,
        Lvl: 2,
        SunNum: 75,
        PicArr: (function() {
            var b = "images/Zombies/DuckyTubeZombie2/",
                a = "images/Zombies/DuckyTubeZombie1/";
            return ["images/Card/Zombies/DuckyTubeZombie1.png", "images/Card/Zombies/DuckyTubeZombie1G.png", b + "Walk1.gif", b + "Walk2.gif", b + "1.gif", b + "Attack.gif", "images/Zombies/Zombie/ZombieHead.gif" + $Random, a + "Die.gif" + $Random, a + "Walk1.gif", a + "Walk2.gif", a + "Attack.gif"]
        })(),
        getHurt: function(i, a, g, m, c, k, j) {
            var e = this;
            if (!e.beAttacked) {
                j && e.Die(2);
                return
            }
            var b = e.id,
                l = e.OrnHP,
                h = e.HP,
                f = e.isAttacking,
                d = e.PicArr;
            switch (true) {
                case (l -= g) > 0:
                    e.OrnHP = l;
                    break;
                case l < 0:
                    switch (true) {
                        case (h += l) < 1:
                            e.HP = 0;
                            e.Die(j);
                            return;
                        case h < 91:
                            e.HP = h;
                            e.GoingDie();
                            return
                    }
                    e.HP = h;
                default:
                    e.OrnHP = 0;
                    e.EleBody.src = d[[e.NormalGif = [e.WalkGif0 = 8, e.WalkGif1 = 9][e.WalkStatus], e.AttackGif = 10][f]];
                    e.getHurt = OrnNoneZombies.prototype.getHurt
            }
            switch (m) {
                case -1:
                    e.getSlow(e, b, 1000);
                    break;
                case 1:
                    e.getFireball(e, b, a)
            }
            e.SetAlpha(e, e.EleBody, 50, 0.5);
            oSym.addTask(10, function(q) {
                var n = $Z[q];
                n && n.SetAlpha(n, n.EleBody, 100, 1)
            }, [b])
        }
    }),
    oDuckyTubeZombie3 = InheritO(oDuckyTubeZombie2, {
        EName: "oDuckyTubeZombie3",
        CName: "铁桶鸭子救生圈僵尸",
        OrnHP: 1100,
        Lvl: 3,
        SunNum: 125,
        PicArr: (function() {
            var b = "images/Zombies/DuckyTubeZombie3/",
                a = "images/Zombies/DuckyTubeZombie1/";
            return ["images/Card/Zombies/DuckyTubeZombie1.png", "images/Card/Zombies/DuckyTubeZombie1G.png", b + "Walk1.gif", b + "Walk2.gif", b + "1.gif", b + "Attack.gif", "images/Zombies/Zombie/ZombieHead.gif" + $Random, a + "Die.gif" + $Random, a + "Walk1.gif", a + "Walk2.gif", a + "Attack.gif"]
        })()
    }),
    oSnorkelZombie = InheritO(oDuckyTubeZombie1, {
        EName: "oSnorkelZombie",
        CName: "潜水僵尸",
        Lvl: 1,
        SunNum: 75,
        width: 143,
        height: 200,
        beAttackedPointL: 40,
        beAttackedPointR: 100,
        OSpeed: 2,
        Speed: 2,
        Altitude: 1,
        Produce: '潜水僵尸可以在水下前行。<p>韧性：<font color="#FF0000">低</font><br>特点：<font color="#FF0000">潜泳以避免遭到攻击<br>只在水池关卡出现</font></p>僵尸不呼吸。他们不需要空气。那么为什么潜水僵尸需要一套潜水装置来潜水呢？<br>答案：同行的压力。',
        getShadow: function(a) {
            return "left:" + a.beAttackedPointL + "px;top:" + (a.height - 45) + "px"
        },
        PicArr: (function() {
            var a = "images/Zombies/SnorkelZombie/";
            return ["images/Card/Zombies/SnorkelZombie.png", "images/Card/Zombies/SnorkelZombieG.png", a + "Walk1.gif", a + "Walk2.gif", a + "1.gif", a + "Attack.gif", a + "Head.gif" + $Random, a + "Die.gif" + $Random, a + "Jump.gif" + $Random, a + "Risk.gif" + $Random, a + "Sink.gif" + $Random]
        }()),
        ChkActsL1: function(d, c, e, b) {
            var a;
            !(d.FreeFreezeTime || d.FreeSetbodyTime) && (d.AttackedLX > GetX(9) ? (d.AttackedRX -= (a = d.Speed), LX = d.ZX = d.AttackedLX -= a, d.Ele.style.left = Math.floor(d.X -= a) + "px") : (d.beAttacked && (d.Altitude = 2, SetHidden(d.EleShadow), d.EleBody.src = d.PicArr[8] + Math.random(), oSym.addTask(160, function(g, f) {
                $Z[g] && f.beAttacked && (f.WalkStatus = 1, f.Altitude = 0, f.EleBody.src = f.PicArr[f.NormalGif = f.WalkGif1], f.ChkActs = f.ChkActsL2)
            }, [d.id, d]), d.ChkActs = function() {
                return 0
            })));
            return 1
        },
        ChkActsL2: function(d, c, e, b) {
            var a;
            !(d.FreeFreezeTime || d.FreeSetbodyTime) && (d.AttackedLX > GetX(0) ? (d.beAttacked && !d.isAttacking && d.JudgeAttack(), !d.isAttacking && (d.AttackedRX -= (a = d.Speed), d.ZX = d.AttackedLX -= a, d.Ele.style.left = Math.floor(d.X -= a) + "px")) : (d.beAttacked && (d.WalkStatus = 0, d.Altitude = 1, d.EleBody.src = d.PicArr[d.NormalGif = d.WalkGif0], SetVisible(d.EleShadow), d.ChkActs = d.ChkActsL3)));
            return 1
        },
        JudgeAttack: function() {
            var e = this,
                b = e.ZX,
                c = e.R + "_",
                d = GetC(b),
                g = oGd.$,
                a, f = e.id;
            (a = e.JudgeLR(e, c, d, b, g) || e.JudgeSR(e, c, d, b, g)) ? !e.isAttacking ? (e.isAttacking = 1, e.EleBody.src = e.PicArr[9] + Math.random(), oSym.addTask(50, function(i, h) {
                $Z[i] && h.beAttacked && (h.EleBody.src = h.PicArr[h.AttackGif], h.Altitude = 1, h.NormalAttack(a[0], a[1]))
            }, [f, e])) : e.NormalAttack(a[0], a[1]): e.isAttacking && (e.EleBody.src = e.PicArr[10] + Math.random(), e.Altitude = 0, oSym.addTask(70, function(i, h) {
                $Z[i] && h.beAttacked && (h.isAttacking = 0, h.EleBody.src = h.PicArr[h.NormalGif])
            }, [f, e]))
        },
        NormalAttack: function(b, a) {
            oSym.addTask(100, function(d, c) {
                var f = $Z[d],
                    e;
                f && f.beAttacked && !f.FreeFreezeTime && !f.FreeSetbodyTime && ((e = $P[c]) && e.getHurt(f, 0, 100), f.JudgeAttack())
            }, [b, a])
        },
        JudgeAttackH: function() {
            var c = this,
                b = oZ.getZ0(c.ZX, c.R),
                d = c.id,
                a;
            b && b.beAttacked && b.AttackedLX < 900 && b.Altitude < 2 ? (!c.isAttacking ? (c.isAttacking = 1, c.EleBody.src = c.PicArr[9] + Math.random(), a = b.id, !b.isAttacking && b.AttackZombie2(b, a, d), oSym.addTask(50, function(g, h, f, e) {
                $Z[h] && g.beAttacked && ($Z[e] && f.beAttacked ? (g.EleBody.src = g.PicArr[g.AttackGif], g.Altitude = 1, g.AttackZombie(h, e)) : g.JudgeAttackH())
            }, [c, d, b, a])) : c.AttackZombie(d, a)) : c.isAttacking && (c.EleBody.src = c.PicArr[10] + Math.random(), c.Altitude = 0, oSym.addTask(70, function(f, e) {
                $Z[f] && e.beAttacked && (e.isAttacking = 0, e.EleBody.src = e.PicArr[e.NormalGif])
            }, [d, c]))
        },
        AttackZombie2: function(c, b, a) {
            c.isAttacking = 1;
            c.EleBody.src = c.PicArr[9] + Math.random();
            oSym.addTask(50, function(g, e, d, f) {
                $Z[e] && g.beAttacked && ((f = $Z[d]) && f.beAttacked ? (g.EleBody.src = g.PicArr[g.AttackGif], g.Altitude = 1, oSym.addTask(10, function(k, i, j, h) {
                    $Z[i] && k.beAttacked && !k.FreeFreezeTime && !k.FreeSetbodyTime && ($Z[h] && j.beAttacked ? (j.getHurt(-1, 0, 10), oSym.addTask(10, arguments.callee, [k, i, j, h])) : (k.EleBody.src = k.PicArr[10] + Math.random(), k.Altitude = 0, oSym.addTask(70, function(l, m) {
                        $Z[l] && m.beAttacked && (m.isAttacking = 0, m.EleBody.src = m.PicArr[m.NormalGif])
                    }, [i, k])))
                }, [g, e, f, d])) : (g.EleBody.src = g.PicArr[10] + Math.random(), g.Altitude = 0, oSym.addTask(70, function(h, i) {
                    $Z[h] && i.beAttacked && (i.isAttacking = 0, i.EleBody.src = i.PicArr[i.NormalGif])
                }, [e, g])))
            }, [c, b, a])
        },
        AutoReduceHP: function(a) {
            oSym.addTask(300, ClearChild, [this.Ele]);
            oSym.addTask(100, function(c) {
                var b = $Z[c];
                b && ((b.HP -= 60) < 1 ? b.Die(0) : oSym.addTask(100, arguments.callee, [c]))
            }, [a])
        }
    });