const gridElement = document.querySelector("#grid");
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

function checkFoodCollision() {
  console.log("checking food collision");
  console.log(`snake head: ${snake.body[0].row}, ${snake.body[0].col}`);
  console.log(`food: ${food.row}, ${food.col}`);
  if (snake.body.some((x) => x.row === food.row && x.col === food.col)) {
    console.log("food collision");
    return true;
  }
  return false;
}

// game
function updatePlayer() {
  const tail = { ...snake.body[snake.body.length - 1] };

  // unset prev snake head
  if (snake.body.length === 1) {
    grid.cells[snake.body[0].row][snake.body[0].col].type = null;
  }

  // update snake body
  // start at the back of array and move each segment to the position of the segment in front of it
  for (let i = snake.body.length - 1; i > 0; i--) {
    if (snake.body.length === 1) {
      break;
    }
    console.log(
      `updating body segment ${snake.body[i].row}, ${snake.body[i].col}`
    );
    const row = snake.body[i].row;
    const col = snake.body[i].col;
    const prevRow = snake.body[i - 1].row;
    const prevCol = snake.body[i - 1].col;
    // unset the cell type of the segment that just moved
    grid.cells[prevRow][prevCol].type = null;
    grid.cells[row][col].type = "snake";
    // move each body segment to the position of the segment in front of it
    snake.body[i] = snake.body[i - 1];
  }
  // update snake head
  snake.body[0].row += snake.dy;
  snake.body[0].col += snake.dx;
  grid.cells[snake.body[0].row][snake.body[0].col].type = "snake";

  if (checkFoodCollision()) {
    // copy the last segment into the end of the body (so it doesn't move)
    snake.body.push({ ...snake.body[snake.body.length - 1] });
    updateFood();
  } else if (snake.body.length > 1) {
    // if the snake didn't eat food, remove the tail
    grid.cells[tail.row][tail.col].type = null;
  }
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
  console.log(grid.cells.flat().filter((x) => x.type === "food")[0]);
}

function generateSnake() {
  const cell = randomCell();
  // update grid
  grid.cells[cell.row][cell.col].type = "snake";
  // start snake
  snake.body.push(cell);
}

function gameLoop() {
  updatePlayer();
  updateGrid();
  setTimeout(gameLoop, 500);
}

generateGrid();
generateSnake();
updateFood();
updateGrid();
gameLoop();
