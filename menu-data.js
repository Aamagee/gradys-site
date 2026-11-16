/* ==========================================================================
   Gradys — menu data (single source of truth)
   Used by the Menu page (index.html) and the printable menu (print.html).
   Source: Gradys printed menu posted to Instagram, Oct 29 2026.
   To update the menu, edit this file only.
     n = name · p = price · d = description · add = add-on line
     tag = 'V' (vegetarian) or 'VG' (vegan) · sauces = [label, color-class]
     callout = highlighted special row
   ========================================================================== */
window.GRADYS_MENU = [
  {
    id: 'shareables', title: 'Shareables', note: 'Made for the middle of the table.',
    img: 'assets/wings.jpg', alt: 'Sticky glazed wings at the bar', print: 1,
    items: [
      { n: 'Chorizo Cheese Ball', p: '12', d: 'House-made chorizo, sharp white cheddar, cream cheese, chives, bacon, candied pecan, honey, crackers, carrots & celery' },
      { n: 'Nachos', p: '14', d: 'Taco-seasoned tortilla chips or fries, garlic beer cheese, pico de gallo, charred tomatillo-avocado crema, pickled red onion, pickled Fresno, cilantro', add: 'Add chorizo +4 · chicken +6 · braised short rib +8 · shrimp +8 · steak +10' },
      { n: 'Roasted Carrots', p: '15', tag: 'VG', d: 'Coriander & cumin roasted heirloom carrots, cashew & roasted garlic purée, spiced maple pecans, balsamic-fig reduction, chive' },
      { n: 'Brown Butter Pretzel Dips', p: '16', tag: 'V', d: 'Pretzel braids, garlic beer cheese, charred shallot whole grain mustard, maple bourbon caramel' },
      { n: 'Fried Cheese Curds', p: '12', d: 'Crispy tempura batter', sauces: [['Fermented chili honey', 's-honey'], ['Garlic chive aioli', 's-aioli']] },
      { n: 'Short Rib Taquitos', p: '18', d: 'Chili-braised short rib, white cheddar, corn tortilla, pickled red onion, cilantro, almond poblano crema, chili jus' },
      { n: 'Wings', p: '17', d: 'Fried chicken wings with green goddess ranch or blue cheese. Dry rubs: lemon pepper, blue cheese buffalo or house seasoning.', sauces: [['Buffalo', 's-buffalo'], ['Gold BBQ', 's-bbq'], ['Stout BBQ', 's-bbq'], ['Fermented Chili Honey', 's-honey'], ['Chipotle Cherry', 's-buffalo'], ['Bourbon Soy', 's-rub'], ['INFERNO!!!!', 's-buffalo']] },
      { n: 'Gra-deez Nuts', p: '10', tag: 'V', d: 'Maple glaze, rosemary, flaky salt' },
      { n: 'Pickle Chips', p: '10', d: 'Ginger-breaded pickle chips, ranch dressing' },
      { n: 'Jalapeño Popper Wontons', p: '13', d: 'Jalapeño, bacon, cream cheese, cheddar, garlic, wonton, honey' },
      { n: 'Chips & Salsa', p: '11', d: 'Taco-seasoned tortilla chips, salsa roja, salsa verde, charred tomatillo & avocado crema' },
      { n: 'Fried Goodie Baskets', p: '', d: 'House-made chips 6 · House-made fries 6 · Sweet potato tots 8 · Onion rings 9' }
    ]
  },
  {
    id: 'salads', title: 'Soups & Salads', note: 'Add chicken +6 · shrimp +8 · steak +10',
    img: 'assets/brussels-caesar.jpg', alt: 'Fried Brussels sprouts salad', print: 1,
    items: [
      { n: 'Brussels', p: '15', d: 'Fried Brussels sprouts, lemon Caesar dressing, bacon, sourdough crumble, pecorino, balsamic fig glaze' },
      { n: 'Wedge Salad', p: '16', d: 'Iceberg, bacon, tomato, pickled red onion, blue cheese crumble, chive, blue cheese dressing' },
      { n: 'Market Salad', p: '13', tag: 'VG', d: 'Cabbage, Brussels sprout, iceberg, arugula, cucumber, pickled red onion, tomato, carrot, chopped almond, Granny Smith apple, citrus vinaigrette' },
      { n: 'Ski Resort Chili', p: '14', d: 'Seared ground beef, braised short rib, kidney beans, sharp white cheddar, sour cream, pickled Fresno, chive, served in a sourdough bread bowl', add: 'Bread bowl too much? Get a cup 8' },
      { n: 'Soup of the Moment', p: '6/8', d: 'It could change at any time. Sometimes we may not even have it! But whatever it is, it’ll be delicious. We’ll always have chili.', add: 'Get it in a sourdough bread bowl +4' }
    ]
  },
  {
    id: 'burgers', title: 'Burgers', note: 'Chips or fries on the side. Swap in sweet potato tots, onion rings or a house salad +2.',
    img: 'assets/burger-egg.jpg', alt: 'Burger with bacon and a fried egg', print: 2,
    items: [
      { n: 'Burger Thursday', p: '13', callout: true, d: 'Every burger is $13 all day Thursday (bison excluded), plus a new feature burger each week.' },
      { n: 'Smash Burger*', p: '16', d: 'House blend smash patty, American, iceberg, dill pickle, Pop Off sauce, potato bun' },
      { n: 'The Gradys Way Bison Burger*', p: '24', d: 'Bison patty, white cheddar, crisp bacon, arugula, house-seasoned chips, Stout BBQ, potato bun' },
      { n: 'Fresno Fire Burger*', p: '18', d: 'House blend burger patty, white cheddar, pickled Fresno, almond poblano aioli, iceberg, potato bun' },
      { n: 'Sweet Heat Burger*', p: '18', d: 'Smash patty, bacon-jalapeño cream cheese, garlic chive aioli, iceberg, candied jalapeños, potato bun' },
      { n: 'Shroom of Doom Burger*', p: '19', d: 'Smash patty, roasted mushrooms, rosemary garlic jam, Swiss, crispy shallots, garlic aioli, iceberg, potato bun' },
      { n: 'Burger Add-Ons', p: '', d: 'Add patty: beef +4 · buffalo +8 · Bacon or egg +2 · Pickled red onion, pickled Fresno, candied jalapeño, roasted jalapeño, crispy shallots, red onion or tomato +1 · Garlic aioli, Utah Gold BBQ, Stout BBQ or fermented chili honey +.75 · Sub grilled portobello +2' }
    ]
  },
  {
    id: 'handhelds', title: 'Handhelds', note: 'House chips or fries included. Swap tots, rings or salad +2.',
    img: 'assets/steak-sandwich.jpg', alt: 'Sandwich and fries on the marble bar', print: 1,
    items: [
      { n: 'Grilled Cheese', p: '12', tag: 'V', d: 'American, Swiss, white cheddar, tomato soup jam, sourdough', add: 'Add short rib +8 · bacon +2' },
      { n: 'Chicken Sandwich', p: '18', d: 'Crispy or grilled chicken, cranberry jalapeño relish, apple cabbage slaw, crispy shallots' },
      { n: 'Poblano Chicken Tacos', p: '18', d: 'Crispy or grilled chicken, cabbage, roasted poblano almond crema, pickled red onion, avocado, cilantro, white cheddar crisp, white corn tortilla', add: 'Sub portobello at no extra cost · shrimp +2 · short rib +2' },
      { n: 'Smoked Turkey Club', p: '18', d: 'Smoked turkey, bacon, sharp white cheddar, avocado, pickled red onion, tomato, iceberg, green goddess ranch, sourdough' },
      { n: 'Tender Basket', p: '17', d: '5 fried tenders', sauces: [['Utah Gold BBQ', 's-bbq'], ['Buffalo', 's-buffalo'], ['Fermented chili', 's-honey'], ['Stout BBQ', 's-bbq'], ['Honey mustard', 's-aioli'], ['Ranch', 's-rub'], ['Blue cheese', 's-rub']] }
    ]
  },
  {
    id: 'entrees', title: 'Entrées', note: 'Available after 4 PM.',
    img: 'assets/steak-eggs.jpg', alt: 'Seared sirloin with chimichurri', print: 2,
    items: [
      { n: 'Steak', p: '28', d: '8 oz seared sirloin, brown butter mashed potatoes, coriander & cumin roasted carrots, Fresno horseradish chimichurri' },
      { n: 'Chicken', p: '21', d: '6 oz blackened chicken breast, brown butter mashed potatoes, sourdough crumb, apple-cabbage slaw, fig balsamic glaze' },
      { n: 'Skewers', p: '22', d: 'Choice of shrimp, chicken, steak or a combination, rice pilaf, fermented chili honey' },
      { n: 'Mac & Cheese', p: '17', d: 'Cavatappi, garlic beer cheese sauce, bacon, house-made chip & panko crumble' },
      { n: 'Cauliflower', p: '20', tag: 'VG', d: 'Seared cauliflower steak, pickled cauliflower, roasted portobello mushroom, cashew & roasted garlic purée, pickled red onion, Fresno & horseradish chimichurri' }
    ]
  },
  {
    id: 'brunch', title: 'Brunch', note: 'Saturdays & Sundays, 11 AM – 3 PM.',
    img: 'assets/biscuits-gravy.jpg', alt: 'Biscuits and gravy with eggs and bacon', print: 2,
    items: [
      { n: 'Steak & Eggs', p: '26', d: 'Seared 8 oz sirloin, home fries, 2 eggs your way, horseradish & pickled Fresno chimichurri' },
      { n: 'Short Rib Chilaquiles', p: '18', d: 'Chili-braised short rib, salsa roja, fried tortilla chips, 1 egg your way, garlic chive aioli, avocado, crumbled cotija, cilantro' },
      { n: 'Sourdough French Toast', p: '14', d: 'Thick-cut sourdough, spiced vanilla custard, bourbon caramel, tart whipped cream, Gra-deez Nuts crumble' },
      { n: 'Breakfast Burrito', p: '15', d: 'House-made sausage, fluffy scrambled egg, potatoes, gouda, green chiles, almond poblano crema, large flour tortilla seared to perfection' },
      { n: 'Biscuits & Gravy', p: '14', d: 'House-made garlic-cheddar biscuits, sausage gravy, 2 eggs your way' },
      { n: 'Croissant Breakfast Sandwich', p: '16', d: 'Flaky toasted croissant, bacon, tomato jam, fluffy scrambled egg, gouda, tarragon-Dijon aioli, home fries' },
      { n: 'Breakfast Plate', p: '14', d: 'Two eggs your way, house-made sausage or thick-cut bacon, home fries, sourdough toast, tomato jam' },
      { n: 'Parfait', p: '11', d: 'Whipped Greek yogurt, maple-brown butter rosemary nuts, macerated berries, honey' },
      { n: 'Brunch Sides', p: '', d: 'Toast 3 · 1 egg 3 · 2 eggs 5 · Bacon (3) 4 · Sausage patties (2) 4 · Breakfast potatoes 4 · with beer cheese 5 · Biscuit & gravy 5 · Fruit 5' }
    ]
  },
  {
    id: 'desserts', title: 'Desserts', note: 'Save room. Trust us.',
    img: 'assets/french-toast.jpg', alt: 'Sourdough French toast with whipped cream', print: 2,
    items: [
      { n: 'Brûléed Banana Bread', p: '12', d: 'Banana bread, maple bourbon caramel, vanilla whipped cream, toasted pecan' },
      { n: 'Stout Toffee Cake', p: '14', d: 'Dark chocolate stout cake, toffee, vanilla whipped cream' },
      { n: 'Uncrust We Trust Sunday', p: '13', d: 'Fried Smucker’s Uncrustable, cinnamon sugar dust, vanilla ice cream, Gra-deez Nuts, whipped cream, caramel drizzle, maraschino cherry' }
    ]
  }
];

