import React, { useState, useCallback, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Image } from '../types';

interface Props {
  images: Image[];
  onAddImage: (image: Image) => void;
  onRemoveImage: (imageId: string) => void;
}

export function ImageUploader({ images, onAddImage, onRemoveImage }: Props) {
  const [caption, setCaption] = useState('');
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setObjectUrls(prev => [...prev, imageUrl]);
    
    onAddImage({
      id: Date.now().toString(),
      url: imageUrl,
      caption: caption.trim() || file.name,
    });
    setCaption('');
  }, [caption, onAddImage]);

  const handleRemoveImage = useCallback((imageId: string, imageUrl: string) => {
    URL.revokeObjectURL(imageUrl);
    setObjectUrls(prev => prev.filter(url => url !== imageUrl));
    onRemoveImage(imageId);
  }, [onRemoveImage]);

  return (
    <div className="space-y-4" role="region" aria-label="Image upload section">
      <div className="flex items-center gap-4">
        <label 
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.click()}
        >
          <ImagePlus size={20} aria-hidden="true" />
          <span>Add Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            aria-label="Upload image"
          />
        </label>
        <input
          type="text"
          placeholder="Image caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Image caption"
        />
      </div>

      <div 
        className="grid grid-cols-2 gap-4"
        role="list"
        aria-label="Uploaded images"
      >
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative group"
            role="listitem"
          >
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
            />
            <button
              onClick={() => handleRemoveImage(image.id, image.url)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${image.caption}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
            {image.caption && (
              <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}