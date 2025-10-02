 // --- Sidebar Toggling Logic (Unified for all screen sizes) ---
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        const toggleSidebar = () => {
            const isOpen = sidebar.classList.toggle('toggled');
            overlay.classList.toggle('toggled');

            // Prevent scrolling the main body when the menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        hamburgerMenu.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);

        // Close sidebar when a navigation link is clicked (good UX for single-page nav)
        sidebar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                // Only close if currently toggled/open
                if (sidebar.classList.contains('toggled')) {
                    toggleSidebar();
                }
            });
        });

        // --- Category Filtering Logic ---
        
        const servicesData = [
            { id: 'all', label: '⭐ All Services' },
            { id: 'repair-device', label: '📱 Device & PC Repair' },
            { id: 'repair-appliances', label: '📺 Home Tech & Setup' },
            { id: 'plumbing', label: '💧 Plumbing & Water Solutions' },
            { id: 'electrical', label: '⚡ Electrical Wiring & Lighting' },
            { id: 'design-graphic', label: '🎨 Graphic Design & Branding' },
            { id: 'web-dev', label: '💻 Website Development' },
            { id: 'mobile-dev', label: '🚀 Mobile App Development' },
            { id: 'it-security', label: '🔒 IT Support & Security' },
            { id: 'custom-software', label: '⚙️ Bespoke Software' }
        ];

        const serviceCards = document.querySelectorAll('.tech-card');
        const categoryTabsContainer = document.getElementById('category-tabs');
        const currentCategoryTitle = document.getElementById('current-category-title');

        // 1. Function to create and render category tabs
        const renderCategoryTabs = () => {
            categoryTabsContainer.innerHTML = ''; 

            servicesData.forEach(service => {
                const button = document.createElement('button');
                button.textContent = service.label;
                button.setAttribute('data-category', service.id);
                button.className = 'category-tab px-4 py-2 rounded-full text-sm font-medium text-gray-300 transition duration-150 flex-shrink-0';
                
                // Event listener for filtering
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = button.getAttribute('data-category');
                    filterCards(category);
                    
                    // Update active state
                    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
                    button.classList.add('active');
                });
                
                categoryTabsContainer.appendChild(button);
            });
        };

        // 2. Function to filter the cards based on category
        const filterCards = (category) => {
            const activeService = servicesData.find(s => s.id === category);
            
            // Clean up the text by removing the leading emoji and spacing for the title
            let selectedTitle = (activeService?.label || 'All Featured Solutions').replace(/[\s\S]*?\s/, '').trim(); 
            currentCategoryTitle.textContent = selectedTitle === 'All Services' ? 'All Featured Solutions' : selectedTitle;

            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const isVisible = category === 'all' || cardCategory === category;
                
                // Use a display property to show/hide cards
                card.style.display = isVisible ? 'flex' : 'none';
            });
        };

        // Initial setup on load
        document.addEventListener('DOMContentLoaded', () => {
            renderCategoryTabs();
            // Default to 'All Services' active
            const defaultTab = document.querySelector('.category-tab[data-category="all"]');
            if (defaultTab) {
                defaultTab.classList.add('active');
            }
            filterCards('all');
        });