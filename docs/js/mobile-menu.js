// Simple mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav nav') || document.querySelector('header nav');
    if (!nav) return;
    
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    
    const menu = nav.querySelector('.menu');
    const navButtons = nav.querySelector('.nav-buttons');
    
    if (menu) {
        menu.parentNode.insertBefore(hamburger, menu);
        
        // Simple toggle
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
            if (navButtons) navButtons.classList.toggle('active');
        });
    }
});
