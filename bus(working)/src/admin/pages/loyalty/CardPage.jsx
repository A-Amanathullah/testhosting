import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoyaltyCard, EditLoyaltyCardModal, CreateCardModal } from '../../components/loyalty-card';

const CardPage = () => {
  // Simulated data - in a real application, this would come from an API/backend
  const [cards, setCards] = useState([
    {
      tier: 'Silver',
      icon: 'card', 
      points: { min: 0, max: 250 },
      customers: 142,
      color: '#C0C0C0',
      pointsMethod: 'booking',
      pointsPerBooking: 5
    },
    {
      tier: 'Gold',
      icon: 'users',
      points: { min: 251, max: 750 },
      customers: 68,
      color: '#FFD700',
      pointsMethod: 'booking',
      pointsPerBooking: 10
    },
    {
      tier: 'Platinum',
      icon: 'award',
      points: { min: 751, max: 10000 },
      customers: 15,
      color: '#E5E4E2',
      pointsMethod: 'amount',
      amount: 1000,
      pointsPerAmount: 1
    }
  ]);

  // Modal states
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const handleOpenCardEdit = (card) => {
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };

  const handleSaveCardChanges = (updatedCard) => {
    setCards(cards.map(card => 
      card.tier === updatedCard.tier ? { ...card, ...updatedCard } : card
    ));
  };
  
  const handleCreateCard = (newCard) => {
    setCards([...cards, newCard]);
    setIsCreateCardModalOpen(false);
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
            {cards.map((card) => (<LoyaltyCard
                key={card.tier}
                tier={card.tier}
                icon={card.icon}
                points={card.points}
                customers={card.customers}
                color={card.color}
                pointsMethod={card.pointsMethod}
                pointsPerBooking={card.pointsPerBooking}
                amount={card.amount}
                pointsPerAmount={card.pointsPerAmount}
                onEdit={() => handleOpenCardEdit(card)}
              />
            ))}
          </div>        </div>
      </div>
      
      {/* Modals */}
      <EditLoyaltyCardModal 
        isOpen={isEditCardModalOpen}
        onClose={() => setIsEditCardModalOpen(false)}
        onSave={handleSaveCardChanges}
        cardData={selectedCard}
      />
      
      <CreateCardModal 
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onSave={handleCreateCard}
        existingCards={cards}
      />
    </div>
  );
};

export default CardPage;