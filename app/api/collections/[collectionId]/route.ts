import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Products";
import { connect2DB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        await connect2DB()
        const collection = await Collection.findById(params.collectionId)
        if (!collection) {
            return new NextResponse(JSON.stringify({ message: "Collection not found" }), { status: 404 })
        }
        return NextResponse.json(collection, { status: 200 })
    } catch (error) {
        console.log("[CollectionId_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await connect2DB()
        let updatedCollection = await Collection.findById(params.collectionId)
        if (!updatedCollection) {
            return new NextResponse("Collection not found", { status: 404 })
        }
        const { title, description, image } = await req.json()
        if (!title || !image) {
            return new NextResponse("Title and image are required", { status: 400 })
        }
        updatedCollection = await Collection.findByIdAndUpdate(params.collectionId, { title, description, image }, { new: true })
        await updatedCollection.save()
        return new NextResponse(updatedCollection, { status: 200 })
    } catch (error) {
        console.log("[CollectionId_UPDATE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await connect2DB()
        await Collection.findByIdAndDelete(params.collectionId)

        await Product.updateMany(
            { collections: params.collectionId },
            { $pull: { collections: params.collectionId } }
        )

        return new NextResponse("Collection is deleted", { status: 200 })
    } catch (error) {
        console.log("[CollectionId_DELETE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}