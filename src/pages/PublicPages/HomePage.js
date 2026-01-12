import React from 'react';
import HeroSection from '../../components/PublicWebsite/Home/HeroSection';
import MissionVision from '../../components/PublicWebsite/Home/MissionVision';
import StatsCounter from '../../components/PublicWebsite/Home/StatsCounter';
import GalleryPreview from '../../components/PublicWebsite/Home/GalleryPreview';
import AnnouncementTicker from '../../components/PublicWebsite/Home/AnnouncementTicker';
import Infrastructure from '../../components/PublicWebsite/Home/Infrastructure';
import Testimonials from '../../components/PublicWebsite/Home/Testimonials';



const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <AnnouncementTicker />
      <MissionVision />
      <StatsCounter />
      <GalleryPreview />
      <Infrastructure /> 
      <Testimonials />
      
    </div>
  );
};

export default HomePage;