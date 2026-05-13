const Shop = require("../models/Shop");

const SHOP_CATEGORIES = [
  "All",
  "Coffee Shops",
  "Jewellery",
  "Spa & Wellness",
  "Clothing",
  "Spices & Tea",
  "Souvenirs",
  "Supermarkets",
  "Furniture & Home",
  "Beauty & Cosmetics",
  "Bookshops",
];

const SHOPS = [
  {
    id: "cs1",
    name: "Colombo Coffee Co.",
    category: "Coffee Shops",
    location: "Colombo 7, Western Province",
    description:
      "Specialty single-origin brews in a relaxed, heritage setting. Famous for their Ceylon pour-over and homemade pastries.",
    rating: 4.7,
    reviewCount: 312,
    priceRange: "LKR 400 - 1,200",
    tag: "Specialty Coffee",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    openHours: "8 AM - 10 PM",
    phone: "+94 11 234 5678",
    website: "https://colombocoffeeco.lk",
  },
  {
    id: "cs2",
    name: "Cafe Kumbuk",
    category: "Coffee Shops",
    location: "Colombo 3, Western Province",
    description:
      "An artisan riverside cafe with organic coffee, healthy bites and a stunning outdoor bamboo terrace alongside the Beira Lake.",
    rating: 4.8,
    reviewCount: 526,
    priceRange: "LKR 500 - 1,500",
    tag: "Artisan Cafe",
    image: "https://images.squarespace-cdn.com/content/v1/58ddf88a29687f5a851489e5/1591369674351-B5R0H60X8Q20JH7UYB44/6J6A2309_10_11_12_Interior.jpg",
    openHours: "8 AM - 11 PM",
    phone: "+94 77 891 2345",
    website: "https://www.cafekumbuk.com",
  },
  {
    id: "cs3",
    name: "Barista Colombo",
    category: "Coffee Shops",
    location: "Liberty Plaza, Colombo 3",
    description:
      "International cafe chain with a strong Sri Lankan twist - try their iced Ceylon tea latte and signature cold brew blends.",
    rating: 4.3,
    reviewCount: 189,
    priceRange: "LKR 350 - 900",
    tag: "Cafe Chain",
    image: "https://barista.lk/wp-content/uploads/2025/07/slider2-1-1536x1025.jpg",
    openHours: "9 AM - 9 PM",
    phone: "+94 11 456 7890",
    website: "https://barista.lk",
  },
  {
    id: "cs4",
    name: "Harpo's Coffee House",
    category: "Coffee Shops",
    location: "Galle Fort, Southern Province",
    description:
      "A beloved Galle Fort institution. Serves hearty Sri Lankan breakfasts, freshly ground Nuwara Eliya estate coffee and homemade cakes.",
    rating: 4.6,
    reviewCount: 403,
    priceRange: "LKR 600 - 1,800",
    tag: "Heritage Cafe",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80",
    openHours: "7 AM - 9 PM",
    phone: "+94 91 223 0644",
    website: null,
  },
  {
    id: "cs5",
    name: "The Tea Cup",
    category: "Coffee Shops",
    location: "Kandy City Centre, Central Province",
    description:
      "Experience traditional Ceylon high tea in the heart of Kandy. Floor-to-ceiling windows overlook the picturesque Kandy Lake.",
    rating: 4.5,
    reviewCount: 278,
    priceRange: "LKR 700 - 2,000",
    tag: "Tea House",
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80",
    openHours: "10 AM - 8 PM",
    phone: "+94 81 234 5670",
    website: null,
  },
  {
    id: "jw1",
    name: "Zam Gems",
    category: "Jewellery",
    location: "Colombo 3, Western Province",
    description:
      "Premier gem and jewellery boutique showcasing certified Ceylon sapphires, rubies and custom-crafted fine jewellery since 1985.",
    rating: 4.9,
    reviewCount: 741,
    priceRange: "LKR 15,000 - 500,000+",
    tag: "Fine Jewellery",
    image: "https://zamgems.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-08-at-23.14.50-5.jpeg",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 234 0000",
    website: "https://zamgems.com",
  },
  {
    id: "jw2",
    name: "Lanka Gems & Jewellery",
    category: "Jewellery",
    location: "Pettah, Colombo 11",
    description:
      "Government-authorised gem trading house offering GIA-certified precious stones, gold jewellery and traditional Kandyan designs.",
    rating: 4.6,
    reviewCount: 334,
    priceRange: "LKR 5,000 - 200,000",
    tag: "Certified Gems",
    image: "https://ngja.gov.lk/wp-content/uploads/2020/08/find-dealers-banner.png",
    openHours: "9 AM - 6 PM",
    phone: "+94 11 234 7890",
    website: "https://ngja.gov.lk/find-boutiques/",
  },
  {
    id: "jw3",
    name: "National Gem & Jewellery Authority",
    category: "Jewellery",
    location: "25 Galle Face Terrace, Colombo 3",
    description:
      "The official government body for gem trading. Buy with total confidence - every stone is independently tested and certified.",
    rating: 4.7,
    reviewCount: 198,
    priceRange: "LKR 10,000 - 1,000,000+",
    tag: "Government Authorised",
    image: "https://ngja.gov.lk/wp-content/uploads/2020/07/jewellery-page-banner.png",
    openHours: "8:30 AM - 4:30 PM (Mon-Fri)",
    phone: "+94 11 230 0706",
    website: "https://www.ngja.gov.lk",
  },
  {
    id: "jw4",
    name: "Nirbhara Gems",
    category: "Jewellery",
    location: "Ratnapura, Sabaragamuwa Province",
    description:
      "Gem capital of Sri Lanka! Visit a real gem mine, watch cutting and polishing, and buy direct from the source at unbeatable prices.",
    rating: 4.8,
    reviewCount: 512,
    priceRange: "LKR 3,000 - 150,000",
    tag: "Mine Direct",
    image: "https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=600&q=80",
    openHours: "8 AM - 6 PM",
    phone: "+94 45 222 5566",
    website: null,
  },
  {
    id: "sp1",
    name: "Spa Ceylon",
    category: "Spa & Wellness",
    location: "Colombo 3, Western Province",
    description:
      "Sri Lanka's most iconic luxury Ayurveda spa brand. Holistic treatments blend ancient Ceylonese herbal wisdom with five-star pampering.",
    rating: 4.9,
    reviewCount: 1024,
    priceRange: "LKR 5,000 - 25,000",
    tag: "Luxury Ayurveda",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    openHours: "10 AM - 9 PM",
    phone: "+94 11 230 0888",
    website: "https://spaceylon.com",
  },
  {
    id: "sp2",
    name: "Jetwing Ayurveda Pavilions",
    category: "Spa & Wellness",
    location: "Negombo, Western Province",
    description:
      "Award-winning dedicated Ayurveda retreat. Expert doctors prescribe personalised treatments including Panchakarma detox programmes.",
    rating: 4.8,
    reviewCount: 689,
    priceRange: "LKR 8,000 - 50,000",
    tag: "Retreat & Wellness",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
    openHours: "7 AM - 8 PM",
    phone: "+94 31 227 3000",
    website: "https://jetwinghotels.com",
  },
  {
    id: "sp3",
    name: "Mandara Spa at Cinnamon Grand",
    category: "Spa & Wellness",
    location: "Colombo 3, Western Province",
    description:
      "Balinese-inspired luxury spa in the heart of Colombo. Signature treatments combine Asian techniques with pure botanical ingredients.",
    rating: 4.7,
    reviewCount: 456,
    priceRange: "LKR 6,000 - 30,000",
    tag: "Luxury Spa",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    openHours: "9 AM - 10 PM",
    phone: "+94 11 243 7437",
    website: null,
  },
  {
    id: "sp4",
    name: "Barberyn Ayurveda Resort",
    category: "Spa & Wellness",
    location: "Beruwala, Western Province",
    description:
      "Pioneering Ayurveda wellness resort since 1982. Combining authentic Ceylonese medicine with beachfront tranquility on the Indian Ocean.",
    rating: 4.8,
    reviewCount: 389,
    priceRange: "LKR 12,000 - 60,000",
    tag: "Ayurveda Resort",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    openHours: "7 AM - 9 PM",
    phone: "+94 34 227 6036",
    website: "https://barberyn.com",
  },
  {
    id: "sp5",
    name: "Spa Ceylon Heritage Store",
    category: "Spa & Wellness",
    location: "Galle Fort, Southern Province",
    description:
      "A signature Spa Ceylon retail and wellness space inside historic Galle Fort, offering luxury Ayurveda products, aromatherapy and gift sets.",
    rating: 4.8,
    reviewCount: 612,
    priceRange: "LKR 2,500 - 20,000",
    tag: "Spa Ceylon Boutique",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    openHours: "10 AM - 9 PM",
    phone: "+94 91 222 9944",
    website: "https://spaceylon.com",
  },
  {
    id: "sp6",
    name: "Siddhalepa Ayurveda Health Resort",
    category: "Spa & Wellness",
    location: "Mount Lavinia, Western Province",
    description:
      "One of Sri Lanka's best-known Ayurveda brands, offering traditional herbal treatments, wellness consultations and authentic Siddhalepa products.",
    rating: 4.7,
    reviewCount: 544,
    priceRange: "LKR 4,000 - 22,000",
    tag: "Ayurveda Brand",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    openHours: "8 AM - 8 PM",
    phone: "+94 11 273 1800",
    website: "https://www.siddhalepa.com",
  },
  {
    id: "cl1",
    name: "Laksala - National Craft Centre",
    category: "Clothing",
    location: "Colombo 3, Western Province",
    description:
      "Government-run emporium showcasing the finest Sri Lankan handlooms, batik, lacework, brasswork, and traditional costumes in one place.",
    rating: 4.5,
    reviewCount: 678,
    priceRange: "LKR 1,500 - 25,000",
    tag: "Handicrafts & Textiles",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 230 1881",
    website: "https://laksala.com",
  },
  {
    id: "cl2",
    name: "Barefoot Gallery & Boutique",
    category: "Clothing",
    location: "Colombo 3, Western Province",
    description:
      "Iconic design boutique famous for vibrant handwoven cotton textiles, unique clothing, home decor and an in-house garden cafe.",
    rating: 4.8,
    reviewCount: 892,
    priceRange: "LKR 2,000 - 40,000",
    tag: "Designer Boutique",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80",
    openHours: "10 AM - 7 PM",
    phone: "+94 11 258 9305",
    website: "https://barefoot.lk",
  },
  {
    id: "cl3",
    name: "ODEL Fashion Mall",
    category: "Clothing",
    location: "Alexandra Place, Colombo 7",
    description:
      "Sri Lanka's largest fashion and lifestyle mall. International brands, local designers and a huge food court under one iconic roof.",
    rating: 4.4,
    reviewCount: 1243,
    priceRange: "LKR 1,000 - 50,000",
    tag: "Fashion Mall",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    openHours: "10 AM - 9 PM",
    phone: "+94 11 268 2712",
    website: "https://odel.lk",
  },
  {
    id: "cl4",
    name: "Kandyan Textiles",
    category: "Clothing",
    location: "Kandy City, Central Province",
    description:
      "Specialising in authentic Kandyan sarees, traditional silk fabric and hand-embroidered ceremonial wear. Perfect for weddings and events.",
    rating: 4.6,
    reviewCount: 321,
    priceRange: "LKR 3,500 - 35,000",
    tag: "Traditional Wear",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4cbc?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 81 222 3344",
    website: null,
  },
  {
    id: "cl5",
    name: "Galle Lace Factory",
    category: "Clothing",
    location: "Galle Fort, Southern Province",
    description:
      "Watch lacemakers at work in a 200-year-old Dutch fort building, then browse exquisite handmade Galle lace tablecloths, garments and gifts.",
    rating: 4.7,
    reviewCount: 267,
    priceRange: "LKR 500 - 15,000",
    tag: "Heritage Lace",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    openHours: "8:30 AM - 5:30 PM",
    phone: "+94 91 222 4455",
    website: null,
  },
  {
    id: "cl6",
    name: "Carnage Flagship Store",
    category: "Clothing",
    location: "Havelock Town, Colombo 5",
    description:
      "One of Sri Lanka's most popular streetwear and youth fashion brands, known for bold graphic tees, denim and casual everyday wear.",
    rating: 4.6,
    reviewCount: 728,
    priceRange: "LKR 1,500 - 12,000",
    tag: "Sri Lankan Streetwear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    openHours: "10 AM - 9 PM",
    phone: "+94 11 250 5050",
    website: "https://www.carnage.shop",
  },
  {
    id: "cl7",
    name: "NoLimit Fashion Store",
    category: "Clothing",
    location: "High Level Road, Nugegoda",
    description:
      "A household Sri Lankan fashion chain with affordable clothing, footwear and accessories for men, women and kids.",
    rating: 4.5,
    reviewCount: 981,
    priceRange: "LKR 900 - 15,000",
    tag: "Popular Fashion Brand",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    openHours: "10 AM - 9 PM",
    phone: "+94 11 281 1811",
    website: "https://nolimit.lk",
  },
  {
    id: "cl8",
    name: "House of Fashions",
    category: "Clothing",
    location: "Duplication Road, Colombo 4",
    description:
      "A long-standing Sri Lankan retail favourite for fashion, handbags, shoes, cosmetics and gifts under one roof.",
    rating: 4.4,
    reviewCount: 1102,
    priceRange: "LKR 1,000 - 20,000",
    tag: "Retail Favourite",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    openHours: "10 AM - 9 PM",
    phone: "+94 11 255 3322",
    website: "https://houseoffashions.lk",
  },
  {
    id: "cl9",
    name: "Buddhi Batiks Atelier",
    category: "Clothing",
    location: "Colombo 7, Western Province",
    description:
      "A premium Sri Lankan designer label celebrated for modern batik fashion, handcrafted prints and resort wear inspired by local art.",
    rating: 4.7,
    reviewCount: 403,
    priceRange: "LKR 3,000 - 35,000",
    tag: "Designer Batik",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    openHours: "10 AM - 7 PM",
    phone: "+94 11 268 5588",
    website: "https://buddhibatiks.com",
  },
  {
    id: "st1",
    name: "Dilmah Tea Boutique",
    category: "Spices & Tea",
    location: "Colombo 3, Western Province",
    description:
      "Sri Lanka's world-famous tea brand direct. Explore 100+ single-origin Ceylon teas, gift boxes and exclusive estate blends.",
    rating: 4.8,
    reviewCount: 934,
    priceRange: "LKR 400 - 8,000",
    tag: "Premium Tea",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80",
    openHours: "9 AM - 8 PM",
    phone: "+94 11 268 0880",
    website: "https://dilmahtea.com",
  },
  {
    id: "st2",
    name: "Mlesna Tea Castle",
    category: "Spices & Tea",
    location: "Talawakelle, Nuwara Eliya",
    description:
      "Unique castle-shaped tea boutique in the heart of the hill country. Award-winning flavoured teas, tea-tasting tours and a gift shop.",
    rating: 4.7,
    reviewCount: 612,
    priceRange: "LKR 600 - 12,000",
    tag: "Estate Tea",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    openHours: "9 AM - 5 PM",
    phone: "+94 52 222 3456",
    website: "https://mlesnatea.com",
  },
  {
    id: "st3",
    name: "Matara Spice Garden",
    category: "Spices & Tea",
    location: "Matara, Southern Province",
    description:
      "Walk through living spice gardens of cinnamon, cardamom, cloves and pepper. Buy fresh spices, oils and Ayurvedic herbal products direct.",
    rating: 4.6,
    reviewCount: 489,
    priceRange: "LKR 200 - 5,000",
    tag: "Organic Spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    openHours: "8 AM - 6 PM",
    phone: "+94 41 222 7788",
    website: null,
  },
  {
    id: "st4",
    name: "Damro Labookellie Tea Centre",
    category: "Spices & Tea",
    location: "Nuwara Eliya, Central Province",
    description:
      "Visit the Labookellie tea estate, enjoy free tea tasting with mountain views, and buy freshly processed teas straight from the factory.",
    rating: 4.8,
    reviewCount: 1140,
    priceRange: "LKR 300 - 6,000",
    tag: "Factory Tour",
    image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=600&q=80",
    openHours: "8 AM - 5 PM",
    phone: "+94 52 222 9900",
    website: null,
  },
  {
    id: "st5",
    name: "Basilur Tea Lounge",
    category: "Spices & Tea",
    location: "One Galle Face, Colombo 1",
    description:
      "A famous Sri Lankan tea brand offering premium tea collections, elegant souvenir tins and tasting sets perfect for visitors.",
    rating: 4.7,
    reviewCount: 468,
    priceRange: "LKR 500 - 10,000",
    tag: "Luxury Tea Brand",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80",
    openHours: "10 AM - 10 PM",
    phone: "+94 11 242 4242",
    website: "https://basilurtea.com",
  },
  {
    id: "sv1",
    name: "Paradise Road Gallery",
    category: "Souvenirs",
    location: "Colombo 7, Western Province",
    description:
      "Iconic lifestyle store curated by renowned designer Shanth Fernando. Unique home decor, art prints, ceramics and exclusive Sri Lanka gifts.",
    rating: 4.8,
    reviewCount: 567,
    priceRange: "LKR 500 - 75,000",
    tag: "Luxury Gifts",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
    openHours: "10 AM - 7 PM",
    phone: "+94 11 268 6043",
    website: "https://paradiseroad.lk",
  },
  {
    id: "sv2",
    name: "Selyn Handlooms & Craft Shop",
    category: "Souvenirs",
    location: "Weligama, Southern Province",
    description:
      "Fair-trade certified handloom collective. Stunning hand-woven bags, scarves and wall hangings - every purchase directly supports rural artisans.",
    rating: 4.7,
    reviewCount: 398,
    priceRange: "LKR 800 - 12,000",
    tag: "Fair Trade",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80",
    openHours: "9 AM - 6 PM",
    phone: "+94 41 225 5000",
    website: "https://selyn.lk",
  },
  {
    id: "sv3",
    name: "Elephant House Gift Shop",
    category: "Souvenirs",
    location: "Pinnawala, Sabaragamuwa Province",
    description:
      "Unique eco-gifts crafted from recycled elephant dung paper - notebooks, cards, art prints. Proceeds fund the Pinnawala Elephant Orphanage.",
    rating: 4.5,
    reviewCount: 832,
    priceRange: "LKR 150 - 3,000",
    tag: "Eco Gifts",
    image: "https://images.unsplash.com/photo-1549407232-9afcb3f12b01?w=600&q=80",
    openHours: "8:30 AM - 5:30 PM",
    phone: "+94 35 226 5258",
    website: null,
  },
  {
    id: "sv4",
    name: "Galle Fort Antiques",
    category: "Souvenirs",
    location: "Galle Fort, Southern Province",
    description:
      "Treasure-hunt through colonial Dutch antiques, vintage maps, old Ceylon stamps and curios in the atmospheric 400-year-old Galle Fort.",
    rating: 4.6,
    reviewCount: 299,
    priceRange: "LKR 300 - 50,000",
    tag: "Antiques",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80",
    openHours: "9 AM - 6 PM",
    phone: null,
    website: null,
  },
  {
    id: "sv5",
    name: "Lakpahana Handicrafts",
    category: "Souvenirs",
    location: "Colombo 7, Western Province",
    description:
      "One of the best-known Sri Lankan handicraft stores for masks, wood carvings, handloom items, lacquerware and cultural souvenirs.",
    rating: 4.7,
    reviewCount: 522,
    priceRange: "LKR 500 - 25,000",
    tag: "Classic Handicrafts",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 269 8231",
    website: "https://lakpahana.com",
  },
  {
    id: "sv6",
    name: "Raux Brothers Lifestyle Store",
    category: "Souvenirs",
    location: "Park Street Mews, Colombo 2",
    description:
      "A respected Sri Lankan heritage brand for homeware, gift items, decorative pieces and elegant locally made lifestyle products.",
    rating: 4.6,
    reviewCount: 344,
    priceRange: "LKR 1,000 - 40,000",
    tag: "Heritage Lifestyle",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&q=80",
    openHours: "10 AM - 7 PM",
    phone: "+94 11 230 4020",
    website: "https://rauxbrothers.com",
  },
  {
    id: "sm1",
    name: "Cargills Food City Signature",
    category: "Supermarkets",
    location: "Colombo 5, Western Province",
    description:
      "One of Sri Lanka's most familiar supermarket brands for snacks, spices, tea, fresh fruit and everyday essentials visitors often need.",
    rating: 4.5,
    reviewCount: 1168,
    priceRange: "LKR 150 - 15,000",
    tag: "Local Supermarket",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    openHours: "8 AM - 10 PM",
    phone: "+94 11 250 5500",
    website: "https://cargillsfoodcity.com",
  },
  {
    id: "sm2",
    name: "Keells Super Flagship",
    category: "Supermarkets",
    location: "Nugegoda, Western Province",
    description:
      "A popular Sri Lankan supermarket chain with quality groceries, ready meals, bakery items and travel-friendly local products.",
    rating: 4.6,
    reviewCount: 974,
    priceRange: "LKR 200 - 18,000",
    tag: "Premium Grocery",
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=600&q=80",
    openHours: "8 AM - 10 PM",
    phone: "+94 11 281 7744",
    website: "https://www.keellssuper.com",
  },
  {
    id: "sm3",
    name: "Arpico Supercentre",
    category: "Supermarkets",
    location: "Colombo 3, Western Province",
    description:
      "A famous Sri Lankan hypermarket brand where visitors can shop for food, luggage, electronics, souvenirs and household items in one stop.",
    rating: 4.4,
    reviewCount: 1324,
    priceRange: "LKR 150 - 45,000",
    tag: "Hypermarket",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80",
    openHours: "9 AM - 9 PM",
    phone: "+94 11 246 6600",
    website: "https://arpicosupercentre.com",
  },
  {
    id: "fh1",
    name: "Damro Experience Centre",
    category: "Furniture & Home",
    location: "Battaramulla, Western Province",
    description:
      "Damro is one of Sri Lanka's best-known home brands, offering furniture, mattresses, office fittings and stylish interior pieces.",
    rating: 4.6,
    reviewCount: 688,
    priceRange: "LKR 3,000 - 350,000",
    tag: "Famous Home Brand",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    openHours: "9 AM - 8 PM",
    phone: "+94 11 288 8899",
    website: "https://damro.lk",
  },
  {
    id: "fh2",
    name: "Royal Ceramics Lifestyle Studio",
    category: "Furniture & Home",
    location: "Rajagiriya, Western Province",
    description:
      "A polished Sri Lankan lifestyle showroom for tiles, bathroomware and elegant home finishes from one of the country's major brands.",
    rating: 4.5,
    reviewCount: 351,
    priceRange: "LKR 1,500 - 250,000",
    tag: "Home Design",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 286 2862",
    website: "https://www.royalceramics.com",
  },
  {
    id: "bc1",
    name: "Nature's Secrets Beauty Boutique",
    category: "Beauty & Cosmetics",
    location: "Colombo 7, Western Province",
    description:
      "A well-known Sri Lankan personal care brand offering herbal skincare, haircare and beauty products made for tropical climates.",
    rating: 4.6,
    reviewCount: 472,
    priceRange: "LKR 400 - 8,000",
    tag: "Herbal Beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    openHours: "10 AM - 8 PM",
    phone: "+94 11 268 4500",
    website: "https://www.naturessecrets.lk",
  },
  {
    id: "bc2",
    name: "Swadeshi Ayurveda Wellness Store",
    category: "Beauty & Cosmetics",
    location: "Colombo 4, Western Province",
    description:
      "One of Sri Lanka's oldest Ayurvedic consumer brands, known for herbal soaps, sandalwood products and wellness essentials.",
    rating: 4.5,
    reviewCount: 389,
    priceRange: "LKR 250 - 6,500",
    tag: "Ayurvedic Cosmetics",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 255 4411",
    website: "https://www.swadeshiayurveda.com",
  },
  {
    id: "bk1",
    name: "Sarasavi Bookshop",
    category: "Bookshops",
    location: "Nugegoda, Western Province",
    description:
      "Sri Lanka's best-known bookshop chain for novels, school books, stationery, gifts and Sinhala or Tamil reading collections.",
    rating: 4.7,
    reviewCount: 923,
    priceRange: "LKR 200 - 25,000",
    tag: "Popular Bookshop",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80",
    openHours: "9 AM - 8 PM",
    phone: "+94 11 282 0820",
    website: "https://sarasavi.lk",
  },
  {
    id: "bk2",
    name: "Vijitha Yapa Bookshop",
    category: "Bookshops",
    location: "Colombo 7, Western Province",
    description:
      "A long-standing Colombo favourite for English books, Sri Lankan history, travel guides, children's titles and stationery.",
    rating: 4.6,
    reviewCount: 541,
    priceRange: "LKR 300 - 30,000",
    tag: "City Bookstore",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 268 9761",
    website: "https://vijithayapa.com",
  },
  {
    id: "bk3",
    name: "Makeen Bookshop",
    category: "Bookshops",
    location: "Colombo 4, Western Province",
    description:
      "A respected Sri Lankan bookseller for educational books, imported titles, exam preparation material and office supplies.",
    rating: 4.5,
    reviewCount: 438,
    priceRange: "LKR 250 - 22,000",
    tag: "Books & Stationery",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80",
    openHours: "9 AM - 7 PM",
    phone: "+94 11 259 9600",
    website: "https://www.makeenbooks.com",
  },
];

