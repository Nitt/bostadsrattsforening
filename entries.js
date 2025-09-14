// Entries page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEntriesPage();
});

function initializeEntriesPage() {
    setupEntryTypeButtons();
    setupFormHandlers();
    loadRecentEntries();
    addFormValidation();
}

// Entry type button handling
function setupEntryTypeButtons() {
    const typeButtons = document.querySelectorAll('.entry-type-btn');
    const entryForms = document.querySelectorAll('.entry-form');

    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // Update active button
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            entryForms.forEach(form => {
                form.style.display = 'none';
            });
            
            const targetForm = document.getElementById(`${type}-form`);
            if (targetForm) {
                targetForm.style.display = 'block';
                targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Enhanced form handling for entries
function setupFormHandlers() {
    // Apartment form
    const apartmentForm = document.getElementById('apartmentForm');
    if (apartmentForm) {
        apartmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleApartmentSubmission(this);
        });
    }

    // Meeting form
    const meetingForm = document.getElementById('meetingForm');
    if (meetingForm) {
        meetingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleMeetingSubmission(this);
        });
    }

    // Maintenance form
    const maintenanceForm = document.getElementById('maintenanceForm');
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleMaintenanceSubmission(this);
        });
    }

    // Finance form
    const financeForm = document.getElementById('financeForm');
    if (financeForm) {
        financeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFinanceSubmission(this);
        });
    }
}

// Apartment form submission
function handleApartmentSubmission(form) {
    const formData = new FormData(form);
    const data = {
        type: 'apartment',
        apartmentNumber: formData.get('apartmentNumber'),
        ownerName: formData.get('ownerName'),
        contactInfo: formData.get('contactInfo'),
        apartmentSize: formData.get('apartmentSize'),
        rooms: formData.get('rooms'),
        notes: formData.get('apartmentNotes'),
        timestamp: new Date().toISOString()
    };

    submitEntry(data, form);
}

// Meeting form submission
function handleMeetingSubmission(form) {
    const formData = new FormData(form);
    const data = {
        type: 'meeting',
        title: formData.get('meetingTitle'),
        date: formData.get('meetingDate'),
        time: formData.get('meetingTime'),
        location: formData.get('meetingLocation'),
        agenda: formData.get('meetingAgenda'),
        timestamp: new Date().toISOString()
    };

    submitEntry(data, form);
}

// Maintenance form submission
function handleMaintenanceSubmission(form) {
    const formData = new FormData(form);
    const data = {
        type: 'maintenance',
        maintenanceType: formData.get('maintenanceType'),
        location: formData.get('maintenanceLocation'),
        description: formData.get('maintenanceDescription'),
        priority: formData.get('maintenancePriority'),
        cost: formData.get('maintenanceCost'),
        timestamp: new Date().toISOString()
    };

    submitEntry(data, form);
}

// Finance form submission
function handleFinanceSubmission(form) {
    const formData = new FormData(form);
    const data = {
        type: 'finance',
        category: formData.get('financeCategory'),
        description: formData.get('financeDescription'),
        amount: formData.get('financeAmount'),
        date: formData.get('financeDate'),
        notes: formData.get('financeNotes'),
        timestamp: new Date().toISOString()
    };

    submitEntry(data, form);
}

// Generic entry submission
function submitEntry(data, form) {
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sparar...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store in localStorage
        saveEntry(data);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification(`${getEntryTypeLabel(data.type)} har sparats!`, 'success');
        
        // Refresh recent entries
        loadRecentEntries();
        
    }, 1000);
}

// Save entry to localStorage
function saveEntry(data) {
    data.id = Date.now();
    const entries = getStoredEntries();
    entries.unshift(data);
    
    // Keep only last 100 entries
    if (entries.length > 100) {
        entries.splice(100);
    }
    
    localStorage.setItem('brf_entries', JSON.stringify(entries));
}

// Get stored entries
function getStoredEntries() {
    try {
        return JSON.parse(localStorage.getItem('brf_entries') || '[]');
    } catch (e) {
        console.error('Error parsing stored entries:', e);
        return [];
    }
}

