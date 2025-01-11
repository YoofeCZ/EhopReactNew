// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { Menu, Input, Drawer, Button } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  ContactsOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import '../styles/Navbar.scss';

const { Search } = Input;

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 980;
      setIsMobile(isNowMobile);

      if (!isNowMobile) {
        setDrawerVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Domů',
      link: '/',
    },
    {
      key: '/kosik',
      icon: <ShoppingCartOutlined />,
      label: 'Košík',
      link: '/kosik',
    },
    {
      key: '/kontakt',
      icon: <ContactsOutlined />,
      label: 'Kontakt',
      link: '/kontakt',
    },
    {
      key: '/admin',
      icon: <UserOutlined />,
      label: 'Admin Panel',
      link: '/admin',
    },
  ];

  const handleClick = (key: string) => {
    navigate(key);
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Button type="link" onClick={() => navigate('/')}>
          <img
            src="/images/logo.png"
            alt="E-shop Logo"
            className="navbar-logo-img"
          />
        </Button>
      </div>

      {/* Search bar */}
      {!isMobile && (
        <Search
          placeholder="Vyhledávání"
          allowClear
          prefix={<SearchOutlined />}
          className="navbar-search"
          onSearch={(value) => console.log('Hledat:', value)}
        />
      )}

      {/* Menu or Drawer */}
      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="navbar-drawer-button"
          />
<Drawer
  title="Menu"
  placement="right"
  onClose={() => setDrawerVisible(false)}
  visible={drawerVisible}
  bodyStyle={{ padding: 0 }}
  className="navbar-drawer"  // <--- PŘIDÁNO
>
  <Menu
    mode="vertical"
    selectedKeys={[location.pathname]}
    items={menuItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: (
        <NavLink to={item.link} className="menu-link">
          {item.label}
        </NavLink>
      ),
    }))}
    onClick={() => setDrawerVisible(false)}
  />
</Drawer>
        </>
      ) : (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="navbar-menu"
          onClick={(e) => handleClick(e.key)}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <NavLink to={item.link} className="menu-link">
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </div>
  );
};

export default Navbar;
