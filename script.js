// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    updateParticlesColor(newTheme);
});

// Mouse follower for title with momentum
const title = document.querySelector('.title');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
});

function updateTitlePosition() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    
    title.style.transform = `perspective(1000px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
    requestAnimationFrame(updateTitlePosition);
}

updateTitlePosition();

// Initialize particles
function initParticles(theme) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: theme === 'light' ? '#1a1a1a' : '#ffffff'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: theme === 'light' ? '#1a1a1a' : '#ffffff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'bubble'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 200,
                    size: 6,
                    duration: 0.4,
                    opacity: 0.8,
                    speed: 3
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

function updateParticlesColor(theme) {
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.color.value = theme === 'light' ? '#1a1a1a' : '#ffffff';
        window.pJSDom[0].pJS.particles.line_linked.color = theme === 'light' ? '#1a1a1a' : '#ffffff';
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}

// Initialize particles with current theme
initParticles(html.getAttribute('data-theme'));

// Enhanced electricity effect for menu items
document.querySelectorAll('.menu-link').forEach(link => {
    const electricity = link.querySelector('.electricity');
    let isHovering = false;
    let animationFrame;
    
    function createElectricityParticle() {
        if (!isHovering) return;
        
        const particle = document.createElement('div');
        particle.className = 'electricity-particle';
        electricity.appendChild(particle);
        
        const size = 1 + Math.random() * 2;
        const startX = Math.random() * 100 - 50;
        const startY = Math.random() * 100 - 50;
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1 + Math.random() * 2;
        const lifetime = 500 + Math.random() * 1000;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        let progress = 0;
        let lastTime = performance.now();
        
        function updateParticle(currentTime) {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            progress += deltaTime;
            
            if (progress >= lifetime) {
                particle.remove();
                return;
            }
            
            const t = progress / lifetime;
            const x = startX + Math.cos(angle) * velocity * progress * 0.1;
            const y = startY + Math.sin(angle) * velocity * progress * 0.1;
            const scale = Math.sin(Math.PI * t);
            
            particle.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            particle.style.opacity = 1 - t;
            
            requestAnimationFrame(updateParticle);
        }
        
        requestAnimationFrame(updateParticle);
    }
    
    function startElectricityEffect() {
        isHovering = true;
        function loop() {
            if (!isHovering) return;
            for (let i = 0; i < 3; i++) {
                createElectricityParticle();
            }
            animationFrame = requestAnimationFrame(loop);
        }
        loop();
    }
    
    function stopElectricityEffect() {
        isHovering = false;
        cancelAnimationFrame(animationFrame);
        electricity.innerHTML = '';
    }
    
    link.addEventListener('mouseenter', startElectricityEffect);
    link.addEventListener('mouseleave', stopElectricityEffect);
});
