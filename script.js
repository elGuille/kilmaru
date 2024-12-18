// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateParticlesColor(newTheme);
});

// Initialize particles with performance optimizations
function initParticles(theme) {
    try {
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 20 : 60;
        
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: particleCount,
                    density: {
                        enable: true,
                        value_area: 1200
                    }
                },
                color: {
                    value: theme === 'light' ? '#1a1a1a' : '#ffffff'
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.2,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 2,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        size_min: 0.3,
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
                    speed: isMobile ? 0.5 : 0.8,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: !isMobile,
                        mode: "bubble"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    bubble: {
                        distance: 200,
                        size: 6,
                        duration: 2,
                        opacity: 1,
                        speed: 3
                    },
                    push: {
                        particles_nb: isMobile ? 2 : 4
                    }
                }
            },
            retina_detect: true
        });
    } catch (error) {
        console.error('Failed to initialize particles:', error);
        // Hide particles container on error
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesContainer.style.display = 'none';
        }
    }
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

// Debounced glitch effect for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function addGlitchEffect() {
    const container = document.querySelector('.container');
    
    const debouncedGlitch = debounce(() => {
        if (Math.random() < 0.15) {
            const intensity = Math.random() * 8 - 4;
            requestAnimationFrame(() => {
                container.style.transform = `translate(${intensity}px, ${intensity}px)`;
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        container.style.transform = 'none';
                    });
                }, 100 + Math.random() * 200);
            });
        }
    }, 100);

    setInterval(debouncedGlitch, 3000);
}

addGlitchEffect();

// Add menu hover particles
function initMenuParticles() {
    document.querySelectorAll('.menu-link').forEach(link => {
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'menu-particle';
            return particle;
        }

        function animateParticles() {
            const particle = createParticle();
            link.appendChild(particle);

            // Random starting position around the link
            const rect = link.getBoundingClientRect();
            const startX = Math.random() * rect.width;
            const startY = Math.random() * rect.height;
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';

            // Animate the particle
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 30 + 20;
            const duration = Math.random() * 1000 + 1000;
            const startTime = Date.now();

            function updateParticle() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                if (progress >= 1) {
                    particle.remove();
                    return;
                }

                const currentX = startX + Math.cos(angle) * velocity * progress;
                const currentY = startY + Math.sin(angle) * velocity * progress;
                const currentOpacity = 0.5 * (1 - progress);

                particle.style.left = currentX + 'px';
                particle.style.top = currentY + 'px';
                particle.style.opacity = currentOpacity;

                requestAnimationFrame(updateParticle);
            }

            requestAnimationFrame(updateParticle);
        }

        let animationInterval;
        
        link.addEventListener('mouseenter', () => {
            console.log('Mouse entered');  // Debug log
            animationInterval = setInterval(animateParticles, 50);
        });

        link.addEventListener('mouseleave', () => {
            console.log('Mouse left');  // Debug log
            clearInterval(animationInterval);
            // Clean up existing particles
            link.querySelectorAll('.menu-particle').forEach(particle => {
                particle.remove();
            });
        });
    });
}

initMenuParticles();

// Handle article card clicks
document.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
        const url = card.dataset.url;
        if (url) {
            window.open(url, '_blank');
        }
    });
});
