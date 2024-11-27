import { Card } from "@/components/ui/card";
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
        
        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <Card className="p-4">
              <TabsList className="flex flex-col h-auto bg-transparent space-y-2">
                <TabsTrigger value="dashboard" className="w-full justify-start">Dashboard</TabsTrigger>
                <TabsTrigger value="clients" className="w-full justify-start">Clients</TabsTrigger>
                <TabsTrigger value="tasks" className="w-full justify-start">Tasks</TabsTrigger>
                <TabsTrigger value="finances" className="w-full justify-start">Finances</TabsTrigger>
                <TabsTrigger value="invoices" className="w-full justify-start">Invoices</TabsTrigger>
              </TabsList>
            </Card>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="dashboard" className="space-y-4">
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
      </div>
    </div>
  );
};

export default Index;