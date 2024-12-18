import { Card } from "@/components/ui/card";
import { BarChart, Activity, Users, FileText, FileCheck, FileEdit, FileMinus, CheckSquare, Edit, XSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getTasks } from "@/services/taskService";
import { getInvoices } from "@/services/invoiceService";
import { getRevenue } from "@/services/financeService";
import { differenceInDays } from "date-fns";

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

  // Filter activities within last 2 days and sort by date
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
    .filter(activity => {
      const daysDifference = differenceInDays(new Date(), activity.date);
      return daysDifference <= 2;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  const getActivityIcon = (type: string, status: string) => {
    if (type === 'invoice') {
      switch (status) {
        case 'created':
          return <FileCheck className="w-4 h-4 text-foreground" />;
        case 'paid':
          return <FileCheck className="w-4 h-4 text-foreground" />;
        case 'deleted':
          return <FileMinus className="w-4 h-4 text-foreground" />;
        default:
          return <FileEdit className="w-4 h-4 text-foreground" />;
      }
    } else { // task
      switch (status) {
        case 'done':
          return <CheckSquare className="w-4 h-4 text-foreground" />;
        case 'deleted':
          return <XSquare className="w-4 h-4 text-foreground" />;
        default:
          return <Edit className="w-4 h-4 text-foreground" />;
      }
    }
  };

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
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <h3 className="text-2xl font-bold">{activeTasks}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
              <h3 className="text-2xl font-bold">{pendingInvoices}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BarChart className="w-6 h-6 text-primary" />
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
                {getActivityIcon(activity.type, activity.text.split(' ')[1])}
                <p className="text-sm text-muted-foreground">{activity.text}</p>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activities in the last 2 days</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Urgent Tasks</h3>
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-[hsl(0_84.2%_60.2%)] animate-pulse" />
                  <div className="absolute -top-0.5 -left-0.5 w-3 h-3 rounded-full bg-[hsl(0_84.2%_60.2%)]/30 animate-ping" />
                </div>
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