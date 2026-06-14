import mongoose, { Schema, type InferSchemaType } from "mongoose";
import slugify from "slugify";

// Product Schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      maxleangth: [200, "Name cann't exeed 200 charecters."],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    image: {
      type: [String],
      required: [true, "At least one image is required."],
      validate: {
        validator: (arr: String[]) => arr.length >= 1,
        message: "At least one image is required.",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cann't be negative."],
    },
    discountPercent: {
      type: Number,
      defaut: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cann't be negative."],
    },
    sellerId: {
      type: Number,
      required: [true, "Seller Id is required."],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required."],
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    specs: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    rejectedReson: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Type of product
export type IProduct = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};
// calculate final price of the product
productSchema.virtual("finalPrice").get(function () {
  const baseprice = this.price || 0;
  const discount = this.discountPercent || 0;

  if (discount > 0) {
    const discountPrice = baseprice - (baseprice * discount) / 100;
    return Math.round(discountPrice * 100) / 100;
  }
  return baseprice;
});

// Generate slug for product
productSchema.pre("save", function () {
  if (!this.isModified("name")) return;
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
    this.slug = `${baseSlug}-${Date.now()}`;
  }
});
