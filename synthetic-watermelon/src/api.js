const API = {
    debug: false,
    parent: '',
    scale: 1,
    backgroundColor: '',
    transparent: false, // transparent：true 让 canvas 背景透明
    cdn: '',
    // 内置事件
    event: {
        onStart: null,
        onGameOver: null,
        onProgress: null,
        onComplete: null,
        onMessage: null,
    }
    
}
export default API 