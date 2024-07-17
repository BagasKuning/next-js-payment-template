import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.SECRET,
    clientKey: process.env.NEXT_PUBLIC_CLIENT
})

export async function POST(request) {
    try{
        const {id, productName, price, quantity} = await request.json()
        let parameter = {
            item_details: {
                name: productName,
                price,
                quantity
            },
            transaction_details: {
                order_id: id,
                gross_amount: price * quantity
            }
        }
        
        const token = await snap.createTransactionToken(parameter)
        console.log("token api", token)
        return NextResponse.json({ token })
    } catch (error) {
        console.error("Error creating transaction token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

export async function GET(res) {
    try{
        return NextResponse.json({ message: 'Test get data' })
    } catch (err){
        return NextResponse.json({
            message: err,
            special_message: "errorrrrr cyukkk"
        })
    }
}