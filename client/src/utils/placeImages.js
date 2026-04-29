const FALLBACK_PLACE_IMAGE =
  "https://images.pexels.com/photos/31154120/pexels-photo-31154120.jpeg?auto=compress&cs=tinysrgb&w=1280";

const IMAGE_URLS = {
  ahungalla:
    "https://images.pexels.com/photos/19177720/pexels-photo-19177720.jpeg?auto=compress&cs=tinysrgb&w=1280",
  anuradhapura:
    "https://images.pexels.com/photos/6840389/pexels-photo-6840389.jpeg?auto=compress&cs=tinysrgb&w=1280",
  arugamBay:
    "https://images.pexels.com/photos/2962392/pexels-photo-2962392.jpeg?auto=compress&cs=tinysrgb&w=1280",
  bambarakanda:
    "https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1280",
  belihuloya:
    "https://images.pexels.com/photos/29757645/pexels-photo-29757645.jpeg?auto=compress&cs=tinysrgb&w=1280",
  bentota:
    "https://images.pexels.com/photos/18463832/pexels-photo-18463832.jpeg?auto=compress&cs=tinysrgb&w=1280",
  beruwala:
    "https://images.pexels.com/photos/11490128/pexels-photo-11490128.jpeg?auto=compress&cs=tinysrgb&w=1280",
  bundala:
    "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1280",
  colomboMuseum:
    "https://images.pexels.com/photos/37010222/pexels-photo-37010222.jpeg?auto=compress&cs=tinysrgb&w=1280",
  colomboSkyline:
    "https://images.pexels.com/photos/36703580/pexels-photo-36703580.jpeg?auto=compress&cs=tinysrgb&w=1280",
  dambulla:
    "https://images.pexels.com/photos/32547976/pexels-photo-32547976.jpeg?auto=compress&cs=tinysrgb&w=1280",
  diyaluma:
    "https://images.pexels.com/photos/34037253/pexels-photo-34037253.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ella:
    "https://images.pexels.com/photos/34714985/pexels-photo-34714985.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ellaRock:
    "https://images.pexels.com/photos/18826647/pexels-photo-18826647.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ellaNineArch:
    "https://images.pexels.com/photos/34218656/pexels-photo-34218656.jpeg?auto=compress&cs=tinysrgb&w=1280",
  galleFort:
    "https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg?auto=compress&cs=tinysrgb&w=1280",
  galOya:
    "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1280",
  habarana:
    "https://images.pexels.com/photos/4428276/pexels-photo-4428276.jpeg?auto=compress&cs=tinysrgb&w=1280",
  haputale:
    "https://images.pexels.com/photos/36847084/pexels-photo-36847084.jpeg?auto=compress&cs=tinysrgb&w=1280",
  hikkaduwa:
    "https://images.pexels.com/photos/2363364/pexels-photo-2363364.jpeg?auto=compress&cs=tinysrgb&w=1280",
  hortonPlains:
    "https://images.pexels.com/photos/5939647/pexels-photo-5939647.jpeg?auto=compress&cs=tinysrgb&w=1280",
  jaffna:
    "https://images.pexels.com/photos/7927514/pexels-photo-7927514.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kalpitiya:
    "https://images.pexels.com/photos/18710387/pexels-photo-18710387.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kalutara:
    "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kalutaraChaitya:
    "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kandyHotel:
    "https://images.pexels.com/photos/739409/pexels-photo-739409.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kandyLake:
    "https://images.pexels.com/photos/32795550/pexels-photo-32795550.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kandyTemple:
    "https://images.pexels.com/photos/32678292/pexels-photo-32678292.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kataragama:
    "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kaudulla:
    "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kitulgala:
    "https://images.pexels.com/photos/4553366/pexels-photo-4553366.jpeg?auto=compress&cs=tinysrgb&w=1280",
  knuckles:
    "https://images.pexels.com/photos/31001471/pexels-photo-31001471.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kudumbigala:
    "https://images.pexels.com/photos/12548560/pexels-photo-12548560.jpeg?auto=compress&cs=tinysrgb&w=1280",
  kumana:
    "https://images.pexels.com/photos/37114884/pexels-photo-37114884.jpeg?auto=compress&cs=tinysrgb&w=1280",
  mannar:
    "https://images.pexels.com/photos/36508709/pexels-photo-36508709.jpeg?auto=compress&cs=tinysrgb&w=1280",
  minneriya:
    "https://images.pexels.com/photos/4428276/pexels-photo-4428276.jpeg?auto=compress&cs=tinysrgb&w=1280",
  minneriyaGathering:
    "https://images.pexels.com/photos/27808468/pexels-photo-27808468.jpeg?auto=compress&cs=tinysrgb&w=1280",
  mirissa:
    "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=1280",
  nallur:
    "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1280",
  negombo:
    "https://images.pexels.com/photos/33929221/pexels-photo-33929221.jpeg?auto=compress&cs=tinysrgb&w=1280",
  negomboLagoon:
    "https://images.pexels.com/photos/17429271/pexels-photo-17429271.jpeg?auto=compress&cs=tinysrgb&w=1280",
  nilaveli:
    "https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=1280",
  nuwaraEliya:
    "https://images.pexels.com/photos/4403937/pexels-photo-4403937.jpeg?auto=compress&cs=tinysrgb&w=1280",
  pasikudah:
    "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=1280",
  pigeonIsland:
    "https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=1280",
  pidurangala:
    "https://images.pexels.com/photos/6091035/pexels-photo-6091035.jpeg?auto=compress&cs=tinysrgb&w=1280",
  polonnaruwa:
    "https://images.pexels.com/photos/33171754/pexels-photo-33171754.jpeg?auto=compress&cs=tinysrgb&w=1280",
  sigiriya:
    "https://images.pexels.com/photos/31154120/pexels-photo-31154120.jpeg?auto=compress&cs=tinysrgb&w=1280",
  sinharaja:
    "https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&w=1280",
  talalla:
    "https://images.pexels.com/photos/34861048/pexels-photo-34861048.jpeg?auto=compress&cs=tinysrgb&w=1280",
  tangalle:
    "https://images.pexels.com/photos/16508232/pexels-photo-16508232.jpeg?auto=compress&cs=tinysrgb&w=1280",
  trincomalee:
    "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1280",
  trincomaleeBeach:
    "https://images.pexels.com/photos/10850849/pexels-photo-10850849.jpeg?auto=compress&cs=tinysrgb&w=1280",
  udawalawe:
    "https://images.pexels.com/photos/37114883/pexels-photo-37114883.jpeg?auto=compress&cs=tinysrgb&w=1280",
  unawatuna:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Unawatuna_Beach_from_above.jpg/1280px-Unawatuna_Beach_from_above.jpg",
  wadduwa:
    "https://sandee.com/_next/image?url=https%3A%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOBwQ2VIaiZwceHfKAEmrcE2sweuIlndSOVbq-i%3Ds1600-k-no&w=3840&q=75",
  wasgamuwa:
    "https://images.pexels.com/photos/4428276/pexels-photo-4428276.jpeg?auto=compress&cs=tinysrgb&w=1280",
  weligama:
    "https://images.pexels.com/photos/35456333/pexels-photo-35456333.jpeg?auto=compress&cs=tinysrgb&w=1280",
  wilpattu:
    "https://images.pexels.com/photos/10607669/pexels-photo-10607669.jpeg?auto=compress&cs=tinysrgb&w=1280",
  yalaLeopard:
    "https://images.pexels.com/photos/33130315/pexels-photo-33130315.jpeg?auto=compress&cs=tinysrgb&w=1280",
};

