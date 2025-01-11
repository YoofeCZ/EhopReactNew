// src/pages/Kosik.tsx
import React from 'react';
import { Table, Typography, Button, InputNumber, message } from 'antd';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';
import '../styles/Kosik.scss';
import { CartItem } from '../types/types'; // Importujte CartItem a Order

const { Title } = Typography;

const Kosik: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        message.warning('Košík je prázdný.');
        return;
      }

      const userId = 1; // Zatím statické ID uživatele, v budoucnu získejte z autentizace

      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      await orderApi.createOrder({ userId, items, total }); // Odstranili jsme 'order'

      message.success('Objednávka byla úspěšně vytvořena.');

      clearCart();
      navigate('/'); // Přesměrování na domovskou stránku nebo stránku s potvrzením
    } catch (error: unknown) {
      console.error('Chyba při vytváření objednávky:', error);

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { error?: string } } };
        message.error(err.response?.data?.error || 'Chyba při vytváření objednávky.');
      } else {
        message.error('Neočekávaná chyba při vytváření objednávky.');
      }
    }
  };

  const columns = [
    {
      title: 'Produkt',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>, // 'record' není potřeba
    },
    {
      title: 'Cena za kus',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price} Kč`,
    },
    {
      title: 'Množství',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={quantity} // Použijte 'value' místo 'defaultValue' pro kontrolovaný komponent
          onChange={(value: number | null) => {
            if (value !== null) {
              updateQuantity(record.id, value);
            }
          }}
        />
      ),
    },
    {
      title: 'Celkem',
      key: 'total',
      render: (_: unknown, record: CartItem) => `${record.price * record.quantity} Kč`,
    },
    {
      title: 'Akce',
      key: 'action',
      render: (_: unknown, record: CartItem) => (
        <Button type="link" danger onClick={() => removeFromCart(record.id)}>
          Odebrat
        </Button>
      ),
    },
  ];

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="kosik">
      <Title level={2}>Košík</Title>
      <Table
        dataSource={cartItems}
        columns={columns}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: 'Váš košík je prázdný.' }}
      />
      {cartItems.length > 0 && (
        <div className="kosik-summary">
          <h3>Celková cena: {totalPrice} Kč</h3>
          <Button type="primary" onClick={handleCheckout}>
            Zaplatit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Kosik;
