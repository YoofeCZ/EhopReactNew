import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input, Select, Button, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';
import categoryApi from '../api/categoryApi';
import { Category } from '../types/types';
import '../styles/Categories.scss';

const { Option } = Select;
const { Search } = Input;

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        console.error('Chyba při načítání kategorií:', err);
        setError('Nepodařilo se načíst kategorie.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterCategories(value, selectedCategory);
  };

  const handleFilter = (category: string | undefined) => {
    setSelectedCategory(category);
    filterCategories(searchTerm, category);
  };

  const filterCategories = (search: string, category: string | undefined) => {
    let filtered = categories;

    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((c) => c.name === category);
    }

    setFilteredCategories(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(undefined);
    setFilteredCategories(categories);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div className="all-products">
      <h2>Všechny Kategorie</h2>
      <div className="filters">
        <Search
          placeholder="Hledat kategorie"
          allowClear
          enterButton="Hledat"
          size="middle"
          onSearch={handleSearch}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          placeholder="Filtrovat dle kategorie"
          style={{ width: 150 }}
          allowClear
          value={selectedCategory}
          onChange={handleFilter}
        >
          {categories.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Button onClick={resetFilters}>Resetovat Filtry</Button>
      </div>
      <Row gutter={[16, 16]}>
        {filteredCategories.map((category) => (
          <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <Link to={`/categories/${category.id}/products`}>
                  <img
                    alt={category.name}
                    src={`/images/categories/${category.name.toLowerCase()}.jpg`}
                    className="product-image"
                  />
                </Link>
              }
            >
              <Card.Meta
                title={<Link to={`/categories/${category.id}/products`}>{category.name}</Link>}
                description={category.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Categories;
