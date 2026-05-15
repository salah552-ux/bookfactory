import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * Post-launch charts. Real time-series come from post-launch-agent and
 * ams-optimizer-agent reports; we surface them here. When real data is not
 * yet available we show a "no data yet" placeholder per chart.
 */
export interface PostLaunchData {
  bsr?: Array<{ day: string; bsr: number }>;
  reviews?: Array<{ day: string; reviews: number; rating: number }>;
  ams?: Array<{ campaign: string; spend: number; acos: number }>;
  ku?: Array<{ day: string; pages: number }>;
}

const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 6,
  fontSize: 12,
  color: "#e2e8f0",
};
const axisStyle = { fill: "#94a3b8", fontSize: 11 };

export function PostLaunchCharts({ data }: { data: PostLaunchData }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>BSR over time</CardTitle>
        </CardHeader>
        <CardBody>
          {data.bsr && data.bsr.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.bsr}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="day" tick={axisStyle} stroke="#334155" />
                <YAxis tick={axisStyle} stroke="#334155" reversed />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="bsr"
                  stroke="#c8b99a"
                  fill="#c8b99a33"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Placeholder agent="post-launch-agent" metric="BSR" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review velocity</CardTitle>
        </CardHeader>
        <CardBody>
          {data.reviews && data.reviews.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.reviews}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="day" tick={axisStyle} stroke="#334155" />
                <YAxis tick={axisStyle} stroke="#334155" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Placeholder agent="post-launch-agent" metric="reviews + rating" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AMS spend vs ACoS</CardTitle>
        </CardHeader>
        <CardBody>
          {data.ams && data.ams.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.ams}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="campaign" tick={axisStyle} stroke="#334155" />
                <YAxis tick={axisStyle} stroke="#334155" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="spend" fill="#1b3a5c" />
                <Bar dataKey="acos" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Placeholder agent="ams-optimizer-agent" metric="campaign spend + ACoS" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KU page reads</CardTitle>
        </CardHeader>
        <CardBody>
          {data.ku && data.ku.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.ku}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="day" tick={axisStyle} stroke="#334155" />
                <YAxis tick={axisStyle} stroke="#334155" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="pages"
                  stroke="#60a5fa"
                  fill="#60a5fa33"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Placeholder agent="post-launch-agent" metric="KU page reads" />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function Placeholder({ agent, metric }: { agent: string; metric: string }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center text-center gap-1">
      <p className="text-xs text-slate-500">No {metric} data yet.</p>
      <p className="text-[11px] text-slate-600 max-w-xs">
        Will populate once <code className="text-brand-tan">{agent}</code> emits
        its first report after launch.
      </p>
    </div>
  );
}
