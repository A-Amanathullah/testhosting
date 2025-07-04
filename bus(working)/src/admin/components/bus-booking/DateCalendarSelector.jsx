import React, { useState, useEffect } from 'react';
import { format, parse, startOfMonth, addMonths, subMonths } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DateCalendarSelector = ({ dates, selectedDate, onChange, disabled }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Prioritize current month, then first available date's month
    const today = new Date();
    
    if (dates.length > 0) {
      // Check if today's date exists in available dates
      const todayStr = format(today, 'yyyy-MM-dd');
      const hasToday = dates.includes(todayStr);
      
      if (hasToday) {
        return startOfMonth(today);
      }
      
      // Find future dates
      const futureDates = dates.filter(dateStr => {
        try {
          const date = parse(dateStr, 'yyyy-MM-dd', new Date());
          return date > today;
        } catch {
          return false;
        }
      }).sort();
      
      if (futureDates.length > 0) {
        try {
          const nearestFutureDate = parse(futureDates[0], 'yyyy-MM-dd', new Date());
          return startOfMonth(nearestFutureDate);
        } catch (error) {
          console.error('Error parsing nearest future date:', error);
        }
      }
      
      // Fallback to first available date
      try {
        const firstDate = parse(dates[0], 'yyyy-MM-dd', new Date());
        return startOfMonth(firstDate);
      } catch (error) {
        console.error('Error parsing first date:', error);
      }
    }
    
    // Default to current month
    return startOfMonth(today);
  });

  // Convert string dates to Date objects for comparison
  const availableDates = dates.map((dateStr) => {
    try {
      const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
      console.log(`Parsed Date (${dateStr}):`, parsedDate);
      return parsedDate;
    } catch (error) {
      console.error(`Error parsing date ${dateStr}:`, error);
      return null;
    }
  }).filter((date) => date !== null);

  // Debug available dates
  useEffect(() => {
    console.log('Available Dates:', availableDates);
    console.log('Current Month:', currentMonth);
  }, [availableDates, currentMonth]);

  // Automatically set currentMonth based on priority when dates change
  useEffect(() => {
    if (dates.length > 0) {
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
          const date = parse(dateStr, 'yyyy-MM-dd', new Date());
          return date > today;
        } catch {
          return false;
        }
      }).sort();
      
      if (futureDates.length > 0) {
        try {
          const nearestFutureDate = parse(futureDates[0], 'yyyy-MM-dd', new Date());
          setCurrentMonth(startOfMonth(nearestFutureDate));
          return;
        } catch (error) {
          console.error('Error parsing nearest future date:', error);
        }
      }
      
      // Fallback to first available date
      try {
        const firstDate = parse(dates[0], 'yyyy-MM-dd', new Date());
        setCurrentMonth(startOfMonth(firstDate));
      } catch (error) {
        console.error('Error parsing first date:', error);
      }
    }
  }, [dates]);

  // Get formatted selected date for display
  const formattedSelectedDate = selectedDate
    ? format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')
    : 'Select a date';

  // Check if a date is available in our dates array
  const isDateAvailable = (date) => {
    const isAvailable = availableDates.some(
      (availableDate) =>
        date.getDate() === availableDate.getDate() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getFullYear() === availableDate.getFullYear()
    );
    console.log(`Checking date ${format(date, 'yyyy-MM-dd')}:`, isAvailable);
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

          {dates.length === 0 && (
            <div className="py-3 text-sm text-center text-gray-500">
              No dates available for selected bus
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