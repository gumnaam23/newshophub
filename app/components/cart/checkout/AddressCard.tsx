'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Home, Map, Edit, Trash2 } from 'lucide-react';

interface Address {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
      }`}
      onClick={() => onSelect(address._id)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-5 h-5 text-blue-500" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {address.isDefault ? <Home className="w-5 h-5" /> : <Map className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {address.fullName}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {address.street}<br />
            {address.city}, {address.state} {address.zipCode}<br />
            {address.country}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Phone: {address.phone}
          </p>
          {address.isDefault && (
            <span className="inline-block mt-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
              Default Address
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address._id);
            }}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}