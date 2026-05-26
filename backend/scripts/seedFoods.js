import dotenv from "dotenv";
import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

const foods = [
    { name: "Greek Salad", description: "Fresh vegetables with herbs and light dressing", price: 120, category: "Salad", image: "food_1.png" },
    { name: "Veg Salad", description: "Crunchy mixed vegetables served fresh", price: 140, category: "Salad", image: "food_2.png" },
    { name: "Clover Salad", description: "Healthy greens with house seasoning", price: 130, category: "Salad", image: "food_3.png" },
    { name: "Chicken Salad", description: "Protein rich chicken salad with vegetables", price: 180, category: "Salad", image: "food_4.png" },
    { name: "Paneer Roll", description: "Soft roll stuffed with spiced paneer", price: 160, category: "Rolls", image: "food_5.png" },
    { name: "Peri Peri Roll", description: "Spicy peri peri filling wrapped fresh", price: 150, category: "Rolls", image: "food_6.png" },
    { name: "Chicken Roll", description: "Juicy chicken roll with sauces", price: 190, category: "Rolls", image: "food_7.png" },
    { name: "Veg Roll", description: "Classic vegetable roll with chutney", price: 120, category: "Rolls", image: "food_8.png" },
    { name: "Ripple Ice Cream", description: "Creamy ripple ice cream dessert", price: 100, category: "Deserts", image: "food_9.png" },
    { name: "Fruit Ice Cream", description: "Fruit flavored chilled ice cream", price: 120, category: "Deserts", image: "food_10.png" },
    { name: "Jar Ice Cream", description: "Layered ice cream served in a jar", price: 110, category: "Deserts", image: "food_11.png" },
    { name: "Vanilla Ice Cream", description: "Classic vanilla ice cream", price: 90, category: "Deserts", image: "food_12.png" },
    { name: "Chicken Sandwich", description: "Grilled chicken sandwich with sauces", price: 170, category: "Sandwich", image: "food_13.png" },
    { name: "Vegan Sandwich", description: "Fresh vegan sandwich with vegetables", price: 130, category: "Sandwich", image: "food_14.png" },
    { name: "Grilled Sandwich", description: "Toasted sandwich with cheese and vegetables", price: 150, category: "Sandwich", image: "food_15.png" },
    { name: "Bread Sandwich", description: "Simple bread sandwich for a quick bite", price: 100, category: "Sandwich", image: "food_16.png" },
    { name: "Cup Cake", description: "Soft cupcake with sweet topping", price: 80, category: "Cake", image: "food_17.png" },
    { name: "Vegan Cake", description: "Eggless vegan cake slice", price: 130, category: "Cake", image: "food_18.png" },
    { name: "Butterscotch Cake", description: "Rich butterscotch cake slice", price: 150, category: "Cake", image: "food_19.png" },
    { name: "Sliced Cake", description: "Fresh cake slice for dessert", price: 100, category: "Cake", image: "food_20.png" },
    { name: "Garlic Mushroom", description: "Mushrooms tossed with garlic and spices", price: 180, category: "Pure Veg", image: "food_21.png" },
    { name: "Fried Cauliflower", description: "Crispy cauliflower bites", price: 140, category: "Pure Veg", image: "food_22.png" },
    { name: "Mix Veg Pulao", description: "Rice cooked with mixed vegetables", price: 160, category: "Pure Veg", image: "food_23.png" },
    { name: "Rice Zucchini", description: "Vegetable rice with zucchini", price: 150, category: "Pure Veg", image: "food_24.png" },
    { name: "Cheese Pasta", description: "Creamy cheese pasta", price: 220, category: "Pasta", image: "food_25.png" },
    { name: "Tomato Pasta", description: "Pasta tossed in tomato sauce", price: 190, category: "Pasta", image: "food_26.png" },
    { name: "Creamy Pasta", description: "Rich creamy pasta with herbs", price: 230, category: "Pasta", image: "food_27.png" },
    { name: "Chicken Pasta", description: "Pasta with chicken and creamy sauce", price: 260, category: "Pasta", image: "food_28.png" },
    { name: "Butter Noodles", description: "Noodles tossed with butter and seasoning", price: 160, category: "Noodles", image: "food_29.png" },
    { name: "Veg Noodles", description: "Classic vegetable noodles", price: 150, category: "Noodles", image: "food_30.png" },
    { name: "Somen Noodles", description: "Light noodles with simple seasoning", price: 180, category: "Noodles", image: "food_31.png" },
    { name: "Cooked Noodles", description: "Hot cooked noodles with vegetables", price: 170, category: "Noodles", image: "food_32.png" },
];

const seedFoods = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(process.env.MONGO_URI);
    await foodModel.deleteMany({});
    await foodModel.insertMany(foods);
    await userModel.updateMany({}, { cartData: {} });
    console.log(`Seeded ${foods.length} foods`);
    await mongoose.disconnect();
}

seedFoods().catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
});
