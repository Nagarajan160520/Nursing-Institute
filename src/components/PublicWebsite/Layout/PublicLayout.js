import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from '../Common/AnnouncementBar';


const PublicLayout = () => {
  return (
    <div className="public-layout">
      <AnnouncementBar />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;