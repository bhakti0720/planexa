from typing import Dict, Any  # ← ADD THIS
import json
from app.core.config import settings  # ← ADD THIS

def extract_mission_params(message: str) -> Dict[str, Any]:
    import google.generativeai as genai
    
    genai.configure(api_key=settings.google_api_key)
    
    model = genai.GenerativeModel(
        model_name=settings.gemini_model,
        generation_config={
            "temperature": 0.1,
            "response_mime_type": "application/json",
        }
    )
    
    prompt = f"""
    Extract mission parameters from this user request as JSON only:
    
    User: "{message}"
    
    Return ONLY JSON with these fields:
    {{
      "mission_type": "earth_observation|communication|other",
      "revisit_hours": number (24 for daily),
      "region": "string" (optional),
      "resolution_m": number (5 for medium-res)
    }}
    
    If unclear, use defaults: earth_observation, 24, 5.
    """
    
    try:
        response = model.generate_content(prompt)
        params_text = response.text.strip()
        params = json.loads(params_text)
    except Exception as e:
        print(f"Gemini error: {e}")
        params = {
            "mission_type": "earth_observation",
            "revisit_hours": 24.0,
            "region": "",
            "resolution_m": 5.0
        }
    
    return params
