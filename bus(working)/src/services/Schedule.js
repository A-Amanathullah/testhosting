import axios from 'axios';

const BASE_URL = "http://localhost:8000/api/bus-trips";

// GET all buses
export const getAllSchedules = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// POST (create a new bus)
export const AddSchedule = async (formData) => {
  await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};



// PUT (update a bus using method override)
export const updateSchedule = async (updatedSchedule) => {
  const formData = new FormData();
  formData.append("bus_no", updatedSchedule.bus_no);
  formData.append("driver_name", updatedSchedule.driver_name);
  formData.append("driver_contact", updatedSchedule.driver_contact);
  formData.append("conductor_name", updatedSchedule.conductor_name);
  formData.append("conductor_contact", updatedSchedule.conductor_contact);
  formData.append("start_point", updatedSchedule.start_point);
  formData.append("end_point", updatedSchedule.end_point);
  formData.append("departure_date", updatedSchedule.departure_date); // ✅ correct spelling
  formData.append("departure_time", updatedSchedule.departure_time);
  formData.append("price", updatedSchedule.price);
  formData.append("arrival_date", updatedSchedule.arrival_date);
  formData.append("arrival_time", updatedSchedule.arrival_time);

  formData.append('_method', 'PUT');
  await axios.post(`${BASE_URL}/${updatedSchedule.id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE a bus
export const deleteSchedule = async (busId) => {
  await axios.delete(`${BASE_URL}/${busId}`);
};
