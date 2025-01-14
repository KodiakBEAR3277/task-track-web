
export function Alert({ variant = "default", className, children, ...props }) {
  const variants = {
    default: "bg-gray-800 text-white",
    destructive: "bg-red-600 text-white"
  };

  return (
    <div className={`p-4 rounded-md ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDescription({ className, children, ...props }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