const PLACE_IMAGE_BY_TITLE = {
  "Unawatuna Bay Escape": IMAGE_URLS.unawatuna,
  "Bentota River & Beach Break": IMAGE_URLS.bentota,
  "Hikkaduwa Reef Coast": IMAGE_URLS.hikkaduwa,
  "Weligama Surf & Sand": IMAGE_URLS.weligama,
  "Tangalle Golden Bays": IMAGE_URLS.tangalle,
  "Nilaveli Island Escape": "https://images.pexels.com/photos/37208428/pexels-photo-37208428.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Pasikudah Shallow Waters": "https://images.pexels.com/photos/23697398/pexels-photo-23697398.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Arugam Bay Surf Camp": "https://images.pexels.com/photos/35577997/pexels-photo-35577997.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Negombo Lagoon Beach Holiday": "https://images.pexels.com/photos/33916880/pexels-photo-33916880.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Kalpitiya Dolphin Coast": "https://images.pexels.com/photos/18780346/pexels-photo-18780346.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Sigiriya Sky Citadel": IMAGE_URLS.sigiriya,
  "Kandy Temple & Lake": IMAGE_URLS.kandyTemple,
  "Dambulla Cave Temple Journey": "https://images.pexels.com/photos/35598967/pexels-photo-35598967.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Polonnaruwa Royal Ruins": IMAGE_URLS.polonnaruwa,
  "Anuradhapura Sacred City Trail": IMAGE_URLS.anuradhapura,
  "Galle Fort Heritage Walk": "https://images.pexels.com/photos/31032899/pexels-photo-31032899.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Jaffna Peninsula Heritage": "https://images.pexels.com/photos/30488025/pexels-photo-30488025.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Colombo Museum Mile": "https://images.pexels.com/photos/37010193/pexels-photo-37010193.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Kataragama Pilgrim Route": "https://images.pexels.com/photos/11013741/pexels-photo-11013741.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Nallur Temple & Northern Arts": "https://images.pexels.com/photos/36587847/pexels-photo-36587847.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Ella Highlands Explorer": IMAGE_URLS.ellaNineArch,
  "Horton Plains & World's End": IMAGE_URLS.hortonPlains,
  "Knuckles Cloud Forest": IMAGE_URLS.knuckles,
  "Nuwara Eliya Tea Country": IMAGE_URLS.nuwaraEliya,
  "Haputale Viewpoint Trails": IMAGE_URLS.haputale,
  "Diyaluma Falls Adventure": "https://images.pexels.com/photos/34037253/pexels-photo-34037253.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Belihuloya River & Falls": "https://images.pexels.com/photos/30142202/pexels-photo-30142202.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Bambarakanda Waterfall Loop": "https://images.pexels.com/photos/32598500/pexels-photo-32598500.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Sinharaja Rainforest Trails": "https://images.pexels.com/photos/35649769/pexels-photo-35649769.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Kitulgala Forest & River": "https://images.pexels.com/photos/28426098/pexels-photo-28426098.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Yala Leopard Safari": IMAGE_URLS.yalaLeopard,
  "Udawalawe Elephant Plains": IMAGE_URLS.udawalawe,
  "Wilpattu Wilderness Drive": IMAGE_URLS.wilpattu,
  "Minneriya Elephant Gathering": IMAGE_URLS.minneriyaGathering,
  "Kumana Bird Sanctuary Escape": IMAGE_URLS.kumana,
  "Bundala Wetlands Birding": "https://images.pexels.com/photos/18458044/pexels-photo-18458044.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Wasgamuwa Wild Trails": "https://images.pexels.com/photos/20321536/pexels-photo-20321536.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Kaudulla Elephant Safari": "https://images.pexels.com/photos/27808468/pexels-photo-27808468.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Gal Oya Boat Safari": "https://images.pexels.com/photos/31536076/pexels-photo-31536076.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Pigeon Island Marine Wildlife": "https://images.pexels.com/photos/2363364/pexels-photo-2363364.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Wadduwa Ayurveda Coast": IMAGE_URLS.wadduwa,
  "Beruwala Wellness Sands": IMAGE_URLS.beruwala,
  "Ahungalla Ocean Spa": IMAGE_URLS.ahungalla,
  "Talalla Yoga Hideaway": IMAGE_URLS.talalla,
  "Kandy Forest Healing Retreat": "https://images.pexels.com/photos/31001478/pexels-photo-31001478.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Ella Sunrise Yoga Stay": "https://images.pexels.com/photos/34714986/pexels-photo-34714986.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Pasikudah Calm Water Wellness": "https://images.pexels.com/photos/35511612/pexels-photo-35511612.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Kalutara Herbal Sanctuary": "https://images.pexels.com/photos/31001467/pexels-photo-31001467.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Negombo Lagoon Reset": "https://images.pexels.com/photos/28575503/pexels-photo-28575503.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Habarana Mindful Nature Retreat": "https://images.pexels.com/photos/35606854/pexels-photo-35606854.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Colombo & Negombo Short Escape": IMAGE_URLS.colomboSkyline,
  "South Coast Family Holiday": "https://images.pexels.com/photos/16508231/pexels-photo-16508231.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "East Coast Summer Break": IMAGE_URLS.trincomaleeBeach,
  "Cultural Triangle Short Stay": "https://images.pexels.com/photos/35606857/pexels-photo-35606857.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Hill Country Rail Holiday": "https://images.pexels.com/photos/4769075/pexels-photo-4769075.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Jaffna Peninsula Discovery": "https://images.pexels.com/photos/34011153/pexels-photo-34011153.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Trincomalee Family Beach Holiday": "https://images.pexels.com/photos/10850860/pexels-photo-10850860.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Mirissa Whale & Beach Holiday": "https://images.pexels.com/photos/34003845/pexels-photo-34003845.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Bentota River & Beach Holiday": "https://images.pexels.com/photos/15689754/pexels-photo-15689754.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Nuwara Eliya Cool Climate Holiday": "https://images.pexels.com/photos/321571/pexels-photo-321571.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Sigiriya Rock Fortress": IMAGE_URLS.sigiriya,
  "Galle Fort Colonial Villa": "https://images.pexels.com/photos/27669342/pexels-photo-27669342.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Ella Mountain Retreat": IMAGE_URLS.ellaNineArch,
  "Mirissa Beach Resort": "https://images.pexels.com/photos/36477913/pexels-photo-36477913.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Kandy Heritage Hotel": IMAGE_URLS.kandyTemple,
  "Yala Safari Camp": IMAGE_URLS.yalaLeopard,
  "Trincomalee Bay Hostel": IMAGE_URLS.trincomaleeBeach,
  "Nuwara Eliya Tea Estate Bungalow": IMAGE_URLS.nuwaraEliya,
  "Dambulla Cave Temple": "https://images.pexels.com/photos/35598967/pexels-photo-35598967.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "Jaffna Cultural Stay": IMAGE_URLS.nallur,
  "Kalpitiya Lagoon": IMAGE_URLS.kalpitiya,
  "Haputale Tea Country": IMAGE_URLS.haputale,
  "Mannar Island": IMAGE_URLS.mannar,
  "Pidurangala Rock": IMAGE_URLS.pidurangala,
  "Belihuloya Eco Village": IMAGE_URLS.belihuloya,
  "Kudumbigala Monastery": IMAGE_URLS.kudumbigala,
  "Diyaluma Falls Retreat": IMAGE_URLS.diyaluma,
  "Polonnaruwa Ancient City": IMAGE_URLS.polonnaruwa,
  "Wilpattu Safari Lodge": IMAGE_URLS.wilpattu,
  "Anuradhapura Sacred City": IMAGE_URLS.anuradhapura,
};

