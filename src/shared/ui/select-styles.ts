import { StylesConfig } from "react-select";

 type OptionType = { value: string; label: string };
  export const customStyles: StylesConfig<OptionType, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#121825',
      width: '137px',
      height: '40px',
      border: 'none',
      borderRadius: '10px',
      boxShadow: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      color: 'white',
      alignItems: 'center',
      padding: '0 8px',
      '&:hover': {
        border: 'none',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      border: '1px solid #444',
      width: '272px',
      height: '156px',
      color: 'white',
      backgroundColor: '#121825',
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      borderRadius: '10px',
      backgroundColor: isFocused ? '#222B44' : isSelected ? '#222B44' : '#121825',
      color: 'white',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#fff',
      padding: '0 4px',
      margin: 0,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#fff',
      margin: 0,
      
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#444',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none', 
    }),
  };
  