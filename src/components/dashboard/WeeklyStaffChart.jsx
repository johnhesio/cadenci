import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrencyBRL } from "@/utils/dateHelpers";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-card px-3 py-2 shadow-lift">
      <p className="text-xs font-medium text-ink/60">{label}</p>
      <p className="font-mono text-sm font-semibold text-pine">{formatCurrencyBRL(payload[0].value)}</p>
    </div>
  );
}

export default function WeeklyStaffChart({ data }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Faturamento da semana</h3>
          <p className="text-xs text-ink/50">Segunda a domingo, em pauta</p>
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="32%" margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid horizontal vertical={false} stroke="#DED6C4" strokeWidth={1} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#6B756F" }}
            />
            <YAxis hide domain={[0, (max) => (max === 0 ? 100 : max * 1.25)]} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(36,83,74,0.06)" }} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={34}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.isToday ? "#B8842C" : "#24534A"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
