import mongoose, { Schema, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Category name is required."],
      trim: true,
      unique: true,
    },
    slug: { type: String, unique: true, require: true, lowercase: true },
    icon: { type: String, default: "" },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
// define the typescript types with inferSchema Type
export type ICategory = InferSchemaType<typeof categorySchema> & {
  _id: mongoose.Types.ObjectId;
};
// Pre save middleware
categorySchema.pre("save", function (this: any, next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
});
// Create the category model
export default mongoose.model("Category", categorySchema);
