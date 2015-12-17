// The game object stores information about the game, its board dimensions,
// and has functions to help update game information, and to level up.
var game = {
    level: 1,
    score: 0,
    lives: 3,
    playing: true, // the game starts right away
    board: {
        width: 707,
        height: 704,
        tileHeight: 83,
        tileWidth: 101
    },
    writeScore: function() {
        $('#score-value').html(this.score);
    },
    writeLives: function() {
        $('#lives-value').html(this.lives);
    },
    writeLevel: function() {
        $('#level-value').html(this.level);
    },
    increaseScore: function(points) {
        this.score += points;
        this.writeScore();
    },
    decreaseScore: function(points) {
        this.score -= points;
        this.writeScore();
    },
    extraLife: function() {
        this.lives++;
        this.writeLives();
    },
    loseLife: function() {
        this.lives--;
        this.writeLives();
    },
    startPlaying: function() {this.playing = false;},
    stopPlaying: function() {this.playing = true;},
    levelUp: function() {
        // The game is over once you beat level 20.
        if (this.level >= 20) {
            this.playing = false;
        } else {
            this.level ++;
            heart.reset();
            // Speed up Enemies a little each level.
            allEnemies.forEach(function(enemy) {
                enemy.levelUp();
            });
            // Place the gem, and if it overlaps the heart, place the gem
            // again until it is in a different spot than the heart.
            do {
                gem.reset();
            } while (gem.checkCollision(heart));
            this.writeLevel();
            this.increaseScore(100);
            addEnemies(this, this.level);
        }
    }
};

// The player starts at and cannot move past yLimit
game.board.yLimit = game.board.height - game.board.tileHeight - 47;

// Entity object constructor
// Parameters: x, y, width, height, xOffset, yOffset, sprite
// x and y are coordinates the entity is located at on the game board.
// width and height are the width and height of the entity within the image.
// xOffset and yOffset are whitespace on the sides and top of the entity
// in the image respsectively.
// sprite is the image url. A provided helper loads the images.
var Entity = function(x, y, width, height, xOffset, yOffset, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.sprite = sprite;
};

// Collision detection uses axis-aligned bounding box code adapted from MDN
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Entity.prototype.checkCollision = function(otherEntity) {
    if (game.playing) {
        if (this.x + this.xOffset < otherEntity.x + otherEntity.width + otherEntity.xOffset &&
            this.x + this.xOffset + this.width > otherEntity.x + otherEntity.xOffset &&
            this.y + this.yOffset < otherEntity.y + otherEntity.yOffset + otherEntity.height &&
            this.height + this.y + this.yOffset > otherEntity.y + otherEntity.yOffset) {
            return true;
        } else {
            return false;
        }
    }
};

// An object's render function is called by renderEntities() in engine.js;
// If you add additional types of entities, you will need to update that
// function.
Entity.prototype.render = function() {
    if (game.playing) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Enemy object constructor
// Parameters: x, y, speed, yOffset, height, sprite are passed to the
// Entity constructor along with a width of 98 and xOffset of 1.
// unique parameter: speed, the speed of the enemy
var Enemy = function(x, y, speed, yOffset, height, sprite) {
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
        if (this.checkCollision(player)) {
            if (game.score > 0) {
                game.decreaseScore(50);
            }
            game.loseLife();
            if (game.lives > 0) {
                player.reset();
            } else {
                game.playing = false;
            }
        }
        if (this.x > game.board.width) {
            this.x = -150;
        }
    }
};

// Increase enemy speed
// Parameter: amount (how much you want to increase the speed by)
Enemy.prototype.increaseSpeed = function(amount) {
    this.speed += amount;
};

// Action(s) to perform at each new level: Speed up the enemy a
// small random amount based on level.
// Parameters: game (object) and level (the level the game is on)
Enemy.prototype.levelUp = function(game, level) {
    if (this.level > 10) {
        this.increaseSpeed(getRandomInt(10, 20));
    } else {
        this.increaseSpeed(getRandomInt(5,15));
    }
};

// LadyBug object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 50 and 100 is passed to the Enemy constructor,
// as well as a yOffset of 77, height of 67, and the image URL for sprite.
var LadyBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(50, 100), 77, 67, 'images/enemy-bug.png');
};
LadyBug.prototype = Object.create(Enemy.prototype);
LadyBug.prototype.constructor = Enemy;

// GreenBug object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 125 and 225 is passed to the Enemy constructor,
// as well as a yOffset of 79, height of 53, and the image URL for sprite.
var GreenBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(125, 225), 79, 53, 'images/enemy-bug-green.png');
};
GreenBug.prototype = Object.create(Enemy.prototype);
GreenBug.prototype.constructor = Enemy;

