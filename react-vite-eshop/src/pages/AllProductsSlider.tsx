// src/components/Home/AllProductsSlider.tsx
import React, { useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import { Card, Spin, Alert, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/Home/AllProducts.scss';
import productApi from '../api/productApi';
import { Product } from '../types/types';
import { useCart } from '../context/CartContext';

const { Meta } = Card;

const AllProductsSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // stáhni všechny, ale zobraz jen 10
        const data = await productApi.getAllProducts();
        const topTen = data.slice(0, 10);
        setProducts(topTen);
      } catch (err) {
        console.error('Chyba při načítání produktů:', err);
        setError('Chyba při načítání produktů.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    message.success(`${product.name} byl přidán do košíku.`);
  };

  const settings = useMemo(() => ({
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(3, products.length) } },
      { breakpoint: 992,  settings: { slidesToShow: Math.min(2, products.length) } },
      { breakpoint: 768,  settings: { slidesToShow: 1 } },
    ],
  }), [products.length]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }
  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }
  if (products.length === 0) {
    return <Alert message="Žádné produkty nejsou k dispozici." type="info" style={{ margin: '20px' }} />;
  }

  return (
    <div className="all-products-slider">
      <h2>Všechny Produkty</h2>

      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="slider-item">
            <Card
              hoverable
              className="all-card"
              onClick={() => navigate(`/products/${product.id}`)}
              cover={
                <img
                  alt={product.name}
                  src={product.imageUrl || '/images/default-product.jpg'}
                  loading="lazy"
                />
              }
            >
              <Meta
                title={<Link to={`/products/${product.id}`}>{product.name}</Link>}
                description={`Cena: ${product.price} Kč`}
              />
              <Button
                type="primary"
                className="add-to-cart-button"
                onClick={(e) => handleAddToCart(product, e)}
              >
                Přidat do košíku
              </Button>
            </Card>
          </div>
        ))}
      </Slider>

      {/* Tlačítko zobrazit vše */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="default">
          <Link to="/products">Zobrazit všechny produkty</Link>
        </Button>
      </div>
    </div>
  );
};

export default AllProductsSlider;
