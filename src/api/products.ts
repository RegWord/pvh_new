import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Ошибка при загрузке продуктов:", error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    return { ...product, id: docRef.id };
  } catch (error) {
    console.error("Ошибка при добавлении продукта:", error);
    throw error;
  }
};

export const editProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, product);
    return { ...product, id } as Product;
  } catch (error) {
    console.error("Ошибка при редактировании продукта:", error);
    throw error;
  }
};

export const removeProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "products", id));
    return true;
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    throw error;
  }
};