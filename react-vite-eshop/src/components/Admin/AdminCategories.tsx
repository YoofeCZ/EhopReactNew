// src/components/Admin/AdminCategories.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Spin, Alert } from 'antd';
import categoryApi from '../../api/categoryApi';
import { Category } from '../../types/types';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Chyba při načítání kategorií:', err);
      setError('Nepodařilo se načíst kategorie.');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryApi.deleteCategory(id);
      message.success('Kategorie byla úspěšně smazána.');
      fetchCategories();
    } catch (err) {
      console.error('Chyba při mazání kategorie:', err);
      message.error('Nepodařilo se smazat kategorii.');
    }
  };

  const handleFormSubmit = async (values: { name: string; description?: string; icon?: string }) => {
    try {
      if (editingCategory) {
        // Aktualizace kategorie
        await categoryApi.updateCategory(editingCategory.id, values);
        message.success('Kategorie byla úspěšně aktualizována.');
      } else {
        // Vytvoření nové kategorie
        await categoryApi.createCategory(values);
        message.success('Kategorie byla úspěšně vytvořena.');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (err) {
      console.error('Chyba při ukládání kategorie:', err);
      message.error('Nepodařilo se uložit kategorii.');
    }
  };
  

  const columns = [
    {
      title: 'Název',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Popis',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ikona',
      dataIndex: 'icon',
      key: 'icon',
      render: (iconUrl: string | undefined) => (
        iconUrl ? <img src={iconUrl} alt="ikona" style={{ width: 24, height: 24 }} /> : null
      )
    },
    {
      title: 'Akce',
      key: 'action',
      render: (_: unknown, record: Category) => (
        <>
          <Button type="link" onClick={() => showEditModal(record)}>
            Upravit
          </Button>
          <Popconfirm
            title="Opravdu chcete tuto kategorii smazat?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ano"
            cancelText="Ne"
          >
            <Button type="link" danger>
              Smazat
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }

  return (
    <div>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: '16px' }}>
        Přidat kategorii
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="id" />

      <Modal
  title={editingCategory ? 'Upravit kategorii' : 'Přidat kategorii'}
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleFormSubmit}
    initialValues={{
      name: editingCategory ? editingCategory.name : '',
      description: editingCategory ? editingCategory.description : '',
      icon: editingCategory ? editingCategory.icon : '', // <--- nastavení ikony při editaci
    }}
  >
    <Form.Item
      name="name"
      label="Název"
      rules={[{ required: true, message: 'Prosím, zadejte název kategorie.' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item name="description" label="Popis">
      <Input.TextArea rows={4} />
    </Form.Item>

    {/* Nové pole pro ikonu */}
    <Form.Item name="icon" label="Ikona">
      <Input placeholder="URL ikony (např. /images/icons/books.png)" />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        {editingCategory ? 'Uložit změny' : 'Vytvořit'}
      </Button>
      <Button onClick={handleCancel} style={{ marginLeft: '8px' }}>
        Zrušit
      </Button>
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
};

export default AdminCategories;
