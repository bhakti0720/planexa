from pydantic import BaseModel
from typing import List


class ChatRequest(BaseModel):
    message: str
    session_id: str = "demo"


class OrbitInfo(BaseModel):
    type: str
    altitude_km: float
    inclination_deg: float
    period_minutes: float


class ConstellationInfo(BaseModel):
    satellites: int
    configuration: str
    phasing_deg: float
    coverage_note: str


class DataInfo(BaseModel):
    daily_volume_GB: float
    passes_per_day: int
    required_downlink_Mbps: float


class GroundInfo(BaseModel):
    passes_per_day: int
    stations_needed: int
    avg_pass_duration_min: float


class LiveDataSource(BaseModel):
    name: str
    status: str
    note: str


class MissionConceptResponse(BaseModel):
    summary: str
    orbit: OrbitInfo
    constellation: ConstellationInfo
    data: DataInfo
    ground: GroundInfo
    live_data_sources: List[LiveDataSource] = []
