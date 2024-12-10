import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Products";
import { connect2DB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect2DB();

    const { title, description, media, category, collections, tags, sizes, colors, price, expense } = await req.json();

    // Validate required fields
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Mandatory data not provided", { status: 400 });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ title });

    if (existingProduct) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    // Create new product
    const newProduct = await Product.create({
      title, description, media, category, collections, tags, sizes, colors, price, expense,
    });

    await newProduct.save();

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId)
        if (collection) {
          collection.products.push(newProduct._id)
          await collection.save()
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.error("[products_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connect2DB();
    const products = await Product.find().sort({createdAt: "desc"}).populate({ path: "collections", model: Collection });
    return NextResponse.json(products, {status: 200})
  } catch (error) {
    console.error("[product_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}