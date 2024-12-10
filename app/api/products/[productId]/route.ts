import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Products";
import { connect2DB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connect2DB()
        const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection })
        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
        }
        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.log("[productId_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await connect2DB()
        const product = await Product.findById(params.productId)
        if (!product) {
            return new NextResponse("Product not found", { status: 404 })
        }
        const { title, description, media, category, collections, tags, sizes, colors, price, expense } = await req.json()
        if (!title || !description || !media || !category || !price || !expense) {
            return new NextResponse("More data is required", { status: 400 })
        }

        const addedCollections = collections.filter((collectionId: string) => !product.collections.includes(collectionId))
        const removedCollections = product.collections.filter((collectionId: string) => !collections.includes(collectionId))

        await Promise.all([
            ...addedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, { $push: { products: product._id }, })),
            ...removedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, { $pull: { products: product._id }, })),
        ])

        const updatedProduct = await Product.findByIdAndUpdate(
            params.productId,
            { title, description, media, category, collections, tags, sizes, colors, price, expense },
            { new: true }
        ).populate({ path: "collections", model: Collection })
        await updatedProduct.save()
        return new NextResponse(updatedProduct, { status: 200 })
    } catch (error) {
        console.log("[productId_UPDATE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await connect2DB()
        const product = await Product.findById(params.productId)
        if (!product) {
            return new NextResponse("Product not found", { status: 404 })
        }
        await Product.findByIdAndDelete(params.productId)
        await Promise.all(
            product.collections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id },
                }))
        )
        return new NextResponse("Product is deleted", { status: 200 })
    } catch (error) {
        console.log("[productId_DELETE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}