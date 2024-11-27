import { Card } from "@/components/ui/card";
import { BarChart, Activity, Users, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getTasks } from "@/services/taskService";
import { getInvoices } from "@/services/invoiceService";
import { getRevenue } from "@/services/financeService";

const Dashboard = () => {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });

  const { data: revenue = [] } = useQuery({
    queryKey: ['revenue'],
    queryFn: getRevenue,
  });

  // Calculate metrics
  const totalClients = clients.length;
  const activeTasks = tasks.filter(task => task.status !== 'done').length;
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;
  
  // Calculate monthly revenue (sum of current month's revenue)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyRevenue = revenue
    .filter(rev => rev.month === currentMonth)
    .reduce((sum, rev) => sum + Number(rev.amount), 0);

  // Get urgent tasks (high priority, not done)
  const urgentTasks = tasks
    .filter(task => task.priority === 'high' && task.status !== 'done')
    .slice(0, 4);

  // Get recent activities from tasks and invoices
  const recentActivities = [
    ...tasks.map(task => ({
      type: 'task',
      text: `Task ${task.status === 'done' ? 'completed' : 'updated'} - ${task.title}`,
      date: new Date(task.updated_at),
    })),
    ...invoices.map(invoice => ({
      type: 'invoice',
      text: `Invoice ${invoice.status === 'paid' ? 'paid' : 'created'} - #${invoice.id}`,
      date: new Date(invoice.created_at),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <h3 className="text-2xl font-bold">{totalClients}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-full">
              <Activity className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <h3 className="text-2xl font-bold">{activeTasks}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-warning/10 rounded-full">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
              <h3 className="text-2xl font-bold">{pendingInvoices}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-full">
              <BarChart className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <h3 className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'task' ? 'bg-primary' : 'bg-warning'
                }`} />
                <p className="text-sm text-muted-foreground">{activity.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Urgent Tasks</h3>
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <p className="text-sm text-muted-foreground">{task.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;