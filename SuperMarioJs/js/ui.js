// Super Mario Bros. JS Version
// recompiled by EtherDream
// translate by MichaelAn

// util 工具函数
function now() {
  // performance 接口可以获取到当前页面中与性能相关的信息(这里返回一个时间点)
  return performance.now();
}

function toFix(v) {
  // | 位运算符
  return (v * 100 | 0) / 100;
}

// 内存复制32位？
function memcpy32(dstBuf, dstPos, srcBuf, srcPos, len) {
  var src = srcBuf.subarray(srcPos >> 2, (srcPos + len) >> 2);
  dstBuf.set(src, dstPos >> 2);
}

function char(str) {
  return str.charCodeAt(0);
}

// 创建二进制缓存区（
var gameBuf = new ArrayBuffer(1024 * 1024 * 16);

// 根据原始二进制缓存区创建不同数据类型分的数组
// Uint8Array 数组类型表示一个8位无符号整型数组，创建时内容被初始化为0。创建完后，可以以对象的方式或使用数组下标索引的方式引用数组中的元素。
// Uint32Array 创建32位无符号整形数组
// Float32Array 创建32位浮点型数组 
var HEAPU8 = new Uint8Array(gameBuf);
var HEAPU32 = new Uint32Array(gameBuf);
var HEAPF32 = new Float32Array(gameBuf);

// fill static data 填充静态数据
asm_smb_init_mem(gameBuf);

// init asm.js module 开始游戏（汇编反编译实现）
var gameMod = asm_smb_mod(self, {}, gameBuf);
gameMod.init();

// 下面是游戏的参数
var fpsAll = 0;
var gameTimeAll = 0;
var apuTimeAll = 0;
var ppuTimeAll = 0;
var renderTimeAll = 0;
var lastTime = 0;

var nFPS = 0;
var nSec = -1;
var nGameFrame = 0;
var nAudioFrame = 0;
var nSpeed = 1;
var nRemain = 0;

// image 图像尺寸
var PIC_W = 256;
var PIC_H = 240;
var PIC_LEN = PIC_W * PIC_H * 4;
var picPtr = gameMod.getImageBuf();

// 获取界面中的canvas，根据图片的尺寸设置canvas的尺寸
var imageCtx = canvas.getContext('2d');
var imgData = imageCtx.createImageData(PIC_W, PIC_H);
var pixelData = imgData.data;
if (pixelData.buffer) {
  // H5
  var imgDstU32 = new Uint32Array(pixelData.buffer);
} else {
  // IE: fill alpha data
  for (var i = 0; i < PIC_LEN; i += 4) {
    pixelData[i + 3] = 0xff;
  }
}


// audio 设置声音打开
var isMute = true;
var audioCtx;

(function() {
  var _AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!_AudioContext) {
    return;
  }
  audioCtx = new _AudioContext();

  var scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
  var SAMPLES_PER_FRAME = 44100 / 60;
  var AUDIO_SIZE = 2048 * 4;
  var AUDIO_BUF_SIZE = 4096 * 4;
  var audioBufPtr = gameMod.getAudioBuf();
  var lastPos = 0;

  scriptNode.onaudioprocess = function(e) {
    var outBuff = e.outputBuffer;
    var dstBuf = outBuff.getChannelData(0);

    var currPos = nAudioFrame * SAMPLES_PER_FRAME * 4;
    var newBytes = currPos - lastPos;
// if (newBytes < 0) debugger;

    if (newBytes === 0) {
      return;
    }

    var size = newBytes;
    if (size > AUDIO_SIZE) {
      if (size >= AUDIO_SIZE * 2) {
        console.log('audio drop frame');
        lastPos += (size - AUDIO_SIZE);
      }
      size = AUDIO_SIZE;
    }

    var pos = lastPos % AUDIO_BUF_SIZE;
    var remain = AUDIO_BUF_SIZE - pos;
    if (remain > size) {
      memcpy32(dstBuf, 0, HEAPF32, audioBufPtr + pos, size);
    } else {
      memcpy32(dstBuf, 0, HEAPF32, audioBufPtr + pos, remain);
      memcpy32(dstBuf, remain, HEAPF32, audioBufPtr, size - remain);
    }
    lastPos += size;
  };

  scriptNode.connect(audioCtx.destination);

  chkMute.disabled = false;
})();


function audioSetMute(enabled) {
  if (!audioCtx) {
    return;
  }
  if (enabled) {
    audioCtx.suspend();
  } else {
    audioCtx.resume();
  }
  isMute = enabled;
}

