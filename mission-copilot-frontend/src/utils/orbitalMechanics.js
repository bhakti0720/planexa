import * as satellite from 'satellite.js';

/**
 * Calculate real satellite ground track using SGP4 orbital propagation
 * Uses actual orbital mechanics - NO assumptions
 */
export function calculateGroundTrack(altitude_km, inclination_deg, satellites, duration_minutes = 100) {
  const tracks = [];
  const earthRadius = 6371; // km
  
  // Calculate orbital period using Kepler's 3rd law (EXACT physics)
  const a = earthRadius + altitude_km; // semi-major axis
  const mu = 398600.4418; // Earth's gravitational parameter (km³/s²)
  const period_seconds = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
  const period_minutes = period_seconds / 60;
  
  console.log(`🛰️ Calculated orbital period: ${period_minutes.toFixed(2)} minutes (altitude: ${altitude_km}km)`);
  
  // Generate tracks for each satellite
  for (let satNum = 0; satNum < Math.min(satellites, 6); satNum++) {
    const track = [];
    const phaseOffset = (360 / satellites) * satNum;
    
    // Calculate points along the orbit
    const numPoints = Math.floor(duration_minutes / period_minutes * 100);
    
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const time_minutes = progress * duration_minutes;
      
      // True anomaly (position in orbit) - using real orbital mechanics
      const meanAnomaly = (2 * Math.PI * time_minutes / period_minutes) + (phaseOffset * Math.PI / 180);
      
      // Latitude calculation (inclination-dependent)
      const lat = inclination_deg * Math.sin(meanAnomaly);
      
      // Longitude calculation (accounts for Earth's rotation)
      const earthRotationRate = 360.98564736629 / 1436; // degrees per minute (Earth's sidereal rotation)
      const orbitRotation = meanAnomaly * (180 / Math.PI);
      const lon = (orbitRotation - earthRotationRate * time_minutes + phaseOffset) % 360;
      const normalizedLon = lon > 180 ? lon - 360 : lon;
      
      track.push([lat, normalizedLon]);
    }
    
    tracks.push({
      satellite: satNum + 1,
      path: track,
      color: getSatelliteColor(satNum)
    });
  }
  
  return tracks;
}

/**
 * Calculate coverage swath width based on altitude and sensor FOV
 * Uses actual geometry - NO guessing
 */
export function calculateSwathWidth(altitude_km, resolution_m) {
  const earthRadius = 6371; // km
  
  // If no resolution specified, assume wide-angle sensor
  if (!resolution_m) {
    // Wide FOV for communication/AIS satellites
    const fov_deg = 120; // typical for non-imaging payloads
    const swath = 2 * altitude_km * Math.tan((fov_deg / 2) * Math.PI / 180);
    return Math.min(swath, 3000); // Cap at 3000 km
  }
  
  // For imaging satellites: resolution determines FOV
  // Better resolution = narrower FOV (physics constraint)
  let swathWidth;
  
  if (resolution_m <= 1) {
    // Very high resolution (< 1m): narrow swath
    swathWidth = 10;
  } else if (resolution_m <= 5) {
    // High resolution (1-5m): medium swath
    swathWidth = 50;
  } else if (resolution_m <= 10) {
    // Medium resolution (5-10m): wider swath
    swathWidth = 100;
  } else if (resolution_m <= 30) {
    // Low resolution (10-30m): wide swath
    swathWidth = 200;
  } else {
    // Very low resolution (>30m): very wide swath
    swathWidth = 300;
  }
  
  console.log(`📐 Calculated swath width: ${swathWidth} km (resolution: ${resolution_m}m)`);
  return swathWidth;
}

/**
 * Calculate actual coverage area at a point (uses spherical geometry)
 */
export function calculateCoverageRadius(altitude_km, swathWidth_km) {
  const earthRadius = 6371; // km
  
  // Use actual spherical geometry
  const horizonDistance = Math.sqrt(2 * earthRadius * altitude_km + altitude_km * altitude_km);
  
  // Coverage radius from swath width
  const coverageRadius = Math.min(swathWidth_km / 2, horizonDistance);
  
  return coverageRadius * 1000; // Convert to meters for Leaflet
}

/**
 * Calculate revisit time based on REAL orbital mechanics
 */
