import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import Clients from "@/components/Clients";
import Tasks from "@/components/Tasks";
import Finances from "@/components/Finances";
import Invoices from "@/components/Invoices";
import { UserNav } from "@/components/UserNav";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const logoUrl = localStorage.getItem('app-logo');
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sync URL with tab state
  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    setActiveTab(path);
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/${value === 'dashboard' ? '' : value}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/5 backdrop-blur-xl bg-background/30 sticky top-0 z-50 shadow-sm shadow-primary/5">
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
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="bg-secondary/10 backdrop-blur-lg border border-border/10">
                  <TabsTrigger 
                    value="dashboard" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm px-4 transition-all duration-200"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="clients" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm px-4 transition-all duration-200"
                  >
                    Clients
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tasks" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm px-4 transition-all duration-200"
                  >
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger 
                    value="finances" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm px-4 transition-all duration-200"
                  >
                    Finances
                  </TabsTrigger>
                  <TabsTrigger 
                    value="invoices" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm px-4 transition-all duration-200"
                  >
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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsContent value="dashboard" className="mt-0 space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients" className="mt-0 space-y-6">
            <Clients />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0 space-y-6">
            <Tasks />
          </TabsContent>

          <TabsContent value="finances" className="mt-0 space-y-6">
            <Finances />
          </TabsContent>

          <TabsContent value="invoices" className="mt-0 space-y-6">
            <Invoices />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;