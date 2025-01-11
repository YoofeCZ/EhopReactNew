// src/components/Home/FeaturedProducts.tsx
import React, { useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import { Card, Spin, Alert, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/Home/FeaturedProducts.scss';
import productApi from '../../api/productApi';
import { Product } from '../../types/types';
import { useCart } from '../../context/CartContext';

const { Meta } = Card;

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Načti featured produkty
        const featuredData = await productApi.getFeaturedProducts();
        console.log('Fetched featured products:', featuredData);

        // Extrahujte ID featured produktů
        const featuredIds = featuredData.map(product => product.id);

        // Pokud je nedostatek featured produktů, doplň je náhodnými produkty, které nejsou ve featured
        const desiredSlidesToShow = 20; // Požadovaný počet produktů ve slideru
        let combinedProducts = featuredData;

        if (featuredData.length < desiredSlidesToShow) {
          const remainingCount = desiredSlidesToShow - featuredData.length;
          const randomData = await productApi.getRandomProducts(remainingCount, featuredIds);
          console.log('Fetched random products:', randomData);

          // Ověření, že randomData je pole
          if (Array.isArray(randomData)) {
            combinedProducts = [...featuredData, ...randomData];
          } else {
            console.error('getRandomProducts nevrací pole:', randomData);
            setError('Chyba při načítání náhodných produktů.');
            return;
          }
        }

        // Kontrola, zda jsme načetli dostatek produktů
        if (combinedProducts.length < desiredSlidesToShow) {
          const additionalCount = desiredSlidesToShow - combinedProducts.length;
          const additionalMockProducts = Array.from({ length: additionalCount }, (_, i) => ({
            id: combinedProducts.length + i + 1,
            name: `Mock Produkt ${combinedProducts.length + i + 1}`,
            description: 'Mock description',
            price: 999, // Číslo
            imageUrl: '/images/default-product.jpg',
            categoryId: 1,
            stock: 100,
          }));
          combinedProducts = [...combinedProducts, ...additionalMockProducts];
        }

        setProducts(combinedProducts);
      } catch (err) {
        console.error('Chyba při načítání produktů:', err);
        setError('Chyba při načítání produktů.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const settings = useMemo(() => {
    return {
      dots: false,
      infinite: products.length > 4, // Nekonečný posuv pouze pokud je více než 4 produktů
      speed: 500,
      slidesToShow: 4, // Zobrazení 4 produktů najednou
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1400, // Velké obrazovky
          settings: {
            slidesToShow: Math.min(4, products.length),
            infinite: products.length > 4,
          },
        },
        {
          breakpoint: 1200, // Středně velké obrazovky
          settings: {
            slidesToShow: Math.min(3, products.length),
            infinite: products.length > 3,
          },
        },
        {
          breakpoint: 992, // Menší obrazovky
          settings: {
            slidesToShow: Math.min(2, products.length),
            infinite: products.length > 2,
          },
        },
        {
          breakpoint: 768, // Mobilní zařízení
          settings: {
            slidesToShow: 1,
            infinite: products.length > 1,
          },
        },
      ],
    };
  }, [products.length]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Zabraňuje navigaci při kliknutí na tlačítko
    addToCart(product, 1);
    message.success(`${product.name} byl přidán do košíku.`);
  };

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
    <div className="featured-products">
      <h2>Oblíbené Produkty</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="featured-product-card">
            <Card
              hoverable
              className="featured-card"
              onClick={() => navigate(`/products/${product.id}`)}
              cover={
                <img
                  alt={product.name}
                  src={product.imageUrl || '/images/default-product.jpg'}
                  loading="lazy" // Pro lazy loading obrázků
                />
              }
            >
              <Meta
                title={<Link to={`/products/${product.id}`}>{product.name}</Link>}
                description={`Cena: ${product.price} Kč`}
              />
              <Button
                type="primary"
                className="featured-add-to-cart-button"
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

export default FeaturedProducts;
