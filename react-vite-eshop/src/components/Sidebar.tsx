import React, { useEffect, useState } from 'react';
import { Drawer, Button, Typography, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types/types';
import categoryApi from '../api/categoryApi';
import '../styles/Sidebar.scss';
import useWindowWidth from '../hooks/useWindowWidth';

const { Title } = Typography;

const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Category[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 993;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);

        // Rozdělení kategorií na viditelné a skryté
        if (!isMobile) {
          const visible = data.slice(0, 8); // Viditelné kategorie (např. max 8)
          const hidden = data.slice(8); // Skryté kategorie
          setVisibleCategories(visible);
          setHiddenCategories(hidden);
        }
      } catch (err) {
        console.error('Chyba při načítání kategorií:', err);
        setError('Nepodařilo se načíst kategorie.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isMobile]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  const handleClick = (key: string) => {
    navigate(`/categories/${key}/products`);
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <Title level={3}></Title>
      </div>

      {isMobile ? (
        <>
          <Button type="primary" onClick={showDrawer} style={{ marginBottom: '10px' }}>
            Zobrazit kategorie
          </Button>
          <Drawer
  title="Kategorie"
  placement="left"
  onClose={closeDrawer}
  visible={isDrawerVisible}
  className="sidebar-drawer"  // <--- přidáno
>
{categories.map((category) => (
  <div
    key={category.id}
    className="sidebar-grid-item"
    onClick={() => {
      handleClick(category.id.toString());
      closeDrawer();
    }}
  >
    {/* Pokud je icon definované, zobraz img */}
    {category.icon && (
      <img 
        src={category.icon} 
        alt="icon" 
        style={{ width: 24, height: 24, marginRight: 8 }} 
      />
    )}
    {category.name}
  </div>
))}

</Drawer>

        </>
      ) : (
        <div className="sidebar-grid">
          {/* Viditelné kategorie */}
          {visibleCategories.map((category) => (
            <div
              key={category.id}
              className="sidebar-grid-item"
              onClick={() => handleClick(category.id.toString())}
            >
              {category.name}
            </div>
          ))}

          {/* Tlačítko pro otevření draweru */}
          {hiddenCategories.length > 0 && (
            <Button type="link" onClick={showDrawer}>
              Zobrazit více
            </Button>
          )}

          {/* Drawer pro skryté kategorie */}
          <Drawer
  title="Další kategorie"
  placement="left"
  onClose={closeDrawer}
  visible={isDrawerVisible}
  className="sidebar-drawer"  // <--- taky přidej
>
  {hiddenCategories.map((category) => (
    <div
      key={category.id}
      className="sidebar-grid-item"
      onClick={() => {
        handleClick(category.id.toString());
        closeDrawer();
      }}
    >
      {category.name}
    </div>
  ))}
</Drawer>

        </div>
      )}
    </div>
  );
};

export default Sidebar;
