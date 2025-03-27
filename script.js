document.addEventListener('DOMContentLoaded', function () {
    // Set up the canvas and 3D context
    const canvas = document.getElementById('waffleCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill the window
    canvas.width = window.innerWidth*1.2;
    canvas.height = window.innerHeight;

    // Load the custom waffle image
    const waffleImage = new Image();
    waffleImage.src = 'waffle.png';

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

        // Check overlap with other waffles
        isOverlapping(otherWaffle) {
            const dx = this.x + this.size / 2 - (otherWaffle.x + otherWaffle.size / 2);
            const dy = this.y + this.size / 2 - (otherWaffle.y + otherWaffle.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Minimum distance to prevent overlap (sum of half-sizes)
            const minDistance = (this.size + otherWaffle.size) / 2;
            
            return distance < minDistance;
        }
    }

    // Create an array of waffles
    const waffles = [];
    const fallSpeed = 2;
    const maxWaffles = 20; // Reduced max waffles due to increased size

    // Function to calculate waffle size based on window dimensions
    function calculateWaffleSize() {
        const baseSize = Math.min(canvas.width, canvas.height) / 15;
        const sizeVariation = baseSize / 2;
        // Increased size by 50% (from 1.25 to 1.5)
        return (baseSize + Math.random() * sizeVariation) * 3;
    }

    // Function to spawn a new waffle without overlap
    function spawnWaffle() {
        const size = calculateWaffleSize();
        let x, y;
        let newWaffle;
        let attempts = 0;

        do {
            x = Math.random() * (canvas.width - size);
            y = -size * (1 + Math.random() * 10); // Staggered vertical position
            newWaffle = new Waffle(x, y, size, fallSpeed, Math.random() * Math.PI * 2);

            // Check for overlap with existing waffles
            const isOverlapping = waffles.some(existingWaffle => 
                newWaffle.isOverlapping(existingWaffle)
            );

            attempts++;
            if (attempts > 100) {
                // If we can't find a non-overlapping position, place it anyway
                return newWaffle;
            }

            if (!isOverlapping) {
                return newWaffle;
            }
        } while (true);
    }

    // Initial waffle generation
    function initializeWaffles() {
        waffles.length = 0; // Clear existing waffles
        for (let i = 0; i < maxWaffles / 2; i++) {
            waffles.push(spawnWaffle());
        }
    }

    // Spawn timer to create continuous, random waffle generation
    let lastSpawnTime = 0;
    function shouldSpawnWaffle(currentTime) {
        // Random spawn interval between 100-500 ms
        const spawnInterval = 100 + Math.random() * 400;
        return currentTime - lastSpawnTime > spawnInterval;
    }

    // Animation loop
    function animate(currentTime) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw waffles
        for (let i = waffles.length - 1; i >= 0; i--) {
            waffles[i].update();
            waffles[i].draw();

            // Remove waffles that have fallen off the screen
            if (waffles[i].y > canvas.height) {
                waffles.splice(i, 1);
            }
        }

        // Spawn new waffles continuously
        if (shouldSpawnWaffle(currentTime)) {
            if (waffles.length < maxWaffles) {
                waffles.push(spawnWaffle());
                lastSpawnTime = currentTime;
            }
        }

        requestAnimationFrame(animate);
    }

    // Initialize waffles and start animation
    initializeWaffles();
    requestAnimationFrame(animate);

    // Resize the canvas when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeWaffles(); // Regenerate waffles
    });
});
