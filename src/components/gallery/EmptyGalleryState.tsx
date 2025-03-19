
import React from 'react';
import { Image } from 'lucide-react';

const EmptyGalleryState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <div className="mb-6 p-6 rounded-full bg-muted/50">
        <Image size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-3">Aucun design sauvegardé</h3>
      <p className="text-muted-foreground max-w-xs mx-auto">
        Commencez par créer un design de nails et sauvegardez-le pour le retrouver ici
      </p>
    </div>
  );
};

export default EmptyGalleryState;
