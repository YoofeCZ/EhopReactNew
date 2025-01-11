const { Order, OrderItem, Product } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // Vytvoření objednávky
    const order = await Order.create({ userId, total });

    // Vytvoření položek objednávky
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        if (product.stock < item.quantity) {
          throw new Error(`Nedostatečný sklad pro produkt ${product.name}`);
        }

        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });

        // Aktualizace počtu nákupů a skladu
        product.purchaseCount += item.quantity;
        product.stock -= item.quantity;
        await product.save();
      } else {
        throw new Error(`Produkt s ID ${item.productId} nenalezen`);
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Chyba při vytváření objednávky:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
