var board = {
    width: 707,
    height: 704,
    tileHeight: 83,
    tileWidth: 101
};
// The player starts at and cannot move past yLimit
board.yLimit = board.height - board.tileHeight - 47;

// Function code from Mozilla Developer Network
// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var Enemy = function(x, y, speed, yOffset, height, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 98;         // width of enemy in the image
    this.xOffset = 1;        // whitespace on the sides of the enemy in the image
    this.yOffset = yOffset;  // whitespace on the top of enemy in the image
    this.height = height;    // height of the enemy within the image
    this.sprite = sprite;    // uses provided helper to easily load images
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        this.x += this.speed * dt;
        this.checkCollision(player)
        if (this.x > board.width) {
            this.x = -150;
        }
};

// Collision uses axis-aligned bounding box code adapted from MDN
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.checkCollision = function(player) {
    if (this.x + this.xOffset < player.x + player.width + player.xOffset &&
        this.x + this.xOffset + this.width > player.x + player.xOffset &&
        this.y + this.yOffset < player.y + player.yOffset + player.height &&
        this.height + this.y + this.yOffset > player.y + player.yOffset) {
            if (player.score > 0) {
                player.score -= 50;
            }
            player.reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    console.log(this.type);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = board.tileWidth * 3;
    this.y = board.yLimit;
    this.xOffset = 17;  // whitespace on each side of player in the image
    this.width = 67;    // width of the player within the image
    this.height = 76;   // height of the player within the image
    this.yOffset = 64;  // whitespace on the top of player in the image
    this.score = 0;
    this.level = 1;
    this.sprite = 'images/char-pink-girl.png';
}

Player.prototype.reset = function() {
    // Put player back at the starting position
    this.x = board.tileWidth * 3;
    this.y = board.yLimit;
    // Update the score
    document.getElementById('score-value').innerHTML = this.score;
    // Update the Level
    document.getElementById('level-value').innerHTML = this.level;
};

Player.prototype.update = function() {
    if (this.y <= 0) {
        this.score += 100;
        this.level += 1;
        player.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Move the player left, right, up, or down based on
// the arrow key the user presses. It also prevents
// the player from moving off the board.
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if (this.x > 0) {
               this.x -= board.tileWidth;
            }
            break;
        case 'right':
            if (this.x < board.width - board.tileWidth) {
                this.x += board.tileWidth;
            }
            break;
        case 'up':
            if (this.y > 0) {
                this.y -= board.tileHeight;
            }
            break;
        case 'down':
            if (this.y < board.yLimit) {
                this.y += board.tileHeight;
            }
            break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var ladyBug1 = new Enemy(getRandomInt(-300, -400), 60 + board.tileHeight,
                400, 77, 67, 'images/enemy-bug.png');
var greenBug1 = new Enemy(getRandomInt(-200, -300), 60 + board.tileHeight * 2,
                getRandomInt(250, 350), 79, 53, 'images/enemy-bug-green.png');
var blueBug1 = new Enemy(getRandomInt(-500, -600),60 + board.tileHeight * 3,
                getRandomInt(50, 75), 79, 52, 'images/enemy-bug-blue.png');
var yellowBug1 = new Enemy(getRandomInt(-50, -100), 60 + board.tileHeight * 4,
                getRandomInt(100, 200), 73, 76, 'images/enemy-bug-yellow.png');
var purpleBug1 = new Enemy(getRandomInt(-500, -600), 60 + board.tileHeight * 4,
                getRandomInt(400, 500), 77, 67, 'images/enemy-bug-purple.png');
var allEnemies = [ladyBug1, greenBug1, blueBug1, yellowBug1, purpleBug1];
var player = new Player();
console.log(ladyBug1.x, ladyBug1.y, ladyBug1.speed, ladyBug1.yOffset, ladyBug1.height, ladyBug1.sprite);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});
