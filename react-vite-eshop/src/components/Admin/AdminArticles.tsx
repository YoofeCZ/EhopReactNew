// src/components/Admin/AdminArticles.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Spin, Alert } from 'antd';
import { Article } from '../../types/types';
import { getArticles, getArticleById } from '../../api/articlesService';
import articlesService from '../../api/articlesService';

const { TextArea } = Input;

const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error('Chyba při načítání článků:', err);
      setError('Nepodařilo se načíst články.');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingArticle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = async (id: number) => {
    try {
      const article = await getArticleById(id);
      setEditingArticle(article);
      form.setFieldsValue({
        title: article.title,
        image: article.image,
        shortText: article.shortText,
        content: article.content,
      });
      setIsModalVisible(true);
    } catch (err) {
      console.error('Chyba při načítání článku:', err);
      message.error('Nepodařilo se načíst článek.');
    }
  };
  
  

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingArticle(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await articlesService.deleteArticle(id);
      message.success('Článek byl úspěšně smazán.');
      fetchArticles();
    } catch (err) {
      console.error('Chyba při mazání článku:', err);
      message.error('Nepodařilo se smazat článek.');
    }
  };

  const handleFormSubmit = async (values: { title: string; image?: string; shortText: string; content: string }) => {
    try {
      if (editingArticle) {
        // Aktualizace článku
        await articlesService.updateArticle(editingArticle.id, values);
        message.success('Článek byl úspěšně aktualizován.');
      } else {
        // Vytvoření nového článku
        await articlesService.createArticle(values);
        message.success('Článek byl úspěšně vytvořen.');
      }
      setIsModalVisible(false);
      fetchArticles();
    } catch (err) {
      console.error('Chyba při ukládání článku:', err);
      message.error('Nepodařilo se uložit článek.');
    }
  };
  

  const columns = [
    {
      title: 'Název',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Krátký text',
      dataIndex: 'shortText',
      key: 'shortText',
      ellipsis: true,
    },
    {
            title: 'Akce',
            key: 'action',
            render: (_: unknown, record: Article) => (
                <>
                  <Button type="link" onClick={() => showEditModal(record.id)}>
                    Upravit
                  </Button>
                  <Popconfirm
                    title="Opravdu chcete tento článek smazat?"
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
        Přidat článek
      </Button>
      <Table dataSource={articles} columns={columns} rowKey="id" />

      <Modal
        title={editingArticle ? 'Upravit článek' : 'Přidat článek'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            title: editingArticle ? editingArticle.title : '',
            image: editingArticle ? editingArticle.image : '',
            shortText: editingArticle ? editingArticle.shortText : '',
            content: editingArticle ? editingArticle.content : '',
          }}
        >
          <Form.Item
            name="title"
            label="Název"
            rules={[{ required: true, message: 'Prosím, zadejte název článku.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="image" label="URL Obrázku">
            <Input />
          </Form.Item>
          <Form.Item
            name="shortText"
            label="Krátký Text"
            rules={[{ required: true, message: 'Prosím, zadejte krátký text.' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="content"
            label="Obsah"
            rules={[{ required: true, message: 'Prosím, zadejte obsah článku.' }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingArticle ? 'Uložit změny' : 'Vytvořit'}
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

export default AdminArticles;