const PROVINCES = new Set([
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
]);

const AREA_ALL = "All Areas";

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

function slugifyCatalogId(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildShopAreas(shops) {
  return [
    AREA_ALL,
    ...Array.from(new Set(shops.map((shop) => getShopArea(shop.location)))).sort((left, right) => left.localeCompare(right)),
  ];
}

function buildShopQuery(query = {}) {
  const category = String(query.category || "All").trim();
  const area = String(query.area || AREA_ALL).trim();
  const search = String(query.search || "").trim();
  const exactCategory = normalizeText(query.exactCategory) === "true";
  const filter = {};

  if (category !== "All") {
    filter.category = exactCategory
      ? category
      : { $regex: escapeRegex(category), $options: "i" };
  }

  if (area !== AREA_ALL) {
    filter.location = { $regex: escapeRegex(area), $options: "i" };
  }

  if (search) {
    const searchPattern = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      { id: searchPattern },
      { name: searchPattern },
      { category: searchPattern },
      { location: searchPattern },
      { description: searchPattern },
      { tag: searchPattern },
    ];
  }

  return filter;
}

function getShopArea(location = "") {
  const parts = String(location)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    if (!PROVINCES.has(parts[index])) {
      return parts[index];
    }
  }

  return "Sri Lanka";
}