// 处理渲染性能分析
function render() {
  requestAnimationFrame(render);

  var t1 = now();

  nRemain += nSpeed;
  while (nRemain > 0) {
    gameMod.updateGameFrame();
    nRemain--;
  }

  var t2 = now();
  if (!isMute) {
    gameMod.updateAudioFrame();
    nAudioFrame++;
  }

  var t3 = now();
  gameMod.updateImageBuf();

  var t4 = now();
  if (imgDstU32) {
    // H5
    memcpy32(imgDstU32, 0, HEAPU32, picPtr, PIC_LEN);
  } else {
    // IE
    for (var i = 0; i < PIC_LEN; i += 4) {
      pixelData[i    ] = HEAPU8[picPtr + i    ];
      pixelData[i + 1] = HEAPU8[picPtr + i + 1];
      pixelData[i + 2] = HEAPU8[picPtr + i + 2];
      // alpha alway 255
    }
  }
  imageCtx.putImageData(imgData, 0, 0);

  var t5 = now();

  var gameTime = t2 - t1;
  var apuTime = t3 - t2;
  var ppuTime = t4 - t3;
  var renderTime = t5 - t4;

  gameTimeAll += gameTime;
  apuTimeAll += apuTime;
  ppuTimeAll += ppuTime;
  renderTimeAll += renderTime;

  nGameFrame++;
  nFPS++;

  if (t5 - lastTime >= 1000) {
    // skip first frame
    nSec++;
    if (nSec > 0) {
      fpsAll += nFPS;
      itemFPSNow.textContent = nFPS;
      itemFPSAvg.textContent = toFix(fpsAll / nSec);
    }

    itemGameNow.textContent = toFix(gameTime);
    itemAPUNow.textContent = toFix(apuTime);
    itemPPUNow.textContent = toFix(ppuTime);
    itemRenderNow.textContent = toFix(renderTime);

    itemGameAvg.textContent = toFix(gameTimeAll / nGameFrame);
    itemAPUAvg.textContent = toFix(apuTimeAll / nGameFrame);
    itemPPUAvg.textContent = toFix(ppuTimeAll / nGameFrame);
    itemRenderAvg.textContent = toFix(renderTimeAll / nGameFrame);    

    nFPS = 0;
    lastTime = t5;
  }
}

var JOY_A       = 0;
var JOY_B       = 1;
var JOY_SELECT  = 2;
var JOY_START   = 3;
var JOY_UP      = 4;
var JOY_DOWN    = 5;
var JOY_LEFT    = 6;
var JOY_RIGHT   = 7;
var PAD_MAP = {};

// gamepad 设置游戏的快捷键
(function() {
  PAD_MAP[char('W')] = JOY_UP;
  PAD_MAP[char('D')] = JOY_RIGHT;
  PAD_MAP[char('S')] = JOY_DOWN;
  PAD_MAP[char('A')] = JOY_LEFT;
  PAD_MAP[char(' ')] = JOY_SELECT;
  PAD_MAP[char('\r')] = JOY_START;

  // 监听键盘输入（如果使用手柄，获取手柄的事件并绑定函数）
  document.addEventListener('keydown', function(e) {
    var key = PAD_MAP[e.keyCode];
    if (key !== undefined) {
      gameMod.setKeyState(key, 1);
    }
  });
  document.addEventListener('keyup', function(e) {
    var key = PAD_MAP[e.keyCode];
    if (key !== undefined) {
      gameMod.setKeyState(key, 0);
    }
  });
})();

// config 配置
(function() {
  var cvsSty = canvas.style;

  chkSwapAB.onclick = function() {
    if (this.checked) {
      PAD_MAP[char('O')] = JOY_A;
      PAD_MAP[char('I')] = JOY_B;
    } else {
      PAD_MAP[char('I')] = JOY_A;
      PAD_MAP[char('O')] = JOY_B;
    }
  };
  chkSwapAB.onclick();

  function setCanvasScale(rate) {
    cvsSty.width = (PIC_W * rate) + 'px';
    cvsSty.height = (PIC_H * rate) + 'px';
  }

  btnSize1X.onclick = function() {
    setCanvasScale(1);
  };
  btnSize2X.onclick = function() {
    setCanvasScale(2);
  };
  btnSize2X.onclick();

  var rFS = canvas.requestFullScreen ||
    canvas.webkitRequestFullscreen ||
    canvas.mozRequestFullScreen;

  if (rFS) {
    btnSizeScreen.disabled = false;
    btnSizeScreen.onclick = function() {
      rFS.call(canvas);
    };
  }

  // 处理浏览器兼容性
  if (/WebKit/.test(navigator.userAgent)) {
    chkPxStyle.disabled = false;
    chkPxStyle.checked = true;
    chkPxStyle.onclick = function() {
      cvsSty.imageRendering = this.checked ? 'pixelated' : '';
    };
    chkPxStyle.onclick();
  }

  rangeSpeed.onchange = function() {
    nSpeed = toFix(Math.pow(2, this.value / 10));
    labelSpeed.textContent = nSpeed;
  };
  rangeSpeed.value = 0;

  chkMute.onchange = function() {
    audioSetMute(this.checked);
  };
  chkMute.onchange();


  btnBenchmark.onclick = function() {
    audioSetMute(true);

    var N = 1000; // 1000 per round
    var round = 0;
    var time = 0;

    for (;;) {
      var t = now();
      for (var i = 0; i < N; i++) {
        gameMod.updateGameFrame();
      }
      t = now() - t;

      round++;
      time += t;
      if (time > 1000) {
        break;
      }
    }

    var frames = round * N;
    var sec = time / 1000;
    alert('Benchmark Result: ' + Math.round(frames / sec) + 'FPS');

    audioSetMute(false);
  };
})();

// Page Visibility
(function() {
  var key, evt;
  if ('hidden' in document) {
    key = 'hidden';
    evt = 'visibilitychange';
  } else if ('msHidden' in document) {
    key = 'msHidden';
    evt = 'msvisibilitychange';
  } else if ('webkitHidden' in document) {
    key = 'webkitHidden';
    evt = 'webkitvisibilitychange';
  }
  if (!key) {
    return;
  }
  document.addEventListener(evt, function() {
    var isHidden = document[key];
    audioSetMute(isHidden);
  });
})();

function main() {
  render();
}

main();