import React, { useState, useEffect } from "react";
import { Calculator, Info, Plus, Minus, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface PriceCalculatorProps {
  onSubmitRequest?: (calculatorData: CalculatorData) => void;
  defaultProduct?: ProductType | null;
}

interface CalculatorData {
  width: number;
  height: number;
  windowType: string;
  material: string;
  glazingType: string;
  additionalFeatures: string[];
  quantity: number;
  selectedProduct?: ProductType; // Добавляем выбранный продукт
}

interface ProductType {
  id: string;
  name: string;
  category: string;
}

const PriceCalculator = ({
  onSubmitRequest = () => {},
  defaultProduct = null,
}: PriceCalculatorProps) => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>(() => {
    const storedProduct = localStorage.getItem("selectedProduct");
    const initialProduct = storedProduct ? JSON.parse(storedProduct) : defaultProduct;
    return {
      width: 100,
      height: 100,
      windowType: "standard",
      material: initialProduct?.category || "vinyl",
      glazingType: "double",
      additionalFeatures: [],
      quantity: 1,
      selectedProduct: initialProduct,
    };
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Загружаем категории из Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { fetchProducts } = await import("@/api/products");
        const products = await fetchProducts();
        const uniqueCategories = [
          ...new Set(products.map((product: ProductType) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFeatureToggle = (feature: string) => {
    setCalculatorData((prev) => {
      const features = [...prev.additionalFeatures];
      if (features.includes(feature)) {
        return {
          ...prev,
          additionalFeatures: features.filter((f) => f !== feature),
        };
      } else {
        return {
          ...prev,
          additionalFeatures: [...features, feature],
        };
      }
    });
  };

  const incrementQuantity = () => {
    setCalculatorData((prev) => ({
      ...prev,
      quantity: prev.quantity + 1,
    }));
  };

  const decrementQuantity = () => {
    setCalculatorData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity - 1),
    }));
  };

  const handleSubmit = () => {
    setIsRequestModalOpen(true); // Открываем модальное окно для заявки
  };

  const handleRequestSubmit = async () => {
    try {
      const { createRequest } = await import("@/api/requests");
      const requestData = {
        ...requestForm,
        calculatorData: {
          ...calculatorData,
          area: ((calculatorData.width * calculatorData.height) / 10000).toFixed(2), // Добавляем площадь
        },
        date: new Date().toISOString(),
        status: "new",
      };
      await createRequest(requestData);
      console.log("Заявка успешно отправлена:", requestData);
      setIsRequestModalOpen(false);
      setRequestForm({ name: "", phone: "", email: "", message: "" });
      localStorage.removeItem("selectedProduct"); // Очищаем после отправки
      onSubmitRequest(calculatorData); // Вызываем callback
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Калькулятор параметров окон</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Размеры и тип</CardTitle>
            <CardDescription>Укажите размеры и выберите тип окна</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="width" className="text-sm font-medium leading-none">
                  Ширина (см)
                </label>
                <div className="flex items-center gap-1">
                  <Info
                    className="h-4 w-4 text-muted-foreground cursor-help"
                    onMouseEnter={() => setActiveTooltip("width")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                  {activeTooltip === "width" && (
                    <div className="absolute bg-black text-white text-xs p-2 rounded shadow-lg max-w-xs z-50">
                      Укажите ширину окна в сантиметрах
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[calculatorData.width]}
                  min={30}
                  max={300}
                  step={1}
                  onValueChange={(value) =>
                    setCalculatorData((prev) => ({ ...prev, width: value[0] }))
                  }
                  className="flex-grow"
                />
                <Input
                  id="width"
                  type="number"
                  value={calculatorData.width}
                  onChange={(e) =>
                    setCalculatorData((prev) => ({
                      ...prev,
                      width: Number(e.target.value),
                    }))
                  }
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="height" className="text-sm font-medium leading-none">
                  Высота (см)
                </label>
                <div className="flex items-center gap-1">
                  <Info
                    className="h-4 w-4 text-muted-foreground cursor-help"
                    onMouseEnter={() => setActiveTooltip("height")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                  {activeTooltip === "height" && (
                    <div className="absolute bg-black text-white text-xs p-2 rounded shadow-lg max-w-xs z-50">
                      Укажите высоту окна в сантиметрах
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[calculatorData.height]}
                  min={30}
                  max={300}
                  step={1}
                  onValueChange={(value) =>
                    setCalculatorData((prev) => ({ ...prev, height: value[0] }))
                  }
                  className="flex-grow"
                />
                <Input
                  id="height"
                  type="number"
                  value={calculatorData.height}
                  onChange={(e) =>
                    setCalculatorData((prev) => ({
                      ...prev,
                      height: Number(e.target.value),
                    }))
                  }
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="windowType" className="text-sm font-medium leading-none">
                Тип окна
              </label>
              <Select
                value={calculatorData.windowType}
                onValueChange={(value) =>
                  setCalculatorData((prev) => ({ ...prev, windowType: value }))
                }
              >
                <SelectTrigger id="windowType">
                  <SelectValue placeholder="Выберите тип окна" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Стандартное</SelectItem>
                  <SelectItem value="casement">Створчатое</SelectItem>
                  <SelectItem value="sliding">Раздвижное</SelectItem>
                  <SelectItem value="awning">Откидное</SelectItem>
                  <SelectItem value="bay-window">Эркерное</SelectItem>
                  <SelectItem value="picture-window">Панорамное</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Материалы и особенности</CardTitle>
            <CardDescription>Выберите материал и дополнительные опции</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="material" className="text-sm font-medium leading-none">
                Материал рамы
              </label>
              <Select
                value={calculatorData.material}
                onValueChange={(value) =>
                  setCalculatorData((prev) => ({ ...prev, material: value }))
                }
              >
                <SelectTrigger id="material">
                  <SelectValue placeholder="Выберите материал" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "vinyl"
                        ? "ПВХ (Винил)"
                        : category === "aluminum"
                          ? "Алюминий"
                          : category === "wooden"
                            ? "Дерево"
                            : category === "fiberglass"
                              ? "Стекловолокно"
                              : category === "composite"
                                ? "Композитный материал"
                                : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="glazingType" className="text-sm font-medium leading-none">
                Тип остекления
              </label>
              <Select
                value={calculatorData.glazingType}
                onValueChange={(value) =>
                  setCalculatorData((prev) => ({ ...prev, glazingType: value }))
                }
              >
                <SelectTrigger id="glazingType">
                  <SelectValue placeholder="Выберите тип остекления" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Одинарное</SelectItem>
                  <SelectItem value="double">Двойное</SelectItem>
                  <SelectItem value="triple">Тройное</SelectItem>
                  <SelectItem value="low-e">Энергосберегающее</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium leading-none">
                Дополнительные функции
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uv-protection"
                    checked={calculatorData.additionalFeatures.includes("uv-protection")}
                    onCheckedChange={() => handleFeatureToggle("uv-protection")}
                  />
                  <label
                    htmlFor="uv-protection"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    UV-защита
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="soundproof"
                    checked={calculatorData.additionalFeatures.includes("soundproof")}
                    onCheckedChange={() => handleFeatureToggle("soundproof")}
                  />
                  <label
                    htmlFor="soundproof"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Шумоизоляция
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="security-glass"
                    checked={calculatorData.additionalFeatures.includes("security-glass")}
                    onCheckedChange={() => handleFeatureToggle("security-glass")}
                  />
                  <label
                    htmlFor="security-glass"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ударопрочное стекло
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tinted"
                    checked={calculatorData.additionalFeatures.includes("tinted")}
                    onCheckedChange={() => handleFeatureToggle("tinted")}
                  />
                  <label
                    htmlFor="tinted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Тонировка
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Итоговые параметры</CardTitle>
            <CardDescription>Подтвердите выбранные параметры</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium leading-none">
                Количество
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={calculatorData.quantity <= 1}
                  className="rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={calculatorData.quantity}
                  onChange={(e) =>
                    setCalculatorData((prev) => ({
                      ...prev,
                      quantity: Math.max(1, Number(e.target.value)),
                    }))
                  }
                  className="w-16 rounded-none text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4">
              {calculatorData.selectedProduct && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Выбранный товар:</span>
                  <span>{calculatorData.selectedProduct.name}</span>
                </div>
              )}
              <div className="flex justify-between text-sm mb-2">
                <span>Размер:</span>
                <span>
                  {calculatorData.width} × {calculatorData.height} см
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Площадь:</span>
                <span>
                  {((calculatorData.width * calculatorData.height) / 10000).toFixed(2)} м²
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Тип окна:</span>
                <span className="capitalize">
                  {{
                    standard: "Стандартное",
                    casement: "Створчатое",
                    sliding: "Раздвижное",
                    awning: "Откидное",
                    "bay-window": "Эркерное",
                    "picture-window": "Панорамное",
                  }[calculatorData.windowType] || calculatorData.windowType}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Материал:</span>
                <span className="capitalize">
                  {calculatorData.material === "vinyl"
                    ? "ПВХ (Винил)"
                    : calculatorData.material === "aluminum"
                      ? "Алюминий"
                      : calculatorData.material === "wooden"
                        ? "Дерево"
                        : calculatorData.material === "fiberglass"
                          ? "Стекловолокно"
                          : calculatorData.material === "composite"
                            ? "Композитный материал"
                            : calculatorData.material}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Остекление:</span>
                <span className="capitalize">
                  {{
                    single: "Одинарное",
                    double: "Двойное",
                    triple: "Тройное",
                    "low-e": "Энергосберегающее",
                  }[calculatorData.glazingType] || calculatorData.glazingType}
                </span>
              </div>
              {calculatorData.additionalFeatures.length > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Доп. функции:</span>
                  <span className="text-right">
                    {calculatorData.additionalFeatures
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
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm mb-2">
                <span>Количество:</span>
                <span>{calculatorData.quantity} шт.</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <Check className="h-4 w-4" />
              Оформить заявку
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Модальное окно для заявки */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Оформить заявку</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                value={requestForm.name}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Телефон
              </Label>
              <Input
                id="phone"
                value={requestForm.phone}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={requestForm.email}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="text-right">
                Сообщение
              </Label>
              <Textarea
                id="message"
                value={requestForm.message}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, message: e.target.value }))
                }
                className="col-span-3"
                rows={4}
                placeholder="Укажите дополнительные пожелания..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleRequestSubmit}>Отправить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceCalculator;