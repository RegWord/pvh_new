import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  product?: {
    id: string;
    name: string;
    description: string;
    rating: number;
    features: string[];
    specifications: Record<string, string>;
    images: string[];
    category: string; // Добавляем category для передачи в калькулятор
  };
}

const ProductModal = ({
  isOpen = true,
  onClose = () => {},
  product = {
    id: "1",
    name: "Окно ПВХ Премиум",
    description:
      "Высококачественные окна из ПВХ с отличными изоляционными свойствами. Идеально подходят для жилых зданий, где важна энергоэффективность и долговечность.",
    rating: 4.5,
    features: [
      "Энергоэффективное двойное остекление",
      "UV-защитное покрытие",
      "Шумоизоляция",
      "Легкое обслуживание",
      "Пожизненная гарантия",
    ],
    specifications: {
      Материал: "ПВХ/Винил",
      "Тип стекла": "Двойное, Low-E",
      "Цвет рамы": "Белый",
      "U-Value": "0.30 W/m²K",
      Шумоизоляция: "35dB",
      Безопасность: "Многоточечная система запирания",
    },
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
      "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    ],
    category: "vinyl",
  },
}: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleAddToCalculator = () => {
    // Сохраняем выбранный продукт в localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    // Перенаправляем в калькулятор
    const calculatorSection = document.getElementById("calculator");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" });
    }
    onClose(); // Закрываем модальное окно
  };

  const handleRequestCalculation = () => {
    // То же самое, что "Добавить в калькулятор"
    handleAddToCalculator();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product Images */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-primary" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mt-auto space-y-3">
              <Button className="w-full" onClick={handleAddToCalculator}>
                Добавить в калькулятор
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestCalculation}
              >
                Запросить расчет
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Features and Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Особенности</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Характеристики</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(
                ([key, value], index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;