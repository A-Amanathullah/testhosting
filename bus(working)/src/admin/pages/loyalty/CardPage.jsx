import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';
// import { motion } from 'framer-motion';
import { LoyaltyCard, EditLoyaltyCardModal, CreateCardModal } from '../../components/loyalty-card';
import { createLoyaltyCard, getLoyaltyCards, updateLoyaltyCard, deleteLoyaltyCard } from '../../../services/loyaltyCardService';

const CardPage = () => {
  const [cards, setCards] = useState([]);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await getLoyaltyCards();
      setCards(data);
    } catch (err) {
      alert('Failed to fetch loyalty cards.');
    }
  };

  const handleOpenCardEdit = (card) => {
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };

  const handleCreateCard = async (newCard) => {
    setIsLoading(true);
    try {
      await createLoyaltyCard(newCard);
      await fetchCards();
    } catch (err) {
      alert('Failed to create loyalty card.');
    }
    setIsLoading(false);
    setIsCreateCardModalOpen(false);
  };

  const handleSaveCardChanges = async (id, updatedCard) => {
    setIsLoading(true);
    try {
      await updateLoyaltyCard(id, updatedCard);
      await fetchCards();
    } catch (err) {
      alert('Failed to update loyalty card.');
    }
    setIsLoading(false);
  };
  
  const handleDeleteCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteLoyaltyCard(id);
      await fetchCards();
    } catch (err) {
      alert('Failed to delete loyalty card.');
    }
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Header with title and create card button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Program Management</h1>
            <p className="text-sm text-gray-600">Configure loyalty tiers and point earning methods</p>
          </div>
          
          <button
            onClick={() => setIsCreateCardModalOpen(true)} 
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Plus size={18} className="mr-2" />
            Create Loyalty Card
          </button>
        </div>
        
        {/* Loyalty tiers section */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Loyalty Tier Configuration</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.id || card.tier} className="relative">
                <LoyaltyCard
                  tier={card.tier}
                  points={{ min: card.min_points, max: card.max_points }}
                  color={card.color}
                  pointsPerBooking={card.points_per_booking}
                  onEdit={() => handleOpenCardEdit(card)}
                />
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="absolute top-2 right-12 p-2 text-xs text-white bg-red-500 rounded-full hover:bg-red-700 flex items-center justify-center"
                  title="Delete Card"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>        </div>
      </div>
      
      {/* Modals */}
      <EditLoyaltyCardModal 
        isOpen={isEditCardModalOpen}
        onClose={() => setIsEditCardModalOpen(false)}
        onSave={handleSaveCardChanges}
        cardData={selectedCard}
        isLoading={isLoading}
      />
      
      <CreateCardModal 
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onSave={handleCreateCard}
        existingCards={cards}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CardPage;