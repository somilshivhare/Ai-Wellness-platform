import React from 'react';

const Input = ({ label, type, name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="input-group">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <input
        className="input-field"
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;