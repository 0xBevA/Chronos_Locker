'use client';

import { useFormStore } from '@/store/formStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Start', uv: 0 },
  { name: 'Cliff', uv: 0 },
  { name: 'Cliff End', uv: 1000 },
  { name: 'End', uv: 4000 },
];

export function PlanSummary() {
  const { unlockFrequency, vestingTerm, vestingTermUnit, cliff, cliffUnit } = useFormStore();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Plan summary</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Schedule</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Unlock frequency</span>
          <span className="font-medium text-gray-800">{unlockFrequency}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vesting term</span>
          <span className="font-medium text-gray-800">
            {vestingTerm} {vestingTermUnit}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Cliff</span>
          <span className="font-medium text-gray-800">
            {cliff} {cliffUnit}
          </span>
        </div>
      </div>
    </div>
  );
}
