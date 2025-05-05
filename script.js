// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for system preference
function getSystemThemePreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Load saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') || getSystemThemePreference();
html.setAttribute('data-theme', savedTheme);

// Add event listener to all theme toggle buttons
document.querySelectorAll('#themeToggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateParticlesColor(newTheme);
    });
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only apply if user hasn't set a preference
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateParticlesColor(newTheme);
        }
    });
}

// Initialize particles with performance optimizations
function initParticles(theme) {
    try {
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 15 : 40;
        
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
                    value: 0.2,
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
                    speed: isMobile ? 0.3 : 0.5,
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

// Add hover effects to link items
function initLinkHoverEffects() {
    const linkItems = document.querySelectorAll('.link-item');
    
    linkItems.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('hover-active');
        });
        
        link.addEventListener('mouseleave', () => {
            link.classList.remove('hover-active');
        });
        
        // Add subtle pulse animation on touch for mobile
        if ('ontouchstart' in window) {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
                setTimeout(() => {
                    link.classList.remove('touch-active');
                }, 300);
            });
        }
    });
}

// Initialize hover effects
initLinkHoverEffects();

// Add subtle animation to profile image
const profileImage = document.querySelector('.profile-image-container');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        document.querySelector('.profile-image').style.transform = 'scale(1.05)';
    });
    
    profileImage.addEventListener('mouseleave', () => {
        document.querySelector('.profile-image').style.transform = 'scale(1)';
    });
}

// Add subtle animations on page load
window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const links = document.querySelectorAll('.link-item');
    const socialLinks = document.querySelectorAll('.social-links a');
    
    // Fade in elements with slight delay between each
    setTimeout(() => {
        container.style.opacity = '1';
        
        // Animate links with staggered delay
        links.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
        
        // Animate social links
        socialLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 300 + (index * 50));
        });
    }, 100);
});

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

// Handle article card clicks
document.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
        const url = card.dataset.url;
        if (url) {
            window.open(url, '_blank');
        }
    });
});
