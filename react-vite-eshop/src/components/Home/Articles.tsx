// src/components/Home/Articles.tsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';
import '../../styles/Home/Articles.scss';
import { Article } from '../../types/types';
import { getArticles } from '../../api/articlesService';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        // Předpokládáme, že nejnovější články jsou na začátku pole
        setArticles(data);
      } catch (err) {
        console.error(err); // Logování chyby
        setError('Nepodařilo se načíst články.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message="Chyba" description={error} type="error" showIcon />;
  }

  const largeArticles = articles.slice(0, 2);
  const smallArticles = articles.slice(2, 5);

  return (
    <div className="articles-section">
      <h2>Novinky</h2>
      <Row gutter={[16, 16]}>
        {largeArticles.map((article) => (
          <Col key={article.id} xs={24} md={12}>
            <Card
              hoverable
              className="ant-card-custom" /* Přidání vlastní třídy pro další stylování, pokud je potřeba */
            >
              <Link to={`/clanek/${article.id}`} className="article-image-container">
                <img alt={article.title} src={article.image} className="article-image large" />
              </Link>
              <Card.Meta
                title={<Link to={`/clanek/${article.id}`}>{article.title}</Link>}
                description={article.shortText}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} className="small-articles-row">
        {smallArticles.map((article) => (
          <Col key={article.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="ant-card-custom" /* Přidání vlastní třídy pro další stylování, pokud je potřeba */
            >
              <Link to={`/clanek/${article.id}`} className="article-image-container">
                <img alt={article.title} src={article.image} className="article-image small" />
              </Link>
              <Card.Meta
                title={<Link to={`/clanek/${article.id}`}>{article.title}</Link>}
                description={article.shortText}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Articles;
