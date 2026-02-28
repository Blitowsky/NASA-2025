// Inicializar mapa (centrado en Argentina)
const map = L.map('map').setView([-34.6, -58.4], 5);

// Definición de las tres capas base
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    attribution: '© OpenStreetMap contributors' 
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles &copy; Esri' 
});

const reliefLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles &copy; Esri &mdash; Fuente: Esri, USGS, NGA, NASA' 
});

// Añadir la vista de calles (OSM) como predeterminada al cargar
osmLayer.addTo(map);

// Agrupar las capas para el control
const baseLayers = {
    "OpenStreetMap (Calles)": osmLayer,
    "Satelital": satelliteLayer,
    "Topográfico": reliefLayer
};

// Agregar el control nativo de Leaflet al mapa
L.control.layers(baseLayers).addTo(map);