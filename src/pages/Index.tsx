import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import Clients from "@/components/Clients";
import Tasks from "@/components/Tasks";
import Finances from "@/components/Finances";
import Invoices from "@/components/Invoices";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary/30 p-6">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Web Agency CRM</h1>
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Clients />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Tasks />
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            <Finances />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Invoices />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;