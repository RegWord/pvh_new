import React, { useState } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react"; // Добавлен импорт User
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  onAdminLogin?: () => void;
}

const Header = ({ onAdminLogin = () => {} }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Главная", href: "#" },
    { name: "Продукты", href: "#products" },
    { name: "Калькулятор", href: "#calculator" },
    { name: "Контакты", href: "#contact" },
  ];

  const productCategories = [
    { name: "Пластиковые окна", href: "#plastic-windows" },
    { name: "Алюминиевые окна", href: "#aluminum-windows" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <span className="text-xl font-bold text-primary">
              МАСШТАБ-СТРОЙ СОЧИ
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item, index) => {
                if (item.name === "Продукты") {
                  return (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuTrigger className="text-base font-medium">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                          {productCategories.map((category, idx) => (
                            <li key={idx}>
                              <NavigationMenuLink asChild>
                                <a
                                  href={category.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {category.name}
                                  </div>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink asChild>
                      <a
                        href={item.href}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {item.name}
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
          {/* Кнопка "Вход" убрана из десктопной версии */}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-white border-b border-gray-200 shadow-md transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navItems.map((item, index) => {
            if (item.name === "Продукты") {
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <a
                      href={item.href}
                      className="text-base font-medium hover:text-primary"
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </a>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                    {productCategories.map((category, idx) => (
                      <a
                        key={idx}
                        href={category.href}
                        className="block text-sm hover:text-primary"
                        onClick={toggleMenu}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={index}
                href={item.href}
                className="block text-base font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                {item.name}
              </a>
            );
          })}
          <div className="pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1"
              onClick={() => {
                onAdminLogin();
                toggleMenu();
              }}
            >
              <User className="h-4 w-4" />
              <span>Вход для администратора</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
