import mongoose from "mongoose";
import validator from "validator";

const categories = new Set(["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"]);
const statuses = new Set(["Food Processing", "Out for delivery", "Delivered"]);

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const cleanString = (value) => typeof value === "string" ? value.trim() : "";

const validateFoodInput = ({ name, description, price, category }, file) => {
    const parsedPrice = Number(price);

    if (!file) return "Food image is required";
    if (!file.mimetype?.startsWith("image/")) return "Only image uploads are allowed";
    if (cleanString(name).length < 2) return "Food name is required";
    if (cleanString(description).length < 5) return "Food description is required";
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return "Food price must be greater than 0";
    if (!categories.has(category)) return "Invalid food category";

    return null;
}

const validateAddress = (address) => {
    const required = ["firstName", "lastName", "email", "street", "city", "state", "zipcode", "country", "phone"];
    if (!address || typeof address !== "object") return "Delivery address is required";

    for (const field of required) {
        if (!cleanString(address[field])) return `${field} is required`;
    }

    if (!validator.isEmail(address.email)) return "Valid email address is required";
    if (!validator.isMobilePhone(String(address.phone), "any")) return "Valid phone number is required";

    return null;
}

const validateOrderInput = ({ items, amount, address }) => {
    if (!Array.isArray(items) || items.length === 0) return "Order must contain at least one item";
    for (const item of items) {
        if (!isObjectId(item._id)) return "Invalid order item";
        if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1) return "Invalid item quantity";
        if (!Number.isFinite(Number(item.price)) || Number(item.price) <= 0) return "Invalid item price";
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) return "Invalid order amount";
    return validateAddress(address);
}

const validateStatus = (status) => statuses.has(status);

export { categories, cleanString, isObjectId, validateFoodInput, validateOrderInput, validateStatus };
