
export function Button({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-gray-800 text-white hover:bg-gray-700",
    secondary: "bg-yellow-400 text-black hover:bg-yellow-500",
    outline: "border border-gray-600 hover:bg-gray-700",
    ghost: "hover:bg-gray-700"
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
