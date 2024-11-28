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
      <header className="border-b border-border/5 backdrop-blur-md bg-background/30 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Web Agency CRM" 
                className="h-6 object-contain"
              />
            ) : (
              <h1 className="text-lg font-light tracking-tight">Web Agency <span className="text-primary font-normal">CRM</span></h1>
            )}
            <nav className="hidden md:block">
              <Tabs defaultValue="dashboard">
                <TabsList className="bg-transparent border-none">
                  <TabsTrigger value="dashboard" className="data-[state=active]:bg-secondary/30 data-[state=active]:text-primary px-4">
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="clients" className="data-[state=active]:bg-secondary/30 data-[state=active]:text-primary px-4">
                    Clients
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="data-[state=active]:bg-secondary/30 data-[state=active]:text-primary px-4">
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="finances" className="data-[state=active]:bg-secondary/30 data-[state=active]:text-primary px-4">
                    Finances
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="data-[state=active]:bg-secondary/30 data-[state=active]:text-primary px-4">
                    Invoices
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>
          </div>
          <UserNav />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
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