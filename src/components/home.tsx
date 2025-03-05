import React, { useState } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HeroSection from "./sections/HeroSection";
import ProductSection from "./sections/ProductSection";
import PriceCalculator from "./calculator/PriceCalculator";
import ContactForm from "./contact/ContactForm";

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    const calculatorSection = document.getElementById("calculator");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCalculatorSubmit = (calculatorData) => {
    console.log("Calculator data submitted:", calculatorData);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = async (formData) => {
    try {
      const { createRequest } = await import("@/api/requests");

      // Получаем данные калькулятора, если они есть
      const calculatorDataStr = localStorage.getItem("currentCalculatorData");
      const calculatorData = calculatorDataStr ? JSON.parse(calculatorDataStr) : null;

      // Создаем объект заявки, исключая calculatorData, если оно null
      const requestData = {
        ...formData,
        ...(calculatorData && { calculatorData }), // Добавляем только если есть данные
      };

      // Сохраняем заявку в Firestore
      const newRequest = await createRequest(requestData);
      console.log("Заявка успешно сохранена в Firestore:", newRequest);

      // Очищаем данные калькулятора после отправки
      localStorage.removeItem("currentCalculatorData");
    } catch (error) {
      console.error("Ошибка при сохранении заявки:", error);
      throw error; // Ошибка передается в ContactForm для отображения
    }
  };

  const handleAdminLogin = () => {
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onAdminLogin={handleAdminLogin} />

      <main className="flex-grow">
        <HeroSection
          onCtaClick={() => {
            const calculatorSection = document.getElementById("calculator");
            if (calculatorSection) {
              calculatorSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          onSecondaryCtaClick={() => {
            const productsSection = document.getElementById("products");
            if (productsSection) {
              productsSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        <ProductSection />

        <section id="calculator" className="py-16 px-4 md:px-8 bg-gray-100">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Рассчитайте параметры окон
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Используйте наш калькулятор, чтобы подобрать параметры окон с учетом ваших требований и предпочтений.
              </p>
            </div>
            <PriceCalculator
              defaultProduct={selectedProduct}
              onSubmitRequest={handleCalculatorSubmit}
            />
          </div>
        </section>

        <section id="contact" className="py-16 px-4 md:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Свяжитесь с нами
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                У вас есть вопросы или вы готовы сделать заказ? Заполните форму
                ниже, и наши специалисты свяжутся с вами в ближайшее время.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-6">Наш офис</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Часы работы</h4>
                    <p className="text-gray-600">Пн-Пт: 9:00 - 18:00</p>
                    <p className="text-gray-600">Сб: 10:00 - 15:00</p>
                    <p className="text-gray-600">Вс: Выходной</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Контакты</h4>
                    <p className="text-gray-600">Телефон: +7 (988) 149-99-89</p>
                    <p className="text-gray-600">Email: mashtabss@mail.ru</p>
                  </div>
                </div>
              </div>
              <ContactForm onSubmit={handleContactSubmit} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;