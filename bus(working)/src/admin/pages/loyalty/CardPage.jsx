import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';
// import { motion } from 'framer-motion';
import { LoyaltyCard, EditLoyaltyCardModal, CreateCardModal } from '../../components/loyalty-card';
import { createLoyaltyCard, getLoyaltyCards, updateLoyaltyCard, deleteLoyaltyCard } from '../../../services/loyaltyCardService';
import { getLoyaltyStatistics } from '../../../services/loyaltyMemberService';
import { usePermissions } from '../../../context/PermissionsContext';

const CardPage = () => {
  const [cards, setCards] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { permissions } = usePermissions();

  // Helper to check permission for Loyalty Card
  const hasPermission = (action) => {
    if (!permissions || !permissions['Loyalty Card']) return false;
    return !!permissions['Loyalty Card'][action];
  };

  // Permission helper functions
  const canAdd = () => hasPermission('add');
  const canEdit = () => hasPermission('edit');
  const canDelete = () => hasPermission('delete');

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    fetchCards();
    fetchStatistics();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await getLoyaltyCards();
      setCards(data);
    } catch (err) {
      setNotification({
        message: 'Failed to fetch loyalty cards.',
        type: 'error'
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await getLoyaltyStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const getCustomerCount = (cardType) => {
    if (!statistics?.members_by_tier) return 0;
    const tierData = statistics.members_by_tier.find(tier => tier.card_type === cardType);
    return tierData ? tierData.count : 0;
  };

  const handleOpenCardEdit = (card) => {
    if (!canEdit()) {
      setNotification({
        message: 'You do not have permission to edit loyalty cards.',
        type: 'error'
      });
      return;
    }
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };

  const handleCreateCard = async (newCard) => {
    if (!canAdd()) {
      setNotification({
        message: 'You do not have permission to create loyalty cards.',
        type: 'error'
      });
      setIsCreateCardModalOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      await createLoyaltyCard(newCard);
      await fetchCards();
      await fetchStatistics();
      setNotification({
        message: 'Loyalty card created successfully.',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to create loyalty card.',
        type: 'error'
      });
    }
    setIsLoading(false);
    setIsCreateCardModalOpen(false);
  };

  const handleSaveCardChanges = async (id, updatedCard) => {
    if (!canEdit()) {
      setNotification({
        message: 'You do not have permission to edit loyalty cards.',
        type: 'error'
      });
      return;
    }
    setIsLoading(true);
    try {
      await updateLoyaltyCard(id, updatedCard);
      await fetchCards();
      await fetchStatistics();
      setNotification({
        message: 'Loyalty card updated successfully.',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to update loyalty card.',
        type: 'error'
      });
    }
    setIsLoading(false);
  };
  
  const handleDeleteCard = async (id) => {
    if (!canDelete()) {
      setNotification({
        message: 'You do not have permission to delete loyalty cards.',
        type: 'error'
      });
      return;
    }
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteLoyaltyCard(id);
      await fetchCards();
      await fetchStatistics();
      setNotification({
        message: 'Loyalty card deleted successfully.',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to delete loyalty card.',
        type: 'error'
      });
    }
  };
  
  const handleCreateCardClick = () => {
    if (!canAdd()) {
      setNotification({
        message: 'You do not have permission to create loyalty cards.',
        type: 'error'
      });
      return;
    }
    setIsCreateCardModalOpen(true);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {/* Notification */}
      {notification.message && (
        <div className={`mx-6 mt-4 p-4 rounded-md ${
          notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {notification.type === 'error' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>{notification.message}</div>
          </div>
        </div>
      )}
      
      <div className="flex-grow p-6 overflow-auto">
        {/* Header with title and create card button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Program Management</h1>
            <p className="text-sm text-gray-600">Configure loyalty tiers and point earning methods</p>
          </div>
          
          <button
            onClick={handleCreateCardClick}
            disabled={!canAdd()}
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              canAdd() 
                ? 'bg-red-800 hover:bg-red-900' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
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
                  customers={getCustomerCount(card.tier)}
                  pointsPerBooking={card.points_per_booking}
                  onEdit={() => handleOpenCardEdit(card)}
                  canEdit={canEdit()}
                />
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  disabled={!canDelete()}
                  className={`absolute top-2 right-12 p-2 text-xs text-white rounded-full flex items-center justify-center ${
                    canDelete() 
                      ? 'bg-red-500 hover:bg-red-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  title={canDelete() ? "Delete Card" : "No permission to delete"}
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