// Blog Post Filters - Enhanced with debugging
(function() {
    const categoryFilter = document.getElementById('categoryFilter');
    const tagFilter = document.getElementById('tagFilter');
    const resetButton = document.getElementById('resetFilters');
    const resultCount = document.getElementById('resultCount');
    const posts = document.querySelectorAll('.post-entry');
    
    if (!categoryFilter || !tagFilter || !posts.length) {
        console.log('Filter elements not found or no posts');
        return;
    }
    
    console.log(`Found ${posts.length} posts to filter`);
    
    function filterPosts() {
        const selectedCategory = categoryFilter.value.toLowerCase().trim();
        const selectedTag = tagFilter.value.toLowerCase().trim();
        let visibleCount = 0;
        
        console.log('Filtering:', { selectedCategory, selectedTag });
        
        posts.forEach(post => {
            const categories = (post.dataset.categories || '').toLowerCase().trim();
            const tags = (post.dataset.tags || '').toLowerCase().trim();
            
            // Check if selected values exist in the post's data
            const categoryMatch = selectedCategory === 'all' || 
                                 selectedCategory === '' ||
                                 categories.split(/\s+/).includes(selectedCategory);
            
            const tagMatch = selectedTag === 'all' || 
                            selectedTag === '' ||
                            tags.split(/\s+/).includes(selectedTag);
            
            const isVisible = categoryMatch && tagMatch;
            
            if (isVisible) {
                post.style.display = '';
                post.classList.remove('filtered-out');
                post.classList.add('filtered-in');
                visibleCount++;
            } else {
                post.style.display = 'none';
                post.classList.add('filtered-out');
                post.classList.remove('filtered-in');
            }
        });
        
        // Update count
        if (resultCount) {
            resultCount.textContent = visibleCount;
        }
        
        // Highlight active filters
        categoryFilter.classList.toggle('active', selectedCategory !== 'all' && selectedCategory !== '');
        tagFilter.classList.toggle('active', selectedTag !== 'all' && selectedTag !== '');
        
        console.log(`Visible posts: ${visibleCount}`);
    }
    
    function resetFilters() {
        // Animate reset button
        resetButton.classList.add('resetting');
        
        setTimeout(() => {
            categoryFilter.value = 'all';
            tagFilter.value = 'all';
            filterPosts();
            resetButton.classList.remove('resetting');
        }, 400);
    }
    
    // Event listeners
    categoryFilter.addEventListener('change', function() {
        console.log('Category changed to:', this.value);
        filterPosts();
    });
    
    tagFilter.addEventListener('change', function() {
        console.log('Tag changed to:', this.value);
        filterPosts();
    });
    
    resetButton.addEventListener('click', resetFilters);
    
    // Debug: Log all posts and their data
    console.log('Post data:');
    posts.forEach((post, index) => {
        console.log(`Post ${index}:`, {
            categories: post.dataset.categories,
            tags: post.dataset.tags,
            title: post.querySelector('h2')?.textContent?.trim()
        });
    });
    
    // Initialize on load
    filterPosts();
})();
