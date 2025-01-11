// src/components/Home/SliderBar.tsx
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Button, Spin, Alert } from 'antd';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/Home/SliderBar.scss';
import sliderApi from '../../api/sliderApi';

interface ISlider {
  image?: string;
  caption?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface Slide {
  image: string;
  caption: string;
  buttonText: string;
  buttonLink: string;
}

const SliderBar: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchSlides = async () => {
        try {
          const data: ISlider[] = await sliderApi.getAllSliders();
  
          const transformedData: Slide[] = data.map(slider => ({
            image: slider.image || '',
            caption: slider.caption || '',
            buttonText: slider.buttonText || '',
            buttonLink: slider.buttonLink || '#',
          }));
  
          setSlides(transformedData);
        } catch (err) {
          console.error('Chyba při načítání sliderů:', err);
          setError('Nepodařilo se načíst slidery.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchSlides();
    }, []);
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: true, // Zapnutí šipek
    };
  
    if (loading) {
      return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
    }
  
    if (error) {
      return <Alert message={error} type="error" style={{ margin: '20px' }} />;
    }
  
    return (
      <div className="slider-bar">
        <div className="slider-container">
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index} className="slider-slide">
                <div className="slider-background">
                  <img
                    src={slide.image}
                    alt={`Slider ${index}`}
                    className="slider-image"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-image.png'; }}
                  />
                  <div className="slider-content">
                    <h2>{slide.caption}</h2>
                    {slide.buttonText && slide.buttonLink && (
                      <Button type="primary" href={slide.buttonLink}>
                        {slide.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
};

export default SliderBar;
