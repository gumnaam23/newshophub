'use client';

import { MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface EmptyAddressProps {
  userName?: string;
  onAddAddress: () => void;
}

export default function EmptyAddress({ userName, onAddAddress }: EmptyAddressProps) {
  return (
    <div className="text-center py-8">
      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {`You haven't added any addresses yet`}
      </p>
      <Button variant="primary" onClick={onAddAddress}>
        Add Your First Address
      </Button>
    </div>
  );
}