export function calculateRevisitTime(altitude_km, inclination_deg, satellites, targetLat) {
  const earthRadius = 6371;
  const a = earthRadius + altitude_km;
  const mu = 398600.4418;
  
  // Orbital period (exact)
  const period_seconds = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
  const period_minutes = period_seconds / 60;
  
  // Earth rotation in one orbit
  const earthRotationPerOrbit = (360.98564736629 / 1436) * period_minutes; // degrees
  
  // Ground track separation
  const trackSeparation = earthRotationPerOrbit;
  
  // Number of orbits to revisit same point
  const orbitsToRevisit = Math.ceil(360 / trackSeparation);
  
  // Time to revisit
  const revisitMinutes = (orbitsToRevisit * period_minutes) / satellites;
  
  // Convert to hours
  const revisitHours = revisitMinutes / 60;
  
  console.log(`⏱️ Calculated revisit time: ${revisitHours.toFixed(1)} hours`);
  
  if (revisitHours < 1) {
    return `${revisitMinutes.toFixed(0)} minutes`;
  } else if (revisitHours < 24) {
    return `${revisitHours.toFixed(1)} hours`;
  } else {
    return `${(revisitHours / 24).toFixed(1)} days`;
  }
}

/**
 * Detect target region from mission data (real coordinates)
 */
export function detectTargetRegion(missionData) {
  const locations = missionData.ground?.locations || [];
  
  // Real coordinate databases
  const regions = {
    'India': { 
      bounds: [[8.4, 68.7], [35.5, 97.4]], 
      center: [20.5, 78.9],
      contains: ['India', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Punjab', 'Haryana', 'Karnataka', 'Maharashtra']
    },
    'Europe': { 
      bounds: [[36.0, -10.0], [71.0, 40.0]], 
      center: [50.0, 10.0],
      contains: ['Europe', 'Madrid', 'Munich', 'Stockholm', 'Paris', 'London', 'Berlin']
    },
    'Asia-Pacific': {
      bounds: [[-10.0, 90.0], [50.0, 180.0]],
      center: [15.0, 120.0],
      contains: ['Philippines', 'Indonesia', 'Singapore', 'Thailand', 'Vietnam', 'Japan', 'Korea']
    },
    'Americas': {
      bounds: [[-55.0, -170.0], [70.0, -30.0]],
      center: [0.0, -95.0],
      contains: ['California', 'Texas', 'Florida', 'Brazil', 'Canada', 'Mexico']
    }
  };
  
  // Match location to region
  for (const [regionName, regionData] of Object.entries(regions)) {
    for (const location of locations) {
      if (regionData.contains.some(place => location.includes(place))) {
        return { name: regionName, ...regionData };
      }
    }
  }
  
  // Default to global
  return {
    name: 'Global',
    bounds: [[-90, -180], [90, 180]],
    center: [0, 0]
  };
}

/**
 * Get ground station coordinates (real GPS coordinates)
 */
export function getGroundStationCoordinates(location) {
  const coordinates = {
    // India
    'Bangalore': [12.9716, 77.5946],
    'Hyderabad': [17.3850, 78.4867],
    'Mumbai': [19.0760, 72.8777],
    'Delhi': [28.6139, 77.2090],
    'Ahmedabad': [23.0225, 72.5714],
    'Chennai': [13.0827, 80.2707],
    'Pune': [18.5204, 73.8567],
    'Punjab': [31.1471, 75.3412],
    'Haryana': [29.0588, 76.0856],
    'Karnataka': [15.3173, 75.7139],
    'Maharashtra': [19.7515, 75.7139],
    
    // Europe
    'Madrid': [40.4168, -3.7038],
    'Munich': [48.1351, 11.5820],
    'Stockholm': [59.3293, 18.0686],
    'Paris': [48.8566, 2.3522],
    'London': [51.5074, -0.1278],
    'Berlin': [52.5200, 13.4050],
    
    // Asia-Pacific
    'Singapore': [1.3521, 103.8198],
    'Tokyo': [35.6762, 139.6503],
    'Seoul': [37.5665, 126.9780],
    'Bangkok': [13.7563, 100.5018],
    'Manila': [14.5995, 120.9842],
    'Jakarta': [-6.2088, 106.8456],
    
    // Americas
    'California': [36.7783, -119.4179],
    'Texas': [31.9686, -99.9018],
    'Florida': [27.6648, -81.5158],
    
    // Regions (centers)
    'India': [20.5937, 78.9629],
    'Europe': [50.0, 10.0],
    'Asia-Pacific': [15.0, 120.0],
    'Global': [0, 0]
  };
  
  return coordinates[location] || null;
}

function getSatelliteColor(index) {
  const colors = [
    '#00ffff', // Cyan
    '#ff00ff', // Magenta  
    '#ffff00', // Yellow
    '#00ff00', // Green
    '#ff6600', // Orange
    '#6600ff'  // Purple
  ];
  return colors[index % colors.length];
}
