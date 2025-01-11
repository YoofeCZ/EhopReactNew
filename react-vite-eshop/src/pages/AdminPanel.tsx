// src/pages/AdminPanel.tsx
import React from 'react';
import { Tabs } from 'antd';
import AdminCategories from '../components/Admin/AdminCategories';
import AdminArticles from '../components/Admin/AdminArticles';
import AdminProducts from '../components/Admin/AdminProducts';
import AdminSliders from '../components/Admin/AdminSliders';
import '../styles/AdminPanel.scss';

const { TabPane } = Tabs;

const AdminPanel: React.FC = () => (
  <div className="admin-panel">
    <h2>Admin Panel</h2>
    <Tabs defaultActiveKey="categories">
      <TabPane tab="Kategorie" key="categories">
        <AdminCategories />
      </TabPane>
      <TabPane tab="Články" key="articles">
        <AdminArticles />
      </TabPane>
      <TabPane tab="Produkty" key="products">
        <AdminProducts />
      </TabPane>
      <TabPane tab="Slidery" key="sliders">
        <AdminSliders />
      </TabPane>
    </Tabs>
  </div>
);

export default AdminPanel;
