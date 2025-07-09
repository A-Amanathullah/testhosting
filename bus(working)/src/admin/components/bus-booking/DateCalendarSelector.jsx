import React, { useState, useEffect } from 'react';
import { format, startOfMonth, addMonths, subMonths } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DateCalendarSelector = ({ dates, selectedDate, onChange, disabled }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Prioritize current month, then first available date's month
    const today = new Date();
    
    if (dates && dates.length > 0) {
      // Check if today's date exists in available dates
      const todayStr = format(today, 'yyyy-MM-dd');
      const hasToday = dates.includes(todayStr);
      
      if (hasToday) {
        return startOfMonth(today);
      }
      
      // Find future dates
      const futureDates = dates.filter(dateStr => {
        try {
          if (!isValidDateFormat(dateStr)) return false;
          const date = new Date(dateStr);
          return date > today;
        } catch {
          return false;
        }
      }).sort();
      
      if (futureDates.length > 0) {
        try {
          const nearestFutureDate = new Date(futureDates[0]);
          if (!isNaN(nearestFutureDate.getTime())) {
            return startOfMonth(nearestFutureDate);
          }
        } catch (error) {
          console.error('Error parsing nearest future date:', error);
        }
      }
      
      // Fallback to first available date
      for (const dateStr of dates) {
        try {
          if (!isValidDateFormat(dateStr)) continue;
          const firstDate = new Date(dateStr);
          if (!isNaN(firstDate.getTime())) {
            return startOfMonth(firstDate);
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    // Default to current month
    return startOfMonth(today);
  });

  // Helper function to validate date format
  const isValidDateFormat = (dateStr) => {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const [year, month, day] = dateStr.split('-').map(Number);
    // Basic validation for month and day ranges
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    
    // Verify it's a valid date (not like 2023-02-31)
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  // Convert string dates to Date objects for comparison
  const availableDates = (dates || []).map((dateStr) => {
    try {
      // Validate date format before parsing
      if (!isValidDateFormat(dateStr)) {
        console.warn(`Skipping invalid date format: ${dateStr}`);
        return null;
      }
      
      const parsedDate = new Date(dateStr);
      
      // Additional validation to ensure the date is valid
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Invalid date value: ${dateStr}`);
        return null;
      }
      
      return parsedDate;
    } catch (error) {
      console.error(`Error parsing date ${dateStr}:`, error);
      return null;
    }
  }).filter((date) => date !== null);

  // Debug available dates
  useEffect(() => {
    console.log('Available Dates (raw):', dates);
    console.log('Available Dates (parsed):', availableDates);
    console.log('Current Month:', currentMonth);
    console.log('Selected Date:', selectedDate);
  }, [availableDates, currentMonth, dates, selectedDate]);

  // Automatically set currentMonth based on priority when dates change
  useEffect(() => {
    if (dates && dates.length > 0) {
      const today = new Date();
      
      // Check if today's date exists in available dates
      const todayStr = format(today, 'yyyy-MM-dd');
      const hasToday = dates.includes(todayStr);
      
      if (hasToday) {
        setCurrentMonth(startOfMonth(today));
        return;
      }
      
      // Find future dates
      const futureDates = dates.filter(dateStr => {
        try {
          if (!isValidDateFormat(dateStr)) return false;
          const date = new Date(dateStr);
          return date > today;
        } catch {
          return false;
        }
      }).sort();
      
      if (futureDates.length > 0) {
        try {
          const nearestFutureDate = new Date(futureDates[0]);
          if (!isNaN(nearestFutureDate.getTime())) {
            setCurrentMonth(startOfMonth(nearestFutureDate));
            return;
          }
        } catch (error) {
          console.error('Error parsing nearest future date:', error);
        }
      }
      
      // Fallback to first available date
      for (const dateStr of dates) {
        try {
          if (!isValidDateFormat(dateStr)) continue;
          const firstDate = new Date(dateStr);
          if (!isNaN(firstDate.getTime())) {
            setCurrentMonth(startOfMonth(firstDate));
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }
  }, [dates]);

  // Get formatted selected date for display
  const formattedSelectedDate = selectedDate && isValidDateFormat(selectedDate)
    ? format(new Date(selectedDate), 'MMM dd, yyyy')
    : 'Select a date';

  // Check if a date is available in our dates array
  const isDateAvailable = (date) => {
    if (!date || isNaN(date.getTime())) return false;
    
    const isAvailable = availableDates.some(
      (availableDate) =>
        availableDate &&
        date.getDate() === availableDate.getDate() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getFullYear() === availableDate.getFullYear()
    );
    return isAvailable;
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle date click in calendar
  const handleDateClick = (dateStr) => {
    console.log('Date Clicked:', dateStr);
    onChange(dateStr);
    setShowCalendar(false);
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Render day names
    dayNames.forEach((day) => {
      days.push(
        <div
          key={`header-${day}`}
          className="flex items-center justify-center w-10 h-10 text-xs font-medium text-gray-500"
        >
          {day}
        </div>
      );
    });

    // Add empty days to align with correct day of week
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = format(date, 'yyyy-MM-dd');
      const isAvailable = isDateAvailable(date);
      const isSelected = selectedDate === dateString;

      days.push(
        <div
          key={`day-${day}`}
          onClick={() => {
            if (isAvailable && !disabled) {
              handleDateClick(dateString);
            }
          }}
          className={`
            w-10 h-10 flex items-center justify-center rounded-full text-sm
            ${isAvailable && !disabled ? 'cursor-pointer' : 'cursor-not-allowed'}
            ${isSelected ? 'bg-red-800 text-white' : ''}
            ${isAvailable && !isSelected ? 'hover:bg-red-100 text-gray-900' : ''}
            ${!isAvailable ? 'text-gray-300' : ''}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-w-[240px]">
      <label htmlFor="dateSelector" className="block mb-2 text-sm font-medium text-gray-700">
        Select Date
      </label>
      <div
        id="dateSelector"
        className={`
          flex items-center px-4 py-2.5 border rounded-md w-full
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-red-500'}
          ${showCalendar ? 'border-red-500' : 'border-gray-300'}
        `}
        onClick={() => !disabled && setShowCalendar(!showCalendar)}
      >
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <span className={`text-sm ${selectedDate ? 'text-gray-900' : 'text-gray-500'}`}>
          {formattedSelectedDate}
        </span>
      </div>

      {showCalendar && (
        <div className="absolute z-10 p-3 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-80">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="text-base font-medium text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h4>
            <button
              onClick={handleNextMonth}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>

          {(!dates || dates.length === 0) && (
            <div className="py-3 text-sm text-center text-gray-500">
              {disabled 
                ? 'Please select a bus first' 
                : 'No dates available for selected bus'}
            </div>
          )}
          
          {dates && dates.length > 0 && availableDates.length === 0 && (
            <div className="py-3 text-sm text-center text-red-500">
              Found {dates.length} date(s), but none are in a valid format
            </div>
          )}

          <div className="mt-3 text-right">
            <button
              onClick={() => setShowCalendar(false)}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateCalendarSelector;