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
        
        // Varied particle sizes for more visual interest
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        return particle;
    }

    function startEffect(e) {
        isHovering = true;
        const electricity = this.querySelector('.electricity');
        if (!electricity) return;
        
        electricity.innerHTML = '';
        
        // Create more particles
        for (let i = 0; i < 35; i++) {
            const particle = createParticle(50, 50);
            electricity.appendChild(particle);
            
            // Complex animation patterns
            const baseAngle = (i / 35) * Math.PI * 2;
            const speed = 1.5 + Math.random() * 0.8;
            const radiusX = 35 + Math.random() * 20;
            const radiusY = 30 + Math.random() * 15;
            const phaseOffset = Math.random() * Math.PI * 2;
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            let progress = phaseOffset;
            function animate() {
                if (!isHovering) return;
                
                progress += 0.04 * speed;
                
                // Combine multiple sinusoidal patterns for more complex movement
                const wobble = Math.sin(progress * 2) * 5;
                const x = 50 + (Math.sin(progress * direction) * radiusX + wobble) * Math.cos(progress * 0.5);
                const y = 50 + (Math.cos(progress * 1.5) * radiusY + wobble) * Math.sin(progress * 0.7);
                
                // Dynamic opacity based on position
                const distanceFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
                const opacityFactor = 1 - (distanceFromCenter / 100);
                
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                particle.style.opacity = 0.3 + (opacityFactor * 0.7) + Math.sin(progress) * 0.2;
                
                // Add subtle scale animation
                const scale = 1 + Math.sin(progress * 2) * 0.2;
                particle.style.transform = `scale(${scale})`;
                
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
