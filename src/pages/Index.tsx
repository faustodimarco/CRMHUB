import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import Clients from "@/components/Clients";
import Tasks from "@/components/Tasks";
import Finances from "@/components/Finances";
import Invoices from "@/components/Invoices";
import { UserNav } from "@/App";

const Index = () => {
  const logoUrl = localStorage.getItem('app-logo');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/10 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Web Agency CRM" 
                className="h-8 object-contain"
              />
            ) : (
              <h1 className="text-2xl font-light tracking-tight">Web Agency <span className="text-primary font-normal">CRM</span></h1>
            )}
          </div>
          <UserNav />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <Card className="p-1.5 bg-card/50 backdrop-blur-sm border-border/50">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Clients
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="finances" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Finances
              </TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Invoices
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients" className="mt-0">
            <Clients />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <Tasks />
          </TabsContent>

          <TabsContent value="finances" className="mt-0">
            <Finances />
          </TabsContent>

          <TabsContent value="invoices" className="mt-0">
            <Invoices />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;