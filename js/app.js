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
    lives: 3,
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
                enemy.increaseSpeed(getRandomInt(10, 20));
            } else {
                enemy.increaseSpeed(getRandomInt(5,15));
            }
        });
        // Add additional enemies at alternating levels
        switch(this.level) {
            case 2:
                var ladyBug2 = new LadyBug(getRandomInt(-100, -200), 60 + board.tileHeight * 3);
                allEnemies.push(ladyBug2);
                break;
            case 4:
                var yellowBug2 = new YellowBug(getRandomInt(-100, -250), 60 + board.tileHeight * 2);
                allEnemies.push(yellowBug2);
                break;
            case 6:
                var greenBug2 = new GreenBug(getRandomInt(-100, -175), 60 + board.tileHeight);
                allEnemies.push(greenBug2);
                break;
            case 8:
                var blueBug2 = new BlueBug(getRandomInt(-100, -225), 60 + board.tileHeight * 4);
                allEnemies.push(blueBug2);
                break;
            case 10:
                var purpleBug = new PurpleBug(getRandomInt(-150, -250), 60 + board.tileHeight * 5);
                allEnemies.push(purpleBug);
                break;
            case 12:
                var purpleBug2 = new PurpleBug(getRandomInt(-100, -200), 60 + board.tileHeight * 5);
                allEnemies.push(purpleBug2);
                break;
            case 14:
                var purpleBug3 = new PurpleBug(getRandomInt(-150, -250), 60);
                allEnemies.push(purpleBug3);
                break;
            case 16:
                var purpleBug4 = new PurpleBug(getRandomInt(-100, -200), 60);
                allEnemies.push(purpleBug4);
                break;
            case 18:
                var yellowBug2 = new YellowBug(getRandomInt(-150, -200), -25);
                allEnemies.push(yellowBug2);
                break;
            case 20:
                var yellowBug3 = new YellowBug(getRandomInt(-150, -200), -25);
                allEnemies.push(yellowBug3);
                break;
        }
    }
};

// Function code from Mozilla Developer Network
// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var Entity = function(x, y, width, height, xOffset, yOffset, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;     // width of entity in the image
    this.height = height;   // height of the entity within the image
    this.xOffset = xOffset; // whitespace on the sides of the entity in the image
    this.yOffset = yOffset; // whitespace on the top of entity in the image
    this.sprite = sprite;   // uses provided helper to easily load images
}

var Enemy = function(x, y, speed, yOffset, height, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
        Entity.call(this, x, y, 98, height, 1, yOffset, sprite);
        this.speed = speed;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Entity;

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
                game.lives--;
                document.getElementById('lives-value').innerHTML = game.lives;
                if (game.lives > 0) {
                    player.reset();
                } else {
                    game.playing = false;
                }
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

//Create LadyBug Object
var LadyBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(50, 100), 77, 67, 'images/enemy-bug.png');
};
LadyBug.prototype = Object.create(Enemy.prototype);
LadyBug.prototype.constructor = Enemy;

// Create GreenBug Object
var GreenBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(125, 225), 79, 53, 'images/enemy-bug-green.png');
};
GreenBug.prototype = Object.create(Enemy.prototype);
GreenBug.prototype.constructor = Enemy;

// Create YellowBug Object
var YellowBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(175, 250), 73, 76, 'images/enemy-bug-yellow.png');
};
YellowBug.prototype = Object.create(Enemy.prototype);
YellowBug.prototype.constructor = Enemy;

// Create BlueBug Object
var BlueBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(150, 225), 79, 52, 'images/enemy-bug-blue.png');
};
BlueBug.prototype = Object.create(Enemy.prototype);
BlueBug.prototype.constructor = Enemy;

// Create PurpleBug Object
var PurpleBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(75, 175), 77, 67, 'images/enemy-bug-purple.png');
};
PurpleBug.prototype = Object.create(Enemy.prototype);
PurpleBug.prototype.constructor = Enemy;



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
        Entity.call(this, board.tileWidth * 3, board.yLimit, 67, 76, 17, 64,
                    'images/char-pink-girl.png');
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Entity;

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
var ladyBug = new LadyBug(getRandomInt(-175, -250), 60 + board.tileHeight);
var greenBug = new GreenBug(getRandomInt(-125, -225), 60 + board.tileHeight *2);
var yellowBug = new YellowBug(getRandomInt(-75, -125),60 + board.tileHeight * 3);
var blueBug = new BlueBug(getRandomInt(-50, -100), 60 + board.tileHeight * 4);
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
