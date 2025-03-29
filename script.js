document.addEventListener('DOMContentLoaded', function () {
    console.log("Document loaded");
    
    // Set up the canvas and 3D context
    const canvas = document.getElementById('waffleCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load the custom waffle image
    const waffleImage = new Image();
    waffleImage.src = 'waffle.png';
    waffleImage.onload = () => console.log("Waffle image loaded successfully");
    waffleImage.onerror = () => console.error("Failed to load waffle image");

    // Background music setup
    const music = document.getElementById('bgMusic');
    const splashScreen = document.getElementById('splashScreen');

    function startWebsite() {
        console.log("Splash screen clicked");
        splashScreen.style.display = 'none'; // Hide splash screen

        if (music) {
            music.play().then(() => {
                console.log("Music is playing");
            }).catch(err => console.error("Autoplay blocked or error playing music:", err));
        } else {
            console.error("Music element not found");
        }
    }

    if (splashScreen) {
        splashScreen.addEventListener('click', startWebsite);
    } else {
        console.error("Splash screen element not found");
    }

    // Ensure music loads properly
    if (music) {
        music.load();
        console.log("Music file loaded");
    } else {
        console.error("Music element not found in DOM");
    }

    // Waffle class
    class Waffle {
        constructor(x, y, size, speed, angle) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.angle = angle;
        }

        update() {
            this.y += this.speed;
            this.angle += .01;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
            ctx.rotate(this.angle);
            ctx.translate(-this.size / 2, -this.size / 2);
            ctx.drawImage(waffleImage, 0, 0, this.size, this.size);
            ctx.restore();
        }
    }

    const waffles = [];
    const fallSpeed = 2;
    const maxWaffles = 20;

    function calculateWaffleSize() {
        const baseSize = Math.min(canvas.width, canvas.height) / 15;
        const sizeVariation = baseSize / 2;
        return (baseSize + Math.random() * sizeVariation) * 2.5;
    }

    function spawnWaffle() {
        const size = calculateWaffleSize();
        let x, y;
        let newWaffle;
        let attempts = 0;

        do {
            x = Math.random() * (canvas.width * 1.3 - size);
            y = -size * (1 + Math.random() * 10);
            newWaffle = new Waffle(x, y, size, fallSpeed, Math.random() * Math.PI * 2);

            attempts++;
            if (attempts > 100) {
                return newWaffle;
            }
        } while (false);

        return newWaffle;
    }

    function initializeWaffles() {
        waffles.length = 0;
        for (let i = 0; i < maxWaffles / 2; i++) {
            waffles.push(spawnWaffle());
        }
    }

    let lastSpawnTime = 0;
    function shouldSpawnWaffle(currentTime) {
        const spawnInterval = 100 + Math.random() * 400;
        return currentTime - lastSpawnTime > spawnInterval;
    }

    function animate(currentTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = waffles.length - 1; i >= 0; i--) {
            waffles[i].update();
            waffles[i].draw();

            if (waffles[i].y > canvas.height) {
                waffles.splice(i, 1);
            }
        }

        if (shouldSpawnWaffle(currentTime)) {
            if (waffles.length < maxWaffles) {
                waffles.push(spawnWaffle());
                lastSpawnTime = currentTime;
            }
        }

        requestAnimationFrame(animate);
    }

    initializeWaffles();
    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeWaffles();
    });
});