// YellowBug object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 175 and 250 is passed to the Enemy constructor,
// as well as a yOffset of 73, height of 76, and the image URL for sprite.
var YellowBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(175, 250), 73, 76, 'images/enemy-bug-yellow.png');
};
YellowBug.prototype = Object.create(Enemy.prototype);
YellowBug.prototype.constructor = Enemy;

// BlueBug object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 150 and 225 is passed to the Enemy constructor,
// as well as a yOffset of 79, height of 52, and the image URL for sprite.
var BlueBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(150, 225), 79, 52, 'images/enemy-bug-blue.png');
};
BlueBug.prototype = Object.create(Enemy.prototype);
BlueBug.prototype.constructor = Enemy;

// PurpleBug object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 75 and 175 is passed to the Enemy constructor,
// as well as a yOffset of 77, height of 67, and the image URL for sprite.
var PurpleBug = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(75, 175), 77, 67, 'images/enemy-bug-purple.png');
};
PurpleBug.prototype = Object.create(Enemy.prototype);
PurpleBug.prototype.constructor = Enemy;

// Player object constructor
// Calculated x coordinates, calculated y coordinates, width of 67, height of 76,
// xOffset of 17, yOffset of 64, and the image URL for the sprite are being passed to the
// Entity constructor.
var Player = function() {
        Entity.call(this, game.board.tileWidth * 3, game.board.yLimit, 67, 76, 17, 64,
            'images/char-pink-girl.png');
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Entity;

// Reset player by moving back to starting position
Player.prototype.reset = function() {
    this.x = game.board.tileWidth * 3;
    this.y = game.board.yLimit;
};

// When player gets to the other side and has "beat a level"
// call function to reset player and for leveling up in the game
Player.prototype.update = function() {
    if (game.playing) {
        // player made it to the top where y <= 0
        if (this.y <= 0) {
            player.reset();
            game.levelUp();
        }
    }
};

// Move the player left, right, up, or down based on
// the arrow key the user presses. It also prevents
// the player from moving off the board.
Player.prototype.handleInput = function(key) {
    if (game.playing) {
        switch(key) {
            case 'left':
                if (this.x > 0) {
                    this.x -= game.board.tileWidth;
                }
                break;
            case 'right':
                if (this.x < game.board.width - game.board.tileWidth) {
                    this.x += game.board.tileWidth;
                }
                break;
            case 'up':
                if (this.y > 0) {
                    this.y -= game.board.tileHeight;
                }
                break;
            case 'down':
                if (this.y < game.board.yLimit) {
                    this.y += game.board.tileHeight;
                }
                break;
        }
    }
};

// Item object constructor
// Parameters x, y, width, height, xOffset, yOffset, and sprite
// are being passed to the Entity constructor.
var Item = function(x, y, width, height, xOffset, yOffset, sprite) {
        Entity.call(this, x, y, width, height, xOffset, yOffset, sprite);
        // Unique property obtained keeps track if the player got the item.
        // Intended to be set to true when the player touches the item,
        // and to be reset to false at the beginning of each level.
        this.obtained = false;
};
Item.prototype = Object.create(Entity.prototype);
Item.prototype.constructor = Entity;

// Reset the item, intended to be run at the start of each level.
// It resets the object's obtained property to false and moves it to
// a new random location (tile) on the board except for on the grass.
Item.prototype.reset = function() {
    this.obtained = false;
    this.x = game.board.tileWidth * getRandomInt(0, 7);
    this.y = 80 + game.board.tileHeight * getRandomInt(0, 6);
};

// When the player is touching the item, set the item's obtained
// value to true, and run that object's success function. The success
// function is unique to each item and is the action to take once
// the player obtained the item at that level.
Item.prototype.update = function() {
    if (this.checkCollision(player) && this.obtained === false) {
        this.obtained = true;
        if (typeof this.success === 'function') {
            this.success();
        }
    }
};

// Heart object constructor.
// Parameters: x, y (coordinates) will be passed to the Item constructor.
// A width of 90, height of 90, xOffset of 7, yOffset of 53 (see note), and
// the image URL for the sprite are being passed to the Item constructor.
// Note: The real yOffset of the heart image is 48 but using 53 instead
// because the heart goes beyond the top of the tile and I want the player
// to be on the tile with the majority of the heart to obtain it.
var Heart = function(x, y) {
    Item.call(this, x, y, 90, 90, 7, 53, 'images/Heart.png');
};
Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Item;

// Action(s) to perform when heart is successfully obtained:
// Gain an extra life
Heart.prototype.success = function() {
    game.extraLife();
};

// Gem object constructor
// Parameters: x, y (coordinates) will be passed to the Item constructor.
// A width of 95, height of 85 (see note), xOffset of 4, yOffset of 58, and
// the image URL for the sprite are being passed to the Item constructor.
// Note: The real height of the gem image is 105 but using 85 for height instead
// because the gem goes beyond the bottom of the tile and I want the player
// to be on the tile with the majority of the gem to obtain it.
var Gem = function(x, y) {
        Item.call(this, x, y, 95, 85, 4, 58, 'images/gem-orange.png');
};
Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Item;

// Action(s) to perform when gem is successfully obtained:
// Increase score by 500.
Gem.prototype.success = function() {
        game.increaseScore(500);
};

// Instantiate initial objects.
var ladyBug = new LadyBug(getRandomInt(-175, -250), 60 + game.board.tileHeight);
var greenBug = new GreenBug(getRandomInt(-125, -225), 60 + game.board.tileHeight *2);
var yellowBug = new YellowBug(getRandomInt(-75, -125),60 + game.board.tileHeight * 3);
var blueBug = new BlueBug(getRandomInt(-50, -100), 60 + game.board.tileHeight * 4);
var player = new Player();
var heart = new Heart(game.board.tileWidth * getRandomInt(0, 7),
    80 + game.board.tileHeight * getRandomInt(0, 6));
var gem = new Gem(game.board.tileWidth * getRandomInt(0, 7),
    80 + game.board.tileHeight * getRandomInt(0, 6));
// Make sure gem is not placed where it overlaps the heart
while (gem.checkCollision(heart)) {
    gem.reset();
}

// Any new enemy added must be placed in the allEnemies array.
// engine.js loops through the array to render enemies.
var allEnemies = [ladyBug, greenBug, yellowBug, blueBug];

// Add new enemies at even levels. Used a switch, but JSLint gave an error
// to not declare variables in a switch, and since these are
// objects being created, you can't declare them ahead of time.
// I looked for another way to do this and found this article:
// http://davidbcalhoun.com/2010/is-hash-faster-than-switch-in-javascript/
// which is where the below code in tne addEnemies function is adapted from.
function addEnemies(game, level) {
    var cases = {};
    cases[2] = function() {
        var ladyBug2 = new LadyBug(getRandomInt(-100, -200), 60 + game.board.tileHeight * 3);
        allEnemies.push(ladyBug2);
    };
    cases[4] = function() {
        var yellowBug2 = new YellowBug(getRandomInt(-100, -250), 60 + game.board.tileHeight * 2);
        allEnemies.push(yellowBug2);
    };
    cases[6] = function() {
        var greenBug2 = new GreenBug(getRandomInt(-100, -175), 60 + game.board.tileHeight);
        allEnemies.push(greenBug2);
    };
    cases[8] = function() {
        var blueBug2 = new BlueBug(getRandomInt(-100, -225), 60 + game.board.tileHeight * 4);
        allEnemies.push(blueBug2);
    };
    cases[10] = function() {
        var purpleBug = new PurpleBug(getRandomInt(-150, -250), 60 + game.board.tileHeight * 5);
        allEnemies.push(purpleBug);
    };
    cases[12] = function() {
        var purpleBug2 = new PurpleBug(getRandomInt(-100, -200), 60 + game.board.tileHeight * 5);
        allEnemies.push(purpleBug2);
    };
    cases[14] = function() {
        var purpleBug3 = new PurpleBug(getRandomInt(-150, -250), 60);
        allEnemies.push(purpleBug3);
    };
    cases[16] = function() {
        var purpleBug4 = new PurpleBug(getRandomInt(-100, -200), 60);
        allEnemies.push(purpleBug4);
    };
    cases[18] = function() {
        var yellowBug2 = new YellowBug(getRandomInt(-150, -200), -25);
        allEnemies.push(yellowBug2);
    };
    cases[20] = function() {
        var yellowBug3 = new YellowBug(getRandomInt(-150, -200), -25);
        allEnemies.push(yellowBug3);
    };
    if(typeof cases[level] === 'function') {
        // Only executes if defined above.
         cases[level]();
    }
}

// Function code is from from Mozilla Developer Network
// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
$(document).ready(function(){
    // The Start New Game button will start a new game by reloading
    // the webpage.
    $('#btn-start-game').click(function(){
        location.reload();
    });
});

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});