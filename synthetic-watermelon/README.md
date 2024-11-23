# 合成西瓜

## 技术说明

这是一个基于 phaser 框架开发的 TS 合成西瓜移动端小游戏。phaser 使用 canvas 技术渲染游戏界面，已经实现了游戏的基础逻辑部分（例如碰撞检测）。

## 产品说明

合成西瓜游戏，类似 2048 游戏，不同尺寸的水果（西瓜）遇到后合并成一个大西瓜。关键技术点是图形碰撞检测。如果相邻西瓜种类相同，那么自动合并。

## 技术栈

- phaser： 高性能 2D 游戏框架，https://github.com/phaserjs/phaser
- rollup：快速打包工具

## 开发命令

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run watch` | Build project and open web server running project, watching for changes |
| `npm run dev` | Builds project and open web server, but do not watch for changes |
| `npm run build` | Builds code bundle with production settings (minification, no source maps, etc..) |
