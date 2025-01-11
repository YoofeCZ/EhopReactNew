// src/pages/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../types/types';
import { getArticleById } from '../api/articlesService';
import { Spin, Alert, Typography } from 'antd';
import '../styles/ArticleDetail.css';

const { Title, Paragraph } = Typography;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(Number(id));
        setArticle(data);
      } catch (err) {
        console.error(err); // Logování chyby
        setError('Nepodařilo se načíst články.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message="Chyba" description={error} type="error" showIcon />;
  }

  if (!article) {
    return <Alert message="Článek nenalezen" type="warning" showIcon />;
  }

  return (
    <div className="article-detail">
      <Title>{article.title}</Title>
      <img src={article.image} alt={article.title} className="article-detail-image" />
      <Paragraph>{article.content}</Paragraph>
      <Paragraph><em>Publikováno: {new Date(article.createdAt).toLocaleDateString()}</em></Paragraph>
    </div>
  );
};

export default ArticleDetail;
