// src/pages/AllProducts.tsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Spin, Alert, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';
import { Product } from '../types/types';
import '../styles/Home/AllProductsSlider.scss';
import { useCart } from '../context/CartContext';

const { Title } = Typography;
const { Meta } = Card;

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Chyba při načítání produktů:', err);
        setError('Chyba při načítání produktů.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  const handleCardClick = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }

  return (
    <div className="all-products">
      <Title level={2}>Všechny Produkty</Title>

      <Row gutter={[16, 16]}>
        {products.slice(0, visibleCount).map(product => (
          <Col
            key={product.id}
            xxl={6}  // 4 sloupce  (≥1600px)
            xl={8}   // 3 sloupce  (1200–1599)
            lg={12}  // 2 sloupce  (992–1199)
            md={12}  // 2 sloupce  (768–991)
            sm={24}  // 1 sloupec  (576–767)
            xs={24}  // 1 sloupec  (<576)
          >
            <Card
              hoverable
              className="product-card"
              onClick={() => handleCardClick(product.id)}
              cover={
                <img
                  alt={product.name}
                  src={product.imageUrl || '/images/default-product.jpg'}
                  className="product-image"
                  loading="lazy"
                />
              }
            >
              <Meta
                title={<Link to={`/products/${product.id}`} className="product-title">{product.name}</Link>}
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
          </Col>
        ))}
      </Row>

      {visibleCount < products.length && (
        <div className="load-more-container">
          <Button type="primary" onClick={handleLoadMore}>
            Zobrazit další produkty
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
