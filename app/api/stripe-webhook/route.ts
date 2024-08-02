
import { NextResponse } from "next/server";
import stripe from "stripe";
import db from '@/utils/db'

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }


  // Get the ID and type
  const eventType = event.type;

  if (eventType === "checkout.session.completed") {

    // if (eventType === "payment_intent.succeeded") {

    const paymentIntentSucceeded = event.data.object;
    // console.log(paymentIntentSucceeded)

    // return new Response("", { status: 200 });


    // console.log('checkou.session.completed Webhook received! ===============>');


    if (!event?.data?.object?.metadata?.bookingId) {
      throw new Error('Booking ID not found')
    }
    const { bookingId } = event.data.object.metadata;




    await db.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: true },
    })

    // console.log('WEBHOOK  ROUTE = Webhook received! ===============>  payment status updated' + bookingId);
  }



  return new Response("", { status: 200 });
}





// // Get the ID and type
// const eventType = event.type;

// // CREATE
// if (eventType === "checkout.session.completed") {

//   console.log(event.data.object.metadata);


//   console.log('Webhook received! ===============>');
//   // const { id, amount_total, metadata } = event.data.object;

//   // const transaction = {
//   //   stripeId: id,
//   //   amount: amount_total ? amount_total / 100 : 0,
//   //   plan: metadata?.plan || "",
//   //   credits: Number(metadata?.credits) || 0,
//   //   buyerId: metadata?.buyerId || "",
//   //   createdAt: new Date(),
//   // };

//   // const newTransaction = await createTransaction(transaction);

//   // return NextResponse.json({ message: "OK", transaction: newTransaction });
// }


