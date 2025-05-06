import React, { ReactNode, ReactElement } from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  children?: ReactNode; // Pour les éléments comme <select>
  error?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean; // <-- Ajout de la prop required
}

interface CloneElementProps {
  id: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean; // <-- Ajout de la prop required ici aussi
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  children,
  error,
  onBlur,
  placeholder,
  required, // <-- Récupération de la prop required
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      {children ? (
        React.cloneElement(
          children as ReactElement<CloneElementProps>,
          {
            id: id,
            value: value,
            onChange: onChange,
            onBlur: onBlur,
            className: `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`,
            required: required, // <-- Passage de la prop required
          }
        )
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
          required={required} // <-- Passage de la prop required
        />
      )}
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default FormField;