export const categories = [
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'tea', name: 'Tea', icon: '🍵' },
  { id: 'cold', name: 'Cold Drinks', icon: '🥤' },
  { id: 'starters', name: 'Starters', icon: '🧄' },
  { id: 'mains', name: 'Main Course', icon: '🍽️' },
  { id: 'pasta', name: 'Pasta & Pizza', icon: '🍝' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export const menuItems = [
  // Coffee
  { id: 'c1', name: 'Espresso', desc: 'Bold, intense, single-origin shot', price: 150, category: 'coffee', isVeg: true, popular: false },
  { id: 'c2', name: 'Cappuccino', desc: 'Velvety foam, perfect balance of espresso and steamed milk', price: 180, category: 'coffee', isVeg: true, popular: true },
  { id: 'c3', name: 'Café Latte', desc: 'Smooth espresso with silky steamed milk', price: 190, category: 'coffee', isVeg: true, popular: false },
  { id: 'c4', name: 'Mocha', desc: 'Rich chocolate meets bold espresso, topped with cream', price: 220, category: 'coffee', isVeg: true, popular: true },
  { id: 'c5', name: 'Americano', desc: 'Espresso diluted with hot water — clean and crisp', price: 160, category: 'coffee', isVeg: true, popular: false },
  { id: 'c6', name: 'Flat White', desc: 'Micro-foam milk over a double ristretto', price: 200, category: 'coffee', isVeg: true, popular: false },
  { id: 'c7', name: 'Irish Coffee', desc: 'Coffee with a spirited twist, cream-topped', price: 280, category: 'coffee', isVeg: true, popular: false },
  { id: 'c8', name: 'Caramel Macchiato', desc: 'Vanilla, steamed milk, espresso, caramel drizzle', price: 230, category: 'coffee', isVeg: true, popular: true },

  // Tea
  { id: 't1', name: 'Masala Chai', desc: 'Traditional spiced tea brewed with fresh cardamom & ginger', price: 80, category: 'tea', isVeg: true, popular: true },
  { id: 't2', name: 'Green Tea', desc: 'Light, antioxidant-rich Japanese sencha', price: 120, category: 'tea', isVeg: true, popular: false },
  { id: 't3', name: 'Earl Grey', desc: 'Bergamot-infused classic, aromatic & refined', price: 140, category: 'tea', isVeg: true, popular: false },
  { id: 't4', name: 'Chamomile Bloom', desc: 'Calming chamomile with honey undertones', price: 130, category: 'tea', isVeg: true, popular: false },
  { id: 't5', name: 'Iced Lemon Tea', desc: 'Refreshingly cold with fresh lemon & mint', price: 150, category: 'tea', isVeg: true, popular: false },

  // Cold Drinks
  { id: 'd1', name: 'Cold Brew', desc: '24-hour steep, smooth & naturally sweet', price: 200, category: 'cold', isVeg: true, popular: true },
  { id: 'd2', name: 'Iced Latte', desc: 'Espresso over ice with cold milk', price: 210, category: 'cold', isVeg: true, popular: false },
  { id: 'd3', name: 'Caramel Frappe', desc: 'Blended iced coffee with caramel swirl', price: 240, category: 'cold', isVeg: true, popular: true },
  { id: 'd4', name: 'Mango Shake', desc: 'Fresh Alphonso mango, creamy & tropical', price: 180, category: 'cold', isVeg: true, popular: false },
  { id: 'd5', name: 'Berry Smoothie', desc: 'Blueberry, strawberry & banana blend', price: 220, category: 'cold', isVeg: true, popular: false },
  { id: 'd6', name: 'Fresh Lime Soda', desc: 'Zesty lime with a spark of soda', price: 100, category: 'cold', isVeg: true, popular: false },

  // Starters
  { id: 's1', name: 'Garlic Bread', desc: 'Toasted artisan bread with garlic butter & herbs', price: 190, category: 'starters', isVeg: true, popular: true },
  { id: 's2', name: 'Bruschetta', desc: 'Diced tomatoes, basil, olive oil on crostini', price: 220, category: 'starters', isVeg: true, popular: false },
  { id: 's3', name: 'French Fries', desc: 'Crispy golden fries with chipotle dip', price: 180, category: 'starters', isVeg: true, popular: true },
  { id: 's4', name: 'Chicken Wings', desc: 'Spicy buffalo wings with blue cheese dip', price: 320, category: 'starters', isVeg: false, popular: false },
  { id: 's5', name: 'Potato Wedges', desc: 'Seasoned thick-cut wedges with sour cream', price: 160, category: 'starters', isVeg: true, popular: false },
  { id: 's6', name: 'Soup of the Day', desc: 'Freshly prepared — ask your server', price: 180, category: 'starters', isVeg: true, popular: false },

  // Main Course
  { id: 'm1', name: 'Grilled Chicken', desc: 'Herb-marinated chicken with roasted vegetables', price: 420, category: 'mains', isVeg: false, popular: true },
  { id: 'm2', name: 'Fish & Chips', desc: 'Beer-battered fish with fries & tartar sauce', price: 380, category: 'mains', isVeg: false, popular: false },
  { id: 'm3', name: 'Veg Burger', desc: 'Black bean patty, avocado, lettuce, chipotle aioli', price: 280, category: 'mains', isVeg: true, popular: true },
  { id: 'm4', name: 'Club Sandwich', desc: 'Triple-decker with chicken, bacon, egg & greens', price: 300, category: 'mains', isVeg: false, popular: false },
  { id: 'm5', name: 'Pepper Steak', desc: 'Tenderloin steak with peppercorn sauce & mash', price: 520, category: 'mains', isVeg: false, popular: false },

  // Pasta & Pizza
  { id: 'p1', name: 'Alfredo Pasta', desc: 'Creamy parmesan sauce with fettuccine', price: 340, category: 'pasta', isVeg: true, popular: true },
  { id: 'p2', name: 'Arrabbiata', desc: 'Spicy tomato sauce with penne & chili flakes', price: 300, category: 'pasta', isVeg: true, popular: false },
  { id: 'p3', name: 'Margherita Pizza', desc: 'Classic tomato, mozzarella, fresh basil', price: 320, category: 'pasta', isVeg: true, popular: true },
  { id: 'p4', name: 'BBQ Chicken Pizza', desc: 'Smoky BBQ sauce, chicken, red onion, cilantro', price: 380, category: 'pasta', isVeg: false, popular: false },
  { id: 'p5', name: 'Truffle Mushroom Pizza', desc: 'Wild mushrooms, truffle oil, mozzarella, arugula', price: 400, category: 'pasta', isVeg: true, popular: false },

  // Desserts
  { id: 'x1', name: 'Brownie Sundae', desc: 'Warm chocolate brownie with vanilla ice cream & fudge', price: 290, category: 'desserts', isVeg: true, popular: true },
  { id: 'x2', name: 'Tiramisu', desc: 'Classic Italian coffee-flavored layered delight', price: 320, category: 'desserts', isVeg: true, popular: true },
  { id: 'x3', name: 'New York Cheesecake', desc: 'Creamy, dense, with graham cracker crust', price: 280, category: 'desserts', isVeg: true, popular: false },
  { id: 'x4', name: 'Crème Brûlée', desc: 'Custard base with caramelized sugar top', price: 300, category: 'desserts', isVeg: true, popular: false },
  { id: 'x5', name: 'Chocolate Lava Cake', desc: 'Molten center, served with vanilla ice cream', price: 260, category: 'desserts', isVeg: true, popular: true },
];

export const popularItems = menuItems.filter(item => item.popular);

export const combos = [
  { id: 'combo1', name: 'Classic Morning', items: 'Cappuccino + Garlic Bread', price: 340, originalPrice: 370, savings: 30 },
  { id: 'combo2', name: 'Lunch Deal', items: 'Veg Burger + French Fries + Cold Brew', price: 580, originalPrice: 660, savings: 80 },
  { id: 'combo3', name: 'Date Night', items: 'Pepper Steak + Tiramisu + 2× Mocha', price: 1090, originalPrice: 1260, savings: 170 },
  { id: 'combo4', name: 'Sweet Escape', items: 'Brownie Sundae + Caramel Macchiato', price: 460, originalPrice: 520, savings: 60 },
];