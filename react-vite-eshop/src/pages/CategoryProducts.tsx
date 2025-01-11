// src/components/CategoryProducts.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Spin, Alert, Button, message, Slider, InputNumber, DatePicker, Select, Form } from 'antd';
import { FilterOutlined } from '@ant-design/icons'; // Import ikonky filtru
import categoryApi, { SortBy } from '../api/categoryApi';
import { Product, Category } from '../types/types';
import '../styles/CategoryProducts.scss';
import { useCart } from '../context/CartContext';
import { Dayjs } from 'dayjs';

const { Meta } = Card;
const { RangePicker } = DatePicker;
const { Option } = Select;

const CategoryProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Stavy pro filtry
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.PriceAsc);

  // Stav pro viditelnost filtrů
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        if (id) {
          const categoryId = parseInt(id, 10);
          const fetchedCategory = await categoryApi.getCategoryById(categoryId);
          setCategory(fetchedCategory);

          // Přečtěte produkty s filtry a tříděním
          const fetchedProducts = await categoryApi.getProductsByCategoryWithFilters(
            categoryId,
            priceRange,
            dateRange,
            sortBy
          );
          setProducts(fetchedProducts);
        } else {
          setError('Neplatné ID kategorie.');
        }
      } catch (err) {
        console.error('Chyba při načítání kategorií nebo produktů:', err);
        setError('Nepodařilo se načíst kategorii nebo produkty.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id, priceRange, dateRange, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    message.success(`${product.name} byl přidán do košíku.`);
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const handleInputNumberChange = (value: number | null, index: number) => {
    if (value !== null) {
      const newRange: [number, number] = [...priceRange];
      newRange[index] = value;
      setPriceRange(newRange);
    }
  };

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
    console.log('Selected dates:', dateStrings);
  };

  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }

  if (!category) {
    return <Alert message="Kategorie nenalezena." type="warning" style={{ margin: '20px' }} />;
  }

  return (
    <div className="category-products">
      <h2>{category.name}</h2>
      <p>{category.description}</p>

      {/* Tlačítko pro zobrazení/skrytí filtrů */}
      <Button
        type="primary"
        icon={<FilterOutlined />}
        onClick={() => setFiltersVisible(!filtersVisible)}
        className="toggle-filters-button"
      >
        Filtry
      </Button>

      {/* Filtry a třídění - zobrazí se pouze pokud jsou viditelné */}
      {filtersVisible && (
        <Form layout="vertical" className="filters">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <label>Cena (Kč):</label>
              <Slider
                range
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onChange={handlePriceChange}
                marks={{ 0: '0', 5000: '5000', 10000: '10000' }}
              />
              <InputNumber
                min={0}
                max={10000}
                step={100}
                value={priceRange[0]}
                onChange={(value) => handleInputNumberChange(value, 0)}
                style={{ marginRight: 16 }}
              />
              <InputNumber
                min={0}
                max={10000}
                step={100}
                value={priceRange[1]}
                onChange={(value) => handleInputNumberChange(value, 1)}
              />
            </Col>

            <Col xs={24} sm={12} md={8}>
              <label>Datum přidání:</label>
              <RangePicker
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Třídit podle:</label>
              <Select value={sortBy} onChange={handleSortChange} style={{ width: '100%' }}>
                <Option value={SortBy.PriceAsc}>Cena: Nejnižší</Option>
                <Option value={SortBy.PriceDesc}>Cena: Nejvyšší</Option>
                <Option value={SortBy.PurchaseCountDesc}>Nejprodávanější</Option>
                <Option value={SortBy.CreatedAtDesc}>Nejnovější</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setDateRange(null);
                  setSortBy(SortBy.PriceAsc);
                }}
                style={{ marginTop: '30px' }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      )}

      {/* Produkty */}
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
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
    </div>
  );
};

export default CategoryProducts;
