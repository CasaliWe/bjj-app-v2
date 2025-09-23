import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ImageSheet = ({ open, onOpenChange, src, alt = "Imagem", side = "right" }) => {
  if (!src) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="p-3 w-[85vw] sm:max-w-sm z-[9999]">
        {/* Título acessível (visualmente escondido) para cumprir requisitos do Dialog */}
        <SheetHeader className="sr-only">
          <SheetTitle>Pré-visualização da imagem</SheetTitle>
        </SheetHeader>
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[80vh] object-contain select-none"
            draggable={false}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ImageSheet;
