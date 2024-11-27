import { Card } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

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
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(153 60% 33%)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(153 60% 33%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(var(--border))" 
              opacity={0.1} 
            />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(153 60% 33%)"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(0 84.2% 60.2%)"
              fillOpacity={1}
              fill="url(#colorExpenses)"
              strokeWidth={2}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueExpenseChart;