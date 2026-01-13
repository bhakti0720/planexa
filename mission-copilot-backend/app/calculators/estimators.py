from app.schemas.mission import OrbitInfo, ConstellationInfo, DataInfo, GroundInfo


def estimate_orbit(mission_type: str = "earth_observation") -> OrbitInfo:
    return OrbitInfo(
        type="Sun-Synchronous Orbit",
        altitude_km=550.0,
        inclination_deg=97.0,
        period_minutes=95.0,
    )


def estimate_constellation(orbit_period: float = 95.0) -> ConstellationInfo:
    sats = 3
    return ConstellationInfo(
        satellites=sats,
        configuration="Walker",
        phasing_deg=360.0 / sats,
        coverage_note=f"{sats} satellites for daily coverage",
    )


def estimate_data() -> DataInfo:
    return DataInfo(
        daily_volume_GB=10.5,
        passes_per_day=4,
        required_downlink_Mbps=50.0,
    )


def estimate_ground(data_volume_gb: float = 10.5) -> GroundInfo:
    return GroundInfo(
        passes_per_day=4,
        stations_needed=2,
        avg_pass_duration_min=8.0,
    )
