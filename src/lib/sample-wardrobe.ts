import type { ClosetItem } from './types';

export const sampleWardrobeItems: Omit<ClosetItem, 'id'>[] = [
  // 1. White T-shirt Round Neck
  {
    name: 'White Round Neck T-Shirt',
    category: 'Tops',
    color: 'white',
    description: 'Classic white cotton round neck tee - everyday essential',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop',
    aiHint: 'tops white round neck tshirt basic',
  },

  // 2. Basic Black T-Shirt
  {
    name: 'Basic Black T-Shirt',
    category: 'Tops',
    color: 'black',
    description: 'Essential black cotton tee - timeless wardrobe staple',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
    aiHint: 'tops black basic tshirt',
  },

  // 3. Blue Jeans
  {
    name: 'Blue Denim Jeans',
    category: 'Bottoms',
    color: 'blue',
    description: 'Classic blue denim jeans - versatile and comfortable',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop',
    aiHint: 'bottoms blue denim jeans',
  },

  // 4. White Sneakers
  {
    name: 'White Sneakers',
    category: 'Shoes',
    color: 'white',
    description: 'Classic white sneakers - perfect for casual wear',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop',
    aiHint: 'shoes white sneakers casual',
  },

  // 5. Black Belt
  {
    name: 'Black Leather Belt',
    category: 'Accessories',
    color: 'black',
    description: 'Classic black leather belt - essential accessory',
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583b0?w=800&auto=format&fit=crop',
    aiHint: 'accessories black leather belt',
  },

  // 6. Black Heels
  {
    name: 'Black Stiletto Heels',
    category: 'Shoes',
    color: 'black',
    description: 'Elegant black heels - perfect for formal occasions',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop',
    aiHint: 'shoes black heels stiletto formal',
  },

  // 7. Collared Shirt White
  {
    name: 'White Collared Shirt',
    category: 'Tops',
    color: 'white',
    description: 'Crisp white button-down shirt - professional essential',
    imageUrl: 'https://images.unsplash.com/photo-1603252110971-b8a57087be18?w=800&auto=format&fit=crop',
    aiHint: 'tops white collared shirt button down',
  },

  // 8. Black Blazer
  {
    name: 'Black Tailored Blazer',
    category: 'Outerwear',
    color: 'black',
    description: 'Sleek black blazer - polished and professional',
    imageUrl: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&auto=format&fit=crop',
    aiHint: 'outerwear black blazer tailored',
  },

  // 9. Black Midi Dress
  {
    name: 'Black Midi Dress',
    category: 'Dresses',
    color: 'black',
    description: 'Elegant black midi dress - versatile and chic',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop',
    aiHint: 'dresses black midi dress',
  },

  // 10. Denim Shorts
  {
    name: 'Denim Shorts',
    category: 'Bottoms',
    color: 'blue',
    description: 'Casual blue denim shorts - summer essential',
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop',
    aiHint: 'bottoms blue denim shorts casual',
  },

  // 11. Activewear Leggings
  {
    name: 'Black Activewear Leggings',
    category: 'Bottoms',
    color: 'black',
    description: 'High-waisted black leggings - gym to street',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop',
    aiHint: 'bottoms black leggings activewear gym',
  },

  // 12. Crop Top Black
  {
    name: 'Black Crop Top',
    category: 'Tops',
    color: 'black',
    description: 'Trendy black crop top - modern and stylish',
    imageUrl: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=800&auto=format&fit=crop',
    aiHint: 'tops black crop top',
  },

  // 13. Bralette
  {
    name: 'Black Bralette',
    category: 'Tops',
    color: 'black',
    description: 'Comfortable black bralette - layering essential',
    imageUrl: 'https://images.unsplash.com/photo-1564632516498-6f0e1c2e6733?w=800&auto=format&fit=crop',
    aiHint: 'tops black bralette sports bra',
  },

  // 14. Leather Jacket
  {
    name: 'Black Leather Jacket',
    category: 'Outerwear',
    color: 'black',
    description: 'Edgy black leather jacket - timeless classic',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
    aiHint: 'outerwear black leather jacket',
  },

  // 15. Long Bodycon Black Dress
  {
    name: 'Black Bodycon Maxi Dress',
    category: 'Dresses',
    color: 'black',
    description: 'Sleek black bodycon maxi dress - evening ready',
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format&fit=crop',
    aiHint: 'dresses black bodycon maxi long dress',
  },

  // 16. Boots
  {
    name: 'Black Ankle Boots',
    category: 'Shoes',
    color: 'black',
    description: 'Classic black ankle boots - versatile footwear',
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop',
    aiHint: 'shoes black ankle boots',
  },

  // 17. Tailored Trousers
  {
    name: 'Black Tailored Trousers',
    category: 'Bottoms',
    color: 'black',
    description: 'Professional black tailored trousers - office essential',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop',
    aiHint: 'bottoms black tailored trousers pants',
  },

  // 18. Satin Shirt White
  {
    name: 'White Satin Shirt',
    category: 'Tops',
    color: 'white',
    description: 'Luxurious white satin shirt - elegant and refined',
    imageUrl: 'https://images.unsplash.com/photo-1598032895397-ab04c0f3dc93?w=800&auto=format&fit=crop',
    aiHint: 'tops white satin shirt silk blouse',
  },

  // 19. Party Wear Dress
  {
    name: 'Sequin Party Dress',
    category: 'Dresses',
    color: 'black',
    description: 'Glamorous party dress - night out essential',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    aiHint: 'dresses party wear cocktail dress evening',
  },

  // 20. Structured Shoulder Bag
  {
    name: 'Black Structured Shoulder Bag',
    category: 'Bags',
    color: 'black',
    description: 'Elegant black structured bag - professional accessory',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop',
    aiHint: 'bags black structured shoulder bag handbag',
  },
];
