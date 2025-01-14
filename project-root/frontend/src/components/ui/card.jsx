
export function Card({ className, children, ...props }) {
  return (
    <div className={`rounded-lg border border-gray-700 bg-gray-800 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
