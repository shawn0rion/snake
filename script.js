const gridElement = document.querySelector("#grid");
let score = 0;
const grid = {
  numRows: 15,
  numCols: 15,
  cells: [],
};

const food = {
  row: 0,
  col: 0,
};

const snake = {
  body: [],
  dx: 0,
  dy: 0,
};

// game and ui
function generateGrid() {
  for (let row = 0; row < grid.numRows; row++) {
    grid.cells[row] = [];
    for (let col = 0; col < grid.numCols; col++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.row = row;
      cellElement.dataset.col = col;
      gridElement.appendChild(cellElement);
      grid.cells[row].push({
        row: row,
        col: col,
        type: null,
        element: cellElement,
      });
    }
  }
}

function randomCell() {
  let cell = {};
  while (cell.type !== null) {
    let row = Math.floor(Math.random() * grid.numRows);
    let col = Math.floor(Math.random() * grid.numCols);
    cell = grid.cells[row][col];
  }
  return { ...cell };
}

function checkOutOfBounds(row, col) {
  return row < 0 || row === grid.numRows || col < 0 || col === grid.numCols;
}

function checkFoodCollision(row, col) {
  return row === food.row && col === food.col;
}

function checkSelfCollision(row, col) {
  return snake.body.some((x) => x.row === row && x.col === col);
}

function updatePlayer() {
  const tail = { ...snake.body[snake.body.length - 1] };
  const currentHead = { ...snake.body[0] };

  const nextHeadPosition = {
    row: currentHead.row + snake.dy,
    col: currentHead.col + snake.dx,
  };

  if (checkFoodCollision(nextHeadPosition.row, nextHeadPosition.col)) {
    // this will take on value of current tail next iteration
    snake.body.push(currentHead);
    score += 1;
    updateFood();
  } else {
    // remove the tail
    grid.cells[tail.row][tail.col].type = null;
  }

  if (
    (snake.body.length > 1 &&
      checkSelfCollision(nextHeadPosition.row, nextHeadPosition.col)) ||
    checkOutOfBounds(nextHeadPosition.row, nextHeadPosition.col)
  ) {
    score = 0;
    clearSnake();
    generateSnake();
    return;
  }

  // SNAKE MOVEMENT

  // start at the back so you don't overrite any data
  for (let i = snake.body.length - 1; i > 0; i--) {
    // passing the data of the segment in front of it to the current segment
    const newCell = { ...snake.body[i - 1] };
    snake.body[i] = snake.body[i - 1];
    grid.cells[newCell.row][newCell.col].type = "snake";
  }

  // push the head in direction
  snake.body[0] = nextHeadPosition;
  grid.cells[snake.body[0].row][snake.body[0].col].type = "snake";
}

function updateGrid() {
  // set each cell class name to cell
  // then add classlist(s) for each cell type
  for (let row = 0; row < grid.numRows; row++) {
    for (let col = 0; col < grid.numCols; col++) {
      const cell = grid.cells[row][col];

      cell.element.className = "cell";
      if (cell.type === "snake") {
        cell.element.classList.add("snake");
      } else if (cell.type === "food") {
        cell.element.classList.add("food");
      }
    }
  }
}

// handlue user input to set direction of snake
document.addEventListener("keydown", handleKeyDown);
function handleKeyDown(event) {
  if (event.key === "ArrowUp" || event.key === "w") {
    snake.dx = 0;
    snake.dy = 1;
  }
  if (event.key === "ArrowDown" || event.key === "s") {
    snake.dx = 0;
    snake.dy = -1;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    snake.dx = -1;
    snake.dy = 0;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    snake.dx = 1;
    snake.dy = 0;
  }
}

function updateFood() {
  const cell = randomCell();
  // update grid
  grid.cells[cell.row][cell.col].type = "food";
  // update food
  food.row = cell.row;
  food.col = cell.col;
}

function clearSnake() {
  for (let i = 0; i < snake.body.length; i++) {
    const row = snake.body[i].row;
    const col = snake.body[i].col;
    grid.cells[row][col].type = null;
  }
  snake.body = [];
  snake.dy = 0;
  snake.dx = 0;
}

function generateSnake() {
  const cell = randomCell();
  // update grid
  grid.cells[cell.row][cell.col].type = "snake";
  // start snake
  snake.body.push(cell);
}

function updateScore() {
  document.querySelector("#score").textContent = `Score: ${score}`;
}

function gameLoop() {
  updatePlayer();
  updateGrid();
  updateScore();
  setTimeout(gameLoop, 500);
}

generateGrid();
generateSnake();
updateFood();
updateGrid();
gameLoop();
