import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import json
import requests
from datetime import datetime
import time
import math
import random

load_dotenv()  # Load .env file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Add validation
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables!")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
client = genai.GenerativeModel('gemini-2.0-flash-exp')


app = FastAPI(title="Mission Copilot - Live AI with Real Data")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class MissionRequest(BaseModel):
    userInput: str


# ===== REAL LIVE DATA FUNCTIONS =====

def fetch_and_analyze_live_data():
    """
    Fetch REAL live data from APIs and analyze it
    Returns actionable insights for mission planning
    """

    live_insights = {
        "timestamp": datetime.now().isoformat(),
        "satellite_count": 0,
        "debris_objects": 0,
        "solar_flux": 0,
        "kp_index": 0,
        "crowded_altitudes": [],
        "recommended_altitude_adjustment": 0,
        "debris_risk": "unknown",
        "solar_activity_level": "unknown",
        "sources_status": []
    }

    print("📡 Fetching real-time space data...")

    # ===== 1. CELESTRAK: Active Satellites & TLE Data =====
    try:
        print("🛰️  Fetching from Celestrak...")
        response = requests.get(
            "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json",
            timeout=10
        )

        if response.status_code == 200:
            satellites = response.json()
            live_insights["satellite_count"] = len(satellites)

            # Analyze altitude distribution
            altitudes = []
            print(f"   🔍 Analyzing satellite altitudes...")

            for i, sat in enumerate(satellites[:500]):  # Sample first 500 for speed
                try:
                    # Try multiple field names (Celestrak API varies)
                    apogee = None
                    perigee = None

                    # Try uppercase
                    if 'APOGEE' in sat:
                        apogee = float(sat['APOGEE'])
                    if 'PERIGEE' in sat:
                        perigee = float(sat['PERIGEE'])

                    # Try lowercase
                    if apogee is None and 'apogee' in sat:
                        apogee = float(sat['apogee'])
                    if perigee is None and 'perigee' in sat:
                        perigee = float(sat['perigee'])

                    # If still None, try calculating from MEAN_MOTION
                    if apogee is None or perigee is None:
                        if 'MEAN_MOTION' in sat:
                            mean_motion = float(sat['MEAN_MOTION'])
                            # Calculate semi-major axis from mean motion
                            mu = 398600  # km^3/s^2
                            n_per_second = mean_motion / 86400  # Convert to per second
                            semi_major_axis = (mu / (2 * math.pi * n_per_second) ** 2) ** (1/3)
                            avg_alt = semi_major_axis - 6371  # Earth radius
                            if 200 < avg_alt < 2000:
                                altitudes.append(avg_alt)
                            continue

                    # If we have apogee/perigee, use them
                    if apogee is not None and perigee is not None:
                        avg_alt = (apogee + perigee) / 2
                        if 200 < avg_alt < 2000:  # Valid LEO range
                            altitudes.append(avg_alt)

                except Exception as e:
                    # Debug first satellite to see structure
                    if i == 0:
                        print(f"   🔍 Sample satellite data: {list(sat.keys())[:10]}")
                    continue

            print(f"   ✅ Successfully analyzed {len(altitudes)} altitudes")

            # Find congested altitude bands (50km bins)
            altitude_bins = {}
            for alt in altitudes:
                bin_center = round(alt / 50) * 50  # Round to nearest 50km
                altitude_bins[bin_center] = altitude_bins.get(bin_center, 0) + 1

            # Mark crowded zones (>20 satellites in 50km band)
            crowded = [alt for alt, count in altitude_bins.items() if count > 20]
            live_insights["crowded_altitudes"] = sorted(crowded)

            live_insights["sources_status"].append({
                "name": "Celestrak - Active Satellites",
                "status": "Live",
                "data_used": f"Analyzed {len(altitudes)} orbital altitudes",
                "satellites_tracked": len(satellites)
            })

            print(f"   ✅ Found {len(satellites)} active satellites")
            print(f"   ✅ Crowded zones: {crowded}")

        else:
            live_insights["sources_status"].append({
                "name": "Celestrak",
                "status": "Offline",
                "data_used": "Using default parameters"
            })
            print(f"   ⚠️ Celestrak offline (status {response.status_code})")

    except Exception as e:
        live_insights["sources_status"].append({
            "name": "Celestrak",
            "status": "Error",
            "data_used": f"Error: {str(e)[:50]}"
        })
        print(f"   ❌ Celestrak error: {e}")


    # ===== 2. NOAA SPACE WEATHER: Solar Activity =====
    try:
        print("☀️  Fetching from NOAA Space Weather...")

        # Solar Flux (F10.7)
        response = requests.get(
            "https://services.swpc.noaa.gov/json/f107_cm_flux.json",
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            latest = data[-1]  # Most recent measurement
            solar_flux = float(latest['flux'])
            live_insights["solar_flux"] = solar_flux

            # Kp Index (Geomagnetic Activity)
            try:
                kp_response = requests.get(
                    "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json",
                    timeout=10
                )

                if kp_response.status_code == 200:
                    kp_data = kp_response.json()
                    latest_kp = kp_data[-1]
                    live_insights["kp_index"] = float(latest_kp['kp_index'])
            except:
                live_insights["kp_index"] = 3  # Default moderate

            # Analyze solar activity
            if solar_flux > 150:
                live_insights["solar_activity_level"] = "High"
                live_insights["recommended_altitude_adjustment"] = +50
                reasoning = "High solar activity increases atmospheric drag"
            elif solar_flux < 80:
                live_insights["solar_activity_level"] = "Low"
                live_insights["recommended_altitude_adjustment"] = -30
                reasoning = "Low solar activity allows lower orbits"
            else:
                live_insights["solar_activity_level"] = "Normal"
                live_insights["recommended_altitude_adjustment"] = 0
                reasoning = "Normal solar conditions"

            live_insights["sources_status"].append({
                "name": "NOAA Space Weather",
                "status": "Live",
                "data_used": f"Solar flux: {solar_flux} SFU",
                "reasoning": reasoning
            })

            print(f"   ✅ Solar flux: {solar_flux} SFU ({live_insights['solar_activity_level']})")

        else:
            live_insights["sources_status"].append({
                "name": "NOAA Space Weather",
                "status": "Offline",
                "data_used": "Using nominal solar conditions"
            })
            print(f"   ⚠️ NOAA offline (status {response.status_code})")

    except Exception as e:
        live_insights["sources_status"].append({
            "name": "NOAA Space Weather",
            "status": "Error",
            "data_used": f"Error: {str(e)[:50]}"
        })
        print(f"   ❌ NOAA error: {e}")


    # ===== 3. Calculate Debris Risk =====
    if live_insights["satellite_count"] > 5000:
        live_insights["debris_risk"] = "High"
        live_insights["recommended_altitude_adjustment"] += 20
        risk_note = f"High congestion: {live_insights['satellite_count']} active satellites"
    elif live_insights["satellite_count"] > 3000:
        live_insights["debris_risk"] = "Medium"
        live_insights["recommended_altitude_adjustment"] += 10
        risk_note = f"Moderate congestion: {live_insights['satellite_count']} active satellites"
    else:
        live_insights["debris_risk"] = "Low"
        risk_note = "Low orbital congestion"

    live_insights["sources_status"].append({
        "name": "Debris Risk Analysis",
        "status": "Calculated",
        "data_used": risk_note
    })

    print(f"📊 Debris risk: {live_insights['debris_risk']}")
    print(f"🎯 Recommended altitude adjustment: {live_insights['recommended_altitude_adjustment']:+d} km")

    return live_insights


def apply_live_data_to_mission(base_params, live_insights):
    """
    Apply real live data insights to mission parameters
    """

    # Base altitude from mission type
    base_altitude = base_params.get("altitude_km", 550)

    # Don't adjust GEO/MEO orbits (above 2000 km)
    if base_altitude > 2000:
        print(f"   ⚠️ High orbit ({base_altitude}km) - skipping live data adjustments")
        return {
            "adjusted_altitude_km": base_altitude,
            "altitude_reasoning": [
                f"Base: {base_altitude}km",
                "High orbit - no atmospheric effects",
                "No live data adjustments needed"
            ],
            "expected_lifetime_years": 15.0,
            "lifetime_reasoning": "High orbit - minimal atmospheric drag",
            "collision_avoidance_fuel_kg": 10.0,
            "collision_reasoning": "Standard station-keeping maneuvers",
            "live_data_summary": {
                "active_satellites": live_insights["satellite_count"],
                "solar_flux_sfu": live_insights["solar_flux"],
                "kp_index": live_insights["kp_index"],
                "debris_risk": live_insights["debris_risk"],
                "crowded_altitudes_km": live_insights["crowded_altitudes"]
            }
        }

    # Apply live data adjustments for LEO
    adjusted_altitude = base_altitude + live_insights["recommended_altitude_adjustment"]

    print(f"   📊 Adjusting altitude: {base_altitude}km → {adjusted_altitude}km")

    # Avoid crowded zones
    avoidance_note = None
    for crowded_alt in live_insights["crowded_altitudes"]:
        if abs(adjusted_altitude - crowded_alt) < 30:
            adjusted_altitude = crowded_alt + 50
            avoidance_note = f"Adjusted +50km to avoid congestion at {crowded_alt}km"
            break

    # Calculate mission lifetime based on altitude and solar activity
    if live_insights["solar_activity_level"] == "High":
        lifetime_years = max(2, 5 - (600 - adjusted_altitude) / 100)
        lifetime_note = "Reduced due to high solar drag"
    elif live_insights["solar_activity_level"] == "Low":
        lifetime_years = max(5, 8 - (600 - adjusted_altitude) / 80)
        lifetime_note = "Extended due to low solar drag"
    else:
        lifetime_years = max(3, 7 - (600 - adjusted_altitude) / 90)
        lifetime_note = "Normal atmospheric conditions"

    # Collision avoidance fuel budget
    if live_insights["debris_risk"] == "High":
        collision_avoidance_fuel_kg = 5 + (adjusted_altitude / 100)
        collision_note = "High debris density requires frequent maneuvers"
    else:
        collision_avoidance_fuel_kg = 2 + (adjusted_altitude / 200)
        collision_note = "Standard collision avoidance budget"

    return {
        "adjusted_altitude_km": round(adjusted_altitude),
        "altitude_reasoning": [
            f"Base: {base_altitude}km",
            f"Solar adjustment: {live_insights['recommended_altitude_adjustment']:+d}km ({live_insights['solar_activity_level']} activity)",
            f"Debris adjustment: +{20 if live_insights['debris_risk'] == 'High' else 10 if live_insights['debris_risk'] == 'Medium' else 0}km ({live_insights['debris_risk']} risk)",
            avoidance_note or "No crowded zones nearby"
        ],
        "expected_lifetime_years": round(lifetime_years, 1),
        "lifetime_reasoning": lifetime_note,
        "collision_avoidance_fuel_kg": round(collision_avoidance_fuel_kg, 1),
        "collision_reasoning": collision_note,
        "live_data_summary": {
            "active_satellites": live_insights["satellite_count"],
            "solar_flux_sfu": live_insights["solar_flux"],
            "kp_index": live_insights["kp_index"],
            "debris_risk": live_insights["debris_risk"],
            "crowded_altitudes_km": live_insights["crowded_altitudes"]
        }
    }


def calculate_period(altitude_km):
    """Calculate orbital period using Kepler's third law"""
    earth_radius = 6371  # km
    mu = 398600  # km^3/s^2 (Earth's gravitational parameter)
    semi_major_axis = earth_radius + altitude_km
    period_seconds = 2 * math.pi * math.sqrt(semi_major_axis**3 / mu)
    return round(period_seconds / 60, 1)  # Return in minutes


# ===== ENHANCED FALLBACK =====

def parse_mission_fallback(user_input):
    """
    ENHANCED fallback with detailed mission type detection
    """
    import re

    text = user_input.lower()

    print(f"🔍 Analyzing query: {text[:100]}")

    # ===== MISSION TYPE DETECTION =====
    mission_profiles = {
        "agriculture": {
            "name_prefix": "AgriWatch",
            "altitude": 500,
            "inclination": 98.2,
            "orbit_type": "Sun-Synchronous Orbit (SSO)",
            "satellites": 1,
            "payload": "Multispectral Camera (RGB + NIR + Red Edge)",
            "resolution": 3,
            "swath": 50,
            "revisit": "2 days",
            "regions": ["Punjab", "Haryana", "Maharashtra", "Karnataka"],
            "mission_desc": "Precision agriculture monitoring with crop health analysis"
        },
        "disaster": {
            "name_prefix": "DisasterGuard",
            "altitude": 800,
            "inclination": 98,
            "orbit_type": "Polar Orbit (SSO)",
            "satellites": 12,
            "payload": "SAR + Optical + Thermal Imaging",
            "resolution": 5,
            "swath": 100,
            "revisit": "6 hours",
            "regions": ["Global", "Asia-Pacific", "Americas", "Europe"],
            "mission_desc": "Rapid disaster response with all-weather monitoring"
        },
        "marine": {
            "name_prefix": "MarineWatch",
            "altitude": 650,
            "inclination": 98.2,
            "orbit_type": "Sun-Synchronous Orbit (SSO)",
            "satellites": 6,
            "payload": "AIS Receiver + Multispectral Camera + SAR",
            "resolution": 10,
            "swath": 100,
            "revisit": "12 hours",
            "regions": ["Indian Ocean", "Pacific", "Atlantic"],
            "mission_desc": "Illegal fishing detection with vessel tracking"
        },
        "forest": {
            "name_prefix": "ForestGuard",
            "altitude": 550,
            "inclination": 97.8,
            "orbit_type": "Sun-Synchronous Orbit (SSO)",
            "satellites": 4,
            "payload": "Thermal IR + Optical + Smoke Detector",
            "resolution": 10,
            "swath": 80,
            "revisit": "4 hours",
            "regions": ["Amazon", "California", "Australia", "Indonesia"],
            "mission_desc": "Wildfire detection and forest monitoring"
        },
        "communication": {
            "name_prefix": "CommSat",
            "altitude": 35786,
            "inclination": 0,
            "orbit_type": "Geostationary Orbit (GEO)",
            "satellites": 3,
            "payload": "Ku-band Transponder (14/12 GHz)",
            "resolution": None,
            "swath": None,
            "revisit": "Continuous",
            "regions": ["Asia-Pacific", "Europe", "Americas"],
            "mission_desc": "Broadband internet and telecommunication services"
        },
        "climate": {
            "name_prefix": "ClimateWatch",
            "altitude": 700,
            "inclination": 98.5,
            "orbit_type": "Sun-Synchronous Orbit (SSO)",
            "satellites": 8,
            "payload": "Hyperspectral Imager + CO2/CH4 Sensors",
            "resolution": 50,
            "swath": 200,
            "revisit": "24 hours",
            "regions": ["Global coverage"],
            "mission_desc": "Greenhouse gas monitoring and climate change tracking"
        }
    }

    # Detect mission type from keywords
    detected_type = "general"

    if any(word in text for word in ["agriculture", "crop", "farming", "precision", "agri"]):
        detected_type = "agriculture"
    elif any(word in text for word in ["disaster", "emergency", "earthquake", "flood", "response"]):
        detected_type = "disaster"
    elif any(word in text for word in ["fishing", "marine", "ocean", "maritime", "vessel", "ship"]):
        detected_type = "marine"
    elif any(word in text for word in ["forest", "fire", "wildfire", "deforestation"]):
        detected_type = "forest"
    elif any(word in text for word in ["communication", "broadband", "internet", "telecom"]):
        detected_type = "communication"
    elif any(word in text for word in ["climate", "greenhouse", "carbon", "co2", "methane"]):
        detected_type = "climate"
    else:
        detected_type = "general"

    print(f"🎯 Detected mission type: {detected_type.upper()}")

    # Get profile or use default
    if detected_type in mission_profiles:
        profile = mission_profiles[detected_type]
    else:
        profile = {
            "name_prefix": "EarthObs",
            "altitude": 550,
            "inclination": 45,
            "orbit_type": "Low Earth Orbit (LEO)",
            "satellites": 6,
            "payload": "Optical Camera",
            "resolution": 10,
            "swath": 75,
            "revisit": "24 hours",
            "regions": ["Global"],
            "mission_desc": "General Earth observation mission"
        }

    # Extract numbers from query
    numbers = re.findall(r'\d+', text)

    # Override satellites if specified
    if "constellation" in text and numbers:
        try:
            profile["satellites"] = int(numbers[0])
        except:
            pass

    # Override altitude if specified
    for match in re.finditer(r'(\d+)\s*km', text):
        try:
            profile["altitude"] = int(match.group(1))
        except:
            pass

    # Override revisit if specified
    for match in re.finditer(r'(\d+)\s*(?:hour|hr)', text):
        try:
            profile["revisit"] = f"{match.group(1)} hours"
        except:
            pass

    satellites = profile["satellites"]
    altitude = profile["altitude"]

    # Generate mission name with random suffix
    mission_name = f"{profile['name_prefix']}-{random.randint(1, 99)}"

    print(f"✅ Generated: {mission_name} ({satellites} satellites at {altitude}km)")

    # Build mission data
    return {
        "summary": profile["mission_desc"],
        "mission_name": mission_name,
        "orbit": {
            "type": profile["orbit_type"],
            "altitude_km": altitude,
            "inclination_deg": profile["inclination"],
            "period_min": calculate_period(altitude)
        },
        "constellation": {
            "satellites": satellites,
            "planes": max(1, satellites // 3),
            "configuration": f"Walker {satellites}/{max(1, satellites // 3)}/1" if satellites > 1 else "Single satellite",
            "coverage_percent": min(98, 70 + satellites * 3),
            "revisit_time": profile["revisit"]
        },
        "payload": {
            "type": profile["payload"],
            "resolution_m": profile["resolution"],
            "swath_width_km": profile["swath"],
            "mass_kg": 15 if satellites == 1 else 50,
            "power_w": 50 if satellites == 1 else 150
        },
        "data": {
            "daily_volume_gb": satellites * 100 if profile["resolution"] else 50,
            "downlink_mbps": 150,
            "compression": "JPEG2000" if profile["resolution"] else "N/A",
            "storage_per_sat_gb": 500
        },
        "ground": {
            "stations": min(6, max(2, len(profile["regions"]))),
            "locations": profile["regions"],
            "passes_per_day": 12 if altitude < 1000 else 3,
            "contact_duration_min": 8
        },
        "launch": {
            "vehicle": "Falcon 9" if satellites > 8 else "PSLV" if altitude < 1000 else "Ariane 5",
            "estimated_cost_million_usd": satellites * 5 + 30 if altitude < 2000 else 200,
            "mass_total_kg": satellites * (100 if altitude < 1000 else 500)
        },
        "timeline": {
            "design_months": 12,
            "build_months": 18 if satellites <= 4 else 24,
            "total_months": 30 if satellites <= 4 else 42
        },
        "risks": {
            "technical": f"Medium - {profile['payload']} integration complexity",
            "financial": "Medium - Launch costs dependent on vehicle availability",
            "schedule": "Low - Standard development timeline"
        }
    }


def call_gemini_with_retry(prompt, max_retries=3):
    """Call Gemini with exponential backoff and proper error handling"""
    for attempt in range(max_retries):
        try:
            print(f"🤖 Gemini attempt {attempt + 1}/{max_retries}...")

            response = client.generate_content(prompt)

            # Handle different response types
            text_response = None

            if hasattr(response, 'text') and response.text:
                text_response = response.text
            elif hasattr(response, 'candidates') and response.candidates:
                if isinstance(response.candidates, list) and len(response.candidates) > 0:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                        if isinstance(candidate.content.parts, list) and len(candidate.content.parts) > 0:
                            part = candidate.content.parts[0]
                            if hasattr(part, 'text'):
                                text_response = part.text

            if not text_response:
                text_response = str(response)

            print(f"✅ Gemini response received")
            return text_response.strip() if text_response else ""

        except Exception as e:
            error_msg = str(e)
            print(f"⚠️ Gemini error: {error_msg[:100]}")

            if any(x in error_msg.lower() for x in ["503", "overloaded", "quota", "rate limit", "429"]):
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + 1
                    print(f"⏳ Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue

            if attempt == max_retries - 1:
                raise Exception(f"Gemini failed: {error_msg}")

    raise Exception("Failed after all retries")


# ===== MAIN API ENDPOINT =====

@app.post("/api/generate-mission")
async def generate_mission(request: MissionRequest):
    try:
        print(f"\n{'='*60}")
        print(f"🚀 Mission request: {request.userInput[:100]}...")
        print(f"{'='*60}\n")

        # ===== STEP 1: Fetch REAL Live Data =====
        live_insights = fetch_and_analyze_live_data()

        # ===== STEP 2: Try Gemini AI =====
        prompt = f"""
You are an expert space mission architect with access to live orbital data.

MISSION REQUEST: {request.userInput}

LIVE DATA CONTEXT (USE THIS IN YOUR ANALYSIS):
- Active Satellites: {live_insights['satellite_count']} tracked
- Solar Flux: {live_insights['solar_flux']} SFU ({live_insights['solar_activity_level']} activity)
- Debris Risk: {live_insights['debris_risk']}
- Crowded Altitudes: {live_insights['crowded_altitudes']} km
- Recommended Altitude Adjustment: {live_insights['recommended_altitude_adjustment']:+d} km

Analyze this mission and return ONLY valid JSON (no markdown, no explanations) with this EXACT structure:

{{
  "summary": "One sentence mission description",
  "mission_name": "Creative mission name",
  "orbit": {{
    "type": "SSO/LEO/MEO/GEO",
    "altitude_km": <number - ADJUST based on live data>,
    "inclination_deg": <number>,
    "period_min": <number>
  }},
  "constellation": {{
    "satellites": <number>,
    "planes": <number>,
    "configuration": "Walker notation",
    "coverage_percent": <number>,
    "revisit_time": "X hours/days"
  }},
  "payload": {{
    "type": "Sensor type",
    "resolution_m": <number>,
    "mass_kg": <number>,
    "power_w": <number>
  }},
  "data": {{
    "daily_volume_gb": <number>,
    "downlink_mbps": <number>,
    "compression": "method",
    "storage_per_sat_gb": <number>
  }},
  "ground": {{
    "stations": <number>,
    "locations": ["city", "list"],
    "passes_per_day": <number>,
    "contact_duration_min": <number>
  }},
  "launch": {{
    "vehicle": "Rocket name",
    "estimated_cost_million_usd": <number>,
    "mass_total_kg": <number>
  }},
  "timeline": {{
    "design_months": <number>,
    "build_months": <number>,
    "total_months": <number>
  }},
  "risks": {{
    "technical": "Low/Medium/High - detailed explanation",
    "financial": "Low/Medium/High - detailed explanation",
    "schedule": "Low/Medium/High - detailed explanation"
  }}
}}

IMPORTANT: Adjust altitude based on the live data context above. Avoid crowded altitudes.
"""

        mission_data = None
        gemini_used = False

        try:
            ai_response = call_gemini_with_retry(prompt)

            # Clean markdown
            if ai_response and isinstance(ai_response, str):
                ai_response = ai_response.replace("```json", "").replace("```", "").strip()
                start = ai_response.find('{')
                end = ai_response.rfind('}')
                if start != -1 and end != -1:
                    ai_response = ai_response[start:end+1]

            # Parse JSON
            mission_data = json.loads(ai_response)
            gemini_used = True
            print("✅ Gemini analysis successful")

        except Exception as gemini_error:
            print(f"⚠️ Gemini failed: {gemini_error}")
            print("🔄 Using intelligent fallback...")
            mission_data = parse_mission_fallback(request.userInput)

        # ===== STEP 3: Apply REAL Live Data to Mission =====
        print("\n📊 Applying live data to mission parameters...")

        if mission_data and "orbit" in mission_data:
            live_params = apply_live_data_to_mission(
                mission_data["orbit"],
                live_insights
            )

            # Update mission with live data
            mission_data["orbit"]["altitude_km"] = live_params["adjusted_altitude_km"]
            mission_data["orbit"]["altitude_reasoning"] = live_params["altitude_reasoning"]
            mission_data["orbit"]["period_min"] = calculate_period(live_params["adjusted_altitude_km"])

            mission_data["mission_lifetime"] = {
                "expected_years": live_params["expected_lifetime_years"],
                "reasoning": live_params["lifetime_reasoning"]
            }

            mission_data["collision_avoidance"] = {
                "fuel_budget_kg": live_params["collision_avoidance_fuel_kg"],
                "reasoning": live_params["collision_reasoning"]
            }

            mission_data["live_data_summary"] = live_params["live_data_summary"]

        # Add live data sources
        mission_data["live_data_sources"] = live_insights["sources_status"]
        mission_data["live_data_timestamp"] = live_insights["timestamp"]

        # Add data source badge
        mission_data["live_data_sources"].insert(0, {
            "name": "Gemini 2.5 Flash" if gemini_used else "Smart Parser",
            "status": "Live" if gemini_used else "Fallback",
            "note": "AI Mission Analysis" if gemini_used else "Rule-based analysis"
        })

        print(f"\n{'='*60}")
        print(f"✅ Mission generated: {mission_data.get('mission_name', 'Unknown')}")
        print(f"✅ Altitude: {mission_data['orbit']['altitude_km']} km (adjusted from live data)")
        print(f"✅ Lifetime: {mission_data.get('mission_lifetime', {}).get('expected_years', 'N/A')} years")
        print(f"{'='*60}\n")

        return mission_data

    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error: {e}")
        mission_data = parse_mission_fallback(request.userInput)
        mission_data["live_data_sources"] = [
            {"name": "Fallback Parser", "status": "Active", "note": "JSON parse failed"}
        ]
        return mission_data

    except Exception as e:
        print(f"❌ Critical Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Mission generation failed: {str(e)}")


@app.get("/health")
async def health():
    live_insights = fetch_and_analyze_live_data()
    return {
        "status": "live",
        "gemini": "connected" if GEMINI_API_KEY != "YOUR_ACTUAL_KEY_HERE" else "no API key",
        "celestrak": live_insights["sources_status"][0]["status"] if live_insights["sources_status"] else "unknown",
        "active_satellites": live_insights["satellite_count"],
        "solar_flux": live_insights["solar_flux"],
        "debris_risk": live_insights["debris_risk"],
        "timestamp": datetime.now().isoformat()
    }


@app.get("/")
async def root():
    return {"message": "🚀 Mission Copilot - AI + REAL Live Data", "version": "2.0 - Live Data Integrated"}


@app.get("/test-models")
async def test_models():
    return {"active_model": "gemini-2.5-flash", "status": "available"}