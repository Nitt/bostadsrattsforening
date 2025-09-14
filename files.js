// Files page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeFilesPage();
});

function initializeFilesPage() {
    setupFileUpload();
    setupCategoryTabs();
    setupDocumentSearch();
    setupDocumentActions();
    loadDocuments();
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const fileUpload = document.querySelector('.file-upload');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file');
    const uploadForm = document.getElementById('uploadForm');

    // Drag and drop functionality
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.background = '#f0f8ff';
        this.style.borderColor = '#2563eb';
    });

    fileUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.background = '';
        this.style.borderColor = '';
    });

    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = '';
        this.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    // Remove file button
    removeFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        filePreview.style.display = 'none';
        fileUpload.style.display = 'block';
    });

    // Form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFileUpload(this);
    });
}

// Handle file selection
function handleFileSelection(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
        showNotification('Filtypen stöds inte. Tillåtna format: PDF, DOC, DOCX, XLS, XLSX', 'error');
        return;
    }

    if (file.size > maxSize) {
        showNotification('Filen är för stor. Maximal storlek: 10MB', 'error');
        return;
    }

    // Show file preview
    const fileName = document.getElementById('file-name');
    const filePreview = document.getElementById('file-preview');
    const fileUpload = document.querySelector('.file-upload');

    fileName.textContent = file.name;
    filePreview.style.display = 'block';
    fileUpload.style.display = 'none';
}

// Handle file upload
function handleFileUpload(form) {
    const formData = new FormData(form);
    const fileInput = document.getElementById('file-input');
    
    if (!fileInput.files[0]) {
        showNotification('Välj en fil att ladda upp', 'error');
        return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Laddar upp...';
    submitBtn.disabled = true;

    // Simulate upload
    setTimeout(() => {
        const fileData = {
            id: Date.now(),
            title: formData.get('documentTitle'),
            description: formData.get('documentDescription'),
            category: formData.get('documentCategory'),
            fileName: fileInput.files[0].name,
            fileSize: fileInput.files[0].size,
            uploadDate: new Date().toISOString(),
            downloads: 0
        };

        // Save to localStorage
        saveDocument(fileData);

        // Reset form
        form.reset();
        document.getElementById('file-preview').style.display = 'none';
        document.querySelector('.file-upload').style.display = 'block';

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showNotification('Dokument har laddats upp!', 'success');

        // Refresh document list
        loadDocuments();
    }, 2000);
}

// Save document to localStorage
function saveDocument(document) {
    const documents = getStoredDocuments();
    documents.unshift(document);
    localStorage.setItem('brf_documents', JSON.stringify(documents));
}

// Get stored documents
function getStoredDocuments() {
    try {
        return JSON.parse(localStorage.getItem('brf_documents') || '[]');
    } catch (e) {
        console.error('Error parsing stored documents:', e);
        return [];
    }
}

// Setup category tabs
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter documents
            filterDocuments(category);
        });
    });
}

// Filter documents by category
function filterDocuments(category) {
    const documents = document.querySelectorAll('.document-item');
    
    documents.forEach(doc => {
        if (category === 'all' || doc.dataset.category === category) {
            doc.style.display = 'flex';
        } else {
            doc.style.display = 'none';
        }
    });
}

// Setup document search
function setupDocumentSearch() {
    const searchInput = document.getElementById('document-search');
    const sortSelect = document.getElementById('sort-documents');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            performDocumentSearch(query);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortDocuments(this.value);
        });
    }
}

// Perform document search
function performDocumentSearch(query) {
    const documents = document.querySelectorAll('.document-item');
    
    documents.forEach(doc => {
        const title = doc.querySelector('h4').textContent.toLowerCase();
        const description = doc.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            doc.style.display = 'flex';
        } else {
            doc.style.display = 'none';
        }
    });
}

// Sort documents
function sortDocuments(sortBy) {
    const container = document.getElementById('document-list');
    const documents = Array.from(container.querySelectorAll('.document-item'));
    
    documents.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'date-asc':
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            case 'name-asc':
                return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
            case 'name-desc':
                return b.querySelector('h4').textContent.localeCompare(a.querySelector('h4').textContent);
            default:
                return 0;
        }
    });
    
    // Re-append sorted documents
    documents.forEach(doc => container.appendChild(doc));
}

