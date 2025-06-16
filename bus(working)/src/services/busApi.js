import axios from 'axios';

const BASE_URL = "http://localhost:8000/api/bus-reg";

// GET all buses
export const getAllBuses = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// POST (create a new bus)
export const registerBus = async (formData) => {
  await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// PUT (update a bus using method override)
export const updateBus = async (updatedBus) => {
  const formData = new FormData();
  formData.append("bus_no", updatedBus.bus_no);
  formData.append("start_point", updatedBus.start_point);
  formData.append("end_point", updatedBus.end_point);
  formData.append("total_seats", updatedBus.total_seats);

  if (updatedBus.image instanceof File) {
    formData.append("image", updatedBus.image);
  }

  await axios.post(`${BASE_URL}/${updatedBus.id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE a bus
export const deleteBus = async (busId) => {
  await axios.delete(`${BASE_URL}/${busId}`);
};
