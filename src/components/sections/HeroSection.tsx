import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

const HeroSection = ({
  title = "МАСШТАБ-СТРОЙ СОЧИ",
  subtitle = "Премиальные окна и двери для вашего дома с профессиональной установкой",
  backgroundImage = "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1920&q=80",
  ctaText = "Рассчитать параметры",
  secondaryCtaText = "Наши продукты",
  onCtaClick = () => {},
  onSecondaryCtaClick = () => {},
}: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[700px] bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src={backgroundImage}
          alt="Premium Windows"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-start md:justify-center items-start sm:justify-start">
        <div className="max-w-2xl mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-base font-medium"
              onClick={onCtaClick}
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base font-medium bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
              onClick={onSecondaryCtaClick}
            >
              {secondaryCtaText}
            </Button>
          </div>
        </div>

        {/* Floating Features */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-center p-2">
                <div className="font-bold text-2xl">10+</div>
                <div className="text-sm">Лет опыта</div>
              </div>
              <div className="text-center p-2">
                <div className="font-bold text-2xl">500+</div>
                <div className="text-sm">Довольных клиентов</div>
              </div>
              <div className="text-center p-2">
                <div className="font-bold text-2xl">5</div>
                <div className="text-sm">Лет гарантии</div>
              </div>
              <div className="text-center p-2">
                <div className="font-bold text-2xl">24/7</div>
                <div className="text-sm">Поддержка клиентов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
