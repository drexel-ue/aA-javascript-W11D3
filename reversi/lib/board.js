let Piece = require("./piece");




/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at 
 * [3, 3] and [4, 4] white [3, 4] and [4, 3]  black
 */
// function _makeGrid(length) {
//   var arr = new Array(length || 0),
//     i = length;

//   if (arguments.length > 1) {
//     var args = Array.prototype.slice.call(arguments, 1);
//     while (i--) arr[length - 1 - i] = _makeGrid.apply(this, args);
//   }

//   return arr;
// }

function _makeGrid() {
  const arr = [];
  for (let i = 0; i < 8; i++) {
    arr.push(new Array(8));
  }
  arr[3][4] = new Piece('black');
  arr[4][3] = new Piece('black');
  arr[3][3] = new Piece('white');
  arr[4][4] = new Piece('white');

  return arr;
}

// console.log(_makeGrid());

/**
 * Constructs a Board with a starting grid set up.
 */
function Board() {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [0, 1], [1, 1], [1, 0],
  [1, -1], [0, -1], [-1, -1],
  [-1, 0], [-1, 1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {

  if (this.isValidPos(pos)) {
    return this.grid[pos[0]][pos[1]];
  }
  throw new Error('Not valid pos!');
};



// console.log(test.getPiece([-1, 3]));

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) { //4
  return this.validMoves(color).length > 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.grid[pos[0]][pos[1]] === undefined) {
    return false;
  }
  return this.grid[pos[0]][pos[1]].color === color
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  // return this.grid[pos[0]][pos[1]] !== undefined
  return !!this.getPiece(pos);
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove('black') && !this.hasMove('white'));
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] > 7 || pos[0] < 0 || pos[1] > 7 || pos[1] < 0) {
    return false;
  };
  return true;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip(board, pos, color, dir, piecesToFlip) { //1
  if (!piecesToFlip) {
    piecesToFlip = []
  } else {
    piecesToFlip.push(pos)
  }

  let nextMove = [pos[0] + dir[0], pos[1] + dir[1]];

  if (!board.isValidPos(nextMove)) {
    return null
  } else if (!board.isOccupied(nextMove)) {
    return null
  } else if (board.isMine(nextMove, color)) {
    return piecesToFlip.length == 0 ? null : piecesToFlip;
  } else {
    return _positionsToFlip(board, nextMove, color, dir, piecesToFlip);
  }

};




/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.isOccupied(pos) || !this.validMove(pos, color)) {
    throw new Error("Invalid Move");
  } else if (this.isValidPos(pos)) {
    this.grid[pos[0]][pos[1]] = new Piece(color);
    Board.DIRS.forEach(dir => {
      if (_positionsToFlip(this, pos, color, dir)) {
        _positionsToFlip(this, pos, color, dir).forEach(pos => {
          this.grid[pos[0]][pos[1]].flip();
        });
      }
    });
  };
}

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  this.grid.forEach(row => {
    let temp = '';
    row.forEach((piece, index) => { temp.concat(piece === null ? ' ' : piece.toString()) });
    // ndjn.each_with_index do | thungg, i |
    end
    console.log(temp);
  });
};


/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {//2
  if (this.isOccupied(pos)) {
    return false;
  } else {
    for (let index = 0; index < Board.DIRS.length; index++) {
      if (_positionsToFlip(this, pos, color, Board.DIRS[index])) {
        return true
      }
    }
  }
  return false;
}
// console.log(Board.DIRS);

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {//3
  const valids = [];

  for (let index1 = 0; index1 < 8; index1++) {
    for (let index2 = 0; index2 < 8; index2++) {
      if (this.validMove([index1, index2], color)) {
        valids.push([index1, index2]);
      }
    }
  }
  return valids;
};


module.exports = Board;
