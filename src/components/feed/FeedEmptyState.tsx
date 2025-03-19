
import React from 'react';
import { Image } from 'lucide-react';

const FeedEmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <div className="mb-6 p-6 rounded-full bg-muted/50">
        <Image size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-3">Aucun design partagé</h3>
      <p className="text-muted-foreground max-w-xs mx-auto">
        Vous verrez ici les designs partagés par la communauté
      </p>
    </div>
  );
};

export default FeedEmptyState;
