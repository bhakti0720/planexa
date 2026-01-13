from fastapi import APIRouter
from app.schemas.mission import ChatRequest, MissionConceptResponse, LiveDataSource
from app.calculators.estimators import (
    estimate_orbit, estimate_constellation, estimate_data, estimate_ground
)
from app.core.llm_orchestrator import extract_mission_params
from app.core.data_orchestrator import fetch_celestrak_tle, calculate_coverage  # ← NEW

router = APIRouter()

@router.post("/chat", response_model=MissionConceptResponse)
async def chat_endpoint(request: ChatRequest) -> MissionConceptResponse:
    # 1. LLM extracts parameters
    params = extract_mission_params(request.message)
    
    # 2. Your existing estimators
    orbit = estimate_orbit(params["mission_type"])
    constellation = estimate_constellation(orbit.period_minutes)
    data_info = estimate_data()
    ground = estimate_ground(data_info.daily_volume_GB)
    
    # 3. NEW: Live satellite data
    satellites = await fetch_celestrak_tle("active")
    coverage = calculate_coverage(satellites, params.get("region", "global"))
    
    summary = (
        f"Analyzed: {params['mission_type']} mission at {params['revisit_hours']}h revisit. "
        f"Coverage: {coverage['percentage']:.1f}% from {len(satellites)} live satellites."
    )
    
    return MissionConceptResponse(
        summary=summary,
        orbit=orbit,
        constellation=constellation,
        data=data_info,
        ground=ground,
        live_data_sources=[
            LiveDataSource(name="gemini_extractor", status="success", note=f"Parsed: {params}"),
            LiveDataSource(name="celestrak_tle", status="success", note=f"{len(satellites)} satellites"),
            LiveDataSource(name="coverage_sim", status="success", note=f"{coverage['percentage']:.1f}% coverage"),
        ],
    )
