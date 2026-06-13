import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";

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
categorySchema.pre(
  "save",
  function (
    this: CategoryDocument,
    next: (err?: mongoose.CallbackError) => void,
  ) {
    if (this.isModified("name")) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    next();
  },
);
// Create the category model
export default mongoose.model("Category", categorySchema);
