import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto py-3 bg-white border-top text-center text-muted small">
      <div className="container">
        <span>&copy; {new Date().getFullYear()} Gereja Kristen Jawa Mijen. Hak Cipta Dilindungi.</span>
      </div>
    </footer>
  );
};
