// src/pages/Home.tsx
import React from 'react';
import SliderBar from '../components/Home/SliderBar';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import NewProducts from '../components/Home/NewProducts';
import AllProducts from './AllProductsSlider';
import Articles from '../components/Home/Articles';
import '../styles/Home.scss';

const Home: React.FC = () => (
    <div className="home-page">
      <div className="home-slider-bar">
        <SliderBar />
      </div>
      <div className="products-section">
        <FeaturedProducts />
        <NewProducts />
        <AllProducts />
        <Articles />
      </div>
    </div>
);

export default Home;
