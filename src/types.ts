export interface Product {
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