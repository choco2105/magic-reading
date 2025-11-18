'use client';
// Componente de tarjeta reutilizable

export default function Card({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  onClick = null
}) {
  const baseStyles = 'bg-white rounded-xl shadow-lg';
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0'
  };
  
  const hoverStyles = hover 
    ? 'transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer' 
    : '';
  
  return (
    <div 
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}