
import { Home, Book, Calendar, Award, Target } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Técnicas", url: "/tecnicas", icon: Book },
  { title: "Treinos", url: "/treinos", icon: Calendar },
  { title: "Competições", url: "/competicoes", icon: Award },
  { title: "Objetivos", url: "/objetivos", icon: Target },
];

export function MobileNav() {
  const [activeItem, setActiveItem] = useState("/");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.url;
          return (
            <a
              key={item.title}
              href={item.url}
              onClick={() => setActiveItem(item.url)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-bjj-gold bg-bjj-gold/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
