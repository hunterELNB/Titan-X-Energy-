
"use client";

import { useEffect, useMemo, useState } from "react";

import FacilityScene3D from "./FacilityScene3D";

type Scene = "refining" | "gas";
type Mode = "normal" | "abnormal" | "degraded";
type Severity = "Critical" | "Warning";
type EquipmentStatus = "Operational" | "Warning" | "Fault" | "Reduced Performance";

type TrendPoint = {
  seconds: number;
  temperature: number;
  pressure: number;
  flow: number;
};

type Alarm = {
  id: string;
  equipment: string;
  severity: Severity;
  message: string;
  cause: string;
  recommendation: string;
  timestamp: string;
};

type AlarmHistoryEntry = Alarm & {
  status: "Active" | "Cleared";
  acknowledged: boolean;
};

const modes: { id: Mode; label: string }[] = [
  { id: "normal", label: "Normal Operation" },
  { id: "degraded", label: "Performance Degradation" },
  { id: "abnormal", label: "Abnormal Operation" },
];

function buildTrendPoints(
  data: TrendPoint[],
  key: "temperature" | "pressure" | "flow"
) {
  if (data.length < 2) return "";

  const values = data.map((point) => point[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 600;
      const y = 90 - ((point[key] - min) / range) * 70;
      return `${x},${y}`;
    })
    .join(" ");
}

function formatTime() {
  return new Date().toLocaleTimeString();
}



type InstrumentGaugeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  precision?: number;
  status?: "normal" | "warning" | "critical";
};

function InstrumentGauge({
  label,
  value,
  min,
  max,
  unit,
  precision = 1,
  status = "normal",
}: InstrumentGaugeProps) {
  const ratio = Math.max(
    0,
    Math.min(1, (value - min) / (max - min))
  );

  const angle = 135 + ratio * 270;
  const radians = (angle * Math.PI) / 180;
  const needleX = 100 + 56 * Math.cos(radians);
  const needleY = 100 + 56 * Math.sin(radians);

  const color =
    status === "critical"
      ? "#ef6464"
      : status === "warning"
        ? "#e5b454"
        : "#55b8c8";

  return (
    <article className={`dt-instrument dt-instrument-${status}`}>
      <div className="dt-instrument-label">{label}</div>

      <svg
        className="dt-gauge-svg"
        viewBox="0 0 200 174"
        role="img"
        aria-label={`${label}: ${value.toFixed(precision)} ${unit}`}
      >
        <path
          d="M 35 135 A 82 82 0 1 1 165 135"
          fill="none"
          stroke="#344655"
          strokeWidth="8"
        />

        <path
          d="M 35 135 A 82 82 0 1 1 165 135"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.85"
        />

        {Array.from({ length: 25 }, (_, index) => {
          const tickAngle = (135 + index * 11.25) * Math.PI / 180;
          const major = index % 4 === 0;

          const x1 = 100 + (major ? 69 : 74) * Math.cos(tickAngle);
          const y1 = 100 + (major ? 69 : 74) * Math.sin(tickAngle);
          const x2 = 100 + 79 * Math.cos(tickAngle);
          const y2 = 100 + 79 * Math.sin(tickAngle);

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={major ? "#c3d0da" : "#718494"}
              strokeWidth={major ? 1.8 : 1}
            />
          );
        })}

        <line
          x1="100"
          y1="100"
          x2={needleX}
          y2={needleY}
          stroke="#edf4f8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <circle cx="100" cy="100" r="6" fill="#dce7ee" />
        <circle cx="100" cy="100" r="2.5" fill="#526778" />

        <text
          x="30"
          y="157"
          fill="#8497a7"
          fontSize="10"
          textAnchor="middle"
        >
          {min}
        </text>

        <text
          x="170"
          y="157"
          fill="#8497a7"
          fontSize="10"
          textAnchor="middle"
        >
          {max}
        </text>
      </svg>

      <div className="dt-instrument-reading">
        <strong>{value.toFixed(precision)}</strong>
        <span>{unit}</span>
      </div>

      <div className="dt-instrument-range">
        RANGE {min}–{max} {unit}
      </div>
    </article>
  );
}


