module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Food', [{
    name: 'Scambled Eggs',
    amount: '3000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Fried Potatoes',
    amount: '1000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Catalan Sausage',
    amount: '2500',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Pasta',
    amount: '1500',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mussels',
    amount: '3500',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bacon',
    amount: '4000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Toast Coffee',
    amount: '1000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Shrimps',
    amount: '2400',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sandwich',
    amount: '3000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Paella',
    amount: '1900',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Hamburgers',
    amount: '5000',
    createdAt: new Date(),
    updatedAt: new Date()
    },
  {
    name: 'Shawarma',
    amount: '1500',
    createdAt: new Date(),
    updatedAt: new Date()
    },{
    name: 'Rice',
    amount: '2000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Green Salad',
    amount: '2500',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Cheesecake',
    amount: '6000',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Baguette',
    amount: '5500',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Cappuccino',
    amount: '2500',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Smoothies',
    amount: '4500',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Potato Pie',
    amount: '1500',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Fresh Squeezed Juice',
    amount: '2500',
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
    name: 'Steak',
    amount: '5000',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete('Food', null, {})
};
