import React, { useRef, useEffect } from 'react';

const BusPhotoUploader = ({ previewImage, handleFileChange , setPreviewImage}) => {
  const fileInputRef = useRef(null);

  const BASE_URL = 'http://localhost:8000/storage/';

  useEffect(() => {
    if (
      typeof previewImage === 'string' &&
      !previewImage.startsWith('http') &&
      !previewImage.startsWith('data:image')
    ) {
      setPreviewImage(BASE_URL + previewImage);
    }
  }, [previewImage, setPreviewImage]);
  
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Bus Photo</label>
      <div className="flex items-start mt-1 space-x-4">
        <div className="flex-1">
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {previewImage ? (
                <img src={previewImage} alt="Bus preview" className="object-cover h-32 mx-auto rounded" />
              ) : (
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative font-medium text-blue-600 bg-white rounded-md cursor-pointer hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>{previewImage ? 'Change photo' : 'Upload a file'}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusPhotoUploader;