// src/components/Admin/AdminProducts.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Spin, Alert, Select } from 'antd';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import { Product, Category } from '../../types/types';

const { TextArea } = Input;
const { Option } = Select;

// Definujte typ pro formulářové hodnoty
interface FormValues {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string; // main/cover
  productImages?: string; // <-- sem dočasně uložíme multiline text
  categoryId: number;
  stock: number;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Specifikujte generický typ pro Form
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAllProducts(),
        categoryApi.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Chyba při načítání produktů nebo kategorií:', err);
      setError('Nepodařilo se načíst produkty nebo kategorie.');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      stock: product.stock,
      productImages: product.images // pole ProductImage
        ? product.images.map(img => img.imageUrl).join('\n')
        : ''
    });
    
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      message.success('Produkt byl úspěšně smazán.');
      fetchProductsAndCategories();
    } catch (err) {
      console.error('Chyba při mazání produktu:', err);
      message.error('Nepodařilo se smazat produkt.');
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    // values.productImages je string => chceme array
    const imagesArray = values.productImages
      ? values.productImages.split('\n').map(line => line.trim()).filter(Boolean)
      : []; // pokud nic, prázdné pole
  
    const payload = {
      name: values.name,
      description: values.description,
      price: values.price, // decimal
      imageUrl: values.imageUrl,
      categoryId: values.categoryId,
      stock: values.stock,
      productImages: imagesArray
    };
  
    try {
      if (editingProduct) {
        // update
        await productApi.updateProduct(editingProduct.id, payload);
        message.success('Produkt byl úspěšně aktualizován.');
      } else {
        // create
        await productApi.createProduct(payload);
        message.success('Produkt byl úspěšně vytvořen.');
      }
      setIsModalVisible(false);
      fetchProductsAndCategories();
    } catch (err) {
      console.error('Chyba při ukládání produktu:', err);
      message.error('Nepodařilo se uložit produkt.');
    }
  };
  

  const columns = [
    {
      title: 'Název',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cena',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price} Kč`,
    },
    {
      title: 'Kategorie',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'N/A';
      },
    },
    {
      title: 'Sklad',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Akce',
      key: 'action',
      render: (_: unknown, record: Product) => (
        <>
          <Button type="link" onClick={() => showEditModal(record)}>
            Upravit
          </Button>
          <Popconfirm
            title="Opravdu chcete tento produkt smazat?"
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
        Přidat produkt
      </Button>
      <Table dataSource={products} columns={columns} rowKey="id" />

      <Modal
        title={editingProduct ? 'Upravit produkt' : 'Přidat produkt'}
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
            name: editingProduct ? editingProduct.name : '',
            description: editingProduct ? editingProduct.description : '',
            price: editingProduct ? parseFloat(editingProduct.price.toString()) : 0,
            imageUrl: editingProduct ? editingProduct.imageUrl : '',
            categoryId: editingProduct ? editingProduct.categoryId : undefined,
            stock: editingProduct ? editingProduct.stock : 0,
          }}
        >
          <Form.Item
            name="name"
            label="Název"
            rules={[{ required: true, message: 'Prosím, zadejte název produktu.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Popis">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
  name="price"
  label="Cena"
  rules={[{ required: true, message: 'Prosím, zadejte cenu produktu.' }]}
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <InputNumber
      min={0}
      step={0.01}
      style={{ flex: 1 }}
      formatter={(value) => (value !== undefined ? value.toString().replace('.', ',') : '')} // Zobrazení čárky místo tečky
      // Odstraníme parser
    />
    <span style={{ marginLeft: '8px' }}>Kč</span>
  </div>
</Form.Item>

<Form.Item name="imageUrl" label="Hlavní obrázek (URL)">
  <Input />
</Form.Item>

<Form.Item
  name="productImages"
  label="Další obrázky (1 URL na řádek)"
>
  <TextArea rows={4} placeholder="Např.\n/images/foo1.jpg\n/images/foo2.jpg" />
</Form.Item>
          <Form.Item
            name="categoryId"
            label="Kategorie"
            rules={[{ required: true, message: 'Prosím, vyberte kategorii.' }]}
          >
            <Select placeholder="Vyberte kategorii">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="stock"
            label="Sklad"
            rules={[{ required: true, message: 'Prosím, zadejte skladovou dostupnost.' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Uložit změny' : 'Vytvořit'}
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

export default AdminProducts;
