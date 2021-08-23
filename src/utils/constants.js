export const seasonNames = ["sowing", "peak", "harvesting"]

export const districtList = {
  "upload": "Upload boundary file (shp)",
  "MORANG": "MORANG",
  "SUNSARI": "SUNSARI",
  "JHAPA": "JHAPA",
  "MAHOTTARI": "MAHOTTARI",
  "PARSA": "PARSA",
  "RAUTAHAT": "RAUTAHAT",
  "SAPTARI": "SAPTARI",
  "SARLAHI": "SARLAHI",
  "SIRAHA": "SIRAHA",
  "BARA": "BARA",
  "DHANUSHA": "DHANUSHA",
  "CHITAWAN": "CHITAWAN",
  "NAWALPARASI_E": "NAWALPARASI_E",
  "KAPILBASTU": "KAPILBASTU",
  "NAWALPARASI_W": "NAWALPARASI_W",
  "RUPANDEHI": "RUPANDEHI",
  "BANKE": "BANKE",
  "BARDIYA": "BARDIYA",
  "DANG": "DANG",
  "KAILALI": "KAILALI",
  "KANCHANPUR": "KANCHANPUR",
};

export const dataList = {
  radar: {
    "COPERNICUS/S1_GRD":
      "Sentinel-1 SAR GRD: C-band Synthetic Aperture Radar Ground Range Detected, log scaling",
  },
  optical: {
    "MODIS/006/MOD13Q1":
      "MOD13Q1.006 Terra Vegetation Indices 16-Day Global 250m",
    "LANDSAT/LT05/C01/T1_TOA":
      "USGS Landsat 5 TM Collection 1 Tier 1 TOA Reflectance",
    "LANDSAT/LT05/C01/T1_SR": "USGS Landsat 5 Surface Reflectance Tier 1",
    "LANDSAT/LC08/C01/T1_TOA":
      "USGS Landsat 8 Collection 1 Tier 1 TOA Reflectance",
    "COPERNICUS/S2": "Sentinel-2 MSI: MultiSpectral Instrument, Level-1C",
    "COPERNICUS/S2_SR": "Sentinel-2 MSI: MultiSpectral Instrument, Level-2A",
  },
};

export const featureList = {
  radar: {
    VH: "VH band",
    VV: "VV band",
    "VH/VV": "VH/VV (cross ratio)",
  },
  optical: {
    NDVI: "NDVI",
    EVI: "EVI",
    NDWI: "NDWI",
    MNDWI: "MNDWI",
  },
};



export const BASEMAPS = {
  "Google Maps": {
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "Google"
  },
  "Google Satellite": {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: "Google"
  },
  "Google Terrain": {
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    attribution: "Google",
  },
  "ESRI World Imagery": {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
}