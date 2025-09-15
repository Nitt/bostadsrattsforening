// Main JavaScript file for Bostadsrättsförening website

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => {
            n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and submission
    setupFormHandlers();
});

// Form handling setup
function setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

// Generic form submission handler
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formType = form.id;
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sparar...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showNotification('Formuläret har sparats framgångsrikt!', 'success');
        
        // Clear form if it's not an edit
        if (!form.classList.contains('edit-mode')) {
            form.reset();
        }

        // Store data in localStorage for demo purposes
        storeFormData(formType, formData);
    }, 1500);
}

// Store form data in localStorage
function storeFormData(formType, formData) {
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const existing = JSON.parse(localStorage.getItem(formType + '_entries') || '[]');
    data.id = Date.now();
    data.timestamp = new Date().toISOString();
    existing.unshift(data);
    
    // Keep only last 50 entries
    if (existing.length > 50) {
        existing.splice(50);
    }
    
    localStorage.setItem(formType + '_entries', JSON.stringify(existing));
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                max-width: 400px;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1001;
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                background: #10b981;
                color: white;
            }
            .notification-error {
                background: #ef4444;
                color: white;
            }
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                margin-left: 15px;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK'
    }).format(amount);
}

// Simple search function
function searchItems(query, items, searchFields) {
    if (!query) return items;
    
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => {
        return searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(lowercaseQuery);
        });
    });
}

// Loading indicator
function showLoading(element) {
    element.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Laddar...</div>';
}

function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Kopierat till urklipp!', 'success');
    }).catch(() => {
        showNotification('Kunde inte kopiera till urklipp', 'error');
    });
}

// Print functionality
function printPage() {
    window.print();
}

// Export to CSV
function exportToCSV(data, filename) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('Ett oväntat fel uppstod. Försök igen senare.', 'error');
});

// Service worker registration for offline support (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Theme handling (if dark mode is needed in the future)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', loadTheme);