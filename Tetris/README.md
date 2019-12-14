# Tetris JS
[![Build status](https://neilb.visualstudio.com/Git%20Neil/_apis/build/status/Tetris%20JS%20CI)](https://neilb.visualstudio.com/Git%20Neil/_build/latest?definitionId=5)

This is the classic game of Tetris written in pure HTML (No Canvas 2D Controls). It uses HTML Tables and jQuery for rendering, and is surprisingly pretty fast. I know there's a lot of these out on the web but I wanted to create something that looked minimalistic yet elegant with excellent controls and compatibility.

Wide browser support on both desktop and mobile devices. Includes keyboard, touch, and even Xbox Gamepad Support! It is fully responsive and on larger screens it displays more information like the next piece. I spent quite a bit of time tweaking the touch controls to make it feel smooth and responsive on any smartphone.

See demo here: https://www.neilb.net/tetrisjs/

# Architecture

The code references a few external libraries:

**jQuery** for DOM manipulation and rendering

**Bootstrap** for button styles and grid layout for desktop/mobile

**Rivets** for binding of data labels likes score, lines, etc..

**RequireJS** as the AMD module loader of the compiled TypeScript JS files

**Font Awesome** for directional icons

I used the following styles to extend the touch surface to the entire screen:

```css
body, html {
    height: 100%;
}
```

The code is written in TypeScript, to run and compile it locally use the following commands:

`npm install`

`tsc`

Please send me any feedback or bugs you may find.

Thanks!