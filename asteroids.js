document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('asteroidsCanvas');
    if (!canvas) {
        console.error("Asteroids canvas not found!");
        return;
    }
    const ctx = canvas.getContext('2d');

    let canvasWidth = canvas.offsetWidth;
    let canvasHeight = canvas.offsetHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    window.addEventListener('resize', () => {
        canvasWidth = canvas.offsetWidth;
        canvasHeight = canvas.offsetHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    });

    const SHIP_SIZE = 20;
    const SHIP_THRUST = 5;
    const FRICTION = 0.97;
    const TURN_SPEED = 360; // degrees per second
    const BULLET_SPEED = 500; // pixels per second
    const ASTEROID_NUM = 3; // starting number of asteroids
    const ASTEROID_SIZE = 100; // starting size
    const ASTEROID_SPEED = 50; // max starting speed
    const ASTEROID_VERTICES = 10; // avg number of vertices
    const ASTEROID_JAGGEDNESS = 0.4; // 0 = none, 1 = lots
    const SHOW_BOUNDING = false; // show collision bounding boxes
    const SCORE_FONT_SIZE = 40;
    const LIVES = 3;
    const INVINCIBILITY_DURATION = 3; // seconds
    const BLINK_DURATION = 0.1; // seconds

    let ship, asteroids, bullets, score, lives, level;

    function newGame() {
        ship = newShip();
        score = 0;
        lives = LIVES;
        level = 0;
        asteroids = [];
        createAsteroidBelt();
        bullets = [];
    }

    function newShip() {
        return {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            radius: SHIP_SIZE / 2,
            angle: 90 / 180 * Math.PI, // convert to radians
            rotation: 0,
            thrusting: false,
            thrust: { x: 0, y: 0 },
            canShoot: true,
            isInvincible: true,
            blinkTime: Math.ceil(BLINK_DURATION * 60),
            blinkNum: Math.ceil(INVINCIBILITY_DURATION / BLINK_DURATION),
            explodeTime: 0
        };
    }

    function createAsteroidBelt() {
        asteroids = [];
        let x, y;
        for (let i = 0; i < ASTEROID_NUM + level; i++) {
            do {
                x = Math.floor(Math.random() * canvasWidth);
                y = Math.floor(Math.random() * canvasHeight);
            } while (distBetweenPoints(ship.x, ship.y, x, y) < ASTEROID_SIZE * 2 + ship.radius);
            asteroids.push(newAsteroid(x, y, ASTEROID_SIZE / 2));
        }
    }

    function newAsteroid(x, y, radius) {
        const lvlMult = 1 + 0.1 * level;
        const roid = {
            x: x,
            y: y,
            xVel: Math.random() * ASTEROID_SPEED * lvlMult / 60 * (Math.random() < 0.5 ? 1 : -1),
            yVel: Math.random() * ASTEROID_SPEED * lvlMult / 60 * (Math.random() < 0.5 ? 1 : -1),
            radius: radius,
            angle: Math.random() * Math.PI * 2,
            vertices: Math.floor(Math.random() * (ASTEROID_VERTICES + 1) + ASTEROID_VERTICES / 2),
            offsets: []
        };

        // Create vertex offsets
        for (let i = 0; i < roid.vertices; i++) {
            roid.offsets.push(Math.random() * ASTEROID_JAGGEDNESS * 2 + 1 - ASTEROID_JAGGEDNESS);
        }

        return roid;
    }

    function shootBullet() {
        if (ship.canShoot && bullets.length < 10) {
            bullets.push({
                x: ship.x + ship.radius * Math.cos(ship.angle),
                y: ship.y - ship.radius * Math.sin(ship.angle),
                xVel: BULLET_SPEED / 60 * Math.cos(ship.angle),
                yVel: -BULLET_SPEED / 60 * Math.sin(ship.angle),
                dist: 0,
                maxDist: canvasWidth * 0.6
            });
            ship.canShoot = false;
            setTimeout(() => { ship.canShoot = true; }, 200); // Cooldown
        }
    }

    function distBetweenPoints(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function explodeShip() {
        ship.explodeTime = Math.ceil(0.3 * 60);
        lives--;
        if (lives === 0) {
            gameOver();
        } else {
            setTimeout(() => {
                ship = newShip();
            }, INVINCIBILITY_DURATION * 1000);
        }
    }

    function gameOver() {
        ship.thrusting = false;
        // Show game over message
    }

    // Set up event listeners
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    function keyDown(ev) {
        if (ship.explodeTime > 0) return;

        // Check for game over state and restart on Enter
        if (lives <= 0) {
            if (ev.keyCode === 13) { // Enter key
                newGame();
                requestAnimationFrame(update); // Restart the game loop
            }
            return; // Ignore other keys in game over state
        }

        // Regular gameplay controls
        switch(ev.keyCode) {
            case 32: // space bar (shoot)
                shootBullet();
                break;
            case 37: // left arrow (rotate left)
                ship.rotation = TURN_SPEED / 180 * Math.PI / 60;
                break;
            case 38: // up arrow (thrust)
                ship.thrusting = true;
                break;
            case 39: // right arrow (rotate right)
                ship.rotation = -TURN_SPEED / 180 * Math.PI / 60;
                break;
        }
    }

    function keyUp(ev) {
        if (ship.explodeTime > 0) return;
        switch(ev.keyCode) {
            case 32: // space bar (allow shooting again)
                // Handled by cooldown
                break;
            case 37: // left arrow (stop rotating left)
                ship.rotation = 0;
                break;
            case 38: // up arrow (stop thrusting)
                ship.thrusting = false;
                break;
            case 39: // right arrow (stop rotating right)
                ship.rotation = 0;
                break;
        }
    }

    function update() {
        const blinkOn = ship.blinkNum % 2 == 0;
        const exploding = ship.explodeTime > 0;

        // Draw space
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const shipColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        const asteroidColor = shipColor;
        const bulletColor = shipColor;
        const textColor = shipColor;

        // Thrust the ship
        if (ship.thrusting && !exploding) {
            ship.thrust.x += SHIP_THRUST * Math.cos(ship.angle) / 60;
            ship.thrust.y -= SHIP_THRUST * Math.sin(ship.angle) / 60;
        } else {
            // Apply friction
            ship.thrust.x -= FRICTION * ship.thrust.x / 60;
            ship.thrust.y -= FRICTION * ship.thrust.y / 60;
        }

        // Draw the ship
        if (!exploding) {
            // Only draw if not invincible OR if invincible and blink is ON
            if (!ship.isInvincible || blinkOn) {
                ctx.strokeStyle = shipColor;
                ctx.lineWidth = SHIP_SIZE / 20;
                ctx.beginPath();
                ctx.moveTo( // nose of the ship
                    ship.x + ship.radius * Math.cos(ship.angle),
                    ship.y - ship.radius * Math.sin(ship.angle)
                );
                ctx.lineTo( // rear left
                    ship.x - ship.radius * (Math.cos(ship.angle) + Math.sin(ship.angle)),
                    ship.y + ship.radius * (Math.sin(ship.angle) - Math.cos(ship.angle))
                );
                ctx.lineTo( // rear right
                    ship.x - ship.radius * (Math.cos(ship.angle) - Math.sin(ship.angle)),
                    ship.y + ship.radius * (Math.sin(ship.angle) + Math.cos(ship.angle))
                );
                ctx.closePath();
                ctx.stroke();
            }

            // Draw bounding box if needed
            if (SHOW_BOUNDING) {
                ctx.strokeStyle = 'lime';
                ctx.beginPath();
                ctx.arc(ship.x, ship.y, ship.radius, 0, Math.PI * 2, false);
                ctx.stroke();
            }

            // Handle blinking logic
            if (ship.isInvincible) {
                ship.blinkTime--;
                if (ship.blinkTime == 0) {
                    ship.blinkTime = Math.ceil(BLINK_DURATION * 60);
                    ship.blinkNum--;
                    if (ship.blinkNum == 0) {
                        ship.isInvincible = false;
                    }
                }
            }

        } else {
            // Draw explosion
            ctx.fillStyle = 'darkred';
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius * 1.7, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius * 1.4, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius * 1.1, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius * 0.8, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
            ship.explodeTime--;
            if (ship.explodeTime == 0 && lives > 0) {
                 // Reset ship after timeout
            } else if (ship.explodeTime == 0 && lives == 0) {
                gameOver();
            }
        }

        // Draw bullets
        ctx.fillStyle = bulletColor;
        for (let i = 0; i < bullets.length; i++) {
            ctx.beginPath();
            ctx.arc(bullets[i].x, bullets[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
            ctx.fill();
        }

        // Draw asteroids
        ctx.strokeStyle = asteroidColor;
        ctx.lineWidth = SHIP_SIZE / 20;
        let x, y, radius, angle, vert, offs;
        for (let i = 0; i < asteroids.length; i++) {
            // Get asteroid properties
            x = asteroids[i].x;
            y = asteroids[i].y;
            radius = asteroids[i].radius;
            angle = asteroids[i].angle;
            vert = asteroids[i].vertices;
            offs = asteroids[i].offsets;

            // Draw path
            ctx.beginPath();
            ctx.moveTo(
                x + radius * offs[0] * Math.cos(angle),
                y + radius * offs[0] * Math.sin(angle)
            );

            // Draw polygon
            for (let j = 1; j < vert; j++) {
                ctx.lineTo(
                    x + radius * offs[j] * Math.cos(angle + j * Math.PI * 2 / vert),
                    y + radius * offs[j] * Math.sin(angle + j * Math.PI * 2 / vert)
                );
            }
            ctx.closePath();
            ctx.stroke();

            if (SHOW_BOUNDING) {
                ctx.strokeStyle = 'lime';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2, false);
                ctx.stroke();
            }
        }

        // Draw score
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        ctx.font = SCORE_FONT_SIZE + "px 'Young Serif', serif";
        ctx.fillText(score, canvasWidth - SCORE_FONT_SIZE / 2, SCORE_FONT_SIZE);

        // Draw lives
        for (let i = 0; i < lives; i++) {
            drawShipIcon(SCORE_FONT_SIZE + i * SCORE_FONT_SIZE * 0.8, SCORE_FONT_SIZE, 0.5, textColor);
        }

        // Game Over text
        if (lives <= 0 && ship.explodeTime <= 0) {
             ctx.textAlign = "center";
             ctx.textBaseline = "middle";
             ctx.fillStyle = textColor;
             ctx.font = "bold " + SCORE_FONT_SIZE * 1.5 + "px 'Young Serif', serif";
             ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight * 0.4);
             ctx.font = SCORE_FONT_SIZE * 0.7 + "px 'Outfit', sans-serif";
             ctx.fillText("Press Enter to play again", canvasWidth / 2, canvasHeight * 0.6);
             // Stop the game loop by not requesting the next frame
             return;
        }

        // Detect bullet hits on asteroids
        let ax, ay, ar, bx, by;
        for (let i = asteroids.length - 1; i >= 0; i--) {
            ax = asteroids[i].x;
            ay = asteroids[i].y;
            ar = asteroids[i].radius;

            for (let j = bullets.length - 1; j >= 0; j--) {
                bx = bullets[j].x;
                by = bullets[j].y;

                if (distBetweenPoints(ax, ay, bx, by) < ar) {
                    // Remove bullet
                    bullets.splice(j, 1);

                    // Split asteroid
                    if (ar > ASTEROID_SIZE / 4) {
                        asteroids.push(newAsteroid(ax, ay, ar / 2));
                        asteroids.push(newAsteroid(ax, ay, ar / 2));
                        score += 50;
                    } else {
                        score += 100;
                    }

                    // Remove original asteroid
                    asteroids.splice(i, 1);

                    break; // No need to check other bullets for this asteroid
                }
            }
        }

        // Detect ship collision with asteroids
        if (!ship.isInvincible && !exploding) {
            for (let i = 0; i < asteroids.length; i++) {
                if (distBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.radius + asteroids[i].radius) {
                    explodeShip();
                    // Split asteroid
                    if (asteroids[i].radius > ASTEROID_SIZE / 4) {
                        asteroids.push(newAsteroid(asteroids[i].x, asteroids[i].y, asteroids[i].radius / 2));
                        asteroids.push(newAsteroid(asteroids[i].x, asteroids[i].y, asteroids[i].radius / 2));
                    }
                    asteroids.splice(i, 1);
                    break;
                }
            }
        }

        // Move the ship
        if (!exploding) {
            ship.x += ship.thrust.x;
            ship.y += ship.thrust.y;
            // Handle edge of screen
            if (ship.x < 0 - ship.radius) ship.x = canvasWidth + ship.radius;
            else if (ship.x > canvasWidth + ship.radius) ship.x = 0 - ship.radius;
            if (ship.y < 0 - ship.radius) ship.y = canvasHeight + ship.radius;
            else if (ship.y > canvasHeight + ship.radius) ship.y = 0 - ship.radius;
        }

        // Rotate ship
        ship.angle += ship.rotation;

        // Move bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].x += bullets[i].xVel;
            bullets[i].y += bullets[i].yVel;
            bullets[i].dist += Math.sqrt(Math.pow(bullets[i].xVel, 2) + Math.pow(bullets[i].yVel, 2));

            // Remove bullets that travel too far
            if (bullets[i].dist > bullets[i].maxDist) {
                bullets.splice(i, 1);
                continue;
            }

            // Handle edge of screen
            if (bullets[i].x < 0) bullets[i].x = canvasWidth;
            else if (bullets[i].x > canvasWidth) bullets[i].x = 0;
            if (bullets[i].y < 0) bullets[i].y = canvasHeight;
            else if (bullets[i].y > canvasHeight) bullets[i].y = 0;
        }

        // Move asteroids
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].x += asteroids[i].xVel;
            asteroids[i].y += asteroids[i].yVel;

            // Handle edge of screen
            if (asteroids[i].x < 0 - asteroids[i].radius) asteroids[i].x = canvasWidth + asteroids[i].radius;
            else if (asteroids[i].x > canvasWidth + asteroids[i].radius) asteroids[i].x = 0 - asteroids[i].radius;
            if (asteroids[i].y < 0 - asteroids[i].radius) asteroids[i].y = canvasHeight + asteroids[i].radius;
            else if (asteroids[i].y > canvasHeight + asteroids[i].radius) asteroids[i].y = 0 - asteroids[i].radius;
        }

        // Check for level completion
        if (asteroids.length === 0) {
            level++;
            score += 1000;
            createAsteroidBelt();
        }

        requestAnimationFrame(update);
    }

    function drawShipIcon(x, y, scale, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = SHIP_SIZE / 20 * scale;
        ctx.beginPath();
        ctx.moveTo( // nose of the ship
            x + ship.radius * scale * Math.cos(90 / 180 * Math.PI),
            y - ship.radius * scale * Math.sin(90 / 180 * Math.PI)
        );
        ctx.lineTo( // rear left
            x - ship.radius * scale * (Math.cos(90 / 180 * Math.PI) + Math.sin(90 / 180 * Math.PI)),
            y + ship.radius * scale * (Math.sin(90 / 180 * Math.PI) - Math.cos(90 / 180 * Math.PI))
        );
        ctx.lineTo( // rear right
            x - ship.radius * scale * (Math.cos(90 / 180 * Math.PI) - Math.sin(90 / 180 * Math.PI)),
            y + ship.radius * scale * (Math.sin(90 / 180 * Math.PI) + Math.cos(90 / 180 * Math.PI))
        );
        ctx.closePath();
        ctx.stroke();
    }

    newGame();
    requestAnimationFrame(update);
}); 