// Network background animation
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let nodes = [];
const nodeCount = 50;
const connectionDistance = 150;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Recreate nodes when resizing
    createNodes();
}

function createNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25,
            color: '#9333ea'
        });
    }
}

function drawNodes() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Draw nodes
    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
    }
    
    requestAnimationFrame(drawNodes);
}

// Initialize canvas
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawNodes();

// Platform selection
const platformOptions = document.querySelectorAll('.platform-option');
let selectedPlatform = null;

platformOptions.forEach(option => {
    option.addEventListener('click', () => {
        platformOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedPlatform = option.getAttribute('data-platform');
    });
});

// Continue button functionality
const continueBtn = document.getElementById('continue-btn');
const mainContainer = document.getElementById('main-container');
const generatorContainer = document.getElementById('generator-container');
const usernameInput = document.getElementById('username');
const displayUsername = document.getElementById('display-username');

continueBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    if (!selectedPlatform) {
        alert('Please select your platform');
        return;
    }
    
    // Show generator screen
    mainContainer.style.display = 'none';
    generatorContainer.style.display = 'block';
    displayUsername.textContent = username;
});

// Points generator functionality
const generateBtn = document.getElementById('generate-btn');
const progressBar = document.getElementById('progress-bar');
const pointsValue = document.getElementById('points-value');
const statusText = document.getElementById('status-text');
const completeSound = document.getElementById('complete-sound');

let isGenerating = false;
let generatedPoints = 0;
const maxPoints = 50000;
const generationSteps = [
    "Connecting to FC 25 servers...",
    "Authenticating user credentials...",
    "Bypassing security protocols...",
    "Accessing points database...",
    "Injecting points generator...",
    "Generating points...",
    "Verifying points balance...",
    "Finalizing process..."
];

generateBtn.addEventListener('click', () => {
    if (isGenerating) return;
    
    isGenerating = true;
    generatedPoints = 0;
    pointsValue.textContent = '0';
    progressBar.style.width = '0%';
    generateBtn.classList.add('disabled');
    generateBtn.textContent = 'GENERATING...';
    
    // Start the generation process
    let currentStep = 0;
    statusText.textContent = generationSteps[currentStep];
    
    const stepInterval = setInterval(() => {
        currentStep++;
        
        if (currentStep < generationSteps.length) {
            statusText.textContent = generationSteps[currentStep];
            progressBar.style.width = `${(currentStep / generationSteps.length) * 50}%`;
        } else {
            clearInterval(stepInterval);
            generatePoints();
        }
    }, 1500);
});

function generatePoints() {
    const pointsInterval = setInterval(() => {
        // Increase points
        const increment = Math.floor(Math.random() * 1000) + 500;
        generatedPoints += increment;
        
        if (generatedPoints >= maxPoints) {
            generatedPoints = maxPoints;
            clearInterval(pointsInterval);
            completeGeneration();
        }
        
        // Update UI
        pointsValue.textContent = generatedPoints.toLocaleString();
        const progress = 50 + ((generatedPoints / maxPoints) * 50);
        progressBar.style.width = `${progress}%`;
        
        statusText.textContent = "Generating points...";
    }, 100);
}

function completeGeneration() {
    statusText.textContent = "Generation complete! Points added to your account.";
    generateBtn.textContent = 'GENERATE AGAIN';
    generateBtn.classList.remove('disabled');
    generateBtn.classList.add('pulse');
    isGenerating = false;
    
    // Play completion sound
    completeSound.play();
    
    // Show success message
    setTimeout(() => {
        alert("Congratulations! 50,000 FC 25 Points have been added to your account!");
    }, 1000);
}