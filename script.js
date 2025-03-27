document.addEventListener('DOMContentLoaded', function () {
    // Set up the canvas and 3D context
    const canvas = document.getElementById('waffleCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load the custom waffle image
    const waffleImage = new Image();
    waffleImage.src = 'waffle.png'; // Path to your custom waffle image

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
            this.angle += 0.01;

            // If the waffle has fallen off the screen, reset its position
            if (this.y > canvas.height) {
                this.respawn();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
            ctx.rotate(this.angle);
            ctx.translate(-this.size / 2, -this.size / 2);

            // Draw the custom waffle image
            ctx.drawImage(waffleImage, 0, 0, this.size, this.size);

            ctx.restore();
        }

        // Respawn function to check overlap
        respawn() {
            let attempts = 0;
            let newX, newY;
            do {
                newX = Math.random() * (canvas.width - this.size);
                newY = -this.size;

                attempts++;
                if (attempts > 100) break;
            } while (this.isOverlappingWithOthers(newX, newY) && attempts < 100);

            this.x = newX;
            this.y = newY;
        }

        // Method to check if this waffle overlaps with others
        isOverlappingWithOthers(newX, newY) {
            for (let other of waffles) {
                if (other === this) continue;

                const dx = newX + this.size / 2 - (other.x + other.size / 2);
                const dy = newY + this.size / 2 - (other.y + other.size / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Check if the distance between centers is less than the sum of their radii
                if (distance < (this.size + other.size) / 2) {
                    return true;
                }
            }
            return false;
        }
    }

    // Function to calculate waffle size based on window dimensions
    function calculateWaffleSize() {
        // Base size calculation: smaller on mobile, larger on desktop
        // Multiplied by 1.25 instead of 2
        const baseSize = Math.min(canvas.width, canvas.height) / 15;
        const sizeVariation = baseSize / 2;
        return () => (baseSize + Math.random() * sizeVariation) * 1.25;
    }

    // Create an array of waffles
    const waffles = [];
    const fallSpeed = 2;

    // Function to regenerate waffles with new sizes
    function regenerateWaffles() {
        // Clear existing waffles
        waffles.length = 0;

        // Dynamically calculate waffle count based on screen size
        const waffleCount = Math.floor(Math.min(canvas.width, canvas.height) / 70);
        const getSizeFunc = calculateWaffleSize();

        // Generate new waffles
        for (let i = 0; i < waffleCount; i++) {
            let size = getSizeFunc();
            let angle = Math.random() * Math.PI * 2;
            let x, y;
            let attempts = 0;

            // Try to find a non-overlapping position
            do {
                x = Math.random() * (canvas.width - size);
                y = Math.random() * -canvas.height;
                attempts++;
                if (attempts > 100) break;
            } while (
                waffles.some(waffle => 
                    Math.sqrt(
                        Math.pow(x + size / 2 - (waffle.x + waffle.size / 2), 2) + 
                        Math.pow(y + size / 2 - (waffle.y + waffle.size / 2), 2)
                    ) < (size + waffle.size) / 2
                ) && attempts < 100
            );

            // Create and add the waffle
            let newWaffle = new Waffle(x, y, size, fallSpeed, angle);
            waffles.push(newWaffle);
        }
    }

    // Initial waffle generation
    regenerateWaffles();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < waffles.length; i++) {
            waffles[i].update();
            waffles[i].draw();
        }
        requestAnimationFrame(animate);
    }

    animate();

    // Resize the canvas and regenerate waffles when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        regenerateWaffles(); // Regenerate waffles with new sizes
    });
});
