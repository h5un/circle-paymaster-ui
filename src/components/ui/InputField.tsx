/**
 * @file InputField.tsx
 * @description This file defines a reusable React component for rendering input fields and text areas.
 * The component supports customization options such as label, placeholder, input type, and size.
 * It is designed to be used in forms or other UI elements requiring user input.
 */

import React from "react";

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};


export default function InputField({
  label,
  placeholder = "",
  value,
  type = "text",
  large = false,
  onChange,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {large ? (
        <textarea
          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={5}
        />
      ) : (
        <input
          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
