import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DatePickerInput = ({
  selectedDate,
  setSelectedDate,
  placeholder,
  className = "",
}) => {
  const today = dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        minDate={today}
        format="YYYY-MM-DD"
        slotProps={{
          textField: {
            placeholder,
            className,
            fullWidth: true,
            variant: "outlined",
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
