import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  revenue: number;
  expenses: number;
}

const RevenueExpenseChart = ({ data }: { data: ChartData[] }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="currentColor" 
              strokeOpacity={0.5}
              fontSize={12}
            />
            <YAxis 
              stroke="currentColor"
              strokeOpacity={0.5}
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar 
              dataKey="revenue" 
              fill="hsl(153 60% 33%)" 
              radius={[4, 4, 0, 0]}
              name="Revenue" 
            />
            <Bar 
              dataKey="expenses" 
              fill="hsl(0 84.2% 60.2%)" 
              radius={[4, 4, 0, 0]}
              name="Expenses" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueExpenseChart;