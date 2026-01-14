// Theme Toggle Functionality for Kilmaru
(function() {
    // Check for saved theme preference on page load
    const savedTheme = localStorage.getItem('kilmaru-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Initialize toggle button if it exists
    document.addEventListener('DOMContentLoaded', function() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        
        toggle.addEventListener('click', function() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'classic' ? '' : 'classic';
            
            if (newTheme) {
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('kilmaru-theme', newTheme);
            } else {
                html.removeAttribute('data-theme');
                localStorage.removeItem('kilmaru-theme');
            }
        });
    });
})();