// Load and display recent entries
function loadRecentEntries() {
    const container = document.getElementById('recent-entries');
    if (!container) return;

    const entries = getStoredEntries().slice(0, 10); // Show last 10 entries
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="no-entries">
                <i class="fas fa-inbox"></i>
                <p>Inga poster ännu. Lägg till din första post ovan!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = entries.map(entry => createEntryHTML(entry)).join('');
    
    // Add event listeners for edit/delete buttons
    setupEntryActions();
}

// Create HTML for an entry
function createEntryHTML(entry) {
    const icon = getEntryIcon(entry.type);
    const title = getEntryTitle(entry);
    const description = getEntryDescription(entry);
    const date = new Date(entry.timestamp).toLocaleDateString('sv-SE');
    
    return `
        <div class="entry-item" data-id="${entry.id}">
            <div class="entry-icon">
                <i class="${icon}"></i>
            </div>
            <div class="entry-content">
                <h4>${title}</h4>
                <p>${description}</p>
                <small>${date}</small>
            </div>
            <div class="entry-actions">
                <button class="btn-edit" onclick="editEntry(${entry.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteEntry(${entry.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// Get icon for entry type
function getEntryIcon(type) {
    const icons = {
        apartment: 'fas fa-home',
        meeting: 'fas fa-users',
        maintenance: 'fas fa-tools',
        finance: 'fas fa-chart-line'
    };
    return icons[type] || 'fas fa-file';
}

// Get title for entry
function getEntryTitle(entry) {
    switch (entry.type) {
        case 'apartment':
            return `Lägenhet ${entry.apartmentNumber}`;
        case 'meeting':
            return entry.title;
        case 'maintenance':
            return `${entry.maintenanceType} - ${entry.location}`;
        case 'finance':
            return entry.description;
        default:
            return 'Okänd post';
    }
}

// Get description for entry
function getEntryDescription(entry) {
    switch (entry.type) {
        case 'apartment':
            return `Ägare: ${entry.ownerName}`;
        case 'meeting':
            return `${entry.date} ${entry.time}`;
        case 'maintenance':
            return `Prioritet: ${entry.priority}`;
        case 'finance':
            return `${entry.category}: ${formatCurrency(entry.amount)}`;
        default:
            return '';
    }
}

// Get entry type label
function getEntryTypeLabel(type) {
    const labels = {
        apartment: 'Lägenhetsinformation',
        meeting: 'Möte',
        maintenance: 'Underhållsärende',
        finance: 'Ekonomisk post'
    };
    return labels[type] || 'Post';
}

// Setup entry action buttons
function setupEntryActions() {
    // Edit and delete functionality is handled by onclick attributes in HTML
    // This could be enhanced to use event delegation instead
}

// Edit entry function
function editEntry(id) {
    const entries = getStoredEntries();
    const entry = entries.find(e => e.id === id);
    
    if (!entry) {
        showNotification('Post hittades inte', 'error');
        return;
    }
    
    // Switch to the correct form type
    const typeButton = document.querySelector(`[data-type="${entry.type}"]`);
    if (typeButton) {
        typeButton.click();
    }
    
    // Fill form with entry data
    setTimeout(() => {
        fillFormWithEntry(entry);
    }, 100);
    
    showNotification('Post laddad för redigering', 'info');
}

// Fill form with entry data
function fillFormWithEntry(entry) {
    const formId = `${entry.type}Form`;
    const form = document.getElementById(formId);
    
    if (!form) return;
    
    // Mark form as edit mode
    form.classList.add('edit-mode');
    form.dataset.editId = entry.id;
    
    // Fill form fields based on entry type
    switch (entry.type) {
        case 'apartment':
            fillField(form, 'apartmentNumber', entry.apartmentNumber);
            fillField(form, 'ownerName', entry.ownerName);
            fillField(form, 'contactInfo', entry.contactInfo);
            fillField(form, 'apartmentSize', entry.apartmentSize);
            fillField(form, 'rooms', entry.rooms);
            fillField(form, 'apartmentNotes', entry.notes);
            break;
        case 'meeting':
            fillField(form, 'meetingTitle', entry.title);
            fillField(form, 'meetingDate', entry.date);
            fillField(form, 'meetingTime', entry.time);
            fillField(form, 'meetingLocation', entry.location);
            fillField(form, 'meetingAgenda', entry.agenda);
            break;
        case 'maintenance':
            fillField(form, 'maintenanceType', entry.maintenanceType);
            fillField(form, 'maintenanceLocation', entry.location);
            fillField(form, 'maintenanceDescription', entry.description);
            fillField(form, 'maintenancePriority', entry.priority);
            fillField(form, 'maintenanceCost', entry.cost);
            break;
        case 'finance':
            fillField(form, 'financeCategory', entry.category);
            fillField(form, 'financeDescription', entry.description);
            fillField(form, 'financeAmount', entry.amount);
            fillField(form, 'financeDate', entry.date);
            fillField(form, 'financeNotes', entry.notes);
            break;
    }
    
    // Update submit button text
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Uppdatera post';
}

// Helper function to fill form field
function fillField(form, fieldName, value) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field && value !== undefined && value !== null) {
        field.value = value;
    }
}

// Delete entry function
function deleteEntry(id) {
    if (!confirm('Är du säker på att du vill ta bort denna post?')) {
        return;
    }
    
    const entries = getStoredEntries();
    const filteredEntries = entries.filter(e => e.id !== id);
    
    localStorage.setItem('brf_entries', JSON.stringify(filteredEntries));
    loadRecentEntries();
    
    showNotification('Post har tagits bort', 'success');
}

// Add form validation
function addFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity() && value !== '';
    
    field.classList.toggle('error', !isValid);
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message if invalid
    if (!isValid) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = getFieldErrorMessage(field);
        field.parentNode.appendChild(errorMessage);
    }
    
    return isValid;
}

// Get error message for field
function getFieldErrorMessage(field) {
    if (field.validity.valueMissing) {
        return 'Detta fält är obligatoriskt';
    }
    if (field.validity.typeMismatch) {
        return 'Ogiltigt format';
    }
    if (field.validity.rangeUnderflow) {
        return `Värdet måste vara minst ${field.min}`;
    }
    if (field.validity.rangeOverflow) {
        return `Värdet får inte överstiga ${field.max}`;
    }
    return 'Ogiltigt värde';
}

// Add CSS for form validation
const validationStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 5px;
    }
    
    .entry-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 20px;
        background: #fff;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        min-width: 120px;
    }
    
    .entry-type-btn:hover {
        border-color: #2563eb;
        transform: translateY(-2px);
    }
    
    .entry-type-btn.active {
        border-color: #2563eb;
        background: #eff6ff;
        color: #2563eb;
    }
    
    .entry-type-btn i {
        font-size: 1.5rem;
    }
    
    .entry-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .entry-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: background-color 0.3s ease;
    }
    
    .entry-item:hover {
        background: #f1f5f9;
    }
    
    .entry-icon {
        width: 50px;
        height: 50px;
        background: #2563eb;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .entry-content {
        flex: 1;
    }
    
    .entry-content h4 {
        margin: 0 0 5px 0;
        color: #1e293b;
    }
    
    .entry-content p {
        margin: 0 0 5px 0;
        color: #64748b;
        font-size: 0.9rem;
    }
    
    .entry-content small {
        color: #94a3b8;
        font-size: 0.8rem;
    }
    
    .entry-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-edit,
    .btn-delete {
        width: 35px;
        height: 35px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .btn-edit {
        background: #f59e0b;
        color: white;
    }
    
    .btn-edit:hover {
        background: #d97706;
    }
    
    .btn-delete {
        background: #ef4444;
        color: white;
    }
    
    .btn-delete:hover {
        background: #dc2626;
    }
    
    .no-entries {
        text-align: center;
        padding: 40px;
        color: #94a3b8;
    }
    
    .no-entries i {
        font-size: 3rem;
        margin-bottom: 15px;
        display: block;
    }
`;

// Add validation styles to page
const styleElement = document.createElement('style');
styleElement.textContent = validationStyles;
document.head.appendChild(styleElement);