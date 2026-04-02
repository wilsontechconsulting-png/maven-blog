// Blog Post Filters
(function() {
    const categoryFilter = document.getElementById('categoryFilter');
    const tagFilter = document.getElementById('tagFilter');
    const resetButton = document.getElementById('resetFilters');
    const resultCount = document.getElementById('resultCount');
    const posts = document.querySelectorAll('.post-entry');
    
    if (!categoryFilter || !tagFilter || !posts.length) return;
    
    function filterPosts() {
        const selectedCategory = categoryFilter.value;
        const selectedTag = tagFilter.value;
        let visibleCount = 0;
        
        posts.forEach(post => {
            const categories = post.dataset.categories || '';
            const tags = post.dataset.tags || '';
            
            const categoryMatch = selectedCategory === 'all' || 
                                 categories.includes(selectedCategory);
            const tagMatch = selectedTag === 'all' || 
                            tags.includes(selectedTag);
            
            if (categoryMatch && tagMatch) {
                post.classList.remove('filtered-out');
                post.classList.add('filtered-in');
                visibleCount++;
            } else {
                post.classList.add('filtered-out');
                post.classList.remove('filtered-in');
            }
        });
        
        // Update count
        if (resultCount) {
            resultCount.textContent = visibleCount;
        }
        
        // Highlight active filters
        categoryFilter.classList.toggle('active', selectedCategory !== 'all');
        tagFilter.classList.toggle('active', selectedTag !== 'all');
    }
    
    function resetFilters() {
        categoryFilter.value = 'all';
        tagFilter.value = 'all';
        filterPosts();
        
        // Animate reset button
        resetButton.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            resetButton.style.transform = '';
        }, 300);
    }
    
    // Event listeners
    categoryFilter.addEventListener('change', filterPosts);
    tagFilter.addEventListener('change', filterPosts);
    resetButton.addEventListener('click', resetFilters);
    
    // Initialize on load
    filterPosts();
})();
