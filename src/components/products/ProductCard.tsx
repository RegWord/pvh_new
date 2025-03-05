import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  id?: string;
  image?: string;
  name?: string;
  description?: string;
  rating?: number;
  onViewDetails?: (id: string) => void;
  onAddToCalculator?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  image = "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=500&q=80",
  name = "Окно Премиум",
  description = "Высококачественное двойное окно с отличными теплоизоляционными свойствами.",
  rating = 4.5,
  onViewDetails = () => {},
  onAddToCalculator = () => {},
}: ProductCardProps) => {
  return (
    <Card className="w-full max-w-[350px] h-[450px] overflow-hidden flex flex-col bg-white transition-all duration-300 hover:shadow-lg">
      <div className="relative w-full h-[220px] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-md text-xs flex items-center">
          <Star className="w-3 h-3 mr-1" />
          <span>{rating}</span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription className="text-gray-500">
          {description.length > 80
            ? `${description.substring(0, 80)}...`
            : description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        {/* Убрано отображение цены */}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-2">
        <Button
          className="w-full"
          onClick={() => onViewDetails(id)}
          variant="default"
        >
          Подробнее
        </Button>
        <Button
          className="w-full"
          onClick={() => onAddToCalculator(id)}
          variant="outline"
        >
          Добавить в калькулятор
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;