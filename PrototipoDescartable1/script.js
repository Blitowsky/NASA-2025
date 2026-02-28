// Inicializar mapa (centrado en Argentina)
var map = L.map('map').setView([-34.6, -58.4], 5); // Buenos Aires

// Capas base
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });
var reliefLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri &mdash; Fuente: Esri, USGS, NGA, NASA' });

osmLayer.addTo(map);

// Capas de datos (WMS y Heatmap)

// Densidad de árboles (Global Forest Watch WMS)
var treeDensityLayer = L.tileLayer.wms('https://storage.googleapis.com/wri-tiles/gfw/treecover/wms', {
    layers: 'treecover2000',
    format: 'image/png',
    transparent: true,
    opacity: 0.7,
    attribution: 'Global Forest Watch'
}).addTo(map);

// Áreas protegidas (WDPA via UNEP-WCMC)
var protectedAreasLayer = L.tileLayer.wms('https://www.protectedplanet.net/wms', {
    layers: 'wdpa_polygons',
    format: 'image/png',
    transparent: true,
    opacity: 0.6,
    attribution: 'UNEP-WCMC WDPA'
}).addTo(map);

// CO₂ (OCO-2 Level 3)
var co2Layer = L.tileLayer.wms('https://giovanni.gsfc.nasa.gov/giovanni/wms', {
    layers: 'OCO2_L3_XCO2',
    format: 'image/png',
    transparent: true,
    styles: 'boxfill/occam',
    colorscalerange: '400,450',
    opacity: 0.7,
    attribution: 'NASA GES DISC'
}).addTo(map);

// NO₂ (OMI Level 3)
var no2Layer = L.tileLayer.wms('https://giovanni.gsfc.nasa.gov/giovanni/wms', {
    layers: 'OMI_Aura_NO2',
    format: 'image/png',
    transparent: true,
    styles: 'boxfill/occam',
    colorscalerange: '0,10e15',
    opacity: 0.6,
    attribution: 'NASA GES DISC'
}).addTo(map);

// Ozono (OMI/Aura)
var ozoneLayer = L.tileLayer.wms('https://giovanni.gsfc.nasa.gov/giovanni/wms', {
    layers: 'OMI_Aura_O3',
    format: 'image/png',
    transparent: true,
    styles: 'boxfill/occam',
    colorscalerange: '200,400',
    opacity: 0.5,
    attribution: 'NASA GES DISC'
}).addTo(map);

// Mapa de calor para especies nativas
var speciesHeatData = [
    [-34.0, -65.0, 0.8], // Prosopis alba
    [-33.5, -66.5, 0.7], // Schinopsis quebracho-colorado
    [-35.0, -64.0, 0.6],
    [-34.5, -65.5, 0.9]
];
var speciesLayer = L.heatLayer(speciesHeatData, {
    radius: 25,
    blur: 15,
    maxZoom: 10,
    gradient: { 0.4: 'blue', 0.65: 'yellow', 1: 'red' },
    opacity: 0.8
}).addTo(map);

// Control de capas estándar de Leaflet
var baseLayers = {
    "OpenStreetMap": osmLayer,
    "Satelital": satelliteLayer,
    "Topográfico": reliefLayer
};
var overlayLayers = {
    "Densidad de Árboles": treeDensityLayer,
    "Áreas Protegidas": protectedAreasLayer,
    "CO₂": co2Layer,
    "NO₂": no2Layer,
    "Ozono (O₃)": ozoneLayer,
    "Distribución Especies Nativas": speciesLayer
};
L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(map);

// --- LÓGICA DE LAS FUNCIONES DE CONTROL ---

function toggleLayer(layer, checked) {
    if (layer === 'trees') {
        checked ? map.addLayer(treeDensityLayer) : map.removeLayer(treeDensityLayer);
    } else if (layer === 'protected') {
        checked ? map.addLayer(protectedAreasLayer) : map.removeLayer(protectedAreasLayer);
    } else if (layer === 'co2') {
        checked ? map.addLayer(co2Layer) : map.removeLayer(co2Layer);
    } else if (layer === 'no2') {
        checked ? map.addLayer(no2Layer) : map.removeLayer(no2Layer);
    } else if (layer === 'ozone') {
        checked ? map.addLayer(ozoneLayer) : map.removeLayer(ozoneLayer);
    } else if (layer === 'species') {
        checked ? map.addLayer(speciesLayer) : map.removeLayer(speciesLayer);
    }
}

function setOpacity(layer, value) {
    value = parseFloat(value);
    if (layer === 'trees') {
        treeDensityLayer.setOpacity(value);
    } else if (layer === 'protected') {
        protectedAreasLayer.setOpacity(value);
    } else if (layer === 'co2') {
        co2Layer.setOpacity(value);
    } else if (layer === 'no2') {
        no2Layer.setOpacity(value);
    } else if (layer === 'ozone') {
        ozoneLayer.setOpacity(value);
    } else if (layer === 'species') {
        // Para heatmap, Leaflet-heat no tiene setOpacity nativo, hay que recrear la capa
        map.removeLayer(speciesLayer);
        speciesLayer = L.heatLayer(speciesHeatData, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            gradient: { 0.4: 'blue', 0.65: 'yellow', 1: 'red' },
            opacity: value
        });
        if (document.getElementById('species').checked) {
            speciesLayer.addTo(map);
        }
    }
}

function togglePanel() {
    var panel = document.getElementById('control-panel');
    var button = document.getElementById('toggle-button');
    if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        button.textContent = 'Ocultar Filtros';
    } else {
        panel.classList.add('collapsed');
        button.textContent = 'Mostrar Filtros';
    }
}

// --- EVENT LISTENERS (Reemplazan a los onclick/onchange del HTML) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Botón de colapsar/expandir el panel
    document.getElementById('toggle-button').addEventListener('click', togglePanel);

    // 2. Checkboxes para activar/desactivar capas
    document.querySelectorAll('.layer-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const layerName = e.target.dataset.layer;
            const isChecked = e.target.checked;
            toggleLayer(layerName, isChecked);
        });
    });

    // 3. Sliders de opacidad ('input' permite ver el cambio en tiempo real al arrastrar)
    document.querySelectorAll('.opacity-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const layerName = e.target.dataset.layer;
            const opacityValue = e.target.value;
            setOpacity(layerName, opacityValue);
        });
    });
});