import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
}

export interface CustomerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "processing" | "completed" | "rejected";
  calculatorData?: any;
}

// Реальное подключение к MongoDB
export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/masshtab-stroi";
  const dbName = process.env.MONGODB_DB || "masshtab-stroi";

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("Подключение к MongoDB успешно установлено");
    return { client, db };
  } catch (error) {
    console.error("Ошибка подключения к MongoDB:", error);
    throw error;
  }
}

// Функции для работы с продуктами
export async function getProducts(): Promise<Product[]> {
  try {
    // Initialize products in localStorage if they don't exist
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(getDemoProducts()));
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("products");
    const products = (await collection
      .find({})
      .toArray()) as unknown as Product[];
    return products;
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    // Возвращаем демо-данные в случае ошибки
    return getDemoProducts();
  }
}

export async function addProduct(
  product: Omit<Product, "id">,
): Promise<Product> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("products");

    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };

    await collection.insertOne(newProduct);
    return newProduct as Product;
  } catch (error) {
    console.error("Ошибка при добавлении продукта:", error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  product: Partial<Product>,
): Promise<Product> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("products");

    await collection.updateOne({ id }, { $set: product });
    const updatedProduct = (await collection.findOne({
      id,
    })) as unknown as Product;
    return updatedProduct;
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("products");

    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    throw error;
  }
}

// Функции для работы с заявками
export async function getRequests(): Promise<CustomerRequest[]> {
  try {
    // Initialize requests in localStorage if they don't exist
    if (!localStorage.getItem("requests")) {
      localStorage.setItem("requests", JSON.stringify(getDemoRequests()));
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("requests");
    const requests = (await collection
      .find({})
      .toArray()) as unknown as CustomerRequest[];
    return requests;
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    // Возвращаем демо-данные в случае ошибки
    return getDemoRequests();
  }
}

export async function addRequest(
  request: Omit<CustomerRequest, "id" | "date" | "status">,
): Promise<CustomerRequest> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("requests");

    const newRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "new" as const,
    };

    await collection.insertOne(newRequest);
    return newRequest as CustomerRequest;
  } catch (error) {
    console.error("Ошибка при добавлении заявки:", error);
    throw error;
  }
}

export async function updateRequest(
  id: string,
  request: Partial<CustomerRequest>,
): Promise<CustomerRequest> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("requests");

    await collection.updateOne({ id }, { $set: request });
    const updatedRequest = (await collection.findOne({
      id,
    })) as unknown as CustomerRequest;
    return updatedRequest;
  } catch (error) {
    console.error("Ошибка при обновлении заявки:", error);
    throw error;
  }
}

export async function deleteRequest(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("requests");

    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    throw error;
  }
}

// Демо-данные для случаев, когда нет подключения к БД
function getDemoProducts(): Product[] {
  return [
    {
      id: "1",
      name: "Окно ПВХ Премиум",
      description:
        "Высококачественное двойное окно с отличными теплоизоляционными свойствами.",
      price: 15000,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500&q=80",
      category: "vinyl",
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
    },
    {
      id: "2",
      name: "Алюминиевое раздвижное окно",
      description:
        "Современное раздвижное окно с тонкой алюминиевой рамой, идеально подходит для современных домов.",
      price: 18500,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=500&q=80",
      category: "aluminum",
      features: [
        "Тонкий профиль",
        "Плавный механизм скольжения",
        "Устойчивость к коррозии",
        "Несколько точек запирания",
        "Возможность изготовления по индивидуальным размерам",
      ],
      specifications: {
        Материал: "Алюминий",
        "Тип стекла": "Двойное, закаленное",
        "Цвет рамы": "Серебристый",
        "U-Value": "0.35 W/m²K",
        Шумоизоляция: "32dB",
        Безопасность: "Многоточечная система запирания",
      },
      images: [
        "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=800&q=80",
        "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=80",
        "https://images.unsplash.com/photo-1605117503035-1fa9f79999d7?w=800&q=80",
      ],
    },
  ];
}

function getDemoRequests(): CustomerRequest[] {
  return [
    {
      id: "1",
      name: "Иван Иванов",
      email: "ivan@example.com",
      phone: "+7 (999) 123-45-67",
      message:
        "Интересуют пластиковые окна для квартиры. Нужна консультация по выбору.",
      date: "2023-06-15T10:30:00",
      status: "new",
      calculatorData: {
        width: 150,
        height: 180,
        windowType: "standard",
        material: "vinyl",
        glazingType: "double",
        additionalFeatures: ["uv-protection"],
        quantity: 3,
        estimatedPrice: 45000,
      },
    },
    {
      id: "2",
      name: "Мария Петрова",
      email: "maria@example.com",
      phone: "+7 (999) 987-65-43",
      message:
        "Хочу заказать алюминиевые окна для офиса. Нужен замер и расчет стоимости.",
      date: "2023-06-14T15:45:00",
      status: "processing",
    },
  ];
}
