'use strict';

const { Sequelize, sequelize, Category } = require('./models'); // Ověř, že cesta k modelům je správná

// Data pro kategorie
const categories = [
  { name: "Móda", description: "Oblečení, obuv a módní doplňky", createdAt: new Date(), updatedAt: new Date() },
  { name: "Knihy", description: "Literatura, odborné knihy a magazíny", createdAt: new Date(), updatedAt: new Date() },
  { name: "Hračky", description: "Hračky pro děti všech věkových kategorií", createdAt: new Date(), updatedAt: new Date() },
  { name: "Domácí potřeby", description: "Vybavení a pomůcky do domácnosti", createdAt: new Date(), updatedAt: new Date() },
  { name: "Sport a fitness", description: "Sportovní vybavení a potřeby pro cvičení", createdAt: new Date(), updatedAt: new Date() },
  { name: "Krása a zdraví", description: "Kosmetika, parfémy a zdravotní pomůcky", createdAt: new Date(), updatedAt: new Date() },
  { name: "Potraviny", description: "Potraviny a nápoje pro každodenní potřebu", createdAt: new Date(), updatedAt: new Date() },
  { name: "Dům a zahrada", description: "Zahradní a domácí nářadí, rostliny a vybavení", createdAt: new Date(), updatedAt: new Date() },
  { name: "Hudba", description: "Hudební nástroje, alba a příslušenství", createdAt: new Date(), updatedAt: new Date() },
  { name: "Filmy a hry", description: "DVD, Blu-ray, videohry a konzole", createdAt: new Date(), updatedAt: new Date() },
  { name: "Cestování", description: "Cestovní vybavení, kufry a doplňky", createdAt: new Date(), updatedAt: new Date() },
  { name: "Auto-moto", description: "Příslušenství pro auta a motocykly", createdAt: new Date(), updatedAt: new Date() },
  { name: "Kancelářské potřeby", description: "Vybavení a potřeby do kanceláře", createdAt: new Date(), updatedAt: new Date() },
  { name: "Dětské zboží", description: "Produkty pro péči o děti a novorozence", createdAt: new Date(), updatedAt: new Date() },
  { name: "Zdravá výživa", description: "Bio potraviny a doplňky stravy", createdAt: new Date(), updatedAt: new Date() },
  { name: "Hobby", description: "Vybavení pro kreativní činnosti a koníčky", createdAt: new Date(), updatedAt: new Date() },
  { name: "Chovatelské potřeby", description: "Pomůcky a krmivo pro domácí mazlíčky", createdAt: new Date(), updatedAt: new Date() },
  { name: "Šperky", description: "Prsteny, náramky, náhrdelníky a další", createdAt: new Date(), updatedAt: new Date() },
  { name: "Cyklistika", description: "Jízdní kola a příslušenství", createdAt: new Date(), updatedAt: new Date() }
];

async function seedCategories() {
  try {
    // Připojení k databázi
    await sequelize.authenticate();
    console.log('Připojeno k databázi.');

    // Synchronizace modelů (bez přepisování existujících tabulek)
    await sequelize.sync();
    console.log('Modely synchronizovány.');

    // Kontrola existujících kategorií (duplicit)
    const existingCategories = await Category.findAll();
    if (existingCategories.length > 0) {
      console.log('Kategorie již existují, přeskočeno.');
      process.exit(0); // Úspěšné ukončení skriptu
    }

    // Vložení kategorií
    await Category.bulkCreate(categories, { validate: true });
    console.log('Kategorie byly úspěšně vloženy.');

    process.exit(0); // Úspěšné ukončení skriptu
  } catch (error) {
    console.error('Chyba při vkládání kategorií:', error);
    process.exit(1); // Ukončení skriptu s chybou
  }
}

seedCategories();