export default function DigitalTwinPage() {
  const [scene, setScene] = useState<Scene>("refining");
  const [mode, setMode] = useState<Mode>("normal");
  const [tick, setTick] = useState(0);
  const [selectedEquipment, setSelectedEquipment] = useState("Feed System");
  const [trendHistory, setTrendHistory] = useState<TrendPoint[]>([]);
  const [acknowledgedAlarms, setAcknowledgedAlarms] = useState<string[]>([]);
  const [alarmHistory, setAlarmHistory] = useState<AlarmHistoryEntry[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((previous) => previous + 1);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const isGas = scene === "gas";
  const isAbnormal = mode === "abnormal";
  const isDegraded = mode === "degraded";
  const variation = Math.sin(tick * 0.7);

  const flow = (isGas
    ? isAbnormal
      ? 680
      : isDegraded
        ? 760
        : 900
    : isAbnormal
      ? 620
      : isDegraded
        ? 760
        : 1000) + variation * 12;

  const temperature = (isGas
    ? isAbnormal
      ? 112
      : isDegraded
        ? 88
        : 72
    : isAbnormal
      ? 245
      : isDegraded
        ? 218
        : 195) + variation * 1.5;

  const pressure = (isGas
    ? isAbnormal
      ? 9.8
      : isDegraded
        ? 7.6
        : 6.5
    : isAbnormal
      ? 8.7
      : isDegraded
        ? 7.1
        : 6.2) + variation * 0.1;

  const power = isAbnormal ? 420 : isDegraded ? 680 : 850;
  const efficiency = isAbnormal ? 61 : isDegraded ? 76 : 91;

  const equipment = useMemo(
    () =>
      isGas
        ? [
            "Wellhead Inlet",
            "Gas Treatment",
            "Compressor",
            "Power Generation",
            "Electrical Output",
          ]
        : [
            "Feed System",
            "Separation Unit",
            "Heat Exchanger",
            "Process Pumps",
            "Storage Tanks",
          ],
    [isGas]
  );

  const selectedEquipmentName = equipment.includes(selectedEquipment)
    ? selectedEquipment
    : equipment[0];

  const equipmentIndex = equipment.indexOf(selectedEquipmentName);

  const activeAlarms: Alarm[] = useMemo(() => {
    if (mode === "normal") return [];

    const time = formatTime();

    if (mode === "abnormal") {
      return [
        {
          id: `${scene}-alarm-1`,
          equipment: isGas ? "Compressor" : "Heat Exchanger",
          severity: "Critical",
          message: isGas
            ? "Compressor temperature is above the simulated limit."
            : "Heat exchanger temperature is above the simulated limit.",
          cause: "The simulated operating temperature has exceeded its normal threshold.",
          recommendation:
            "Review operating conditions and inspect the equipment before taking action.",
          timestamp: time,
        },
        {
          id: `${scene}-alarm-2`,
          equipment: isGas ? "Gas Treatment" : "Separation Unit",
          severity: "Warning",
          message: "Process performance is outside the normal operating range.",
          cause: "A simulated process parameter is outside its expected range.",
          recommendation:
            "Check process parameters and review recent operating trends.",
          timestamp: time,
        },
      ];
    }

    return [
      {
        id: `${scene}-alarm-3`,
        equipment: isGas ? "Gas Treatment" : "Separation Unit",
        severity: "Warning",
        message: "Process efficiency is below the normal operating target.",
        cause: "The current demonstration scenario applies a simulated efficiency reduction.",
        recommendation:
          "Review efficiency trends and plan a preventive inspection.",
        timestamp: time,
      },
    ];
  }, [mode, scene, isGas]);

  const activeAlarmIds = activeAlarms.map((alarm) => alarm.id).join("|");

  useEffect(() => {
    setAcknowledgedAlarms([]);
  }, [mode, scene]);

  useEffect(() => {
    const currentIds = activeAlarms.map((alarm) => alarm.id);

    setAlarmHistory((previous) => {
      const updated = previous.map((entry) =>
        entry.status === "Active" && !currentIds.includes(entry.id)
          ? { ...entry, status: "Cleared" as const }
          : entry
      );

      for (const alarm of activeAlarms) {
        const existingIndex = updated.findIndex(
          (entry) => entry.id === alarm.id && entry.status === "Active"
        );

        const acknowledged = acknowledgedAlarms.includes(alarm.id);

        if (existingIndex === -1) {
          updated.unshift({
            ...alarm,
            timestamp: formatTime(),
            status: "Active",
            acknowledged,
          });
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            acknowledged,
          };
        }
      }

      return updated.slice(0, 100);
    });
    // The IDs represent the active alarm set; acknowledgement changes update its history.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlarmIds, acknowledgedAlarms]);

  useEffect(() => {
    setTrendHistory((previous) =>
      [
        ...previous,
        {
          seconds: tick * 2,
          temperature,
          pressure,
          flow,
        },
      ].slice(-20)
    );
  }, [tick, temperature, pressure, flow]);

  const unacknowledgedCount = activeAlarms.filter(
    (alarm) => !acknowledgedAlarms.includes(alarm.id)
  ).length;

  const facilityStatus =
    mode === "abnormal"
      ? "Abnormal"
      : mode === "degraded"
        ? "Degraded"
        : "Operational";

  const equipmentHealth = equipment.map((name, index) => {
    let status: EquipmentStatus = "Operational";

    if (isAbnormal && index === 2) status = "Fault";
    else if ((isAbnormal || isDegraded) && index === 1) status = "Warning";

    return { name, status };
  });

  const equipmentHealthCounts = {
    total: equipmentHealth.length,
    operational: equipmentHealth.filter(
      (item) => item.status === "Operational"
    ).length,
    warning: equipmentHealth.filter((item) => item.status === "Warning").length,
    fault: equipmentHealth.filter((item) => item.status === "Fault").length,
  };

  const equipmentStatus: EquipmentStatus =
    isAbnormal && equipmentIndex === 2
      ? "Fault"
      : (isAbnormal || isDegraded) && equipmentIndex === 1
        ? "Reduced Performance"
        : "Operational";

  const equipmentTemperature = temperature + equipmentIndex * 4.5;
  const equipmentPressure = Math.max(0, pressure - equipmentIndex * 0.15);

  const equipmentPower =
    (isGas
      ? [0, 18, 95, 650, 12][equipmentIndex]
      : [45, 85, 120, 75, 8][equipmentIndex]) *
    (isAbnormal ? 1.2 : isDegraded ? 1.1 : 1);

  const equipmentHealthScore =
    equipmentStatus === "Fault"
      ? 35
      : equipmentStatus === "Reduced Performance"
        ? 68
        : isAbnormal
          ? 75
          : isDegraded
            ? 82
            : 95;

  const equipmentHealthLevel =
    equipmentHealthScore < 50
      ? "Poor"
      : equipmentHealthScore < 80
        ? "Fair"
        : "Good";

  const equipmentDescription = isGas
    ? [
        "Receives incoming wellhead gas.",
        "Removes selected contaminants from the gas stream.",
        "Raises gas pressure for downstream operations.",
        "Converts fuel energy into electrical power.",
        "Represents power delivery to the electrical system.",
      ][equipmentIndex]
    : [
        "Receives feedstock into the processing facility.",
        "Separates feed into process streams.",
        "Transfers heat between process streams.",
        "Moves process fluids through the facility.",
        "Provides storage for process materials.",
      ][equipmentIndex];

  const maintenanceItems = equipment
    .map((name, index) => {
      const status: EquipmentStatus =
        isAbnormal && index === 2
          ? "Fault"
          : (isAbnormal || isDegraded) && index === 1
            ? "Reduced Performance"
            : "Operational";

      return {
        name,
        status,
        score:
          status === "Fault"
            ? 35
            : status === "Reduced Performance"
              ? 68
              : 95,
      };
    })
    .filter((item) => item.status !== "Operational");

  function changeScene(nextScene: Scene) {
    setScene(nextScene);
    setSelectedEquipment(
      nextScene === "gas" ? "Wellhead Inlet" : "Feed System"
    );
    setTrendHistory([]);
  }

  return (
    <main className="dt-shell">
      <style>{`
        .dt-flow-step {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dt-flow-arrow {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 32px;
          width: 32px;
          height: 8px;
          overflow: visible;
          font-size: 0;
          color: transparent;
          background: rgba(100, 116, 139, 0.35);
          border-radius: 99px;
        }

        .dt-flow-arrow::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 8px;
          width: 10px;
          border-radius: 99px;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);
          animation: dt-flow-normal 2s linear infinite;
        }

        .dt-flow-arrow.degraded::after {
          width: 7px;
          background: #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
          animation: dt-flow-degraded 4s linear infinite;
        }

        .dt-flow-arrow.abnormal::after {
          width: 12px;
          background: #f87171;
          box-shadow: 0 0 12px rgba(248, 113, 113, 0.8);
          animation: dt-flow-abnormal 0.9s steps(2, end) infinite;
        }

        .dt-flow-node.degraded {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.15);
        }

        .dt-flow-node.has-alarm {
          border-color: #f87171 !important;
          box-shadow: 0 0 14px rgba(248, 113, 113, 0.2);
        }

        .dt-flow-node.selected {
          outline: 1px solid rgba(96, 165, 250, 0.65);
          outline-offset: 2px;
        }

        @keyframes dt-flow-normal {
          from { left: 0; }
          to { left: 24px; }
        }

        @keyframes dt-flow-degraded {
          0% { left: 0; }
          100% { left: 25px; }
        }

        @keyframes dt-flow-abnormal {
          0% { left: 0; opacity: 1; }
          50% { left: 12px; opacity: 0.25; }
          100% { left: 24px; opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dt-flow-arrow::after {
            animation: none !important;
            left: 50%;
          }
        }
      `}</style>

      <header className="dt-header">
        <a className="dt-brand" href="/">
          TITAN X <span>ENERGY</span>
        </a>
        <div className="dt-header-right">
          <span className="dt-demo-badge">SIMULATION ENVIRONMENT</span>
          <a className="dt-back-link" href="/">
            Corporate Website ↗
          </a>
        </div>
      </header>

      <section className="dt-intro">
        <div className="dt-eyebrow">DIGITAL OPERATIONS PLATFORM</div>
        <h1>Digital Twin Platform</h1>
        <p>
          Explore facility operations, equipment status, process performance
          and simulated operating scenarios.
        </p>
      </section>

      <section className="dt-workspace">
        <aside className="dt-sidebar">
          <div className="dt-sidebar-label">FACILITY SCENARIOS</div>

          <button
            type="button"
            className={`dt-scene-button ${scene === "refining" ? "active" : ""}`}
            onClick={() => changeScene("refining")}
          >
            <span className="dt-scene-number">01</span>
            <span>
              <strong>Modular Refining</strong>
              <small>Refining &amp; Processing</small>
            </span>
          </button>

          <button
            type="button"
            className={`dt-scene-button ${scene === "gas" ? "active" : ""}`}
            onClick={() => changeScene("gas")}
          >
            <span className="dt-scene-number">02</span>
            <span>
              <strong>Wellhead Gas &amp; Power</strong>
              <small>Gas Processing &amp; Generation</small>
            </span>
          </button>

          <div className="dt-sidebar-note">
            <span className="dt-status-dot" />
            Simulation running
            <p>Illustrative data only. Not connected to live equipment.</p>
          </div>
        </aside>

        <div className="dt-main-panel">
          <div className="dt-panel-heading">
            <div>
              <div className="dt-panel-kicker">FACILITY OVERVIEW</div>
              <h2>
                {isGas
                  ? "Wellhead Gas Processing & Power Generation"
                  : "Modular Refining & Processing Facility"}
              </h2>
            </div>
            <span className="dt-mode-label">DEMO MODE</span>
          </div>


<div className="dt-placeholder">
  <div className="dt-facility-hero">

<img
  src={
    isGas
      ? "/wellhead-gas-power.png"
      : "/modular-refining-facility.png"
  }
  alt={

        isGas
          ? "Wellhead gas processing and power generation facility"
          : "Modular refining and processing facility"
      }
    />
    <div className="dt-facility-hero-overlay">
      <span className="dt-facility-hero-tag">
        TITAN X ENERGY · DIGITAL TWIN
      </span>
      <h3>
        {isGas
          ? "Wellhead Gas Processing & Power Generation"
          : "Modular Refining & Processing Facility"}
      </h3>
      <p>Industrial systems visualization · Simulation environment</p>
    </div>
  </div>

  <div className={`dt-operation-status ${mode}`}>
    {mode === "normal"
      ? "NORMAL OPERATION"
      : mode === "abnormal"
        ? "ABNORMAL CONDITION"
        : "PERFORMANCE DEGRADATION"}
  </div>

  <div className="dt-mode-controls">
    {modes.map((item) => (
      <button
        type="button"
        key={item.id}
        className={`dt-mode-button ${mode === item.id ? "active" : ""}`}
        onClick={() => setMode(item.id)}
      >
        {item.label}
      </button>
    ))}
  </div>

  <FacilityScene3D
    scene={scene}
    equipmentNames={equipment}
    selectedEquipment={selectedEquipmentName}
    onSelectEquipment={setSelectedEquipment}
    mode={mode}
  />

  <div className="dt-equipment-list">
    {equipment.map((name) => (
      <button
        key={name}
        type="button"
        className={`dt-equipment-button ${
          name === selectedEquipmentName ? "active" : ""
        }`}
        onClick={() => setSelectedEquipment(name)}
      >
        {name}
      </button>
    ))}
  </div>
</div>
 


          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">SELECTED EQUIPMENT</div>
                <h3>{selectedEquipmentName}</h3>
              </div>
              <span className="dt-model-tag">EQUIPMENT DETAILS</span>
            </div>


<div className="dt-equipment-instruments">
  <article className="dt-instrument dt-status-instrument">
    <div className="dt-instrument-label">EQUIPMENT STATUS</div>
    <div className="dt-status-reading">
      <span
        className={`dt-status-lamp ${
          equipmentStatus === "Fault"
            ? "critical"
            : equipmentStatus === "Reduced Performance"
              ? "warning"
              : "normal"
        }`}
      />
      <strong
        className={
          equipmentStatus === "Fault"
            ? "dt-alarm"
            : equipmentStatus === "Reduced Performance"
              ? "dt-warning"
              : "dt-operational"
        }
      >
        {equipmentStatus === "Reduced Performance"
          ? "DEGRADED"
          : equipmentStatus.toUpperCase()}
      </strong>
    </div>
    <div className="dt-instrument-range">CURRENT OPERATING STATE</div>
  </article>

  <InstrumentGauge
    label="TEMPERATURE"
    value={equipmentTemperature}
    min={0}
    max={isGas ? 150 : 300}
    unit="°C"
    precision={1}
    status={equipmentStatus === "Fault" ? "critical" : isAbnormal ? "warning" : "normal"}
  />

  <InstrumentGauge
    label="PRESSURE"
    value={equipmentPressure}
    min={0}
    max={12}
    unit="bar"
    precision={2}
    status={equipmentStatus === "Fault" ? "critical" : isAbnormal ? "warning" : "normal"}
  />

  <InstrumentGauge
    label={
      isGas && equipmentIndex === 3
        ? "POWER GENERATION"
        : "POWER CONSUMPTION"
    }
    value={equipmentPower}
    min={0}
    max={isGas && equipmentIndex === 3 ? 800 : 200}
    unit="kW"
    precision={1}
    status={equipmentStatus === "Fault" ? "critical" : "normal"}
  />

  <article className="dt-instrument dt-health-instrument">
    <div className="dt-instrument-label">EQUIPMENT HEALTH</div>
    <div className="dt-health-reading">
      <strong
        className={
          equipmentHealthScore < 50
            ? "dt-alarm"
            : equipmentHealthScore < 80
              ? "dt-warning"
              : "dt-operational"
        }
      >
        {equipmentHealthScore}
      </strong>
      <span>/ 100</span>
    </div>
    <div className="dt-health-track">
      <div
        className={`dt-health-fill ${
          equipmentHealthScore < 50
            ? "critical"
            : equipmentHealthScore < 80
              ? "warning"
              : "normal"
        }`}
        style={{ width: `${equipmentHealthScore}%` }}
      />
    </div>
    <div className="dt-instrument-range">
      CONDITION · {equipmentHealthLevel.toUpperCase()}
    </div>
  </article>
</div>


            <div style={{ padding: "16px 4px" }}>
              <div className="dt-panel-kicker">EQUIPMENT DESCRIPTION</div>
              <p>{equipmentDescription}</p>
              <p>
                Maintenance guidance: inspect operating conditions and review
                equipment status before determining any maintenance action.
              </p>
            </div>
          </div>

          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">PROCESS PARAMETERS</div>
                <h3>Operating Conditions</h3>
              </div>
              <span className="dt-model-tag">AUTO-REFRESH · 2 SEC</span>
            </div>


<div className="dt-process-instruments">
  <InstrumentGauge
    label="TEMPERATURE"
    value={temperature}
    min={0}
    max={isGas ? 150 : 300}
    unit="°C"
    precision={1}
    status={isAbnormal ? "critical" : isDegraded ? "warning" : "normal"}
  />

  <InstrumentGauge
    label="PRESSURE"
    value={pressure}
    min={0}
    max={12}
    unit="bar"
    precision={2}
    status={isAbnormal ? "critical" : isDegraded ? "warning" : "normal"}
  />

  <InstrumentGauge
    label={isGas ? "GAS FLOW" : "FEED FLOW"}
    value={flow}
    min={0}
    max={isGas ? 1100 : 1200}
    unit={isGas ? "Mscf/h" : "bbl/h"}
    precision={1}
    status={isAbnormal ? "critical" : isDegraded ? "warning" : "normal"}
  />

  <article className="dt-instrument dt-range-instrument">
    <div className="dt-instrument-label">EFFICIENCY</div>
    <div className="dt-range-reading">
      <strong>{efficiency}</strong>
      <span>%</span>
    </div>
    <div className="dt-range-track">
      <div
        className={`dt-range-fill ${
          efficiency < 65 ? "critical" : efficiency < 80 ? "warning" : "normal"
        }`}
        style={{ width: `${efficiency}%` }}
      />
    </div>
    <div className="dt-instrument-range">SIMULATED PROCESS EFFICIENCY</div>
  </article>

  <article className="dt-instrument dt-range-instrument">
    <div className="dt-instrument-label">FACILITY POWER</div>
    <div className="dt-range-reading">
      <strong>{power}</strong>
      <span>kW</span>
    </div>
    <div className="dt-range-track">
      <div
        className={`dt-range-fill ${
          isAbnormal ? "critical" : isDegraded ? "warning" : "normal"
        }`}
        style={{ width: `${Math.min(100, (power / 1000) * 100)}%` }}
      />
    </div>
    <div className="dt-instrument-range">SIMULATED FACILITY VALUE</div>
  </article>

  <article className="dt-instrument dt-range-instrument">
    <div className="dt-instrument-label">SIMULATION TIME</div>
    <div className="dt-range-reading">
      <strong>{tick * 2}</strong>
      <span>sec</span>
    </div>
    <div className="dt-instrument-range">SINCE PAGE OPENED</div>
  </article>
</div>
</div>

          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">EQUIPMENT HEALTH</div>
                <h3>Equipment Health Overview</h3>
              </div>
              <span className="dt-model-tag">
                SIMULATED · {isGas ? "WELLHEAD GAS" : "REFINING"}
              </span>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "13px" }}>
              Counts reflect the selected operating scenario and simulated
              equipment status.
            </p>

            <div className="dt-metrics">
              <article className="dt-metric">
                <span>Total Equipment</span>
                <strong>{equipmentHealthCounts.total}</strong>
                <small>Current facility scenario</small>
              </article>
              <article className="dt-metric">
                <span>Operational</span>
                <strong className="dt-operational">
                  {equipmentHealthCounts.operational}
                </strong>
                <small>Simulated normal status</small>
              </article>
              <article className="dt-metric">
                <span>Warning</span>
                <strong
                  className={
                    equipmentHealthCounts.warning ? "dt-warning" : ""
                  }
                >
                  {equipmentHealthCounts.warning}
                </strong>
                <small>Reduced performance</small>
              </article>
              <article className="dt-metric">
                <span>Fault</span>
                <strong
                  className={equipmentHealthCounts.fault ? "dt-alarm" : ""}
                >
                  {equipmentHealthCounts.fault}
                </strong>
                <small>Simulated equipment fault</small>
              </article>
            </div>
          </div>

          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">HISTORICAL TRENDS</div>
                <h3>Process Parameter Trends</h3>
              </div>
              <span className="dt-model-tag">LAST 20 SAMPLES</span>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "13px" }}>
              Simulated historical data · Sampling interval: 2 seconds
            </p>

            {[
              {
                key: "temperature" as const,
                label: "Temperature",
                value: temperature.toFixed(1),
                unit: "°C",
                stroke: "#f87171",
              },
              {
                key: "pressure" as const,
                label: "Pressure",
                value: pressure.toFixed(2),
                unit: "bar",
                stroke: "#38bdf8",
              },
              {
                key: "flow" as const,
                label: isGas ? "Gas Flow" : "Feed Flow",
                value: flow.toFixed(1),
                unit: isGas ? "Mscf/h" : "bbl/h",
                stroke: "#34d399",
              },
            ].map((metric) => (
              <div
                key={metric.key}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <strong style={{ color: "#e2e8f0" }}>
                    {metric.label}
                  </strong>
                  <strong style={{ color: metric.stroke }}>
                    {metric.value} {metric.unit}
                  </strong>
                </div>

                <svg
                  viewBox="0 0 600 100"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`${metric.label} simulated trend`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "110px",
                    overflow: "visible",
                  }}
                >
                  {[20, 55, 90].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="600"
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 6"
                    />
                  ))}
                  <polyline
                    points={buildTrendPoints(trendHistory, metric.key)}
                    fill="none"
                    stroke={metric.stroke}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#94a3b8",
                    fontSize: "11px",
                  }}
                >
                  <span>
                    {trendHistory.length > 0
                      ? `${trendHistory[0].seconds}s`
                      : "Waiting for data"}
                  </span>
                  <span>
                    {trendHistory.length > 0
                      ? `${trendHistory[trendHistory.length - 1].seconds}s`
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">ALARM &amp; FAULT MANAGEMENT</div>
                <h3>Active Alarms</h3>
              </div>
              <span className="dt-model-tag">
                {activeAlarms.length} ACTIVE
              </span>
            </div>

            {activeAlarms.length === 0 ? (
              <div className="dt-alarm-empty">
                <strong>No Active Alarms</strong>
                <p>
                  No simulated alarms are active in the current operating
                  scenario.
                </p>
              </div>
            ) : (
              <div className="dt-alarm-list">
                {activeAlarms.map((alarm) => {
                  const isAcknowledged = acknowledgedAlarms.includes(alarm.id);

                  return (
                    <article className="dt-alarm-card" key={alarm.id}>
                      <div className="dt-alarm-card-top">
                        <div>
                          <span
                            className={`dt-severity dt-severity-${alarm.severity.toLowerCase()}`}
                          >
                            {alarm.severity}
                          </span>
                          <h4>{alarm.equipment}</h4>
                        </div>
                        <span className="dt-alarm-time">{alarm.timestamp}</span>
                      </div>

                      <p className="dt-alarm-message">{alarm.message}</p>
                      <p>
                        <strong>Possible Cause: </strong>
                        {alarm.cause}
                      </p>
                      <p>
                        <strong>Recommended Action: </strong>
                        {alarm.recommendation}
                      </p>

                      <div className="dt-alarm-card-bottom">
                        <span>
                          {isAcknowledged
                            ? "Acknowledged"
                            : "Awaiting Acknowledgement"}
                        </span>
                        <button
                          type="button"
                          className="dt-ack-button"
                          disabled={isAcknowledged}
                          onClick={() =>
                            setAcknowledgedAlarms((previous) =>
                              previous.includes(alarm.id)
                                ? previous
                                : [...previous, alarm.id]
                            )
                          }
                        >
                          {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">MAINTENANCE MONITORING</div>
                <h3>Maintenance Recommendations</h3>
              </div>
              <span className="dt-model-tag">
                {maintenanceItems.length} ITEMS
              </span>
            </div>

            {maintenanceItems.length === 0 ? (
              <div className="dt-alarm-empty">
                <strong>No Maintenance Alerts</strong>
                <p>
                  No simulated equipment issues currently require attention.
                </p>
              </div>
            ) : (
              <div className="dt-alarm-list">
                {maintenanceItems.map((item) => (
                  <article className="dt-alarm-card" key={item.name}>
                    <div className="dt-alarm-card-top">
                      <div>
                        <span
                          className={`dt-severity ${
                            item.status === "Fault"
                              ? "dt-severity-critical"
                              : "dt-severity-warning"
                          }`}
                        >
                          {item.status === "Fault" ? "Critical" : "Warning"}
                        </span>
                        <h4>{item.name}</h4>
                      </div>
                      <span className="dt-alarm-time">
                        Health: {item.score}/100
                      </span>
                    </div>
                    <p>
                      {item.status === "Fault"
                        ? "Simulated equipment fault. Inspect the equipment and verify safe operating conditions."
                        : "Reduced or abnormal simulated operating performance. Review process readings and schedule an inspection."}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="dt-visual-panel">
            <div className="dt-visual-top">
              <div>
                <div className="dt-panel-kicker">EVENT LOG</div>
                <h3>Alarm History</h3>
              </div>
              <span className="dt-model-tag">
                {alarmHistory.length} EVENTS
              </span>
            </div>

            {alarmHistory.length === 0 ? (
              <div className="dt-alarm-empty">
                <strong>No Events Recorded</strong>
                <p>
                  Alarm events will appear here when simulated operating
                  conditions change.
                </p>
              </div>
            ) : (
              <div className="dt-history-table-wrap">
                <table className="dt-history-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Equipment</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Acknowledgement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alarmHistory.map((entry, index) => (
                      <tr
                        key={`${entry.id}-${entry.timestamp}-${index}`}
                      >
                        <td>{entry.timestamp}</td>
                        <td>{entry.equipment}</td>
                        <td>
                          <span
                            className={`dt-severity dt-severity-${entry.severity.toLowerCase()}`}
                          >
                            {entry.severity}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              entry.status === "Active"
                                ? "dt-history-active"
                                : "dt-history-cleared"
                            }
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td>
                          {entry.acknowledged
                            ? "Acknowledged"
                            : "Unacknowledged"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="dt-bottom-note">
            <strong>
              {isAbnormal
                ? "ABNORMAL OPERATION"
                : isDegraded
                  ? "PERFORMANCE DEGRADATION"
                  : "NORMAL OPERATION"}
            </strong>
            <p>
              {isAbnormal
                ? "A simulated abnormal condition is active. Review temperature, flow and alarm indicators."
                : isDegraded
                  ? "Simulated performance has declined. Flow and efficiency are reduced compared with normal operation."
                  : "The facility is operating in a simulated normal state. Values fluctuate slightly to demonstrate monitoring."}
            </p>
            <p>
              Facility status: <strong>{facilityStatus}</strong> · Unacknowledged
              alarms: <strong>{unacknowledgedCount}</strong>
            </p>
          </div>
        </div>
      </section>

      <footer className="dt-footer">
        <span>TITAN X ENERGY · DIGITAL TWIN</span>
        <span>
          Illustrative demonstration environment · Not connected to live
          equipment
        </span>
      </footer>
    </main>
  );
}
