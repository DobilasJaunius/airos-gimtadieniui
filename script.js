document.addEventListener('DOMContentLoaded', function () {
    // Set up the canvas and 3D context
    const canvas = document.getElementById('waffleCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log(`Canvas size: ${canvas.width}x${canvas.height}`); // Log the canvas size to ensure it's correct

    // Load the custom waffle image
    const waffleImage = new Image();
    waffleImage.src = 'waffle.png'; // Path to your custom waffle image

    // Waffle class
    class Waffle {
        constructor(x, y, size, speed, angle) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;  // Fixed speed for all waffles
            this.angle = angle; // Rotation angle for 3D effect
        }

        update() {
            this.y += this.speed; // Move down at the same speed
            this.angle += 0.01; // Slow down the rotation (reduced from 0.05 to 0.01)

            // If the waffle has fallen off the screen, reset its position
            if (this.y > canvas.height) {
                this.respawn(); // Check for overlap after respawn
            }
        }

        draw() {
            ctx.save(); // Save the current drawing context
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2); // Move to the center of the waffle
            ctx.rotate(this.angle); // Apply rotation
            ctx.translate(-this.size / 2, -this.size / 2); // Move back to top-left corner

            // Draw the custom waffle image
            ctx.drawImage(waffleImage, 0, 0, this.size, this.size); // Draw the image with the correct size

            ctx.restore(); // Restore the context to avoid affecting other waffles
        }

        // Respawn function to check overlap
        respawn() {
            let attempts = 0;
            let newX, newY;
            do {
                // Set a new random position for the waffle
                newX = Math.random() * (canvas.width - this.size); // Random x position
                newY = -this.size; // Always respawn at the top

                attempts++;
                if (attempts > 100) break; // Prevent infinite loop, max attempts to find non-overlapping position
            } while (isOverlapping(newX, newY, this.size) && attempts < 100); // Ensure no overlap when respawning

            // If there's no overlap, update the waffle's position
            this.x = newX;
            this.y = newY;
        }
    }

    // Create an array of waffles
    const waffles = [];
    const waffleCount = 20; // Decreased number of waffles for better performance
    const fallSpeed = 2; // Fixed fall speed for all waffles

    // Function to check if two waffles overlap
    function isOverlapping(newX, newY, size) {
        for (let i = 0; i < waffles.length; i++) {
            const other = waffles[i];

            // Calculate the distance between the centers of the waffles
            const dx = newX - other.x;
            const dy = newY - other.y;

            // Calculate the distance between their centers
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if the distance is smaller than the sum of their half-sizes (this accounts for their size)
            if (distance < (size / 2 + other.size / 2)) {
                return true; // The waffles overlap
            }
        }
        return false; // No overlap
    }

    // Generate waffles with fixed speed and ensure no overlap
    for (let i = 0; i < waffleCount; i++) {
        let size = (Math.random() * 20 + 40) * 2; // Waffle size increased by 2 times
        let angle = Math.random() * Math.PI * 2; // Random initial angle for rotation
        let x, y;
        let newWaffle;

        // Try to generate a waffle that doesn't overlap with existing ones
        let attempts = 0;
        do {
            x = Math.random() * (canvas.width - size); // Random x position
            y = Math.random() * -canvas.height; // Start off-screen at random y
            newWaffle = new Waffle(x, y, size, fallSpeed, angle);
            attempts++;
            if (attempts > 100) break; // Prevent infinite loop, max attempts to find non-overlapping position
        } while (isOverlapping(x, y, size) && attempts < 100);

        waffles.push(newWaffle);
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        for (let i = 0; i < waffles.length; i++) {
            waffles[i].update();
            waffles[i].draw();
        }
        requestAnimationFrame(animate); // Loop the animation
    }

    animate();

    // Resize the canvas when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
    });
});
