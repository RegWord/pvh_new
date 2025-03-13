import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2, Check, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";

interface CustomerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "processing" | "completed" | "rejected";
  calculatorData?: {
    width: number;
    height: number;
    area: string;
    windowType: string;
    material: string;
    glazingType: string;
    additionalFeatures: string[];
    quantity: number;
    selectedProduct?: { id: string; name: string; category: string };
  };
}

const RequestManagement = () => {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<CustomerRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        setLoading(true);
        const { fetchRequests } = await import("@/api/requests");
        const requestsData = await fetchRequests();
        setRequests(requestsData || []);
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
        setError("Не удалось загрузить заявки");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsData();
  }, []);

  // Фильтрация и сортировка заявок
  const filteredRequests = requests
    .filter(
      (request) =>
        (request?.name?.toLowerCase?.() || "").includes(searchQuery.toLowerCase()) ||
        (request?.email?.toLowerCase?.() || "").includes(searchQuery.toLowerCase()) ||
        (request?.phone?.toLowerCase?.() || "").includes(searchQuery.toLowerCase()) ||
        (request?.message?.toLowerCase?.() || "").includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Сортировка по убыванию даты

  const handleStatusChange = async (
    id: string,
    status: "new" | "processing" | "completed" | "rejected"
  ) => {
    try {
      const { editRequest } = await import("@/api/requests");
      const updatedRequest = await editRequest(id, { status });

      if (updatedRequest) {
        const updatedRequests = requests.map((request) =>
          request.id === id ? { ...request, status } : request
        );
        setRequests(updatedRequests);
        if (currentRequest && currentRequest.id === id) {
          setCurrentRequest({ ...currentRequest, status });
        }
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса заявки:", error);
    }
  };

  const handleDeleteRequest = async () => {
    if (!currentRequest) return;

    try {
      const { removeRequest } = await import("@/api/requests");
      const success = await removeRequest(currentRequest.id);

      if (success) {
        const updatedRequests = requests.filter(
          (request) => request.id !== currentRequest.id
        );
        setRequests(updatedRequests);
      }

      setIsDeleteDialogOpen(false);
      setCurrentRequest(null);
    } catch (error) {
      console.error("Ошибка при удалении заявки:", error);
    }
  };

  const openViewDialog = (request: CustomerRequest) => {
    setCurrentRequest(request);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (request: CustomerRequest) => {
    setCurrentRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Новая</Badge>;
      case "processing":
        return <Badge variant="secondary">В обработке</Badge>;
      case "completed":
        return <Badge variant="success" className="bg-green-500">Завершена</Badge>;
      case "rejected":
        return <Badge variant="destructive">Отклонена</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const exportToExcel = () => {
    const data = filteredRequests.map((request) => ({
      ID: request.id,
      Клиент: request.name,
      Email: request.email,
      Телефон: request.phone,
      Сообщение: request.message,
      Дата: formatDate(request.date),
      Статус:
        request.status === "new"
          ? "Новая"
          : request.status === "processing"
            ? "В обработке"
            : request.status === "completed"
              ? "Завершена"
              : "Отклонена",
      "Выбранный товар": request.calculatorData?.selectedProduct?.name || "-",
      Размер: request.calculatorData
        ? `${request.calculatorData.width} × ${request.calculatorData.height} см`
        : "-",
      Площадь: request.calculatorData?.area ? `${request.calculatorData.area} м²` : "-",
      "Тип окна": request.calculatorData
        ? {
            standard: "Стандартное",
            casement: "Створчатое",
            sliding: "Раздвижное",
            awning: "Откидное",
            "bay-window": "Эркерное",
            "picture-window": "Панорамное",
          }[request.calculatorData.windowType] || request.calculatorData.windowType
        : "-",
      Материал: request.calculatorData
        ? request.calculatorData.material === "vinyl"
          ? "ПВХ (Винил)"
          : request.calculatorData.material === "aluminum"
            ? "Алюминий"
            : request.calculatorData.material === "wooden"
              ? "Дерево"
              : request.calculatorData.material === "fiberglass"
                ? "Стекловолокно"
                : request.calculatorData.material === "composite"
                  ? "Композитный материал"
                  : request.calculatorData.material
        : "-",
      Остекление: request.calculatorData
        ? {
            single: "Одинарное",
            double: "Двойное",
            triple: "Тройное",
            "low-e": "Энергосберегающее",
          }[request.calculatorData.glazingType] || request.calculatorData.glazingType
        : "-",
      "Доп. функции": request.calculatorData?.additionalFeatures?.length
        ? request.calculatorData.additionalFeatures
            .map((feature) => {
              const featureNames: Record<string, string> = {
                "uv-protection": "UV-защита",
                soundproof: "Шумоизоляция",
                "security-glass": "Ударопрочное стекло",
                tinted: "Тонировка",
              };
              return featureNames[feature] || feature;
            })
            .join(", ")
        : "-",
      Количество: request.calculatorData?.quantity
        ? `${request.calculatorData.quantity} шт.`
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заявки");
    XLSX.writeFile(workbook, `Заявки_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-center text-gray-600">Загрузка заявок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <p className="text-center text-red-500">{error}</p>
        <div className="text-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Заявки клиентов</h2>
        <Button
          variant="outline"
          onClick={exportToExcel}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Экспорт в Excel
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Поиск заявок..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Заявки не найдены</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{request.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">
                      {request.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{request.email}</div>
                    <div>{request.phone}</div>
                  </TableCell>
                  <TableCell>{formatDate(request.date)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openViewDialog(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(request)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
          </DialogHeader>
          {currentRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ID заявки</h3>
                  <p>{currentRequest.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Дата</h3>
                  <p>{formatDate(currentRequest.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Статус</h3>
                  <div>{getStatusBadge(currentRequest.status)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Информация о клиенте</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Имя</h4>
                    <p>{currentRequest.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p>{currentRequest.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Телефон</h4>
                    <p>{currentRequest.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Сообщение</h3>
                <p className="whitespace-pre-wrap">{currentRequest.message}</p>
              </div>

              {currentRequest.calculatorData && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Данные калькулятора</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                    {currentRequest.calculatorData.selectedProduct && (
                      <div>
                        <h4 className="text-sm font-medium">Выбранный товар</h4>
                        <p>{currentRequest.calculatorData.selectedProduct.name}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium">Размер</h4>
                      <p>
                        {currentRequest.calculatorData.width} ×{" "}
                        {currentRequest.calculatorData.height} см
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Площадь</h4>
                      <p>{currentRequest.calculatorData.area} м²</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Тип окна</h4>
                      <p className="capitalize">
                        {{
                          standard: "Стандартное",
                          casement: "Створчатое",
                          sliding: "Раздвижное",
                          awning: "Откидное",
                          "bay-window": "Эркерное",
                          "picture-window": "Панорамное",
                        }[currentRequest.calculatorData.windowType] ||
                          currentRequest.calculatorData.windowType}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Материал</h4>
                      <p className="capitalize">
                        {currentRequest.calculatorData.material === "vinyl"
                          ? "ПВХ (Винил)"
                          : currentRequest.calculatorData.material === "aluminum"
                            ? "Алюминий"
                            : currentRequest.calculatorData.material === "wooden"
                              ? "Дерево"
                              : currentRequest.calculatorData.material === "fiberglass"
                                ? "Стекловолокно"
                                : currentRequest.calculatorData.material === "composite"
                                  ? "Композитный материал"
                                  : currentRequest.calculatorData.material}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Остекление</h4>
                      <p className="capitalize">
                        {{
                          single: "Одинарное",
                          double: "Двойное",
                          triple: "Тройное",
                          "low-e": "Энергосберегающее",
                        }[currentRequest.calculatorData.glazingType] ||
                          currentRequest.calculatorData.glazingType}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Количество</h4>
                      <p>{currentRequest.calculatorData.quantity} шт.</p>
                    </div>
                    {currentRequest.calculatorData.additionalFeatures.length > 0 && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium">Дополнительные функции</h4>
                        <p>
                          {currentRequest.calculatorData.additionalFeatures
                            .map((feature) => {
                              const featureNames: Record<string, string> = {
                                "uv-protection": "UV-защита",
                                soundproof: "Шумоизоляция",
                                "security-glass": "Ударопрочное стекло",
                                tinted: "Тонировка",
                              };
                              return featureNames[feature] || feature;
                            })
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Изменить статус</h3>
                <div className="flex gap-2">
                  <Button
                    variant={currentRequest.status === "new" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(currentRequest.id, "new")}
                  >
                    Новая
                  </Button>
                  <Button
                    variant={currentRequest.status === "processing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(currentRequest.id, "processing")}
                  >
                    В обработке
                  </Button>
                  <Button
                    variant={currentRequest.status === "completed" ? "default" : "outline"}
                    size="sm"
                    className={
                      currentRequest.status === "completed"
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                    onClick={() => handleStatusChange(currentRequest.id, "completed")}
                  >
                    <Check className="mr-1 h-3 w-3" /> Завершена
                  </Button>
                  <Button
                    variant={currentRequest.status === "rejected" ? "default" : "outline"}
                    size="sm"
                    className={
                      currentRequest.status === "rejected"
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }
                    onClick={() => handleStatusChange(currentRequest.id, "rejected")}
                  >
                    <X className="mr-1 h-3 w-3" /> Отклонена
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Заявка будет удалена из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRequest}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RequestManagement;