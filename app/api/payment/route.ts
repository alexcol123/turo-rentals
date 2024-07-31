import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
import { type NextRequest, type NextResponse } from 'next/server'
import db from '@/utils/db'
import { formatDate } from '@/utils/format'


export const POST = async (req: NextRequest, res: NextResponse) => {

  const requestHeaders = new Headers(req.headers)
  const origin = requestHeaders.get('origin')

  const { bookingId } = await req.json()

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      Vehicle: {
        select: {
          make: true,
          model: true,
          year: true,
          image: true,
        },
      },
    },
  })

  if (!booking) {
    return Response.json(null, {
      status: 404,
      statusText: 'Not Found',
    })
  }


  const {
    totalNights,
    orderTotal,
    checkIn,
    checkOut,

    // Vehicle: { make , model, year, image },
  } = booking

  const make = booking?.Vehicle?.make || ''
  const model = booking?.Vehicle?.model || ''
  const year = booking?.Vehicle?.year || ''
  const image = booking?.Vehicle?.image || ''

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      metadata: { bookingId: booking.id },
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          quantity: 1,
          price_data: {
            currency: 'usd',

            product_data: {
              name: `${make} ${model} ${year}`,
              images: [image],
              description: `Use this vehicle for  ${totalNights} days, from ${formatDate(
                checkIn
              )} to ${formatDate(checkOut)}. Enjoy it!`,
            },
            unit_amount: orderTotal * 100,
          },
        },
      ],
      mode: 'payment',
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    })

    return Response.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.log(error)

    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }

}