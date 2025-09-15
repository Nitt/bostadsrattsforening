# Bostadsrättsförening Website

Bostadsrättsförening is a static HTML/CSS/JavaScript web application for managing Swedish housing cooperative information. The website provides member management, 3D neighborhood visualization, and document handling capabilities with a user-friendly Swedish interface.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap and run the application:
  - `cd /home/runner/work/bostadsrattsforening/bostadsrattsforening`
  - `python3 -m http.server 8080` -- starts instantly. NEVER CANCEL.
  - Test access: `curl -s http://localhost:8080 | head -5`
  - Application is immediately ready at http://localhost:8080

- No build process required:
  - This is a static website with no compilation steps
  - All dependencies loaded via CDN (Font Awesome, Google Fonts, Three.js)
  - Changes to HTML/CSS/JS files are immediately visible after browser refresh

- Stop the server:
  - `pkill -f "python3 -m http.server"` or use Ctrl+C in the server session

## Validation

- ALWAYS manually validate changes by running the complete application scenario after making changes.
- Test complete user workflows, not just starting and stopping the application.
- Essential validation scenarios:
  1. **Homepage Navigation**: Access http://localhost:8080 and verify all navigation links work
  2. **Apartment Entry Form**: Navigate to "Uppdatera Poster", fill apartment form (lägenhetsnummer, ägare, kontakt), submit and verify data persistence
  3. **3D Viewer**: Test "3D Kvarter" page - verify it loads with either 3D view (when CDN works) or fallback 2D layout
  4. **Document Management**: Test "Dokument" page - verify file upload interface and document listing functionality
  5. **Mobile Navigation**: Test hamburger menu functionality on narrow viewports

- ALWAYS test the Swedish language interface - all text should display correctly
- You can build and run the application fully, and can interact with all UI elements via browser automation tools
- ALWAYS test form submissions and verify JavaScript functionality works correctly

## Dependencies and Environment

- Runtime dependencies (loaded via CDN):
  - Font Awesome 6.0.0 (https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css)
  - Google Fonts Inter (https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap)
  - Three.js r128 (https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js)
  - Three.js OrbitControls (https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js)

- Local development server requirements:
  - Python 3 (for `python3 -m http.server`)
  - Any modern web browser for testing

- Network considerations:
  - CDN resources may be blocked in some environments
  - Application has fallback functionality when external resources fail to load
  - 3D viewer gracefully degrades to 2D layout when Three.js libraries are unavailable

## Common Tasks

- Run the application: `python3 -m http.server 8080`
- Test specific pages:
  - Homepage: http://localhost:8080/
  - Entry forms: http://localhost:8080/entries.html
  - 3D viewer: http://localhost:8080/3d-view.html
  - Documents: http://localhost:8080/files.html

- No linting or formatting tools configured - maintain existing code style
- No automated tests - manual validation required for all changes

## Project Structure

### Main Application Files
- `index.html` - Homepage with navigation and feature overview
- `entries.html` - Apartment and meeting entry forms
- `3d-view.html` - Interactive 3D neighborhood visualization
- `files.html` - Document upload and management interface
- `styles.css` - Complete styling for all pages (613 lines)

### JavaScript Modules
- `script.js` - Core navigation and form handling (297 lines)
- `entries.js` - Entry form specific functionality (620 lines)
- `3d-viewer.js` - Three.js 3D visualization logic (721 lines)
- `3d-fallback.js` - Fallback 2D layout when 3D libraries unavailable (273 lines)
- `files.js` - Document management functionality (779 lines)

### Documentation
- `README.md` - Brief project description (2 lines)
- `ANVÄNDARMANUAL.md` - Comprehensive Swedish user manual (149 lines)

### Key Features by File
- **Navigation**: Responsive hamburger menu in `script.js`
- **Forms**: Apartment, meeting, maintenance, and financial entry forms in `entries.js`
- **3D Visualization**: Interactive neighborhood model with building information in `3d-viewer.js`
- **Document Management**: File upload, categorization, and search in `files.js`
- **Responsive Design**: Mobile-first CSS with breakpoints in `styles.css`

### Data Storage
- Client-side localStorage for form data persistence
- No backend database or server-side storage
- Documents referenced but not actually stored (placeholder functionality)

The application is designed for non-technical users with Swedish interface and comprehensive user documentation in `ANVÄNDARMANUAL.md`.