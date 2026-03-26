// Mobile hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger button if it doesn't exist
    const nav = document.querySelector('.nav nav') || document.querySelector('header nav');
    if (!nav) return;
    
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    if (isMobile()) {
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        
        // Find menu container
        const menu = nav.querySelector('.menu');
        const navButtons = nav.querySelector('.nav-buttons');
        
        if (menu) {
            // Insert hamburger before menu
            menu.parentNode.insertBefore(hamburger, menu);
            
            // Add click handler
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                menu.classList.toggle('active');
                if (navButtons) navButtons.classList.toggle('active');
            });
        }
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            location.reload();
        }, 250);
    });
});
