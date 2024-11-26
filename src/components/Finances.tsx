import { Card } from "@/components/ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Finances = () => {
  const data = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Apr', revenue: 2780, expenses: 3908 },
    { month: 'May', revenue: 1890, expenses: 4800 },
    { month: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-400">$45,231</p>
          <p className="text-sm text-emerald-500">+12.5% from last month</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-500">$12,345</p>
          <p className="text-sm text-red-400">+2.5% from last month</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Net Profit</h3>
          <p className="text-3xl font-bold text-emerald-400">$32,886</p>
          <p className="text-sm text-emerald-500">+15.2% from last month</p>
        </Card>
      </div>

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
    </div>
  );
};

export default Finances;