// Simple 2D fallback for 3D viewer when Three.js is not available

document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js failed to load
    if (typeof THREE === 'undefined') {
        initializeFallbackViewer();
    }
});

function initializeFallbackViewer() {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    // Create a 2D representation
    container.innerHTML = `
        <div class="fallback-viewer">
            <div class="viewer-title">
                <h3>🏘️ Kvarter Översikt</h3>
                <p>Interaktiv 3D-vy kommer att vara tillgänglig när externa bibliotek kan laddas</p>
            </div>
            
            <div class="building-layout">
                <div class="building main-building" data-building="main">
                    <div class="building-icon">🏢</div>
                    <div class="building-label">
                        <strong>Huvudbyggnad</strong>
                        <br>24 lgh, 6 vån
                    </div>
                </div>
                
                <div class="building annex-building" data-building="annex">
                    <div class="building-icon">🏢</div>
                    <div class="building-label">
                        <strong>Annexbyggnad</strong>
                        <br>12 lgh, 3 vån
                    </div>
                </div>
                
                <div class="building garage" data-building="garage">
                    <div class="building-icon">🚗</div>
                    <div class="building-label">
                        <strong>Garage</strong>
                        <br>30 platser
                    </div>
                </div>
                
                <div class="green-area">
                    <div class="tree">🌳</div>
                    <div class="tree">🌳</div>
                    <div class="tree">🌳</div>
                    <div class="grass">🌿</div>
                </div>
                
                <div class="parking-area">
                    <div class="parking-icon">🅿️</div>
                    <div class="parking-label">Parkering</div>
                </div>
            </div>
            
            <div class="viewer-info">
                <p><strong>Klicka på byggnader</strong> för att se mer information</p>
            </div>
        </div>
    `;

    // Add click handlers
    setupFallbackInteractions();
    
    // Add fallback styles
    addFallbackStyles();
}

function setupFallbackInteractions() {
    document.querySelectorAll('.building').forEach(building => {
        building.addEventListener('click', function() {
            const buildingType = this.dataset.building;
            showBuildingInfoFallback(buildingType);
        });
    });
}

function showBuildingInfoFallback(type) {
    const buildingInfo = {
        main: {
            name: 'Huvudbyggnad',
            apartments: 24,
            floors: 6,
            year: 1987,
            status: 'Bra skick'
        },
        annex: {
            name: 'Annexbyggnad', 
            apartments: 12,
            floors: 3,
            year: 1995,
            status: 'Nyligen renoverad'
        },
        garage: {
            name: 'Garage',
            spaces: 30,
            floors: 1,
            year: 1987,
            status: 'Under renovering'
        }
    };

    const info = buildingInfo[type];
    if (!info) return;

    let message = `🏢 ${info.name}\n\n`;
    if (info.apartments) message += `🏠 Lägenheter: ${info.apartments}\n`;
    if (info.spaces) message += `🚗 Platser: ${info.spaces}\n`;
    message += `📊 Våningar: ${info.floors}\n`;
    message += `📅 Byggnadsår: ${info.year}\n`;
    message += `✅ Status: ${info.status}`;

    showNotification(message, 'info');

    // Highlight building
    document.querySelectorAll('.building').forEach(b => b.classList.remove('highlighted'));
    document.querySelector(`[data-building="${type}"]`).classList.add('highlighted');
}

function addFallbackStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fallback-viewer {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-radius: 8px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            min-height: 500px;
        }
        
        .viewer-title {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .viewer-title h3 {
            margin: 0 0 10px 0;
            font-size: 1.5rem;
            color: #1565c0;
        }
        
        .viewer-title p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .building-layout {
            position: relative;
            width: 400px;
            height: 300px;
            margin: 20px auto;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-wrap: wrap;
            padding: 20px;
        }
        
        .building {
            background: white;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin: 10px;
            min-width: 120px;
        }
        
        .building:hover,
        .building.highlighted {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 5px 20px rgba(37, 99, 235, 0.3);
            background: #eff6ff;
        }
        
        .building-icon {
            font-size: 2rem;
            margin-bottom: 8px;
        }
        
        .building-label {
            font-size: 0.85rem;
            color: #374151;
        }
        
        .building-label strong {
            color: #1e40af;
        }
        
        .main-building { background: #dcfce7; }
        .annex-building { background: #dbeafe; }
        .garage { background: #fef3c7; }
        
        .green-area {
            position: absolute;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .tree, .grass {
            font-size: 1.5rem;
            animation: sway 3s ease-in-out infinite;
        }
        
        .parking-area {
            position: absolute;
            top: 20px;
            right: 20px;
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border-radius: 8px;
        }
        
        .parking-icon {
            font-size: 2rem;
            margin-bottom: 5px;
        }
        
        .parking-label {
            font-size: 0.8rem;
            color: #374151;
        }
        
        .viewer-info {
            margin-top: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        
        @keyframes sway {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
        }
        
        @media (max-width: 480px) {
            .building-layout {
                width: 90%;
                height: auto;
                flex-direction: column;
            }
            
            .building {
                width: 80%;
                margin: 5px 0;
            }
            
            .green-area,
            .parking-area {
                position: static;
                margin: 10px 0;
            }
        }
    `;
    document.head.appendChild(style);
}