import React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const Footer = ({
  companyName = "МАСШТАБ-СТРОЙ СОЧИ",
  address = "",
  phone = "+7 (988) 149-99-89",
  email = "mashtabss@mail.ru",
  socialLinks = {
    facebook: "",
    instagram: "",
    twitter: "",
  },
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-4 md:px-8 lg:px-12 bg-opacity-95">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{companyName}</h3>
            <p className="text-gray-300 max-w-xs">
              ООО «МАСШТАБ-СТРОЙ СОЧИ», является производственной монтажной
              компанией по изготовлению и установке металлопластиковых и
              алюминиевых конструкций, противопожарных конструкций, стеклянных
              ограждений, роллет и секционных ворот.
            </p>
            {/* Социальные сети пока отсутствуют */}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Продукция
                </a>
              </li>
              <li>
                <a
                  href="#calculator"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Калькулятор
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Контакты
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Панель администратора
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Контактная информация</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-gray-400" />
                <a
                  href={`tel:${phone.replace(/[\s()-]/g, "")}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 border-white text-white hover:bg-white hover:text-gray-900"
            >
              Связаться с нами
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>
            © {currentYear} {companyName}. Все права защищены.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
