'use client';

import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  name: string;
  value?: string;
  onChange?: (date: string) => void;
};

const DatePicker = ({ name, value, onChange }: DatePickerProps) => {
  // Convert string value to Date object if provided
  const initialDate = value ? new Date(value) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    
    // Convert Date object to ISO string and call the onChange callback
    if (onChange) {
      onChange(date ? date.toISOString() : '');
    }
  };

  return (
    <ReactDatePicker
      selected={selectedDate}
      name={name}
      showTimeSelect
      onChange={handleDateChange}
      dateFormat="MMMM d, yyyy h:mm aa"
      className="w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
      placeholderText="Select due date"
    />
  );
};

export default DatePicker;