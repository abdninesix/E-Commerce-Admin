import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    typescript: true,
});

export const POST = async (req: NextRequest) => {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get("Stripe-Signature") as string

        const event = stripe.webhooks.constructEvent(
            rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!
        )

        if (event.type === "checkout.session.completed") {
            const session = event.data.object
            const customerInfo = {
                clerkId: session?.client_reference_id,
                name: session?.customer_details?.name,
                email: session?.customer_details?.email,
            }
            const shippingAddress = {
                streetNumber: session?.shipping_details?.address?.line1,
                streetName: session?.shipping_details?.address?.line2,
                city: session?.shipping_details?.address?.city,
                state: session?.shipping_details?.address?.state,
                postalCode: session?.shipping_details?.address?.postal_code,
                country: session?.shipping_details?.address?.country,
            }
            const retrieveSession = await stripe.checkout.sessions.retrieve (
                session.id,
                {expand: }
            )
        }
    } catch (error) {
        console.log("[webhooks_POST]", error)
        return new NextResponse("Failed to create the order", { status: 500 })
    }
}