// Setup document actions
function setupDocumentActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-action')) {
            const button = e.target.closest('.btn-action');
            const action = getActionType(button);
            const documentItem = button.closest('.document-item');
            
            handleDocumentAction(action, documentItem);
        }
    });
}

// Get action type from button
function getActionType(button) {
    if (button.title.includes('Ladda ner')) return 'download';
    if (button.title.includes('Förhandsgranska')) return 'preview';
    if (button.title.includes('Redigera')) return 'edit';
    return 'unknown';
}

// Handle document actions
function handleDocumentAction(action, documentItem) {
    const title = documentItem.querySelector('h4').textContent;
    const documentId = documentItem.dataset.id;
    
    switch (action) {
        case 'download':
            downloadDocument(documentId, title);
            break;
        case 'preview':
            previewDocument(documentId, title);
            break;
        case 'edit':
            editDocument(documentId, title);
            break;
    }
}

// Download document
function downloadDocument(documentId, title) {
    // Simulate download
    showNotification(`Laddar ner "${title}"...`, 'info');
    
    // Update download count
    setTimeout(() => {
        updateDownloadCount(documentId);
        showNotification(`"${title}" har laddats ner`, 'success');
    }, 1000);
}

// Preview document
function previewDocument(documentId, title) {
    showDocumentModal(title, 'Detta är en förhandsgranskning av dokumentet. I en riktig implementation skulle dokumentet visas här.');
}

// Edit document
function editDocument(documentId, title) {
    const documents = getStoredDocuments();
    const document = documents.find(d => d.id == documentId);
    
    if (document) {
        // Fill upload form with document data
        document.getElementById('document-title').value = document.title;
        document.getElementById('document-description').value = document.description;
        document.getElementById('document-category').value = document.category;
        
        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        
        showNotification(`Redigerar "${title}"`, 'info');
    }
}

// Update download count
function updateDownloadCount(documentId) {
    const documents = getStoredDocuments();
    const document = documents.find(d => d.id == documentId);
    
    if (document) {
        document.downloads = (document.downloads || 0) + 1;
        localStorage.setItem('brf_documents', JSON.stringify(documents));
        
        // Update UI
        const documentItem = document.querySelector(`[data-id="${documentId}"]`);
        if (documentItem) {
            const downloadSpan = documentItem.querySelector('.document-meta span:last-child');
            if (downloadSpan) {
                downloadSpan.innerHTML = `<i class="fas fa-download"></i> ${document.downloads} nedladdningar`;
            }
        }
    }
}

// Show document modal
function showDocumentModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('document-modal');
    if (!modal) {
        modal = createDocumentModal();
        document.body.appendChild(modal);
    }
    
    // Set content
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-content-body').innerHTML = content;
    
    // Show modal
    modal.style.display = 'flex';
}

