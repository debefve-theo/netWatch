type GaugeCardProps = {
  title: string;
  value: number; // 0-100
  displayValue: string;
  unit?: string;
  subtitle?: string;
  color?: string;
  size?: number;
};

export function GaugeCard({
  title,
  value,
  displayValue,
  unit,
  subtitle,
  color = "#3b82f6",
  size = 120,
}: GaugeCardProps) {
  const safe = Math.max(0, Math.min(100, value));
  // Arc from 220° to 320° (240° sweep)
  const startAngle = 220;
  const sweepAngle = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.075;

  function polarToCartesian(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg: number, endDeg: number) {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const endAngle = startAngle + (sweepAngle * safe) / 100;

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{title}</p>
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size}`} overflow="visible">
          {/* Track */}
          <path
            d={describeArc(startAngle, startAngle + sweepAngle)}
            fill="none"
            stroke="rgba(63,63,70,0.8)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill */}
          {safe > 0 && (
            <path
              d={describeArc(startAngle, endAngle)}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
          {/* Value */}
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#f4f4f5"
            fontSize={size * 0.18}
            fontWeight="700"
            fontFamily="inherit"
          >
            {displayValue}
          </text>
          {unit && (
            <text
              x={cx}
              y={cy + size * 0.165}
              textAnchor="middle"
              fill="#71717a"
              fontSize={size * 0.1}
              fontFamily="inherit"
            >
              {unit}
            </text>
          )}
        </svg>
      </div>
      {subtitle && <p className="text-[10px] text-zinc-500">{subtitle}</p>}
    </div>
  );
}
