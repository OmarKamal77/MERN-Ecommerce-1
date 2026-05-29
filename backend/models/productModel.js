import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	image: { type: Array, required: true },
	category: { type: String, required: true },
	subCategory: { type: String, required: true },
	sizes: { type: Array, required: true },
	bestseller: { type: Boolean },
	reviews: [
    {
      customerName: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
	date: { type: Number, required: true },
});

const productModel =
	mongoose.model.product || mongoose.model("product", productSchema);

export default productModel;