/* Past weekly features (from Instagram). Newest first. */
window.GRADYS_FEATURES = [
  { name: 'Tropic Like It’s Hot', day: 'Burger Thursday', date: 'Nov 12', price: '13', d: 'Beef patty, sambal bacon jam, pineapple black pepper aioli, pepper jack, pickled red onions, shredded lettuce, crispy fried shallots.', line: 'Sweet, spicy, crunchy, and zero regrets.' },
  { name: 'The Chicago Steak Dip', day: 'Meaty Monday', date: 'Nov 9', price: '', d: '8 oz seared & sliced sirloin, molten provolone, Chicago giardiniera, house horseradish-mustard spread, red wine beef au jus.', line: 'Demands a full soak.' },
  { name: 'The Fiesta Smash', day: 'Burger Thursday', date: 'Nov 5', price: '13', d: 'Smash patty, spicy cilantro crema, green chile black bean spread, corn salad, melted Oaxaca, tortilla strips, potato bun.', line: 'A must-try for game day.' },
  { name: 'Meat Monday Massacre Burrito', day: 'Meaty Monday', date: 'Nov 2', price: '15', d: 'Seared sirloin, crispy bacon, fries, black bean purée, candied jalapeños, pico, avocado crema, white cheddar, cilantro, salsa roja.', line: 'Basically an illegal amount of food for a Monday.' },
  { name: 'Steak Shoestring Hoagie', day: 'Meaty Monday', date: 'Oct 26', price: '15', d: 'Seared sirloin, eggs, a massive crunch of shoestrings and garlic-heavy chimichurri aioli.', line: 'First come, first served until the steak runs out.' },
  { name: 'The Oaxaca-ing Dead', day: 'Meaty Monday', date: 'Oct 19', price: '15', d: '8 oz charbroiled sirloin rested in beef tallow, Oaxaca, blistered poblanos, roasted peppers, cabbage, poblano-avocado chimichurri crema, tallow-toasted hoagie.', line: 'Survive the zombie apocalypse.' },
  { name: 'The Taco Smash', day: 'Burger Thursday', date: 'Oct', price: '13', d: 'Taco-seasoned smash patties, gooey Oaxaca, fresh avocado, shredded iceberg, house pico de gallo, chipotle-lime crema.', line: 'Burger or tacos? Why choose.' }
];
