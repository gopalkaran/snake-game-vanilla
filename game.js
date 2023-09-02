const canvasId = 'canvas';
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  const DIRECTION_DOWN = 'DIRECTION_DOWN';
  const DIRECTION_UP = 'DIRECTION_UP';
  const DIRECTION_LEFT = 'DIRECTION_LEFT';
  const DIRECTION_RIGHT = 'DIRECTION_RIGHT';

  let heroPosition = [
    { x: 10, y: 15 },
    { x: 10, y: 16 },
    { x: 10, y: 17 },
  ];

  let heroDirection = DIRECTION_UP;

  const noOfRows = 500 / 20;
  const noOfColumns = 500 / 20;

  let foodPosition = {
    x: Math.floor(Math.random() * noOfColumns),
    y: Math.floor(Math.random() * noOfRows),
  };

  function drawBackground(ctx) {
    const { width, height } = canvas.getBoundingClientRect();

    //Draw border
    ctx.strokeStyle = 'lightgray';
    ctx.rect(0, 0, width, height);
    ctx.stroke();
    ctx.lineWidth = 0.5;

    //Draw rows
    for (let i = 0; i < noOfRows; i++) {
      ctx.moveTo(0, i * 20);
      ctx.lineTo(500, i * 20);
    }

    //Draw cols
    for (let i = 0; i < noOfColumns; i++) {
      ctx.moveTo(i * 20, 0);
      ctx.lineTo(i * 20, 500);
    }

    ctx.stroke();
  }

  function drawHero(ctx) {
    for (let i = 0; i < heroPosition.length; i++) {
      let part = heroPosition[i];
      ctx.fillStyle = i == 0 ? 'yellow' : 'red';
      ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
    }
  }

  function drawFood(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(foodPosition.x * 20, foodPosition.y * 20, 20, 20);
  }

  function displayScore() {
    document.getElementById('score').innerText = score;
  }
  function drawWorld(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    drawHero(ctx);
    drawFood(ctx);
    displayScore();
  }

  let lastAnimationTime;
  let gameOver = false;
  let score = 0;
  const step = (time) => {
    if (!lastAnimationTime) {
      lastAnimationTime = time;
    } else if (time - lastAnimationTime > 300) {
      console.log(time - lastAnimationTime);
      lastAnimationTime = time;
      let { x, y } = heroPosition[0];
      switch (heroDirection) {
        case DIRECTION_DOWN:
          y++;
          break;
        case DIRECTION_UP:
          y--;
          break;
        case DIRECTION_LEFT:
          x--;
          break;
        case DIRECTION_RIGHT:
          x++;
          break;
      }
      if (ifSnakeEatsFood(x, y)) {
        score = score + 1;
        changeFoodLocation();
      } else {
        heroPosition.pop();
      }
      if (y < 0 || y === noOfRows || x < 0 || x === noOfColumns) {
        gameOver = true;
      }

      for (let i = 0; i < heroPosition.length; i++) {
        let part = heroPosition[i];
        if (part.x === x && part.y === y) {
          gameOver = true;
          break;
        }
      }

      if (gameOver) {
        // document.getElementById('error').innerText = 'Game Over';
        alert('Game Over');
        return;
      }
      const newHead = {};
      newHead.x = x;
      newHead.y = y;
      heroPosition.unshift(newHead);
    }
    drawWorld(ctx);
    window.requestAnimationFrame(step);
  };

  document.addEventListener('keyup', (evt) => {
    console.log('keyup', evt.key);
    switch (evt.key) {
      case 'ArrowLeft':
        if (heroDirection !== DIRECTION_RIGHT) heroDirection = DIRECTION_LEFT;
        break;
      case 'ArrowRight':
        if (heroDirection !== DIRECTION_LEFT) heroDirection = DIRECTION_RIGHT;
        break;
      case 'ArrowUp':
        if (heroDirection !== DIRECTION_DOWN) heroDirection = DIRECTION_UP;
        break;
      case 'ArrowDown':
        if (heroDirection !== DIRECTION_UP) heroDirection = DIRECTION_DOWN;
        break;
    }
  });
  window.requestAnimationFrame(step);

  function changeFoodLocation() {
    foodPosition = {
      x: Math.floor(Math.random() * noOfColumns),
      y: Math.floor(Math.random() * noOfRows),
    };
  }

  function ifSnakeEatsFood(x, y) {
    if (x === foodPosition.x && y === foodPosition.y) {
      return true;
    }
  }
});
