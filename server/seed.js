// Removed duplicate destinations array
require("dotenv").config();
const mongoose = require("mongoose");
const Destination = require("./models/Destination");
const { syncPackageCatalog } = require("./utils/syncPackageCatalog");

const destinations = [
  {
    name: "Sigiriya Rock Fortress",
    location: "Matale District, Sri Lanka",
    description: "An ancient rock fortress and palace ruin rising dramatically above the surrounding jungle. A UNESCO World Heritage Site.",
    price: 120,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/20130806_Sigiriya.jpg/1280px-20130806_Sigiriya.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sigiriya_2.jpg/1280px-Sigiriya_2.jpg",
    ],
    tag: "Must See", category: "Resort", amenities: ["Guided Tours", "Viewing Platform", "Museum", "Cafe", "Parking"], rating: 0, reviewCount: 0,
  },
  {
    name: "Galle Fort Colonial Villa",
    location: "Galle, Southern Province",
    description: "A beautifully restored colonial villa inside the historic Galle Fort, offering stunning ocean views.",
    price: 180,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Galle_Fort_Lighthouse.jpg/1280px-Galle_Fort_Lighthouse.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Galle_Fort_ramparts.jpg/1280px-Galle_Fort_ramparts.jpg",
    ],
    tag: "Popular", category: "Villa", amenities: ["WiFi", "Air Conditioning", "Pool", "Restaurant", "Bar", "Ocean View"], rating: 0, reviewCount: 0,
  },
  {
    name: "Ella Mountain Retreat",
    location: "Ella, Badulla District",
    description: "A serene mountain retreat surrounded by rolling tea plantations and the iconic Nine Arch Bridge.",
    price: 95,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Nine_Arch_Bridge_Ella.jpg/1280px-Nine_Arch_Bridge_Ella.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Ella_Rock%2C_Sri_Lanka.jpg/1280px-Ella_Rock%2C_Sri_Lanka.jpg",
    ],
    tag: "Trending", category: "Guesthouse", amenities: ["WiFi", "Breakfast Included", "Mountain View", "Hiking Trails", "Tea Tours"], rating: 0, reviewCount: 0,
  },
  {
    name: "Mirissa Beach Resort",
    location: "Mirissa, Southern Coast",
    description: "A stunning beachfront resort on the golden sands of Mirissa, one of Sri Lanka's best beaches.",
    price: 210,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mirissa_beach_Sri_Lanka.jpg/1280px-Mirissa_beach_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Mirissa_palm_beach.jpg/1280px-Mirissa_palm_beach.jpg",
    ],
    tag: "Popular", category: "Resort", amenities: ["Private Beach", "Pool", "WiFi", "Spa", "Water Sports", "Restaurant"], rating: 0, reviewCount: 0,
  },
  {
    name: "Kandy Heritage Hotel",
    location: "Kandy, Central Province",
    description: "Located in the cultural capital of Sri Lanka, steps from the famous Temple of the Tooth Relic.",
    price: 145,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Temple_of_the_tooth_%28Kandy%29.jpg/1200px-Temple_of_the_tooth_%28Kandy%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Kandy_lake_panorama.jpg/1280px-Kandy_lake_panorama.jpg",
    ],
    tag: "Popular", category: "Hotel", amenities: ["WiFi", "Restaurant", "Lake View", "Tour Desk", "Parking", "Air Conditioning"], rating: 0, reviewCount: 0,
  },
  {
    name: "Yala Safari Camp",
    location: "Yala National Park, Southern Province",
    description: "An exclusive tented safari camp on the edge of Yala National Park with leopards and elephants.",
    price: 320,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sri_Lankan_leopard_in_Yala_National_Park.jpg/1280px-Sri_Lankan_leopard_in_Yala_National_Park.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Elephants_at_Yala_National_Park.jpg/1280px-Elephants_at_Yala_National_Park.jpg",
    ],
    tag: "Must See", category: "Resort", amenities: ["Safari Drives", "All Meals", "Wildlife Guide", "Campfire", "Pool", "WiFi"], rating: 0, reviewCount: 0,
  },
  {
    name: "Trincomalee Bay Hostel",
    location: "Trincomalee, Eastern Province",
    description: "Budget-friendly hostel near the stunning turquoise waters of Trincomalee Bay and Nilaveli Beach.",
    price: 35,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Nilaveli_beach_trincomalee.jpg/1280px-Nilaveli_beach_trincomalee.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Fort_Frederick_Trincomalee.jpg/1280px-Fort_Frederick_Trincomalee.jpg",
    ],
    tag: "Trending", category: "Hostel", amenities: ["WiFi", "Common Kitchen", "Diving Trips", "Beach Access", "Lockers"], rating: 0, reviewCount: 0,
  },
  {
    name: "Nuwara Eliya Tea Estate Bungalow",
    location: "Nuwara Eliya, Central Highlands",
    description: "A colonial planters bungalow set among vast tea estates at 1800m elevation with world-famous Ceylon tea.",
    price: 165,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tea_Plantation_Nuwara_Eliya_Sri_Lanka.jpg/1280px-Tea_Plantation_Nuwara_Eliya_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nuwara_Eliya_town_view.jpg/1280px-Nuwara_Eliya_town_view.jpg",
    ],
    tag: "Trending", category: "Villa", amenities: ["Tea Tasting", "Garden", "Fireplace", "Breakfast Included", "WiFi", "Mountain View"], rating: 0, reviewCount: 0,
  },
  {
    name: "Dambulla Cave Temple",
    location: "Dambulla, Central Province",
    description: "A UNESCO World Heritage Site with ancient Buddhist cave temples filled with stunning murals and statues.",
    price: 60,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Dambulla_cave_temple_Sri_Lanka.jpg/1280px-Dambulla_cave_temple_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Golden_Temple_of_Dambulla.jpg/1280px-Golden_Temple_of_Dambulla.jpg",
    ],
    tag: "Must See", category: "Hotel", amenities: ["Guided Tours", "Cave Paintings", "Parking"], rating: 0, reviewCount: 0,
  },
  {
    name: "Kalpitiya Lagoon",
    location: "Kalpitiya, North Western Province",
    description: "A tranquil lagoon famous for kite surfing, dolphin watching, and untouched beaches.",
    price: 55,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kalpitiya_Sri_Lanka.jpg/1280px-Kalpitiya_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kalpitiya_Lagoon_aerial.jpg/1280px-Kalpitiya_Lagoon_aerial.jpg",
    ],
    tag: "Adventure", category: "Hostel", amenities: ["Kite Surfing", "Boat Tours", "Beach Access"], rating: 0, reviewCount: 0,
  },
  {
    name: "Haputale Tea Country",
    location: "Haputale, Uva Province",
    description: "A lesser-known hill station with panoramic views over the misty tea estates and cool mountain air.",
    price: 70,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Haputale_view_Sri_Lanka.jpg/1280px-Haputale_view_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Dambatenne_Tea_Factory_Haputale.jpg/1280px-Dambatenne_Tea_Factory_Haputale.jpg",
    ],
    tag: "Hidden Gem", category: "Villa", amenities: ["Tea Tours", "Hiking Trails", "Mountain View"], rating: 0, reviewCount: 0,
  },
  {
    name: "Mannar Island",
    location: "Mannar, Northern Province",
    description: "Remote island with wild donkeys, ancient baobab trees, a historic fort, and untouched beaches.",
    price: 40,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Mannar_Fort_Sri_Lanka.jpg/1280px-Mannar_Fort_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mannar_baobab_tree.jpg/1280px-Mannar_baobab_tree.jpg",
    ],
    tag: "Offbeat", category: "Guesthouse", amenities: ["Wildlife Watching", "Beach Access", "Cycling"], rating: 0, reviewCount: 0,
  },
  {
    name: "Pidurangala Rock",
    location: "Sigiriya, Central Province",
    description: "A quieter alternative to Sigiriya with a rewarding hike and sweeping panoramic sunrise views.",
    price: 30,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pidurangala_rock_sunrise.jpg/1280px-Pidurangala_rock_sunrise.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/20130806_Sigiriya.jpg/1280px-20130806_Sigiriya.jpg",
    ],
    tag: "Adventure", category: "Hostel", amenities: ["Hiking", "Guided Tours", "Viewpoint"], rating: 0, reviewCount: 0,
  },
  {
    name: "Belihuloya Eco Village",
    location: "Belihuloya, Sabaragamuwa Province",
    description: "A peaceful eco-village nestled beside a crystal-clear river with waterfalls and authentic village life.",
    price: 50,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Belihul_Oya_river_Sri_Lanka.jpg/1280px-Belihul_Oya_river_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bambarakanda_Falls_Sri_Lanka.jpg/1280px-Bambarakanda_Falls_Sri_Lanka.jpg",
    ],
    tag: "Eco", category: "Guesthouse", amenities: ["Waterfalls", "Village Tours", "Eco Lodges"], rating: 0, reviewCount: 0,
  },
  {
    name: "Kudumbigala Monastery",
    location: "Ampara, Eastern Province",
    description: "An ancient rock monastery surrounded by untouched wilderness, perfect for solitude and exploration.",
    price: 20,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kudumbigala_monastery_Sri_Lanka.jpg/1280px-Kudumbigala_monastery_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Panama_lagoon_Eastern_Sri_Lanka.jpg/1280px-Panama_lagoon_Eastern_Sri_Lanka.jpg",
    ],
    tag: "Hidden Gem", category: "Villa", amenities: ["Rock Climbing", "Guided Tours", "Meditation"], rating: 0, reviewCount: 0,
  },
  {
    name: "Diyaluma Falls Retreat",
    location: "Koslanda, Badulla District",
    description: "Stay near Sri Lanka's second highest waterfall with natural infinity pools and breathtaking highland views.",
    price: 110,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Diyaluma_Falls_Sri_Lanka.jpg/1280px-Diyaluma_Falls_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Diyaluma_natural_pools.jpg/1280px-Diyaluma_natural_pools.jpg",
    ],
    tag: "Nature", category: "Guesthouse", amenities: ["Waterfall Access", "Hiking", "Natural Pools"], rating: 0, reviewCount: 0,
  },
  {
    name: "Polonnaruwa Ancient City",
    location: "Polonnaruwa, North Central Province",
    description: "Explore the magnificent ruins of Sri Lanka's medieval capital, a UNESCO World Heritage Site.",
    price: 75,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gal_Vihara_Polonnaruwa_Sri_Lanka.jpg/1280px-Gal_Vihara_Polonnaruwa_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Polonnaruwa_Vatadage.jpg/1280px-Polonnaruwa_Vatadage.jpg",
    ],
    tag: "Historic", category: "Hotel", amenities: ["Guided Tours", "Bicycle Rental", "Museum"], rating: 0, reviewCount: 0,
  },
  {
    name: "Arugam Bay Surf Camp",
    location: "Arugam Bay, Eastern Province",
    description: "A surfer's paradise with laid-back vibes, world-class waves, and palm-fringed beachside cabanas.",
    price: 90,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Arugam_Bay_Sri_Lanka.jpg/1280px-Arugam_Bay_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Arugam_Bay_surfing.jpg/1280px-Arugam_Bay_surfing.jpg",
    ],
    tag: "Surfing", category: "Hostel", amenities: ["Surf Lessons", "Beach Bar", "Yoga Classes"], rating: 0, reviewCount: 0,
  },
  {
    name: "Wilpattu Safari Lodge",
    location: "Wilpattu National Park, North Western Province",
    description: "Experience wildlife and tranquility deep inside Sri Lanka's largest and oldest national park.",
    price: 200,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Wilpattu_National_Park_Sri_Lanka.jpg/1280px-Wilpattu_National_Park_Sri_Lanka.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Leopard_Wilpattu.jpg/1280px-Leopard_Wilpattu.jpg",
    ],
    tag: "Wildlife", category: "Resort", amenities: ["Safari Drives", "All Meals", "Bird Watching"], rating: 0, reviewCount: 0,
  },
  {
    name: "Anuradhapura Sacred City",
    location: "Anuradhapura, North Central Province",
    description: "Visit the ancient sacred city with its massive dagobas, the Sri Maha Bodhi tree, and centuries-old ruins.",
    price: 80,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ruwanwelisaya_Anuradhapura.jpg/1280px-Ruwanwelisaya_Anuradhapura.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sri_Maha_Bodhi_Anuradhapura.jpg/1280px-Sri_Maha_Bodhi_Anuradhapura.jpg",
    ],
    tag: "Sacred", category: "Hotel", amenities: ["Guided Tours", "Pilgrimage", "Museum"], rating: 0, reviewCount: 0,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Destination.deleteMany({});
    await Destination.insertMany(destinations);
    const packageSync = await syncPackageCatalog({ replace: true });
    console.log(`Seeded ${destinations.length} destinations and ${packageSync.count} packages successfully`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
