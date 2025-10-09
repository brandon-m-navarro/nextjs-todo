interface SelectBoxProps {
  name: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export default function SelectBox({
  name,
  options,
  value,
  onChange,
  required,
}: SelectBoxProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      required={required}
      className="w-full bg-transparent border-none outline-none"
    >
      <option value="">Select a project</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
