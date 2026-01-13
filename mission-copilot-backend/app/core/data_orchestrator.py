import requests
import pandas as pd
from typing import Dict, List
from skyfield.api import load, EarthSatellite, wgs84
from app.core.config import settings

async def fetch_celestrak_tle(category: str = "starlink") -> List[Dict]:
    """Fetch live TLE from Celestrak"""
    url = f"https://celestrak.com/NORAD/elements/{category}/supplemental/supplemental.txt"
    
    try:
        resp = requests.get(url, timeout=10)
        lines = resp.text.strip().split('\n')
        
        satellites = []
        for i in range(0, len(lines), 3):
            if i + 2 < len(lines):
                name = lines[i].strip()
                tle1 = lines[i+1].strip()
                tle2 = lines[i+2].strip()
                
                satellites.append({
                    "name": name,
                    "tle_line1": tle1,
                    "tle_line2": tle2,
                    "category": category
                })
        
        return satellites[:10]  # Top 10
        
    except Exception as e:
        print(f"Celestrak error: {e}")
        return []

def parse_tle_to_position(tle_data: Dict) -> Dict:
    """Convert TLE to current position"""
    ts = load.timescale()
    satellite = EarthSatellite(tle_data["tle_line1"], tle_data["tle_line2"], tle_data["name"], ts)
    now = ts.now()
    
    geocentric = satellite.at(now)
    subpoint = wgs84.subpoint(geocentric)
    
    return {
        "lat": subpoint.latitude.degrees,
        "lon": subpoint.longitude.degrees,
        "alt": subpoint.elevation.km,
        "name": tle_data["name"]
    }

def calculate_coverage(satellites: List[Dict], region: str = "India") -> Dict:
    """Simple coverage score (extend later)"""
    if not satellites:
        return {"percentage": 0, "optimal": []}
    
    # India bounding box
    india_bbox = [68.7, 97.4, 8.1, 37.6]  # lon_min, lon_max, lat_min, lat_max
    
    visible = sum(1 for s in satellites if 68.7 <= s.get('lon', 0) <= 97.4 and 8.1 <= s.get('lat', 0) <= 37.6)
    
    return {
        "percentage": min(95, (visible / len(satellites)) * 100),
        "optimal": [s["name"] for s in satellites[:3]],
        "total_available": len(satellites)
    }
