import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample images - in a real project, these would come from your backend
  const galleryImages = [
    {
      id: 1,
      src: '/images/bus-exterior-1.jpg',
      alt: 'Modern RS Express Bus - Exterior View',
      category: 'fleet',
      title: 'Our Modern Fleet'
    },
    {
      id: 2,
      src: '/images/bus-interior-1.jpg',
      alt: 'Comfortable Bus Interior',
      category: 'interior',
      title: 'Comfortable Seating'
    },
    {
      id: 3,
      src: '/images/bus-station-1.jpg',
      alt: 'RS Express Bus Station',
      category: 'stations',
      title: 'Modern Bus Stations'
    },
    {
      id: 4,
      src: '/images/bus-exterior-2.jpg',
      alt: 'RS Express Bus on Highway',
      category: 'fleet',
      title: 'Highway Travel'
    },
    {
      id: 5,
      src: '/images/bus-interior-2.jpg',
      alt: 'Premium Bus Interior with Entertainment',
      category: 'interior',
      title: 'Entertainment Systems'
    },
    {
      id: 6,
      src: '/images/bus-station-2.jpg',
      alt: 'Waiting Area at Bus Terminal',
      category: 'stations',
      title: 'Comfortable Waiting Areas'
    },
    {
      id: 7,
      src: '/images/driver-training.jpg',
      alt: 'Professional Driver Training',
      category: 'staff',
      title: 'Professional Training'
    },
    {
      id: 8,
      src: '/images/maintenance.jpg',
      alt: 'Bus Maintenance Facility',
      category: 'facilities',
      title: 'Maintenance Excellence'
    }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'fleet', name: 'Our Fleet' },
    { id: 'interior', name: 'Interiors' },
    { id: 'stations', name: 'Stations' },
    { id: 'staff', name: 'Our Team' },
    { id: 'facilities', name: 'Facilities' }
  ];

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  // Placeholder component for missing images
  const ImagePlaceholder = ({ title, category }) => (
    <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl text-primary mb-2">🚌</div>
        <div className="text-primary font-semibold">{title}</div>
        <div className="text-sm text-gray-600 capitalize">{category}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Explore our modern fleet, comfortable interiors, and world-class facilities
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative">
                <ImagePlaceholder title={image.title} category={image.category} />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-lg font-semibold">{image.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No images found in this category</div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FaTimes size={24} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <FaChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <FaChevronRight size={32} />
            </button>

            {/* Image */}
            <div className="bg-white rounded-lg p-4">
              <ImagePlaceholder title={selectedImage.title} category={selectedImage.category} />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedImage.title}</h3>
                <p className="text-gray-600 capitalize">{selectedImage.category}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience RS Express</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From our modern fleet to our comfortable stations, every detail is designed with your comfort in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚌</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Fleet</h3>
              <p className="text-gray-600">
                Our buses are equipped with the latest technology and safety features for your comfort and security.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Stations</h3>
              <p className="text-gray-600">
                Our stations provide comfortable waiting areas with modern amenities for a pleasant travel experience.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Team</h3>
              <p className="text-gray-600">
                Our trained professionals ensure safe and reliable service on every journey you take with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
