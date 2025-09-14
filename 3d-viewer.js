// 3D Viewer JavaScript for the neighbourhood visualization

let scene, camera, renderer, controls;
let buildings = [];
let selectedBuilding = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeThreeJS();
    setupControlButtons();
    createNeighborhood();
    animate();
});

// Initialize Three.js scene
function initializeThreeJS() {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found');
        return;
    }

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

    // Create camera
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(50, 40, 50);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Add lighting
    setupLighting();

    // Add controls
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 10;
        controls.maxDistance = 200;
        controls.maxPolarAngle = Math.PI / 2; // Prevent going below ground
    }

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Setup lighting
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
}

// Create the neighborhood
function createNeighborhood() {
    // Create ground
    createGround();
    
    // Create buildings
    createMainBuilding();
    createAnnexBuilding();
    createGarage();
    
    // Create landscaping
    createLandscaping();
    
    // Create parking areas
    createParkingArea();
    
    // Add some decorative elements
    addDecorations();
}

// Create ground plane
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 }); // Light green
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

// Create main building
function createMainBuilding() {
    const buildingGroup = new THREE.Group();
    
    // Main structure
    const geometry = new THREE.BoxGeometry(20, 30, 15);
    const material = new THREE.MeshLambertMaterial({ color: 0x4ade80 }); // Green
    const building = new THREE.Mesh(geometry, material);
    building.position.y = 15;
    building.castShadow = true;
    building.receiveShadow = true;
    buildingGroup.add(building);
    
    // Add windows
    addWindows(buildingGroup, 20, 30, 15, 6); // 6 floors
    
    // Add entrance
    const entranceGeometry = new THREE.BoxGeometry(3, 4, 1);
    const entranceMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance.position.set(0, 2, 8);
    buildingGroup.add(entrance);
    
    buildingGroup.position.set(0, 0, 0);
    buildingGroup.userData = { type: 'main', name: 'Huvudbyggnad', apartments: 24, floors: 6 };
    buildings.push(buildingGroup);
    scene.add(buildingGroup);
}

// Create annex building
function createAnnexBuilding() {
    const buildingGroup = new THREE.Group();
    
    // Main structure
    const geometry = new THREE.BoxGeometry(15, 18, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0x60a5fa }); // Blue
    const building = new THREE.Mesh(geometry, material);
    building.position.y = 9;
    building.castShadow = true;
    building.receiveShadow = true;
    buildingGroup.add(building);
    
    // Add windows
    addWindows(buildingGroup, 15, 18, 12, 3); // 3 floors
    
    buildingGroup.position.set(35, 0, -10);
    buildingGroup.userData = { type: 'annex', name: 'Annexbyggnad', apartments: 12, floors: 3 };
    buildings.push(buildingGroup);
    scene.add(buildingGroup);
}

// Create garage
function createGarage() {
    const buildingGroup = new THREE.Group();
    
    // Main structure
    const geometry = new THREE.BoxGeometry(25, 8, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0xfbbf24 }); // Yellow
    const building = new THREE.Mesh(geometry, material);
    building.position.y = 4;
    building.castShadow = true;
    building.receiveShadow = true;
    buildingGroup.add(building);
    
    // Add garage doors
    for (let i = -10; i <= 10; i += 4) {
        const doorGeometry = new THREE.PlaneGeometry(3, 6);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 }); // Gray
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(i, 3, 6.1);
        buildingGroup.add(door);
    }
    
    buildingGroup.position.set(-35, 0, 15);
    buildingGroup.userData = { type: 'garage', name: 'Garage', spaces: 30, floors: 1 };
    buildings.push(buildingGroup);
    scene.add(buildingGroup);
}

// Add windows to buildings
function addWindows(buildingGroup, width, height, depth, floors) {
    const windowGeometry = new THREE.PlaneGeometry(1.5, 2);
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB }); // Light blue
    
    const floorHeight = height / floors;
    const windowsPerFloor = Math.floor(width / 3);
    
    for (let floor = 0; floor < floors; floor++) {
        for (let i = 0; i < windowsPerFloor; i++) {
            // Front windows
            const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
            windowFront.position.set(
                (i - windowsPerFloor / 2 + 0.5) * 3,
                (floor + 0.5) * floorHeight,
                depth / 2 + 0.1
            );
            buildingGroup.add(windowFront);
            
            // Back windows
            const windowBack = new THREE.Mesh(windowGeometry, windowMaterial);
            windowBack.position.set(
                (i - windowsPerFloor / 2 + 0.5) * 3,
                (floor + 0.5) * floorHeight,
                -depth / 2 - 0.1
            );
            windowBack.rotation.y = Math.PI;
            buildingGroup.add(windowBack);
        }
    }
}

// Create landscaping
function createLandscaping() {
    // Trees
    for (let i = 0; i < 15; i++) {
        createTree(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150
        );
    }
    
    // Pathways
    createPathway();
}

// Create a tree
function createTree(x, z) {
    // Avoid placing trees too close to buildings
    if (Math.abs(x) < 30 && Math.abs(z) < 30) return;
    
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 6);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 3;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(4);
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 8;
    foliage.castShadow = true;
    treeGroup.add(foliage);
    
    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
}

// Create pathway
function createPathway() {
    const pathGeometry = new THREE.PlaneGeometry(100, 3);
    const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.position.y = 0.1;
    scene.add(path);
}

// Create parking area
function createParkingArea() {
    const parkingGroup = new THREE.Group();
    
    // Parking surface
    const surfaceGeometry = new THREE.PlaneGeometry(40, 20);
    const surfaceMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 }); // Gray
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = 0.1;
    parkingGroup.add(surface);
    
    // Parking spaces
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            const spaceGeometry = new THREE.BoxGeometry(4, 0.1, 2.5);
            const spaceMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF }); // White lines
            const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
            space.position.set(
                (i - 1.5) * 5,
                0.15,
                (j - 2) * 3
            );
            parkingGroup.add(space);
        }
    }
    
    parkingGroup.position.set(60, 0, 30);
    scene.add(parkingGroup);
}

// Add decorative elements
function addDecorations() {
    // Benches
    for (let i = 0; i < 3; i++) {
        createBench(
            Math.random() * 40 - 20,
            Math.random() * 40 - 20
        );
    }
    
    // Lamp posts
    for (let i = 0; i < 6; i++) {
        createLampPost(
            (i - 2.5) * 15,
            25
        );
    }
}

// Create a bench
function createBench(x, z) {
    const benchGroup = new THREE.Group();
    
    const seatGeometry = new THREE.BoxGeometry(3, 0.3, 1);
    const seatMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 1;
    benchGroup.add(seat);
    
    const backGeometry = new THREE.BoxGeometry(3, 1.5, 0.2);
    const back = new THREE.Mesh(backGeometry, seatMaterial);
    back.position.set(0, 1.5, -0.4);
    benchGroup.add(back);
    
    benchGroup.position.set(x, 0, z);
    scene.add(benchGroup);
}

// Create a lamp post
function createLampPost(x, z) {
    const lampGroup = new THREE.Group();
    
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8);
    const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 }); // Dark gray
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 4;
    lampGroup.add(pole);
    
    const lampGeometry = new THREE.SphereGeometry(1);
    const lampMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFAA }); // Light yellow
    const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
    lamp.position.y = 8;
    lampGroup.add(lamp);
    
    lampGroup.position.set(x, 0, z);
    scene.add(lampGroup);
}

// Setup control buttons
function setupControlButtons() {
    const buttons = {
        'view-overview': () => setOverviewView(),
        'view-building': () => focusBuildings(),
        'view-apartments': () => showApartmentDetails(),
        'view-parking': () => focusParking(),
        'view-garden': () => focusGarden(),
        'reset-view': () => resetView()
    };

    Object.keys(buttons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                // Update active button
                document.querySelectorAll('.control-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Execute function
                buttons[buttonId]();
            });
        }
    });

    // Building view buttons
    document.querySelectorAll('.btn-view-building').forEach(button => {
        button.addEventListener('click', function() {
            const buildingType = this.dataset.building;
            focusOnBuilding(buildingType);
        });
    });
}

// View functions
function setOverviewView() {
    if (camera && controls) {
        camera.position.set(50, 40, 50);
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

function focusBuildings() {
    if (camera && controls) {
        camera.position.set(30, 25, 30);
        controls.target.set(0, 10, 0);
        controls.update();
    }
}

function showApartmentDetails() {
    // Highlight apartment windows
    highlightApartments();
    focusBuildings();
}

function focusParking() {
    if (camera && controls) {
        camera.position.set(60, 20, 40);
        controls.target.set(60, 0, 30);
        controls.update();
    }
}

function focusGarden() {
    if (camera && controls) {
        camera.position.set(0, 30, 60);
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

function resetView() {
    setOverviewView();
    clearHighlights();
}

function focusOnBuilding(type) {
    const building = buildings.find(b => b.userData.type === type);
    if (building && camera && controls) {
        const pos = building.position;
        camera.position.set(pos.x + 20, pos.y + 15, pos.z + 20);
        controls.target.copy(pos);
        controls.update();
        
        highlightBuilding(building);
    }
}

// Highlight functions
function highlightApartments() {
    buildings.forEach(building => {
        if (building.userData.type !== 'garage') {
            building.children.forEach(child => {
                if (child.material && child.material.color) {
                    child.material.emissive.setHex(0x222222);
                }
            });
        }
    });
}

function highlightBuilding(building) {
    clearHighlights();
    building.children.forEach(child => {
        if (child.material && child.material.color) {
            child.material.emissive.setHex(0x444444);
        }
    });
}

function clearHighlights() {
    scene.traverse(object => {
        if (object.material && object.material.emissive) {
            object.material.emissive.setHex(0x000000);
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('threejs-container');
    if (container && camera && renderer) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
}

// Mouse interaction
function setupMouseInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', onMouseClick);
    
    function onMouseClick(event) {
        const container = document.getElementById('threejs-container');
        const rect = container.getBoundingClientRect();
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(buildings, true);
        
        if (intersects.length > 0) {
            const building = findParentBuilding(intersects[0].object);
            if (building) {
                showBuildingInfo(building);
            }
        }
    }
    
    function findParentBuilding(object) {
        while (object && !object.userData.type) {
            object = object.parent;
        }
        return object;
    }
    
    function showBuildingInfo(building) {
        const info = building.userData;
        let message = `${info.name}\n`;
        
        if (info.apartments) {
            message += `Lägenheter: ${info.apartments}\n`;
        }
        if (info.spaces) {
            message += `Platser: ${info.spaces}\n`;
        }
        if (info.floors) {
            message += `Våningar: ${info.floors}`;
        }
        
        showNotification(message, 'info');
        highlightBuilding(building);
    }
}

// Initialize mouse interaction when Three.js is ready
setTimeout(() => {
    if (renderer && scene && camera) {
        setupMouseInteraction();
    }
}, 1000);

// Add styles for the 3D viewer
const viewerStyles = `
    .building-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 30px;
    }
    
    .building-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }
    
    .building-card:hover {
        transform: translateY(-5px);
    }
    
    .building-card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .building-card-header i {
        font-size: 1.5rem;
    }
    
    .building-card-header h3 {
        margin: 0;
        font-size: 1.3rem;
    }
    
    .building-details {
        padding: 20px;
    }
    
    .building-details p {
        margin: 10px 0;
        color: #64748b;
    }
    
    .btn-view-building {
        width: 100%;
        padding: 15px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #2563eb;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .btn-view-building:hover {
        background: #2563eb;
        color: white;
    }
    
    .legend {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
    }
    
    .legend-color {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        flex-shrink: 0;
    }
    
    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 20px;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-number {
        font-size: 2rem;
        font-weight: 600;
        color: #2563eb;
        margin-bottom: 5px;
    }
    
    .stat-label {
        font-size: 0.9rem;
        color: #64748b;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        margin-top: 30px;
    }
    
    .stat-card {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 20px;
        transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
    }
    
    .stat-icon {
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
    
    .stat-content {
        flex: 1;
    }
    
    .stat-content .stat-number {
        font-size: 1.8rem;
        margin-bottom: 5px;
    }
    
    .stat-content .stat-label {
        font-size: 0.9rem;
    }
`;

// Add styles to page
const styleElement = document.createElement('style');
styleElement.textContent = viewerStyles;
document.head.appendChild(styleElement);