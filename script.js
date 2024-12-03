// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    updateParticlesColor(newTheme);
});

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

// Different particle effects for menu items
const particleEffects = {
    pulse: (x, y, progress) => ({
        x: x + Math.cos(progress * Math.PI * 2) * 20,
        y: y + Math.sin(progress * Math.PI * 2) * 20,
        scale: 1 + Math.sin(progress * Math.PI) * 0.5
    }),
    spiral: (x, y, progress) => {
        const angle = progress * Math.PI * 4;
        const radius = progress * 30;
        return {
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            scale: 1 - progress * 0.5
        };
    },
    burst: (x, y, progress) => ({
        x: x + (Math.random() - 0.5) * 100 * progress,
        y: y + (Math.random() - 0.5) * 100 * progress,
        scale: 1 - progress
    }),
    wave: (x, y, progress) => ({
        x: x + Math.sin(progress * Math.PI * 4) * 30,
        y: y + progress * 40,
        scale: 1 - progress * 0.5
    }),
    lightning: (x, y, progress) => ({
        x: x + (Math.random() - 0.5) * 20,
        y: y + progress * 60,
        scale: (1 - progress) * Math.random()
    })
};

// Enhanced electricity effect for menu items
document.querySelectorAll('.menu-link').forEach(link => {
    const electricity = link.querySelector('.electricity');
    const effect = link.getAttribute('data-effect');
    let isHovering = false;
    let animationFrame;
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'electricity-particle';
        
        // Varied particle sizes
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Start from center
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        return particle;
    }

    function startEffect(e) {
        isHovering = true;
        const electricity = this.querySelector('.electricity');
        if (!electricity) return;
        
        electricity.innerHTML = '';
        
        // More particles for a denser effect
        for (let i = 0; i < 25; i++) {
            const particle = createParticle(50, 50);
            electricity.appendChild(particle);
            
            // Complex animation patterns
            const baseAngle = (i / 25) * Math.PI * 2;
            const speed = 1.2 + Math.random() * 0.6;
            const radiusX = 30 + Math.random() * 15;
            const radiusY = 25 + Math.random() * 12;
            const phaseOffset = Math.random() * Math.PI * 2;
            
            let progress = phaseOffset;
            function animate() {
                if (!isHovering) return;
                
                progress += 0.03 * speed;
                
                // Combined sinusoidal patterns
                const x = 50 + Math.sin(progress) * radiusX * Math.cos(progress * 0.5);
                const y = 50 + Math.sin(progress * 1.5 + phaseOffset) * radiusY;
                
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                particle.style.opacity = 0.5 + Math.sin(progress) * 0.3;
                
                requestAnimationFrame(animate);
            }
            animate();
        }
    }

    function stopEffect() {
        isHovering = false;
        const electricity = this.querySelector('.electricity');
        if (electricity) {
            electricity.innerHTML = '';
        }
    }

    link.addEventListener('mouseenter', startEffect);
    link.addEventListener('mouseleave', stopEffect);
    link.addEventListener('mousemove', (e) => {
        if (isHovering) {
            const rect = electricity.getBoundingClientRect();
            const centerX = (e.clientX - rect.left) - rect.width / 2;
            const centerY = (e.clientY - rect.top) - rect.height / 2;
            createParticle(centerX, centerY);
        }
    });
});
