'use client';

import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({}) => {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

// const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
    />
  );
};

export default DatePicker;