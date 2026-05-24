import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-05-24" });

const categories = [
  { slug: "signature-aburasoba", title: "Signature Aburasoba 油拌面", sortOrder: 10 },
  { slug: "ramen", title: "Ramen 拉面", sortOrder: 20 },
  { slug: "donburi", title: "Donburi 饭类", sortOrder: 30 },
  { slug: "appetizers", title: "Appetizers 小吃", sortOrder: 40 },
  { slug: "extra-toppings", title: "Extra Toppings 加料", sortOrder: 50 },
  { slug: "drinks", title: "Drinks 饮料", sortOrder: 60 },
  { slug: "alcohol", title: "Alcohol 酒水", sortOrder: 70 },
  { slug: "desserts", title: "Desserts", sortOrder: 80 },
];

const menuItems = [
  {
    category: "signature-aburasoba",
    name: "Original Aburasoba 招牌拌面",
    description: "Chashu, Menma, Nori, Green Onion, Signature Soy-Based Sauce.",
    price: "$19.99",
  },
  {
    category: "signature-aburasoba",
    name: "Homura Aburasoba 火焰拌面",
    description: "Spicy minced pork, spring onion, chives, egg yolk, fish powder, and bamboo shoots.",
    price: "$19.99",
    spiceLevel: 4,
  },
  {
    category: "signature-aburasoba",
    name: "Roast Beef Aburasoba 烤牛肉拌面",
    description: "Beef, Menma, Green Onion, and Nori.",
    price: "$21.99",
  },
  {
    category: "ramen",
    name: "Signature Tonkotsu",
    description: "Pork bone broth, Chashu, Ajitama, Menma, Nori, and Green Onion.",
    price: "$18.99",
  },
  {
    category: "ramen",
    name: "God Fire",
    description:
      "An exciting match of rich Tonkotsu broth and Yoramen's secret blended Spicy Fire. Original thin noodles, tender pork cha shu, black fungus, and spring onions.",
    price: "$19.99",
    spiceLevel: 5,
  },
  {
    category: "ramen",
    name: "Black Garlic Tonkotsu",
    description: "Black garlic oil, pork broth, Chashu, and Ajitama.",
    price: "$19.99",
  },
  {
    category: "ramen",
    name: "Spicy Miso Tonkotsu",
    description: "Spicy pork broth, minced pork, egg, and green onion.",
    price: "$19.99",
    spiceLevel: 4,
  },
  {
    category: "ramen",
    name: "Veggie Ramen",
    description: "Vegetable broth, seasonal vegetables, corn, and mushroom.",
    price: "$19.99",
    dietaryLabels: ["Vegetarian"],
  },
  {
    category: "donburi",
    name: "Homura Don",
    description: "Spicy minced pork, egg yolk, rice, and green onion.",
    price: "$16.99",
    spiceLevel: 4,
  },
  {
    category: "donburi",
    name: "Sukiyaki Beef Don",
    description: "Beef, onion, and egg yolk.",
    price: "$18.99",
  },
  {
    category: "donburi",
    name: "Unagi Don",
    description: "Grilled eel, egg, and pickled radish.",
    price: "$18.99",
  },
  {
    category: "donburi",
    name: "Chashu Don",
    description: "Braised pork, rice, and green onion.",
    price: "$18.99",
  },
  {
    category: "donburi",
    name: "Karage Don",
    price: "$17.99",
  },
  {
    category: "appetizers",
    name: "Freshly Made Takoyaki 章鱼烧",
    description: "6pcs.",
    price: "$8.99",
  },
  {
    category: "appetizers",
    name: "Signature Chicken Karaage 日式炸鸡",
    description: "3pcs.",
    price: "$8.99",
  },
  {
    category: "appetizers",
    name: "Homemade Gyoza",
    description:
      "5 pcs. Hakata Style one-bite pork dumplings. Crispy and juicy. Served with Japanese yuzu citrus pepper and house blended dipping gyoza sauce.",
    price: "$7.99 / 10pcs $14.99",
  },
  {
    category: "appetizers",
    name: "Age Tofu",
    description: "3pcs.",
    price: "$6.99",
  },
  { category: "appetizers", name: "Wakame Salad", price: "$4.99" },
  { category: "appetizers", name: "House Salad", price: "$6.99" },
  { category: "appetizers", name: "Miso Soup", price: "$3.99" },
  { category: "appetizers", name: "Steamed Rice", price: "$2.99" },
  { category: "extra-toppings", name: "Onsen Egg" },
  { category: "extra-toppings", name: "Ajitama Egg" },
  { category: "extra-toppings", name: "Extra Chashu" },
  { category: "extra-toppings", name: "Minced Pork" },
  { category: "extra-toppings", name: "Beef" },
  { category: "extra-toppings", name: "Unagi" },
  { category: "extra-toppings", name: "Menma" },
  { category: "extra-toppings", name: "Nori" },
  { category: "extra-toppings", name: "Green Onion" },
  { category: "extra-toppings", name: "Corn" },
  { category: "extra-toppings", name: "Bean Sprouts" },
  { category: "extra-toppings", name: "Pickled Radish" },
  { category: "extra-toppings", name: "Black Fungus" },
  { category: "extra-toppings", name: "Cheese" },
  { category: "extra-toppings", name: "Extra Noodles" },
  { category: "extra-toppings", name: "Plain Noodles" },
  { category: "drinks", name: "Coke" },
  { category: "drinks", name: "Diet Coke" },
  { category: "drinks", name: "Sprite" },
  { category: "drinks", name: "Canada Dry" },
  { category: "drinks", name: "Nestea" },
  { category: "drinks", name: "Ramune" },
  { category: "drinks", name: "Green Tea (Hot / Cold)" },
  { category: "drinks", name: "Oolong Tea" },
  { category: "drinks", name: "Calpis" },
  { category: "drinks", name: "Orange Juice" },
  { category: "drinks", name: "Bottle Water" },
  { category: "drinks", name: "Brown Sugar Milk Tea" },
  { category: "drinks", name: "Matcha Latte" },
  { category: "drinks", name: "Mango Fruit Tea" },
  { category: "drinks", name: "Taro Milk Tea" },
  { category: "drinks", name: "Cheese Foam Tea" },
  { category: "drinks", name: "Coffee Series" },
  { category: "alcohol", name: "Sapporo" },
  { category: "alcohol", name: "Asahi" },
  { category: "alcohol", name: "Kirin" },
  { category: "alcohol", name: "Japanese Whisky Highball" },
  { category: "alcohol", name: "House Sake" },
  { category: "alcohol", name: "Premium Junmai" },
  { category: "alcohol", name: "Red Wine" },
  { category: "alcohol", name: "White Wine" },
  { category: "desserts", name: "Matcha Crepe Cake 抹茶千层蛋糕", price: "$8.99" },
  { category: "desserts", name: "Mango Crepe Cake 芒果千层蛋糕", price: "$8.99" },
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

const categoryDocs = categories.map((category) => ({
  _id: `menuCategory-${category.slug}`,
  _type: "menuCategory",
  title: category.title,
  slug: { _type: "slug", current: category.slug },
  sortOrder: category.sortOrder,
  visible: true,
}));

const categorySortOrder = new Map(categories.map((category) => [category.slug, category.sortOrder]));
const itemCounters = new Map();

const itemDocs = menuItems.map((item) => {
  const index = (itemCounters.get(item.category) || 0) + 1;
  itemCounters.set(item.category, index);

  const slug = slugify(item.name);
  const doc = {
    _id: `menuItem-${slug}`,
    _type: "menuItem",
    name: item.name,
    slug: { _type: "slug", current: slug },
    category: { _type: "reference", _ref: `menuCategory-${item.category}` },
    available: true,
    featured: false,
    sortOrder: (categorySortOrder.get(item.category) || 0) * 100 + index * 10,
  };

  if (item.description) doc.description = item.description;
  if (item.price) doc.price = item.price;
  if (item.spiceLevel) doc.spiceLevel = item.spiceLevel;
  if (item.dietaryLabels) doc.dietaryLabels = item.dietaryLabels;

  return doc;
});

const oldMenuIds = await client.fetch(`*[_type in ["menuCategory", "menuItem"]]._id`);
const newMenuIds = new Set([...categoryDocs, ...itemDocs].map((doc) => doc._id));

let transaction = client.transaction();

for (const id of oldMenuIds) {
  if (!newMenuIds.has(id)) {
    transaction = transaction.delete(id);
  }
}

for (const doc of [...categoryDocs, ...itemDocs]) {
  transaction = transaction.createOrReplace(doc);
}

transaction = transaction.patch("menuPage", (patch) =>
  patch.set({
    eyebrow: "Yoramen Menu",
    title: "Menu",
    description:
      "Explore aburasoba, ramen, donburi, appetizers, extra toppings, drinks, alcohol, and desserts.",
    categoryNavEnabled: true,
  }),
);

await transaction.commit({ visibility: "sync" });

const result = await client.fetch(`{
  "categories": *[_type == "menuCategory"] | order(sortOrder asc) {title, "items": count(*[_type == "menuItem" && references(^._id)])},
  "itemCount": count(*[_type == "menuItem"]),
  "oldMenuDocsRemaining": count(*[_type in ["menuCategory", "menuItem"] && !(_id in $newIds)])
}`, { newIds: Array.from(newMenuIds) });

console.log(JSON.stringify(result, null, 2));
