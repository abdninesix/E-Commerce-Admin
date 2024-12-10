import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Products";
import { connect2DB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connect2DB();

    let data;
    try {
      data = await req.json();
    } catch {
      return new NextResponse("Invalid JSON body", { status: 400 });
    }

    const { title, description, image } = data;

    // Validate required fields
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // Check if collection already exists
    const existingCollection = await Collection.findOne({ title });

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    // Create new collection
    const newCollection = new Collection({
      title,
      description,
      image,
    });

    await newCollection.save();

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error("[collection_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connect2DB();
    const collections = await Collection.find().sort({createdAt: "desc"}).populate({ path: "products", model: Product });
    return NextResponse.json(collections, {status: 200})
  } catch (error) {
    console.error("[collection_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}