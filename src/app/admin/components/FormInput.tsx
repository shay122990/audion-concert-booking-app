"use client";

type FormInputProps = {
  type?: string;
  name: string;
  value?: string;
  placeholder: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isTextArea?: boolean;
};

export default function FormInput({
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  isTextArea = false,
}: FormInputProps) {
  const commonClasses = "px-4 py-2 rounded border";

  return isTextArea ? (
    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={commonClasses}
      required
    />
  ) : (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={commonClasses}
      required
    />
  );
}