async function getShopAreas() {
  const shops = await Shop.find({}, "location")
    .sort({ displayOrder: 1, _id: 1 })
    .lean();

  return buildShopAreas(shops);
}

async function getFilteredShops(query = {}) {
  const limit = Number(query.limit);

  let shopQuery = Shop.find(buildShopQuery(query))
    .sort({ displayOrder: 1, _id: 1 })
    .lean();

  if (Number.isFinite(limit) && limit > 0) {
    shopQuery = shopQuery.limit(limit);
  }

  return shopQuery;
}

async function getShopCatalog(query = {}) {
  return {
    categories: SHOP_CATEGORIES,
    areas: await getShopAreas(),
    shops: await getFilteredShops(query),
  };
}

async function findShopById(id) {
  const normalizedId = String(id).trim();

  return Shop.findOne({ id: normalizedId }).lean();
}

async function findShopDocumentById(id) {
  return Shop.findOne({ id: String(id).trim() });
}

async function getRelatedShops(shopId, category) {
  return Shop.find({ id: { $ne: shopId }, category })
    .sort({ displayOrder: 1, _id: 1 })
    .limit(3)
    .lean();
}

async function getNextShopDisplayOrder() {
  const lastShop = await Shop.findOne({}, "displayOrder").sort({ displayOrder: -1, _id: -1 }).lean();
  return lastShop ? Number(lastShop.displayOrder) + 1 : 0;
}

module.exports = {
  AREA_ALL,
  SHOP_CATEGORIES,
  SHOPS,
  findShopById,
  findShopDocumentById,
  getFilteredShops,
  getNextShopDisplayOrder,
  getRelatedShops,
  getShopArea,
  getShopAreas,
  getShopCatalog,
  slugifyCatalogId,
};