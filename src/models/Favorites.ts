import { Schema, model, models, type Document } from "mongoose";

export interface IFavoriteItem {
  productId: string;
  addedAt: Date;
}

export interface IFavorites extends Document {
  userId: string;
  items: IFavoriteItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const FavoriteItemSchema = new Schema<IFavoriteItem>(
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

const FavoritesSchema = new Schema<IFavorites>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [FavoriteItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Favorites =
  models.Favorites || model<IFavorites>("Favorites", FavoritesSchema);

export default Favorites;
