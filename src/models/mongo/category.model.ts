import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import slugify from "slugify";
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      unique: true,
    },
    slug: { type: String, unique: true, required: true, lowercase: true },
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
// 2. Define a Document type that includes Mongoose instance methods
type CategoryDocument = HydratedDocument<ICategory>;

// Pre save middleware
categorySchema.pre("save", function (this: CategoryDocument) {
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
// Create the category model
export default mongoose.model("Category", categorySchema);