// Create document modal
function createDocumentModal() {
    const modal = document.createElement('div');
    modal.id = 'document-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content-body"></div>
            </div>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

// Load documents (including sample data)
function loadDocuments() {
    const stored = getStoredDocuments();
    
    // If no stored documents, don't override the sample data in HTML
    if (stored.length === 0) {
        addDataAttributesToExistingDocuments();
        return;
    }
    
    // Render stored documents
    renderDocuments(stored);
}

// Add data attributes to existing documents for filtering
function addDataAttributesToExistingDocuments() {
    const documentItems = document.querySelectorAll('.document-item');
    
    documentItems.forEach((item, index) => {
        item.dataset.id = index + 1;
        item.dataset.date = new Date(Date.now() - index * 86400000).toISOString(); // Subtract days
    });
}

// Render documents in the list
function renderDocuments(documents) {
    const container = document.getElementById('document-list');
    
    container.innerHTML = documents.map(doc => createDocumentHTML(doc)).join('');
}

// Create HTML for a document
function createDocumentHTML(doc) {
    const icon = getDocumentIcon(doc.category);
    const fileType = getFileExtension(doc.fileName).toUpperCase();
    const fileSize = formatFileSize(doc.fileSize);
    const date = new Date(doc.uploadDate).toLocaleDateString('sv-SE');
    
    return `
        <div class="document-item" data-category="${doc.category}" data-id="${doc.id}" data-date="${doc.uploadDate}">
            <div class="document-icon">
                <i class="${icon}"></i>
            </div>
            <div class="document-info">
                <h4>${doc.title}</h4>
                <p>${doc.description}</p>
                <div class="document-meta">
                    <span><i class="fas fa-calendar"></i> ${date}</span>
                    <span><i class="fas fa-file-${getFileIconType(doc.fileName)}"></i> ${fileType}</span>
                    <span><i class="fas fa-download"></i> ${doc.downloads || 0} nedladdningar</span>
                </div>
            </div>
            <div class="document-actions">
                <button class="btn-action" title="Ladda ner">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-action" title="Förhandsgranska">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action" title="Redigera">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `;
}

// Get document icon based on category
function getDocumentIcon(category) {
    const icons = {
        rules: 'fas fa-gavel',
        economics: 'fas fa-chart-line',
        meetings: 'fas fa-users',
        maintenance: 'fas fa-tools',
        insurance: 'fas fa-shield-alt',
        other: 'fas fa-file-alt'
    };
    return icons[category] || 'fas fa-file-alt';
}

// Get file extension
function getFileExtension(fileName) {
    return fileName.split('.').pop() || '';
}

// Get file icon type
function getFileIconType(fileName) {
    const ext = getFileExtension(fileName).toLowerCase();
    const iconMap = {
        pdf: 'pdf',
        doc: 'word',
        docx: 'word',
        xls: 'excel',
        xlsx: 'excel'
    };
    return iconMap[ext] || 'alt';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add styles for files page
const filesStyles = `
    .selected-file {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        background: #f0f8ff;
        border: 2px solid #2563eb;
        border-radius: 8px;
        margin-top: 10px;
    }
    
    .selected-file i {
        color: #2563eb;
    }
    
    #remove-file {
        background: none;
        border: none;
        color: #ef4444;
        cursor: pointer;
        margin-left: auto;
        font-size: 1.2rem;
    }
    
    .category-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }
    
    .category-tab {
        padding: 12px 20px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        white-space: nowrap;
    }
    
    .category-tab:hover {
        background: #e2e8f0;
    }
    
    .category-tab.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
    }
    
    .document-controls {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .search-box {
        position: relative;
        flex: 1;
        min-width: 200px;
    }
    
    .search-box i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
    }
    
    .search-box input {
        width: 100%;
        padding: 12px 15px 12px 45px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 16px;
    }
    
    .sort-options select {
        padding: 12px 15px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        font-size: 16px;
        cursor: pointer;
    }
    
    .document-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .document-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .document-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .document-info {
        flex: 1;
    }
    
    .document-info h4 {
        margin: 0 0 8px 0;
        font-size: 1.2rem;
        color: #1e293b;
    }
    
    .document-info p {
        margin: 0 0 12px 0;
        color: #64748b;
        line-height: 1.5;
    }
    
    .document-meta {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .document-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.85rem;
        color: #94a3b8;
    }
    
    .document-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-action {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        background: #f1f5f9;
        color: #64748b;
    }
    
    .btn-action:hover {
        background: #2563eb;
        color: white;
        transform: translateY(-1px);
    }
    
    #document-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-overlay {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        color: #1e293b;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #94a3b8;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-close:hover {
        color: #64748b;
    }
    
    .modal-content-body {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
    }
    
    @media (max-width: 768px) {
        .document-item {
            flex-direction: column;
            text-align: center;
        }
        
        .document-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .category-tabs {
            justify-content: center;
        }
        
        .document-meta {
            justify-content: center;
        }
    }
`;

// Add styles to page
const styleElement = document.createElement('style');
styleElement.textContent = filesStyles;
document.head.appendChild(styleElement);