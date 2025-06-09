import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { CalendarOutlined } from '@ant-design/icons';

export default forwardRef((props, ref) => {
  const [date, setDate] = useState(null);
  const [picker, setPicker] = useState(null);
  const refFlatPickr = useRef();
  const refInput = useRef();

  const onDateChanged = selectedDates => {
    const [selectedDate] = selectedDates;
    setDate(selectedDate);
    props.onDateChanged();
  };

  useEffect(() => {
    setPicker(
      flatpickr(refFlatPickr.current, {
        onChange: onDateChanged,
        // dateFormat: 'Z',
        wrap: true,
        enableTime: true,
        enableSeconds: false,
        time_12hr: true,
        // dateFormat: "F j, Y h:i K"
      })
    );
  }, []);

  useEffect(() => {
    if (picker) {
      picker.calendarContainer.classList.add('ag-custom-component-popup');
    }
  }, [picker]);

  useEffect(() => {
    if (picker) {
      picker.setDate(date);
    }
  }, [date, picker]);

  useImperativeHandle(ref, () => ({
    getDate() {
      return date;
    },

    setDate(date) {
      setDate(date);
    },

    setInputPlaceholder(placeholder) {
      if (refInput.current) {
        refInput.current.setAttribute('placeholder', placeholder);
      }
    },

    setInputAriaLabel(label) {
      if (refInput.current) {
        refInput.current.setAttribute('aria-label', label);
      }
    }
  }));

  return (
    <div
      className="ag-input-wrapper custom-date-filter"
      role="presentation"
      ref={refFlatPickr}
    >
      <input type="text" id="text" className="ag-input-field-input ag-text-field-input" ref={refInput} data-input style={{ width: '100%' }} /> &nbsp;
      <CalendarOutlined />
    </div>
  );
});
