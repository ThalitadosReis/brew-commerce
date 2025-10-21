import mongoose, { Schema, models, Document } from "mongoose";

export interface IWishlistItem {
  productId: string;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: string; // clerk user ID
  items: IWishlistItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    productId: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [WishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist =
  models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
