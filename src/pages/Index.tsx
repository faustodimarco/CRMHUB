import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import Clients from "@/components/Clients";
import Tasks from "@/components/Tasks";
import Finances from "@/components/Finances";
import Invoices from "@/components/Invoices";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Web Agency CRM</h1>
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients">
            <Clients />
          </TabsContent>

          <TabsContent value="tasks">
            <Tasks />
          </TabsContent>

          <TabsContent value="finances">
            <Finances />
          </TabsContent>

          <TabsContent value="invoices">
            <Invoices />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;