const DESTINATION_GALLERY_BY_TITLE = {
  "Unawatuna Bay Escape": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Unawatuna_Beach_from_above.jpg/1280px-Unawatuna_Beach_from_above.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dusk_at_Unawatuna_Beach.jpg/1280px-Dusk_at_Unawatuna_Beach.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jungle_Beach%2C_Unawatuna%2C_Sri_Lanka.jpg/1280px-Jungle_Beach%2C_Unawatuna%2C_Sri_Lanka.jpg",
  ],
  "Sigiriya Sky Citadel": [
    "https://images.pexels.com/photos/31154120/pexels-photo-31154120.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35606856/pexels-photo-35606856.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34128249/pexels-photo-34128249.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Sigiriya Rock Fortress": [
    "https://images.pexels.com/photos/31154120/pexels-photo-31154120.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35606860/pexels-photo-35606860.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34128246/pexels-photo-34128246.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Galle Fort Colonial Villa": [
    "https://images.pexels.com/photos/31032903/pexels-photo-31032903.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/28575867/pexels-photo-28575867.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31032924/pexels-photo-31032924.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Ella Mountain Retreat": [
    "https://images.pexels.com/photos/26620075/pexels-photo-26620075.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/18080584/pexels-photo-18080584.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/10913652/pexels-photo-10913652.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Ella Highlands Explorer": [
    "https://images.pexels.com/photos/34218656/pexels-photo-34218656.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/26620075/pexels-photo-26620075.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34714985/pexels-photo-34714985.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Mirissa Beach Resort": [
    IMAGE_URLS.mirissa,
    "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kandy Heritage Hotel": [
    "https://images.pexels.com/photos/32678292/pexels-photo-32678292.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/32795550/pexels-photo-32795550.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/322437/pexels-photo-322437.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kandy Temple & Lake": [
    "https://images.pexels.com/photos/32678292/pexels-photo-32678292.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/322437/pexels-photo-322437.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/14372006/pexels-photo-14372006.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kandy Forest Healing Retreat": [
    "https://images.pexels.com/photos/32795550/pexels-photo-32795550.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33404365/pexels-photo-33404365.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/739409/pexels-photo-739409.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Yala Safari Camp": [
    "https://images.pexels.com/photos/33130315/pexels-photo-33130315.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33724001/pexels-photo-33724001.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/13784932/pexels-photo-13784932.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Yala Leopard Safari": [
    "https://images.pexels.com/photos/33130315/pexels-photo-33130315.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33724001/pexels-photo-33724001.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/13784932/pexels-photo-13784932.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Trincomalee Bay Hostel": [
    "https://images.pexels.com/photos/10850856/pexels-photo-10850856.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/10850858/pexels-photo-10850858.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/10850861/pexels-photo-10850861.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Nuwara Eliya Tea Estate Bungalow": [
    "https://images.pexels.com/photos/4403937/pexels-photo-4403937.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4403934/pexels-photo-4403934.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4403935/pexels-photo-4403935.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Dambulla Cave Temple": [
    "https://images.pexels.com/photos/32547976/pexels-photo-32547976.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/32547985/pexels-photo-32547985.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35598970/pexels-photo-35598970.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kalpitiya Lagoon": [
    "https://images.pexels.com/photos/10825335/pexels-photo-10825335.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/18710387/pexels-photo-18710387.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/18780346/pexels-photo-18780346.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Haputale Tea Country": [
    "https://images.pexels.com/photos/5042895/pexels-photo-5042895.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/5042896/pexels-photo-5042896.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/14023536/pexels-photo-14023536.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Mannar Island": [
    "https://images.pexels.com/photos/36508709/pexels-photo-36508709.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/12868139/pexels-photo-12868139.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/12860617/pexels-photo-12860617.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Pidurangala Rock": [
    "https://images.pexels.com/photos/6091035/pexels-photo-6091035.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34218667/pexels-photo-34218667.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/19808528/pexels-photo-19808528.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Belihuloya Eco Village": [
    "https://images.pexels.com/photos/29757645/pexels-photo-29757645.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/26597035/pexels-photo-26597035.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31018816/pexels-photo-31018816.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kudumbigala Monastery": [
    "https://images.pexels.com/photos/12548560/pexels-photo-12548560.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36537689/pexels-photo-36537689.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/7499367/pexels-photo-7499367.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Diyaluma Falls Retreat": [
    "https://images.pexels.com/photos/34037253/pexels-photo-34037253.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/8983596/pexels-photo-8983596.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34037254/pexels-photo-34037254.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Polonnaruwa Ancient City": [
    IMAGE_URLS.polonnaruwa,
    "https://images.pexels.com/photos/12584869/pexels-photo-12584869.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/13764960/pexels-photo-13764960.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Arugam Bay Surf Camp": [
    "https://images.pexels.com/photos/2962392/pexels-photo-2962392.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/1998439/pexels-photo-1998439.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/19984965/pexels-photo-19984965.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Wilpattu Safari Lodge": [
    IMAGE_URLS.wilpattu,
    "https://images.pexels.com/photos/5780322/pexels-photo-5780322.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/37114881/pexels-photo-37114881.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Wadduwa Ayurveda Coast": [
    "https://sandee.com/_next/image?url=https%3A%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOBwQ2VIaiZwceHfKAEmrcE2sweuIlndSOVbq-i%3Ds1600-k-no&w=3840&q=75",
    "https://q-xx.bstatic.com/xdata/images/hotel/max500/638351539.jpg?k=28651da9a5342d9033248d06496201a005128ddfd32622df0bb139ebf5c30c92&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max500/638342140.jpg?k=3406723713c6118f5ecb54773dd739f246ce73b9fca2649e1b922035e8eebfd2&o=&hp=1",
  ],
  "Anuradhapura Sacred City": [
    IMAGE_URLS.anuradhapura,
    "https://images.pexels.com/photos/11696781/pexels-photo-11696781.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33713452/pexels-photo-33713452.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Colombo & Negombo Short Escape": [
    "https://images.pexels.com/photos/36703580/pexels-photo-36703580.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33929221/pexels-photo-33929221.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/28575503/pexels-photo-28575503.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Colombo Museum Mile": [
    "https://images.pexels.com/photos/37010222/pexels-photo-37010222.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33511844/pexels-photo-33511844.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36703586/pexels-photo-36703586.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Negombo Lagoon Beach Holiday": [
    "https://images.pexels.com/photos/33929221/pexels-photo-33929221.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/17429271/pexels-photo-17429271.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/28575503/pexels-photo-28575503.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Negombo Lagoon Reset": [
    "https://images.pexels.com/photos/17429271/pexels-photo-17429271.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33916880/pexels-photo-33916880.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/28575513/pexels-photo-28575513.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Bentota River & Beach Break": [
    "https://images.pexels.com/photos/18463832/pexels-photo-18463832.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/15589614/pexels-photo-15589614.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34322213/pexels-photo-34322213.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Bentota River & Beach Holiday": [
    "https://images.pexels.com/photos/18463834/pexels-photo-18463834.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/15689753/pexels-photo-15689753.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/15589614/pexels-photo-15589614.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Horton Plains & World's End": [
    "https://images.pexels.com/photos/5939647/pexels-photo-5939647.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4403908/pexels-photo-4403908.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4403896/pexels-photo-4403896.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Udawalawe Elephant Plains": [
    "https://images.pexels.com/photos/37114883/pexels-photo-37114883.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/7973780/pexels-photo-7973780.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/32964276/pexels-photo-32964276.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Beruwala Wellness Sands": [
    "https://images.pexels.com/photos/11490128/pexels-photo-11490128.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/15689754/pexels-photo-15689754.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34861053/pexels-photo-34861053.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "South Coast Family Holiday": [
    "https://images.pexels.com/photos/11266605/pexels-photo-11266605.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35473890/pexels-photo-35473890.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34218744/pexels-photo-34218744.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Hikkaduwa Reef Coast": [
    "https://images.pexels.com/photos/2363364/pexels-photo-2363364.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/20044214/pexels-photo-20044214.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/11121578/pexels-photo-11121578.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Dambulla Cave Temple Journey": [
    "https://images.pexels.com/photos/32547976/pexels-photo-32547976.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35598970/pexels-photo-35598970.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35598967/pexels-photo-35598967.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Knuckles Cloud Forest": [
    "https://images.pexels.com/photos/31001471/pexels-photo-31001471.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31001473/pexels-photo-31001473.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/30935689/pexels-photo-30935689.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Wilpattu Wilderness Drive": [
    "https://images.pexels.com/photos/10607669/pexels-photo-10607669.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/37114882/pexels-photo-37114882.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/321525/pexels-photo-321525.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Ahungalla Ocean Spa": [
    "https://images.pexels.com/photos/19177720/pexels-photo-19177720.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/15689754/pexels-photo-15689754.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34861053/pexels-photo-34861053.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "East Coast Summer Break": [
    "https://images.pexels.com/photos/10850849/pexels-photo-10850849.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35511612/pexels-photo-35511612.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/10850856/pexels-photo-10850856.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Weligama Surf & Sand": [
    "https://images.pexels.com/photos/35456333/pexels-photo-35456333.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34714750/pexels-photo-34714750.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34218746/pexels-photo-34218746.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Polonnaruwa Royal Ruins": [
    "https://images.pexels.com/photos/33171754/pexels-photo-33171754.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/13764960/pexels-photo-13764960.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/11398966/pexels-photo-11398966.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Nuwara Eliya Tea Country": [
    "https://images.pexels.com/photos/4553365/pexels-photo-4553365.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4403937/pexels-photo-4403937.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/321571/pexels-photo-321571.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Nuwara Eliya Cool Climate Holiday": [
    "https://images.pexels.com/photos/4553365/pexels-photo-4553365.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/319879/pexels-photo-319879.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36847096/pexels-photo-36847096.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Haputale Viewpoint Trails": [
    "https://images.pexels.com/photos/4553365/pexels-photo-4553365.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36847084/pexels-photo-36847084.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31001475/pexels-photo-31001475.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Hill Country Rail Holiday": [
    "https://images.pexels.com/photos/36847084/pexels-photo-36847084.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/321569/pexels-photo-321569.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/18463825/pexels-photo-18463825.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Minneriya Elephant Gathering": [
    "https://images.pexels.com/photos/27808468/pexels-photo-27808468.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/8126089/pexels-photo-8126089.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33171705/pexels-photo-33171705.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kaudulla Elephant Safari": [
    "https://images.pexels.com/photos/27808468/pexels-photo-27808468.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34128307/pexels-photo-34128307.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/7973780/pexels-photo-7973780.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kumana Bird Sanctuary Escape": [
    "https://images.pexels.com/photos/37114884/pexels-photo-37114884.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4117452/pexels-photo-4117452.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/37114886/pexels-photo-37114886.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Bundala Wetlands Birding": [
    "https://images.pexels.com/photos/37114885/pexels-photo-37114885.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/24031926/pexels-photo-24031926.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/11453113/pexels-photo-11453113.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Gal Oya Boat Safari": [
    "https://images.pexels.com/photos/27808468/pexels-photo-27808468.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/8126089/pexels-photo-8126089.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/7973780/pexels-photo-7973780.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Wasgamuwa Wild Trails": [
    "https://images.pexels.com/photos/4428276/pexels-photo-4428276.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34128307/pexels-photo-34128307.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/7973780/pexels-photo-7973780.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Tangalle Golden Bays": [
    "https://images.pexels.com/photos/14167560/pexels-photo-14167560.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/16508232/pexels-photo-16508232.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/16508230/pexels-photo-16508230.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Nilaveli Island Escape": [
    "https://images.pexels.com/photos/10850849/pexels-photo-10850849.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35511623/pexels-photo-35511623.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Talalla Yoga Hideaway": [
    "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34861048/pexels-photo-34861048.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35251716/pexels-photo-35251716.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Pasikudah Shallow Waters": [
    "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35511623/pexels-photo-35511623.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/10850849/pexels-photo-10850849.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Pasikudah Calm Water Wellness": [
    "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35511619/pexels-photo-35511619.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35511623/pexels-photo-35511623.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Trincomalee Family Beach Holiday": [
    "https://images.pexels.com/photos/10850849/pexels-photo-10850849.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/10850856/pexels-photo-10850856.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kalpitiya Dolphin Coast": [
    "https://images.pexels.com/photos/10825337/pexels-photo-10825337.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/11166072/pexels-photo-11166072.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/18780346/pexels-photo-18780346.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Pigeon Island Marine Wildlife": [
    "https://images.pexels.com/photos/2363364/pexels-photo-2363364.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/20044214/pexels-photo-20044214.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/11166072/pexels-photo-11166072.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Mirissa Whale & Beach Holiday": [
    "https://images.pexels.com/photos/7868018/pexels-photo-7868018.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35637889/pexels-photo-35637889.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Cultural Triangle Short Stay": [
    "https://images.pexels.com/photos/31154120/pexels-photo-31154120.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/32547976/pexels-photo-32547976.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/6840389/pexels-photo-6840389.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Anuradhapura Sacred City Trail": [
    "https://images.pexels.com/photos/6840389/pexels-photo-6840389.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33713452/pexels-photo-33713452.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/32774288/pexels-photo-32774288.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Galle Fort Heritage Walk": [
    "https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/3727256/pexels-photo-3727256.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/3727257/pexels-photo-3727257.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Jaffna Peninsula Discovery": [
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36873197/pexels-photo-36873197.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Jaffna Peninsula Heritage": [
    "https://images.pexels.com/photos/35592070/pexels-photo-35592070.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/35052477/pexels-photo-35052477.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36873300/pexels-photo-36873300.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Nallur Temple & Northern Arts": [
    "https://images.pexels.com/photos/36587808/pexels-photo-36587808.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36587828/pexels-photo-36587828.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/36873197/pexels-photo-36873197.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kataragama Pilgrim Route": [
    "https://images.pexels.com/photos/11013741/pexels-photo-11013741.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4549641/pexels-photo-4549641.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/37153103/pexels-photo-37153103.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Ella Sunrise Yoga Stay": [
    "https://images.pexels.com/photos/34714985/pexels-photo-34714985.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/18826647/pexels-photo-18826647.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34218656/pexels-photo-34218656.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kalutara Herbal Sanctuary": [
    "https://images.pexels.com/photos/31001468/pexels-photo-31001468.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34861053/pexels-photo-34861053.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31001474/pexels-photo-31001474.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/32112349/pexels-photo-32112349.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/11388101/pexels-photo-11388101.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31001481/pexels-photo-31001481.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/17835054/pexels-photo-17835054.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/30467752/pexels-photo-30467752.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Diyaluma Falls Adventure": [
    "https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/30935691/pexels-photo-30935691.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/4553366/pexels-photo-4553366.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Belihuloya River & Falls": [
    "https://images.pexels.com/photos/4553366/pexels-photo-4553366.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/31001489/pexels-photo-31001489.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Bambarakanda Waterfall Loop": [
    "https://images.pexels.com/photos/34516197/pexels-photo-34516197.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/30935691/pexels-photo-30935691.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/12496768/pexels-photo-12496768.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Sinharaja Rainforest Trails": [
    "https://images.pexels.com/photos/35649769/pexels-photo-35649769.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/28426098/pexels-photo-28426098.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/30935691/pexels-photo-30935691.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Kitulgala Forest & River": [
    "https://images.pexels.com/photos/28426098/pexels-photo-28426098.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/1732280/pexels-photo-1732280.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/33732212/pexels-photo-33732212.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
  "Habarana Mindful Nature Retreat": [
    "https://images.pexels.com/photos/4428276/pexels-photo-4428276.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/14697225/pexels-photo-14697225.jpeg?auto=compress&cs=tinysrgb&w=1280",
    "https://images.pexels.com/photos/34128307/pexels-photo-34128307.jpeg?auto=compress&cs=tinysrgb&w=1280",
  ],
};

const PLACE_IMAGE_HINTS = [
  { match: /ahungalla/i, image: IMAGE_URLS.ahungalla },
  { match: /anuradhapura/i, image: IMAGE_URLS.anuradhapura },
  { match: /arugam bay/i, image: IMAGE_URLS.arugamBay },
  { match: /bambarakanda/i, image: IMAGE_URLS.bambarakanda },
  { match: /belihul(?:oya| oya)/i, image: IMAGE_URLS.belihuloya },
  { match: /bentota/i, image: IMAGE_URLS.bentota },
  { match: /beruwala/i, image: IMAGE_URLS.beruwala },
  { match: /bundala/i, image: IMAGE_URLS.bundala },
  { match: /colombo/i, image: IMAGE_URLS.colomboSkyline },
  { match: /dambulla/i, image: IMAGE_URLS.dambulla },
  { match: /diyaluma/i, image: IMAGE_URLS.diyaluma },
  { match: /ella/i, image: IMAGE_URLS.ella },
  { match: /galle/i, image: IMAGE_URLS.galleFort },
  { match: /gal oya/i, image: IMAGE_URLS.galOya },
  { match: /habarana/i, image: IMAGE_URLS.habarana },
  { match: /haputale/i, image: IMAGE_URLS.haputale },
  { match: /hikkaduwa/i, image: IMAGE_URLS.hikkaduwa },
  { match: /horton plains/i, image: IMAGE_URLS.hortonPlains },
  { match: /jaffna/i, image: IMAGE_URLS.jaffna },
  { match: /kalpitiya/i, image: IMAGE_URLS.kalpitiya },
  { match: /kalutara/i, image: IMAGE_URLS.kalutaraChaitya },
  { match: /kandy/i, image: IMAGE_URLS.kandyLake },
  { match: /kataragama/i, image: IMAGE_URLS.kataragama },
  { match: /kaudulla/i, image: IMAGE_URLS.kaudulla },
  { match: /kitulgala/i, image: IMAGE_URLS.kitulgala },
  { match: /knuckles/i, image: IMAGE_URLS.knuckles },
  { match: /kudumbigala/i, image: IMAGE_URLS.kudumbigala },
  { match: /kumana/i, image: IMAGE_URLS.kumana },
  { match: /mannar/i, image: IMAGE_URLS.mannar },
  { match: /minneriya/i, image: IMAGE_URLS.minneriyaGathering },
  { match: /mirissa/i, image: IMAGE_URLS.mirissa },
  { match: /nallur/i, image: IMAGE_URLS.nallur },
  { match: /negombo lagoon/i, image: IMAGE_URLS.negomboLagoon },
  { match: /negombo/i, image: IMAGE_URLS.negombo },
  { match: /nilaveli/i, image: IMAGE_URLS.nilaveli },
  { match: /nuwara eliya/i, image: IMAGE_URLS.nuwaraEliya },
  { match: /pasikudah|passekudah/i, image: IMAGE_URLS.pasikudah },
  { match: /pigeon island/i, image: IMAGE_URLS.pigeonIsland },
  { match: /pidurangala/i, image: IMAGE_URLS.pidurangala },
  { match: /polonnaruwa/i, image: IMAGE_URLS.polonnaruwa },
  { match: /sigiriya/i, image: IMAGE_URLS.sigiriya },
  { match: /sinharaja/i, image: IMAGE_URLS.sinharaja },
  { match: /talalla/i, image: IMAGE_URLS.talalla },
  { match: /tangalle/i, image: IMAGE_URLS.tangalle },
  { match: /trincomalee bay|trincomalee beach/i, image: IMAGE_URLS.trincomaleeBeach },
  { match: /trincomalee/i, image: IMAGE_URLS.trincomalee },
  { match: /udawalawe|udawalawa/i, image: IMAGE_URLS.udawalawe },
  { match: /unawatuna/i, image: IMAGE_URLS.unawatuna },
  { match: /wadduwa/i, image: IMAGE_URLS.wadduwa },
  { match: /wasgamuwa/i, image: IMAGE_URLS.wasgamuwa },
  { match: /weligama/i, image: IMAGE_URLS.weligama },
  { match: /wilpattu/i, image: IMAGE_URLS.wilpattu },
  { match: /yala/i, image: IMAGE_URLS.yalaLeopard },
];

function uniqueImages(images) {
  return [...new Set(images.filter(Boolean))];
}

function findHintImage(text) {
  if (!text) {
    return null;
  }

  const entry = PLACE_IMAGE_HINTS.find(({ match }) => match.test(text));
  return entry?.image || null;
}

function findMappedPlaceImage(title) {
  return PLACE_IMAGE_BY_TITLE[title] || findHintImage(title);
}

export function getPlaceImageCandidates(title, fallbackImage) {
  return uniqueImages([
    findMappedPlaceImage(title),
    fallbackImage,
    FALLBACK_PLACE_IMAGE,
  ]);
}

export function getPlaceImage(title, fallbackImage) {
  return getPlaceImageCandidates(title, fallbackImage)[0];
}

export function getDestinationImageCandidates(destination, fallbackImage) {
  if (!destination) {
    return [FALLBACK_PLACE_IMAGE];
  }

  return uniqueImages([
    findMappedPlaceImage(destination.name),
    findHintImage(destination.location),
    fallbackImage,
    destination.images?.[0],
    FALLBACK_PLACE_IMAGE,
  ]);
}

export function getDestinationGalleryImages(destination) {
  if (!destination) {
    return [FALLBACK_PLACE_IMAGE, FALLBACK_PLACE_IMAGE, FALLBACK_PLACE_IMAGE];
  }

  const gallery = uniqueImages([
    ...(DESTINATION_GALLERY_BY_TITLE[destination.name] || []),
    findMappedPlaceImage(destination.name),
    findHintImage(destination.location),
    ...(destination.images || []),
    FALLBACK_PLACE_IMAGE,
  ]);

  while (gallery.length < 3) {
    gallery.push(gallery[gallery.length - 1] || FALLBACK_PLACE_IMAGE);
  }

  return gallery.slice(0, 3);
}

export function getPackageGalleryImages(title, fallbackImages = []) {
  const gallery = uniqueImages([
    ...(DESTINATION_GALLERY_BY_TITLE[title] || []),
    findMappedPlaceImage(title),
    ...fallbackImages,
    FALLBACK_PLACE_IMAGE,
  ]);

  while (gallery.length < 3) {
    gallery.push(gallery[gallery.length - 1] || FALLBACK_PLACE_IMAGE);
  }

  return gallery.slice(0, 3);
}

export function getDestinationImage(destination) {
  if (!destination) {
    return FALLBACK_PLACE_IMAGE;
  }

  return getDestinationGalleryImages(destination)[0];
}
