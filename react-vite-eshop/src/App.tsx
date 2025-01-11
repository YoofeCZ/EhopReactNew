// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Kontakt from './pages/Kontakt';
import Kosik from './pages/Kosik';
import AllProducts from './pages/AllProducts';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail'; 
import CategoryProducts from './pages/CategoryProducts';
import ArticleDetail from './pages/ArticleDetail';



const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/kosik" element={<Kosik />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id/products" element={<CategoryProducts />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/clanek/:id" element={<ArticleDetail />} />
        
      </Routes>
    </AppLayout>
  );
};

export default App;
