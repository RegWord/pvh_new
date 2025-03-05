import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CustomerRequest } from "@/types";

export const fetchRequests = async (): Promise<CustomerRequest[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "requests"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CustomerRequest[];
  } catch (error) {
    console.error("Ошибка при загрузке заявок:", error);
    throw error;
  }
};

export const createRequest = async (
  request: Omit<CustomerRequest, "id" | "date" | "status">
): Promise<CustomerRequest> => {
  try {
    const newRequest = {
      ...request,
      date: new Date().toISOString(),
      status: "new" as const,
    };
    const docRef = await addDoc(collection(db, "requests"), newRequest);
    return { ...newRequest, id: docRef.id };
  } catch (error) {
    console.error("Ошибка при добавлении заявки:", error);
    throw error;
  }
};

export const editRequest = async (
  id: string,
  request: Partial<CustomerRequest>
): Promise<CustomerRequest> => {
  try {
    const docRef = doc(db, "requests", id);
    await updateDoc(docRef, request);
    return { ...request, id } as CustomerRequest;
  } catch (error) {
    console.error("Ошибка при редактировании заявки:", error);
    throw error;
  }
};

export const removeRequest = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "requests", id));
    return true;
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    throw error;
  }
};