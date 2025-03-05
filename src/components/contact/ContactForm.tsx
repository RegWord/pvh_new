import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  email: z.string().email({ message: "Введите корректный email" }),
  phone: z
    .string()
    .min(10, { message: "Телефон должен содержать минимум 10 цифр" })
    .regex(/^\+?[0-9\s-()]+$/, {
      message: "Введите корректный номер телефона",
    }),
  message: z
    .string()
    .min(10, { message: "Сообщение должно содержать минимум 10 символов" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSubmit?: (values: FormValues) => Promise<void>;
  className?: string;
}

const ContactForm = ({
  onSubmit = async (values: FormValues) => {
    try {
      const { createRequest } = await import("@/api/requests");

      // Получаем данные калькулятора, если они есть
      const calculatorDataStr = localStorage.getItem("currentCalculatorData");
      const calculatorData = calculatorDataStr
        ? JSON.parse(calculatorDataStr)
        : undefined;

      // Создаем объект заявки
      const requestData = {
        ...values,
        calculatorData,
      };

      // Отправляем заявку в Firestore
      const newRequest = await createRequest(requestData);
      console.log("Заявка сохранена в Firestore:", newRequest);

      // Очищаем данные калькулятора после отправки
      localStorage.removeItem("currentCalculatorData");
    } catch (error) {
      console.error("Ошибка при сохранении заявки в Firestore:", error);
      throw error; // Передаем ошибку дальше для отображения пользователю
    }
  },
  className = "",
}: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null); // Сбрасываем предыдущую ошибку
    try {
      await onSubmit(values);
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      setSubmitError("Не удалось отправить заявку. Попробуйте еще раз.");
      console.error("Ошибка при отправке формы:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ${className}`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Связаться с нами</h2>

      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="mb-4 text-primary text-5xl">✓</div>
          <h3 className="text-xl font-semibold mb-2">
            Спасибо за ваше сообщение!
          </h3>
          <p className="text-gray-600 mb-6">
            Мы свяжемся с вами в ближайшее время.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Отправить еще сообщение
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {submitError}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Иванов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@mail.ru"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+7 (999) 123-45-67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сообщение</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите ваш запрос или вопрос..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Отправить
                </>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ContactForm;