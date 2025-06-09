
import React from 'react';
import styles from './style.less'
import {

  Select
} from 'antd';
const CustomDropdown = ({ value, onChange, options }) => {
  const { Option } = Select;

  return (
    <div className={styles.dropdown}>
      Page size
      <div className={styles.options}>
        <select
          onChange={(event) => onChange(Number(event.target.value))}
          value={value}
        >
          {options.map((option, index) => (
            <option value={option} key={index} selected>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomDropdown;
