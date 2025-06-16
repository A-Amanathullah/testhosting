import{ useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  BusTable,
  AddBusModal,
  EditBusModal,
  ViewBusModal,
  DeleteConfirmation
} from '../components/bus-register';

import {
  getAllBuses,
  registerBus,
  updateBus,
  deleteBus,
} from '../../services/busApi';

const BusRegisterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  // Sample bus data - replace with actual data from your API
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const data = await getAllBuses();
      setBuses(data);
    } catch (error) {
      console.error(error.message);
    }
  };

 const handleAddBus = async (formData) => {
  try {
    await registerBus(formData);
    const data = await getAllBuses();
    setBuses(data);
    setIsAddModalOpen(false);
  } catch (error) {
    console.error("Error adding bus:", error);
  }
};


const handleEditBus = async (updatedBus) => {
  try {
    await updateBus(updatedBus);
    const data = await getAllBuses();
    setBuses(data);
    setIsEditModalOpen(false);
  } catch (error) {
    console.error("Failed to update bus:", error);
  }
};

  

const handleDeleteBus = async () => {
  if (selectedBus) {
    try {
      await deleteBus(selectedBus.id);
      const data = await getAllBuses();
      setBuses(data);
      setIsDeleteModalOpen(false);
      setSelectedBus(null);
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  }
};

  

  const openViewModal = (bus) => {
    setSelectedBus(bus);
    setIsViewModalOpen(true);
  };

  const openEditModal = (bus) => {
    setSelectedBus(bus);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (bus) => {
    setSelectedBus(bus);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">

      <div className="flex-grow p-6 overflow-auto">
        {/* Top action bar */}
        <div className="flex items-center justify-between mb-6 bg-gray-50 z-10 sticky top-0 py-4">
          {/* Search box */}
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by bus number,route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Bus button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 text-white bg-red-800 rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Bus
          </button>
        </div>

        {/* Bus Table */}
        <BusTable
          buses={buses}
          searchTerm={searchTerm}
          onViewBus={openViewModal}
          onEditBus={openEditModal}
          onDeleteBus={openDeleteModal}
        />
      </div>

      {/* Modals */}
      <AddBusModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBus}
      />

      <EditBusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditBus}
        busData={selectedBus}
      />

      <ViewBusModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bus={selectedBus}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBus}
        bus_no={selectedBus?.bus_no}
      />
    </div>
  );
};

export default BusRegisterPage;