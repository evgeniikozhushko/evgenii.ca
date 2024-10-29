import React from 'react';
import '../styles/sliderBanner.css'; // Ensure this path is correct

const AnnouncementSlider = () => {
  const announcementText = 'evgenii.ca';

  return (
    <div className="announcement__slider">
      <div className="announcement__wrapper">
        {/* Repeat the text enough times to ensure seamless looping */}
        {[...Array(2000)].map((_, index) => (
          <div key={index} className="announcement__slide">
            {announcementText}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementSlider;
