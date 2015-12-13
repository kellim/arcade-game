var board = {
    width: 707,
    height: 704,
    tileHeight: 83,
    tileWidth: 101
};
// The player starts at and cannot move past yLimit
board.yLimit = board.height - board.tileHeight - 47;

var game = {
    level: 1,
    score: 0,
    increaseScore: function(points) { this.score += points;},
    decreaseScore: function(points) { this.score -= points;},
    startPlaying: function() {this.playing = false;},
    stopPlaying: function() {this.playing = true;},
    playing: true,
    levelUp: function() {
        this.level += 1;
        if (this.level > 20) {
            this.playing = false;
        }
        game.increaseScore(100);
        // increase enemy speed as level increases
        allEnemies.forEach(function(enemy) {
            if (this.level > 10) {
                enemy.increaseSpeed(20);
            } else {
                enemy.increaseSpeed(5);
            }
        });
        // Add additional enemies at alternating levels
        switch(this.level) {
            case 2:
                var ladyBug2 = new Enemy(getRandomInt(-100, -175), 60 + board.tileHeight * 3,
                getRandomInt(50, 75), 77, 67, 'images/enemy-bug.png');
                allEnemies.push(ladyBug2);
                break;
            case 4:
                var yellowBug2 = new Enemy(getRandomInt(-100, -175), 60 + board.tileHeight * 2,
                getRandomInt(50, 75), 73, 76, 'images/enemy-bug-yellow.png');
                allEnemies.push(yellowBug2);
                break;
            case 6:
                var greenBug2 = new Enemy(getRandomInt(-100, -175), 60 + board.tileHeight,
                getRandomInt(50, 75), 79, 53, 'images/enemy-bug-green.png');
                allEnemies.push(greenBug2);
                break;
            case 8:
                var blueBug2 = new Enemy(getRandomInt(-100, -175), 60 + board.tileHeight * 4,
                getRandomInt(50, 75), 79, 52, 'images/enemy-bug-blue.png');
                allEnemies.push(blueBug2);
                break;
            case 10:
                var purpleBug = new Enemy(getRandomInt(-100, -175), 60 + board.tileHeight * 5,
                getRandomInt(50, 75), 77, 67, 'images/enemy-bug-purple.png');
                allEnemies.push(purpleBug);
                break;
            case 12:
                var purpleBug2 = new Enemy(getRandomInt(-100, -175), 60 + board.tileHeight * 5,
                getRandomInt(50, 75), 77, 67, 'images/enemy-bug-purple.png');
                allEnemies.push(purpleBug2);
                break;
            case 14:
                var purpleBug3 = new Enemy(getRandomInt(-100, -175), 60,
                getRandomInt(50, 75), 77, 67, 'images/enemy-bug-purple.png');
                allEnemies.push(purpleBug3);
                break;
            case 16:
                var purpleBug4 = new Enemy(getRandomInt(-100, -175), 60,
                getRandomInt(50, 75), 77, 67, 'images/enemy-bug-purple.png');
                allEnemies.push(purpleBug4);
                break;
            case 18:
                var yellowBug2 = new Enemy(getRandomInt(-100, -175), -25,
                getRandomInt(50, 75), 73, 76, 'images/enemy-bug-yellow.png');
                allEnemies.push(yellowBug2);
                break;
        }
    }
};

// Function code from Mozilla Developer Network
// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


var Enemy = function(x, y, speed, yOffset, height, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    if (game.playing) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 98;         // width of enemy in the image
        this.xOffset = 1;        // whitespace on the sides of the enemy in the image
        this.yOffset = yOffset;  // whitespace on the top of enemy in the image
        this.height = height;    // height of the enemy within the image
        this.sprite = sprite;    // uses provided helper to easily load images
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        if (game.playing) {
            this.x += this.speed * dt;
            this.checkCollision(player)
            if (this.x > board.width) {
                this.x = -150;
            }
    }

};

// Collision uses axis-aligned bounding box code adapted from MDN
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.checkCollision = function() {
    if (game.playing) {
        if (this.x + this.xOffset < player.x + player.width + player.xOffset &&
            this.x + this.xOffset + this.width > player.x + player.xOffset &&
            this.y + this.yOffset < player.y + player.yOffset + player.height &&
            this.height + this.y + this.yOffset > player.y + player.yOffset) {
                if (game.score > 0) {
                    game.decreaseScore(50);
                }
                player.reset();
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (game.playing) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Enemy.prototype.increaseSpeed = function(amount) {
    this.speed += amount;
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    if (game.playing) {
        this.x = board.tileWidth * 3;
        this.y = board.yLimit;
        this.xOffset = 17;  // whitespace on each side of player in the image
        this.width = 67;    // width of the player within the image
        this.height = 76;   // height of the player within the image
        this.yOffset = 64;  // whitespace on the top of player in the image
        this.sprite = 'images/char-pink-girl.png';
    }
}

Player.prototype.reset = function() {
    if (game.playing) {
        // Put player back at the starting position
        this.x = board.tileWidth * 3;
        this.y = board.yLimit;
        // Update the score
        document.getElementById('score-value').innerHTML = game.score;
        // Update the Level
        document.getElementById('level-value').innerHTML = game.level;
    }
};

Player.prototype.update = function() {
    if (game.playing) {
        if (this.y <= 0) {
            game.levelUp();
            player.reset();
        }
    }
};

Player.prototype.render = function() {
    if (game.playing) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Move the player left, right, up, or down based on
// the arrow key the user presses. It also prevents
// the player from moving off the board.
Player.prototype.handleInput = function(key) {
    if (game.playing) {
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
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var ladyBug = new Enemy(getRandomInt(-175, -250), 60 + board.tileHeight,
                getRandomInt(100, 200), 77, 67, 'images/enemy-bug.png');
var greenBug = new Enemy(getRandomInt(-125, -225), 60 + board.tileHeight * 2,
                getRandomInt(150, 225), 79, 53, 'images/enemy-bug-green.png');
var yellowBug = new Enemy(getRandomInt(-75, -125),60 + board.tileHeight * 3,
                getRandomInt(50, 150), 73, 76, 'images/enemy-bug-yellow.png');
var blueBug = new Enemy(getRandomInt(-50, -100), 60 + board.tileHeight * 4,
                getRandomInt(100, 250), 79, 52, 'images/enemy-bug-blue.png');
var allEnemies = [ladyBug, greenBug, yellowBug, blueBug];
var player = new Player();

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
