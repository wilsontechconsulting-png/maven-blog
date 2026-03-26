// Mobile menu - simple and clean
(function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        const header = document.querySelector('header.header') || document.querySelector('.nav');
        if (!header) return;
        
        const nav = header.querySelector('nav');
        if (!nav) return;
        
        const menu = nav.querySelector('.menu');
        const buttons = nav.querySelector('.nav-buttons');
        if (!menu) return;
        
        // Hide menu by default
        menu.style.display = 'none';
        if (buttons) buttons.style.display = 'none';
        
        // Create hamburger
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        hamburger.setAttribute('aria-label', 'Menu');
        
        // Add to header
        header.appendChild(hamburger);
        
        // Toggle menu
        hamburger.addEventListener('click', function() {
            const isOpen = menu.style.display === 'flex';
            
            if (isOpen) {
                // Close
                menu.style.display = 'none';
                if (buttons) buttons.style.display = 'none';
                hamburger.classList.remove('open');
                document.body.style.overflow = '';
            } else {
                // Open
                menu.style.display = 'flex';
                if (buttons) buttons.style.display = 'flex';
                hamburger.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close when clicking menu item
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menu.style.display = 'none';
                if (buttons) buttons.style.display = 'none';
                hamburger.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
})();
