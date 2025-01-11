import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Spin,
  Alert,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import sliderApi from '../../api/sliderApi';
import { Slider } from '../../types/types';
import { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;

const AdminSliders: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const data = await sliderApi.getAllSliders();
      setSliders(data);
    } catch (err) {
      console.error('Chyba při načítání sliderů:', err);
      setError('Nepodařilo se načíst slidery.');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingSlider(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (slider: Slider) => {
    setEditingSlider(slider);
    form.setFieldsValue({
      caption: slider.caption,
      buttonText: slider.buttonText,
      buttonLink: slider.buttonLink,
      image: slider.image ? [{
        uid: '-1',
        name: 'current-image.png',
        status: 'done',
        url: slider.image,
      }] : [],
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSlider(null);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await sliderApi.deleteSlider(id);
      message.success('Slider byl úspěšně smazán.');
      fetchSliders();
    } catch (err) {
      console.error('Chyba při mazání slideru:', err);
      message.error('Nepodařilo se smazat slider.');
    }
  };

  interface FormValues {
    caption?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: UploadFile[]; // Image je nyní pole souborů
  }

  const handleFormSubmit = async (values: FormValues) => {
    try {
      setUploading(true);

      console.log('Form values before upload:', values);

      let imageUrl = editingSlider?.image || '';

      // Pokud je vybraný nový soubor, nahrajeme ho
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        if (file) {
          const uploadResponse = await sliderApi.uploadImage(file);
          if (uploadResponse.url) {
            imageUrl = uploadResponse.url;
            message.success('Obrázek byl úspěšně nahrán.');
          } else {
            throw new Error('Odpověď neobsahuje URL obrázku.');
          }
        }
      } else if (!editingSlider) {
        // Pokud přidáváte nový slider a žádný soubor není vybrán
        message.error('Obrázek je povinný.');
        setUploading(false);
        return;
      }

      const payload = { 
        caption: values.caption,
        buttonText: values.buttonText,
        buttonLink: values.buttonLink,
        image: imageUrl 
      };
      console.log('Odesílám na backend:', payload);

      if (editingSlider) {
        await sliderApi.updateSlider(editingSlider.id, payload);
        message.success('Slider byl úspěšně aktualizován.');
      } else {
        await sliderApi.createSlider(payload);
        message.success('Slider byl úspěšně vytvořen.');
      }

      fetchSliders();
      handleCancel();
    } catch (error) {
      console.error('Chyba při odesílání:', error);
      message.error('Nepodařilo se uložit slider.');
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      title: 'Obrázek',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image} alt="Slider" style={{ width: '100px' }} />
      ),
    },
    {
      title: 'Popis',
      dataIndex: 'caption',
      key: 'caption',
    },
    {
      title: 'Text Tlačítka',
      dataIndex: 'buttonText',
      key: 'buttonText',
    },
    {
      title: 'Odkaz Tlačítka',
      dataIndex: 'buttonLink',
      key: 'buttonLink',
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ),
    },
    {
      title: 'Akce',
      key: 'action',
      render: (_unused: unknown, record: Slider) => (
        <>
          <Button type="link" onClick={() => showEditModal(record)}>
            Upravit
          </Button>
          <Popconfirm
            title="Opravdu chcete tento slider smazat?"
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
    return (
      <Spin
        size="large"
        style={{ display: 'block', margin: 'auto', marginTop: '50px' }}
      />
    );
  }

  if (error) {
    return <Alert message={error} type="error" style={{ margin: '20px' }} />;
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={showAddModal}
        style={{ marginBottom: '16px' }}
      >
        Přidat slider
      </Button>
      <Table dataSource={sliders} columns={columns} rowKey="id" />

      <Modal
        title={editingSlider ? 'Upravit slider' : 'Přidat slider'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            caption: editingSlider ? editingSlider.caption : '',
            buttonText: editingSlider ? editingSlider.buttonText : '',
            buttonLink: editingSlider ? editingSlider.buttonLink : '',
            image: editingSlider ? [{
              uid: '-1',
              name: 'current-image.png',
              status: 'done',
              url: editingSlider.image,
            }] : [],
          }}
        >
          <Form.Item
            name="image"
            label="Obrázek"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[
              {
                required: !editingSlider,
                message: 'Prosím, nahrajte obrázek.',
              },
            ]}
          >
            <Upload
              beforeUpload={() => false} // Zamezení automatickému nahrávání
              listType="picture"
              maxCount={1}
              onChange={() => {
                form.validateFields(['image']);
              }}
              defaultFileList={
                editingSlider && editingSlider.image
                  ? [
                      {
                        uid: '-1',
                        name: 'current-image.png',
                        status: 'done',
                        url: editingSlider.image,
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadOutlined />} disabled={uploading}>
                Vybrat obrázek
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="caption" label="Popis">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="buttonText" label="Text Tlačítka">
            <Input />
          </Form.Item>
          <Form.Item name="buttonLink" label="Odkaz Tlačítka">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading}>
              {editingSlider ? 'Uložit změny' : 'Vytvořit'}
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

export default AdminSliders;
