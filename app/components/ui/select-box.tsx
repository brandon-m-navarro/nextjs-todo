'use client'

type SelectBoxProps = {
  name: string;
  options: string[];
};

export default function SelectBox({ name, options }: SelectBoxProps) {

  return (
        <select name={name} className="w-full h-[48px] rounded-md">
            {options.map((option) => (
                <option key={option} value={option.trim()}>
                    {option.trim()}
                </option>
            ))}
        </select>
  );
}
