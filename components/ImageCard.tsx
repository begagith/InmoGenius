import React from 'react';
import { ImageAction, UploadedImage } from '../types';
import { TrashIcon } from './Icons';

interface ImageCardProps {
  image: UploadedImage;
  onActionChange: (id: string, action: ImageAction) => void;
  onRemove: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onActionChange, onRemove }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 overflow-hidden bg-slate-100 group">
        <img 
          src={image.previewUrl} 
          alt="Preview" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button 
          onClick={() => onRemove(image.id)}
          className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          title="Eliminar imagen"
        >
          <TrashIcon />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acción requerida</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200">
            <input 
              type="radio" 
              name={`action-${image.id}`}
              value={ImageAction.STAGE}
              checked={image.selectedAction === ImageAction.STAGE}
              onChange={() => onActionChange(image.id, ImageAction.STAGE)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 font-medium">
              Staging Virtual (Ikea Style)
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200">
            <input 
              type="radio" 
              name={`action-${image.id}`}
              value={ImageAction.EMPTY}
              checked={image.selectedAction === ImageAction.EMPTY}
              onChange={() => onActionChange(image.id, ImageAction.EMPTY)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 font-medium">
              Vaciar Espacio
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200">
            <input 
              type="radio" 
              name={`action-${image.id}`}
              value={ImageAction.KEEP}
              checked={image.selectedAction === ImageAction.KEEP}
              onChange={() => onActionChange(image.id, ImageAction.KEEP)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 font-medium">
              Mantener Original
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};