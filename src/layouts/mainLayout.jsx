import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import PendingTransactionWidget from '../components/pendingTransactionWidget';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F6] font-sans text-slate-800">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <PendingTransactionWidget />
      <Footer />
    </div>
  );
};

export default MainLayout;