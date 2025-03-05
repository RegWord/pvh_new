import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ProductManagement from "./ProductManagement";
import RequestManagement from "./RequestManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Панель администратора
          </h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products">Управление товарами</TabsTrigger>
            <TabsTrigger value="requests">Заявки клиентов</TabsTrigger>
          </TabsList>
          <TabsContent
            value="products"
            className="bg-white p-6 rounded-lg shadow"
          >
            <ProductManagement />
          </TabsContent>
          <TabsContent
            value="requests"
            className="bg-white p-6 rounded-lg shadow"
          >
            <RequestManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;