// Blog Post Filters - Dynamic Dropdown Filtering
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
    
    // Store original options
    const originalCategoryOptions = Array.from(categoryFilter.options);
    const originalTagOptions = Array.from(tagFilter.options);
    
    // Build relationship map between categories and tags
    const categoryTagMap = new Map(); // category -> Set of tags
    const tagCategoryMap = new Map(); // tag -> Set of categories
    
    posts.forEach(post => {
        const categories = (post.dataset.categories || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
        const tags = (post.dataset.tags || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
        
        categories.forEach(cat => {
            if (!categoryTagMap.has(cat)) {
                categoryTagMap.set(cat, new Set());
            }
            tags.forEach(tag => categoryTagMap.get(cat).add(tag));
        });
        
        tags.forEach(tag => {
            if (!tagCategoryMap.has(tag)) {
                tagCategoryMap.set(tag, new Set());
            }
            categories.forEach(cat => tagCategoryMap.get(tag).add(cat));
        });
    });
    
    console.log('Relationship maps built:', { 
        categories: categoryTagMap.size, 
        tags: tagCategoryMap.size 
    });
    
    function updateDropdownOptions(sourceFilter, targetFilter, relationshipMap, originalOptions) {
        const selectedValue = sourceFilter.value.toLowerCase().trim();
        
        // If "all" is selected, restore all original options
        if (selectedValue === 'all' || selectedValue === '') {
            targetFilter.innerHTML = '';
            originalOptions.forEach(option => {
                targetFilter.appendChild(option.cloneNode(true));
            });
            return;
        }
        
        // Get available values for the selected source
        const availableValues = relationshipMap.get(selectedValue) || new Set();
        
        // Filter target dropdown to only show available options
        const currentValue = targetFilter.value;
        targetFilter.innerHTML = '';
        
        // Always add "All" option
        const allOption = originalOptions[0].cloneNode(true);
        targetFilter.appendChild(allOption);
        
        // Add only available options
        originalOptions.slice(1).forEach(option => {
            const optionValue = option.value.toLowerCase().trim();
            if (availableValues.has(optionValue)) {
                targetFilter.appendChild(option.cloneNode(true));
            }
        });
        
        // Restore previous selection if still valid
        if (currentValue !== 'all' && availableValues.has(currentValue.toLowerCase())) {
            targetFilter.value = currentValue;
        } else {
            targetFilter.value = 'all';
        }
    }
    
    function filterPosts() {
        const selectedCategory = categoryFilter.value.toLowerCase().trim();
        const selectedTag = tagFilter.value.toLowerCase().trim();
        let visibleCount = 0;
        
        console.log('Filtering:', { selectedCategory, selectedTag });
        
        posts.forEach(post => {
            const categories = (post.dataset.categories || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
            const tags = (post.dataset.tags || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
            
            const categoryMatch = selectedCategory === 'all' || 
                                 selectedCategory === '' ||
                                 categories.includes(selectedCategory);
            
            const tagMatch = selectedTag === 'all' || 
                            selectedTag === '' ||
                            tags.includes(selectedTag);
            
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
    
    function onCategoryChange() {
        console.log('Category changed to:', categoryFilter.value);
        
        // Update tag dropdown to show only available tags for this category
        updateDropdownOptions(categoryFilter, tagFilter, categoryTagMap, originalTagOptions);
        
        // Filter posts
        filterPosts();
    }
    
    function onTagChange() {
        console.log('Tag changed to:', tagFilter.value);
        
        // Update category dropdown to show only available categories for this tag
        updateDropdownOptions(tagFilter, categoryFilter, tagCategoryMap, originalCategoryOptions);
        
        // Filter posts
        filterPosts();
    }
    
    function resetFilters() {
        // Animate reset button
        resetButton.classList.add('resetting');
        
        setTimeout(() => {
            // Restore all original options
            categoryFilter.innerHTML = '';
            originalCategoryOptions.forEach(option => {
                categoryFilter.appendChild(option.cloneNode(true));
            });
            
            tagFilter.innerHTML = '';
            originalTagOptions.forEach(option => {
                tagFilter.appendChild(option.cloneNode(true));
            });
            
            categoryFilter.value = 'all';
            tagFilter.value = 'all';
            
            filterPosts();
            resetButton.classList.remove('resetting');
        }, 400);
    }
    
    // Event listeners
    categoryFilter.addEventListener('change', onCategoryChange);
    tagFilter.addEventListener('change', onTagChange);
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
