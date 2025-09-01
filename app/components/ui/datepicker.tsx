'use client';

import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  name: string;
};

const DatePicker = ({ name }: DatePickerProps) => {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  return (
    <ReactDatePicker
      selected={selectedDate}
      name={name}
      showTimeSelect
      onChange={(date) => setSelectedDate(date)}
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
};

export default DatePicker;