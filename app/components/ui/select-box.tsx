// ui/select-box.tsx
interface SelectBoxProps {
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
}

export default function SelectBox({
  name,
  options,
  value,
  onChange,
  defaultValue=null,
  required,
  className=""
}: SelectBoxProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      required={required}
      className={`w-full h-full bg-transparent border-none outline-none cursor-pointer ${className}`}
    >
      {defaultValue && (
        <option value="">{defaultValue}</option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}