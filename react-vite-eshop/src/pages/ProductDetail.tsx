import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Alert, Button, Carousel, Row, Col } from 'antd';
import productApi from '../api/productApi';
import { Product, ProductImage } from '../types/types';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.scss';

const { Title, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productApi.getProductById(parseInt(id, 10));
          setProduct(data);
        } else {
          setError('Neplatné ID produktu.');
        }
      } catch (err) {
        console.error('Chyba při načítání produktu:', err);
        setError('Chyba při načítání produktu.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  const scrollToDescription = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }

  if (!product) {
    return <Alert message="Produkt nenalezen." type="warning" style={{ margin: '20px' }} />;
  }

  return (
    <div className="product-detail-container">
      <Row gutter={[40, 40]} className="product-detail-top">
        <Col xs={24} md={10}>
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <Carousel autoplay>
                {product.images.map((img: ProductImage) => (
                  <div key={img.id}>
                    <img
                      src={img.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src="/images/default-product.jpg"
                alt="Default Product"
                className="product-image"
              />
            )}
          </div>
        </Col>
        <Col xs={24} md={14}>
          <div className="product-info">
            <Title level={2}>{product.name}</Title>
            <Paragraph className="short-description">
              {product.description ? `${product.description.substring(0, 100)}...` : 'Popis není k dispozici.'}
              <Button type="link" onClick={scrollToDescription}>
                Přečíst více
              </Button>
            </Paragraph>

            <div className="product-details">
              <Paragraph>
                <strong>Skladem:</strong> {product.stock > 0 ? `${product.stock} ks` : 'Není skladem'}
              </Paragraph>
              <Paragraph>
                <strong>Cena:</strong> {product.price} Kč
              </Paragraph>
              <Button 
                type="primary" 
                onClick={handleAddToCart} 
                disabled={product.stock <= 0}
              >
                Přidat do košíku
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <div className="product-description" ref={descriptionRef}>
        <Title level={3}>Detailní Popis</Title>
        <Paragraph>{product.description}</Paragraph>
        {/* Pokud máte bohatší popis s HTML nebo obrázky, můžete použít dangerouslySetInnerHTML */}
        {/* <div dangerouslySetInnerHTML={{ __html: product.description }} /> */}
      </div>
    </div>
  );
};

export default ProductDetail;
