type ActionButtonProps = {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
    color?: "blue" | "red" | "green" | "gray";
  };
  
  export default function ActionButton({ label, onClick, type = "button", color = "blue" }: ActionButtonProps) {
    const baseClass = `text-sm px-4 h-10 py-1 text-white rounded`;
    const colorClass = {
      blue: "bg-blue-600 hover:bg-blue-700",
      red: "bg-red-600 hover:bg-red-700",
      green: "bg-green-600 hover:bg-green-700",
      gray: "bg-gray-600 hover:bg-gray-700",
    }[color];
  
    return (
      <button type={type} onClick={onClick} className={`${baseClass} ${colorClass}`}>
        {label}
      </button>
    );
  }
  