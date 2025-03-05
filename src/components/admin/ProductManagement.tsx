import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    rating: 4.5,
    image: "",
    category: "vinyl",
    features: [""],
    specifications: { "": "" },
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const { fetchProducts } = await import("@/api/products");
        const productsData = await fetchProducts();
        setProducts(productsData || []);
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
        setError("Не удалось загрузить продукты");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (product?.name?.toLowerCase?.() || "").includes(searchQuery.toLowerCase()) ||
      (product?.description?.toLowerCase?.() || "").includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: formData.name || "Новый продукт",
        description: formData.description || "Описание продукта",
        rating: formData.rating || 4.5,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500&q=80",
        category: formData.category || "vinyl",
        features: formData.features || [],
        specifications: formData.specifications || {},
        images: formData.images || [
          formData.image ||
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500&q=80",
        ],
      };

      const { createProduct } = await import("@/api/products");
      const newProduct = await createProduct(productData);

      if (newProduct) {
        setProducts([...products, newProduct]);
      }

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Ошибка при добавлении продукта:", error);
    }
  };

  const handleEditProduct = async () => {
    if (!currentProduct) return;

    try {
      const productData = {
        name: formData.name || currentProduct.name,
        description: formData.description || currentProduct.description,
        rating:
          formData.rating !== undefined ? formData.rating : currentProduct.rating,
        category: formData.category || currentProduct.category,
        image: formData.image || currentProduct.image,
        features: formData.features || currentProduct.features,
        specifications: formData.specifications || currentProduct.specifications,
        images: formData.images || currentProduct.images,
      };

      const { editProduct } = await import("@/api/products");
      const updatedProduct = await editProduct(currentProduct.id, productData);

      if (updatedProduct) {
        const updatedProducts = products.map((product) =>
          product.id === currentProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
      }

      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Ошибка при редактировании продукта:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;

    try {
      const { removeProduct } = await import("@/api/products");
      const success = await removeProduct(currentProduct.id);

      if (success) {
        const updatedProducts = products.filter(
          (product) => product.id !== currentProduct.id
        );
        setProducts(updatedProducts);
      }

      setIsDeleteDialogOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
    }
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      rating: product.rating,
      category: product.category,
      image: product.image,
      features: product.features,
      specifications: product.specifications,
      images: product.images,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      rating: 4.5,
      image: "",
      category: "vinyl",
      features: [""],
      specifications: { "": "" },
      images: [],
    });
    setCurrentProduct(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...(formData.images || []), ""],
    });
  };

  const removeImageField = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Добавить товар
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Поиск товаров..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Товары не найдены</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[200px]">Изображение</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[300px]">
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {product.category === "vinyl"
                        ? "ПВХ"
                        : product.category === "aluminum"
                          ? "Алюминий"
                          : product.category === "wooden"
                            ? "Дерево"
                            : product.category}
                    </span>
                  </TableCell>
                  <TableCell>{product.rating.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(product)}
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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить новый товар</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Рейтинг
              </Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Категория
              </Label>
              <div className="col-span-3 flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vinyl">ПВХ (Винил)</SelectItem>
                    <SelectItem value="aluminum">Алюминий</SelectItem>
                    <SelectItem value="wooden">Дерево</SelectItem>
                    <SelectItem value="fiberglass">Стекловолокно</SelectItem>
                    <SelectItem value="composite">Композитный материал</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Новая категория"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData({
                        ...formData,
                        category: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      });
                    }
                  }}
                  className="w-1/2"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Основное изображение
              </Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Дополнительные изображения</Label>
              <div className="col-span-3 space-y-2">
                {formData.images?.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Изображение ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => removeImageField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={addImageField}
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить изображение
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Описание
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Особенности</Label>
              <div className="col-span-3 space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(formData.features || [])];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      placeholder={`Особенность ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => {
                        const newFeatures = [...(formData.features || [])];
                        newFeatures.splice(index, 1);
                        setFormData({ ...formData, features: newFeatures });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      features: [...(formData.features || []), ""],
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить особенность
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Характеристики</Label>
              <div className="col-span-3 space-y-2">
                {formData.specifications &&
                  Object.entries(formData.specifications).map(
                    ([key, value], index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const newSpecs = { ...(formData.specifications || {}) };
                            const oldKey = Object.keys(formData.specifications || {})[index];
                            newSpecs[e.target.value] = newSpecs[oldKey];
                            delete newSpecs[oldKey];
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                          placeholder="Название"
                          className="w-1/2"
                        />
                        <Input
                          value={value}
                          onChange={(e) => {
                            const newSpecs = { ...(formData.specifications || {}) };
                            const currentKey = Object.keys(formData.specifications || {})[index];
                            newSpecs[currentKey] = e.target.value;
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                          placeholder="Значение"
                          className="w-1/2"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => {
                            const newSpecs = { ...(formData.specifications || {}) };
                            const keyToRemove = Object.keys(formData.specifications || {})[index];
                            delete newSpecs[keyToRemove];
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const newSpecs = { ...(formData.specifications || {}) };
                    newSpecs[""] = "";
                    setFormData({ ...formData, specifications: newSpecs });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить характеристику
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddProduct}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Название
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-rating" className="text-right">
                Рейтинг
              </Label>
              <Input
                id="edit-rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Категория
              </Label>
              <div className="col-span-3 flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vinyl">ПВХ (Винил)</SelectItem>
                    <SelectItem value="aluminum">Алюминий</SelectItem>
                    <SelectItem value="wooden">Дерево</SelectItem>
                    <SelectItem value="fiberglass">Стекловолокно</SelectItem>
                    <SelectItem value="composite">Композитный материал</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Новая категория"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData({
                        ...formData,
                        category: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      });
                    }
                  }}
                  className="w-1/2"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                Основное изображение
              </Label>
              <Input
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Дополнительные изображения</Label>
              <div className="col-span-3 space-y-2">
                {formData.images?.map((img, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Изображение ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => removeImageField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={addImageField}
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить изображение
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Описание
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Особенности</Label>
              <div className="col-span-3 space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(formData.features || [])];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      placeholder={`Особенность ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => {
                        const newFeatures = [...(formData.features || [])];
                        newFeatures.splice(index, 1);
                        setFormData({ ...formData, features: newFeatures });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      features: [...(formData.features || []), ""],
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить особенность
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Характеристики</Label>
              <div className="col-span-3 space-y-2">
                {formData.specifications &&
                  Object.entries(formData.specifications).map(
                    ([key, value], index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const newSpecs = { ...(formData.specifications || {}) };
                            const oldKey = Object.keys(formData.specifications || {})[index];
                            newSpecs[e.target.value] = newSpecs[oldKey];
                            delete newSpecs[oldKey];
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                          placeholder="Название"
                          className="w-1/2"
                        />
                        <Input
                          value={value}
                          onChange={(e) => {
                            const newSpecs = { ...(formData.specifications || {}) };
                            const currentKey = Object.keys(formData.specifications || {})[index];
                            newSpecs[currentKey] = e.target.value;
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                          placeholder="Значение"
                          className="w-1/2"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => {
                            const newSpecs = { ...(formData.specifications || {}) };
                            const keyToRemove = Object.keys(formData.specifications || {})[index];
                            delete newSpecs[keyToRemove];
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const newSpecs = { ...(formData.specifications || {}) };
                    newSpecs[""] = "";
                    setFormData({ ...formData, specifications: newSpecs });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить характеристику
                </Button>
              </div>
            </div>
            {currentProduct && (
              <>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Текущий рейтинг</Label>
                  <div className="col-span-3">
                    <p>{currentProduct.rating.toFixed(1)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Текущие изображения</Label>
                  <div className="col-span-3 space-y-2">
                    {currentProduct.images.map((img, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <img
                          src={img}
                          alt={`Изображение ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <span className="text-sm text-gray-500 truncate">
                          {img}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditProduct}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
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

export default ProductManagement;