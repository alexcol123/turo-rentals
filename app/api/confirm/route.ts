import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
import { redirect } from 'next/navigation'

import { type NextRequest, type NextResponse } from 'next/server'
import db from '@/utils/db'
import { sendEmailAction } from '@/utils/actions'

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id') as string

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)


    let myBookingData = null

    const bookingId = session.metadata?.bookingId
    if (session.status === 'complete' && bookingId) {
      const bookingData = await db.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: true },
      })

      myBookingData = bookingData
    }



    const emailData = {
      totalCost: myBookingData?.orderTotal ?? 0,
      totalNights: myBookingData?.totalNights ?? 0,
      email: session?.customer_details?.email ?? '',
      name: session?.customer_details?.name ?? ''
    }

    await sendEmailAction({
      email: emailData.email,
      name: emailData.name,
      totalCost: emailData.totalCost,
      totalNights: emailData.totalNights
    })

    // console.log('email sent im in  CONFIRM ROUTE -------------------------------------------------------  ')


  } catch (err) {
    console.log(err)
    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
  // add 
  redirect('/bookings')
}