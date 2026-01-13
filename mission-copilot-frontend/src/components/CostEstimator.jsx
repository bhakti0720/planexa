import { DollarSign, Rocket, Satellite, Radio, Calendar, TrendingUp, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CostEstimator({ missionData }) {
  const [costs, setCosts] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(true);

  useEffect(() => {
    if (missionData) {
      calculateCosts(missionData);
    }
  }, [missionData]);

  const calculateCosts = (data) => {
    // Extract mission parameters
    const satellites = data.constellation?.satellites || 1;
    const altitude = data.orbit?.altitude_km || 550;
    const lifetime = data.mission_lifetime?.expected_years || 5;
    const groundStations = data.ground?.stations || 3;
    const payloadType = data.payload?.type || "Optical Camera";
    const satelliteMass = data.payload?.mass_kg || 50;

    // ===== SATELLITE MANUFACTURING COST =====
    // Base cost: $50,000 per kg for LEO satellites
    // Complexity multiplier based on payload
    let complexityMultiplier = 1.0;
    if (payloadType.includes('SAR')) complexityMultiplier = 2.5;
    else if (payloadType.includes('Multispectral')) complexityMultiplier = 1.5;
    else if (payloadType.includes('Thermal')) complexityMultiplier = 1.8;
    else if (payloadType.includes('Hyperspectral')) complexityMultiplier = 2.2;
    else if (payloadType.includes('AIS')) complexityMultiplier = 1.3;

    const satelliteCostPerUnit = satelliteMass * 50000 * complexityMultiplier;
    const totalSatelliteCost = satelliteCostPerUnit * satellites;

    // Volume discount (>5 satellites get 15% discount)
    const satelliteDiscount = satellites > 5 ? totalSatelliteCost * 0.15 : 0;
    const satelliteCostFinal = totalSatelliteCost - satelliteDiscount;

    // ===== LAUNCH VEHICLE COST =====
    const totalMass = satelliteMass * satellites;
    let launchVehicle = '';
    let launchCost = 0;

    if (altitude > 20000) {
      // GEO orbit - needs powerful rocket
      launchVehicle = 'Ariane 6';
      launchCost = 150000000; // $150M
    } else if (totalMass > 5000) {
      launchVehicle = 'Falcon Heavy';
      launchCost = 97000000; // $97M
    } else if (totalMass > 1000) {
      launchVehicle = 'Falcon 9';
      launchCost = 67000000; // $67M
    } else if (totalMass > 300) {
      launchVehicle = 'PSLV';
      launchCost = 35000000; // $35M
    } else {
      launchVehicle = 'Electron';
      launchCost = 7500000; // $7.5M
    }

    // Rideshare discount for small satellites
    if (totalMass < 500 && satellites <= 4) {
      launchCost = launchCost * 0.3; // 70% discount for rideshare
      launchVehicle += ' (Rideshare)';
    }

    // ===== GROUND STATION COST =====
    // Professional ground station: $2-3M each
    const groundStationCostPerUnit = 2500000;
    const totalGroundCost = groundStationCostPerUnit * groundStations;

    // ===== OPERATIONS COST =====
    // Annual: $2M base + $500k per satellite
    const annualOpsCost = 2000000 + (satellites * 500000);
    const totalOpsCost = annualOpsCost * lifetime;

    // ===== INSURANCE =====
    // Typically 10-15% of satellite + launch cost
    const insuranceCost = (satelliteCostFinal + launchCost) * 0.12;

    // ===== MISSION DESIGN & DEVELOPMENT =====
    // 15% of hardware costs
    const developmentCost = (satelliteCostFinal + totalGroundCost) * 0.15;

    // ===== CONTINGENCY =====
    // Standard 20% buffer
    const subtotal = satelliteCostFinal + launchCost + totalGroundCost +
      totalOpsCost + insuranceCost + developmentCost;
    const contingencyCost = subtotal * 0.20;

    // ===== TOTAL =====
    const totalCost = subtotal + contingencyCost;

    // Calculate percentages
    const breakdown = [
      {
        category: 'Satellite Manufacturing',
        amount: satelliteCostFinal,
        percentage: (satelliteCostFinal / totalCost * 100).toFixed(1),
        icon: Satellite,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        details: `${satellites} satellites × $${(satelliteCostPerUnit / 1000000).toFixed(1)}M`
      },
      {
        category: 'Launch Vehicle',
        amount: launchCost,
        percentage: (launchCost / totalCost * 100).toFixed(1),
        icon: Rocket,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        details: launchVehicle
      },
      {
        category: 'Ground Stations',
        amount: totalGroundCost,
        percentage: (totalGroundCost / totalCost * 100).toFixed(1),
        icon: Radio,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        details: `${groundStations} stations × $${(groundStationCostPerUnit / 1000000).toFixed(1)}M`
      },
      {
        category: 'Operations',
        amount: totalOpsCost,
        percentage: (totalOpsCost / totalCost * 100).toFixed(1),
        icon: Calendar,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        details: `${lifetime} years × $${(annualOpsCost / 1000000).toFixed(1)}M/year`
      },
      {
        category: 'Insurance',
        amount: insuranceCost,
        percentage: (insuranceCost / totalCost * 100).toFixed(1),
        icon: TrendingUp,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        details: '12% of hardware + launch'
      },
      {
        category: 'Development',
        amount: developmentCost,
        percentage: (developmentCost / totalCost * 100).toFixed(1),
        icon: PieChart,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/20',
        details: 'Mission design & integration'
      },
      {
        category: 'Contingency',
        amount: contingencyCost,
        percentage: (contingencyCost / totalCost * 100).toFixed(1),
        icon: DollarSign,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        details: '20% reserve fund'
      }
    ];

    setCosts({
      breakdown,
      total: totalCost,
      subtotal,
      satellites,
      launchVehicle,
      totalMass,
      lifetime,
      discount: satelliteDiscount
    });
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  if (!costs) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-cyan-500/30">
        <p className="text-gray-400 text-center">Generate a mission to see cost estimate</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Cost Header */}
      <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/50 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Mission Cost</p>
            <h2 className="text-4xl font-bold text-white">
              {formatCurrency(costs.total)}
            </h2>
            <p className="text-xs text-cyan-400 mt-2">
              {costs.satellites} satellites • {costs.launchVehicle} • {costs.lifetime} years
            </p>
          </div>
          <div className="text-right">
            <DollarSign className="w-16 h-16 text-cyan-400 opacity-50" />
            {costs.discount > 0 && (
              <p className="text-xs text-green-400 mt-2">
                Saved {formatCurrency(costs.discount)} (volume discount)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Breakdown Button */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full bg-slate-700/50 hover:bg-slate-700 py-2 rounded-lg text-sm text-gray-300 transition-all"
      >
        {showBreakdown ? '▼ Hide Breakdown' : '▶ Show Breakdown'}
      </button>

      {/* Cost Breakdown */}
      {showBreakdown && (
        <div className="space-y-3">
          {costs.breakdown.map((item, index) => (
            <div
              key={index}
              className={`${item.bgColor} rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <item.icon className={`w-5 h-5 ${item.color} mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white">{item.category}</h3>
                      <span className={`text-sm font-medium ${item.color}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{item.details}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">
                        {formatCurrency(item.amount)}
                      </span>
                      {/* Progress bar */}
                      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${item.color.replace('text', 'bg')} transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Subtotal & Total */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-gray-600">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-gray-300 font-medium">{formatCurrency(costs.subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-gray-700 pt-2">
              <span className="text-white font-bold">Total Mission Cost:</span>
              <span className="text-cyan-400 font-bold">{formatCurrency(costs.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cost Per Year */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Cost per year:</span>
          <span className="text-lg font-semibold text-cyan-400">
            {formatCurrency(costs.total / costs.lifetime)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-400">Cost per satellite:</span>
          <span className="text-lg font-semibold text-cyan-400">
            {formatCurrency(costs.total / costs.satellites)}
          </span>
        </div>
      </div>

      {/* Financing Note */}
      <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
        <p className="text-xs text-blue-300">
          <strong>Tip:</strong> Many space agencies and private investors offer financing options.
          Typical payment plans spread costs over 3-5 years with 6-8% annual interest.
        </p>
      </div>
    </div>
  );
}
