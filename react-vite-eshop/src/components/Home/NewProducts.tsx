// src/components/Home/NewProducts.tsx
import React, { useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import { Card, Spin, Alert, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/Home/NewProducts.scss';
import productApi from '../../api/productApi';
import { Product } from '../../types/types';
import { useCart } from '../../context/CartContext';

const { Meta } = Card;

const NewProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const data = await productApi.getLatestProducts();
        // Z produktů vyber jen 10
        const topTen = data.slice(0, 10);
        setProducts(topTen);
      } catch (err) {
        console.error('Chyba při načítání novinek:', err);
        setError('Nepodařilo se načíst nejnovější produkty.');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    message.success(`${product.name} byl přidán do košíku.`);
  };

  const navigateToDetail = (id: number) => {
    navigate(`/products/${id}`);
  };

  // Nastavení slideru
  const settings = useMemo(() => ({
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200, // středně velké
        settings: { slidesToShow: Math.min(3, products.length) }
      },
      {
        breakpoint: 992, // menší
        settings: { slidesToShow: Math.min(2, products.length) }
      },
      {
        breakpoint: 768, // mobil
        settings: { slidesToShow: 1 }
      },
    ],
  }), [products.length]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }

  if (products.length === 0) {
    return <Alert message="Žádné novinky nejsou k dispozici." type="info" style={{ margin: '20px' }} />;
  }

  return (
    <div className="new-products-slider">
      <h2>Novinky</h2>

      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="slider-item">
            <Card
              hoverable
              className="slider-card"
              onClick={() => navigateToDetail(product.id)}
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
    </div>
  );
};

export default NewProducts;
