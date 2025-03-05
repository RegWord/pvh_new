import React, { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import ProductCard from "../products/ProductCard";
import ProductModal from "../products/ProductModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Product {
  id: string;
  name: string;
  description: string;
  rating: number;
  image: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
}

interface ProductSectionProps {
  products?: Product[];
  title?: string;
  description?: string;
}

const ProductSection = ({
  products = [
    {
      id: "1",
      name: "Premium Vinyl Window",
      description:
        "High-quality double-glazed window with excellent thermal insulation properties.",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500&q=80",
      category: "vinyl",
      features: [
        "Energy efficient double glazing",
        "UV protection coating",
        "Soundproof design",
        "Easy maintenance",
        "Lifetime warranty",
      ],
      specifications: {
        Material: "Vinyl/PVC",
        "Glass Type": "Double glazed, Low-E",
        "Frame Color": "White",
        "U-Value": "0.30 W/m²K",
        "Sound Reduction": "35dB",
        Security: "Multi-point locking system",
      },
      images: [
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
        "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      ],
    },
    {
      id: "2",
      name: "Aluminum Sliding Window",
      description:
        "Modern sliding window with slim aluminum frame, perfect for contemporary homes.",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=500&q=80",
      category: "aluminum",
      features: [
        "Slim profile design",
        "Smooth sliding mechanism",
        "Corrosion resistant",
        "Multiple locking points",
        "Custom sizing available",
      ],
      specifications: {
        Material: "Aluminum",
        "Glass Type": "Double glazed, Tempered",
        "Frame Color": "Silver",
        "U-Value": "0.35 W/m²K",
        "Sound Reduction": "32dB",
        Security: "Multi-point locking system",
      },
      images: [
        "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=800&q=80",
        "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=80",
        "https://images.unsplash.com/photo-1605117503035-1fa9f79999d7?w=800&q=80",
      ],
    },
    {
      id: "3",
      name: "Wooden Frame Window",
      description:
        "Classic wooden frame windows that add warmth and character to traditional homes.",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80",
      category: "wooden",
      features: [
        "Natural wood aesthetics",
        "Excellent insulation",
        "Environmentally friendly",
        "Custom finishes available",
        "Traditional craftsmanship",
      ],
      specifications: {
        Material: "Solid Pine/Oak",
        "Glass Type": "Double glazed, Argon filled",
        "Frame Color": "Natural wood/Custom stain",
        "U-Value": "0.28 W/m²K",
        "Sound Reduction": "38dB",
        Security: "Traditional lock with modern security",
      },
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "https://images.unsplash.com/photo-1604148482093-d58fdd7a8b0e?w=800&q=80",
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
      ],
    },
    {
      id: "4",
      name: "Energy Efficient Casement",
      description:
        "Top-rated energy efficient casement windows with triple glazing for maximum insulation.",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&q=80",
      category: "vinyl",
      features: [
        "Triple glazed glass",
        "Highest energy efficiency rating",
        "Argon gas filled",
        "Thermal break technology",
        "Weather-resistant seals",
      ],
      specifications: {
        Material: "Reinforced Vinyl",
        "Glass Type": "Triple glazed, Low-E",
        "Frame Color": "White/Custom",
        "U-Value": "0.18 W/m²K",
        "Sound Reduction": "42dB",
        Security: "Advanced multi-point locking",
      },
      images: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7ddd0d8a99f?w=800&q=80",
        "https://images.unsplash.com/photo-1600607688066-890987f19a02?w=800&q=80",
      ],
    },
  ],
  title = "Наши Окна",
  description = "Выберите идеальные окна для вашего дома из нашей премиальной коллекции. Все окна изготовлены из высококачественных материалов и обеспечивают отличную теплоизоляцию.",
}: ProductSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsData, setProductsData] = useState<Product[]>(products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const { fetchProducts } = await import("@/api/products");
        const data = await fetchProducts();
        setProductsData(data || []);
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
        setError("Не удалось загрузить продукты");
        setProductsData(products);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  const categories = [
    "all",
    ...new Set(productsData.map((product) => product.category)),
  ];

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch =
      (product?.name?.toLowerCase?.() || "").includes(searchQuery.toLowerCase()) ||
      (product?.description?.toLowerCase?.() || "").includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || product?.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (id: string) => {
    const product = productsData.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleAddToCalculator = (id: string) => {
    console.log(`Adding product ${id} to calculator`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-gray-50" id="products">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-gray-600">Загрузка продуктов...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 md:px-8 bg-gray-50" id="products">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50" id="products">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Поиск окон..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="all"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-1">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category === "all"
                      ? "Все"
                      : category === "vinyl"
                        ? "ПВХ"
                        : category === "aluminum"
                          ? "Алюминий"
                          : category === "wooden"
                            ? "Дерево"
                            : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">
              Нет результатов по вашему запросу
            </h3>
            <p className="mt-2 text-gray-500">
              Попробуйте изменить параметры поиска
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                rating={product.rating}
                onViewDetails={handleViewDetails}
                onAddToCalculator={handleAddToCalculator}
              />
            ))}
          </div>
        )}

        {filteredProducts.length > 0 && filteredProducts.length < productsData.length && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Показать все окна
            </Button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default ProductSection;