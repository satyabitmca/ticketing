import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

function convertToGMT530(utcDate) {
    // Create a new Date object from the UTC date string
    const date = new Date(utcDate);

    // Get the UTC time in milliseconds
    const utcTime = date.getTime();

    // Calculate the offset for GMT+5:30 in milliseconds (5.5 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const offset = 5.5 * 60 * 60 * 1000;

    // Create a new Date object with the adjusted time
    const gmt530Date = new Date(utcTime + offset);

    return gmt530Date;
}


const OrderShow = ({ order, currentUser }) => {
   // console.log('order expires time saved in db: ',convertToGMT530(order.expiresAt));
    const [timeLeft, setTimeLeft] = useState(0);
     // console.log('normal time: ', (new Date(order.expiresAt) - new Date()));
    const {doRequest, errors} = useRequest({
        url:'/api/payments',
        method:'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')

    });
   
    useEffect( () => {
        const findTimeLeft = () => {
            const temp = new Date(convertToGMT530(order.expiresAt)) - new Date();
            // console.log('temp', temp);
            const msLeft = temp - 1000000;           
            setTimeLeft(Math.round(msLeft / 1000));           
        };

        findTimeLeft();
       const timerId = setInterval(findTimeLeft, 1000);

       return () => {
        clearInterval(timerId);
       }

    }, [order]);

    if(timeLeft < 0) {
        return <div>Order Expired</div>;
    }

    return <div>
        Time left to pay: {timeLeft} seconds 
        <StripeCheckout 
        
        token={({id}) => doRequest({token: id}) }
        stripeKey="pk_test_51QfWmjDwZFVDAq5Y01zsRLU7lBGuPPlCluFd0h1d1FCID4B2e0KhIqmUHMhXjjJnaWhgAzDwUOghUkJFmPCLlFYm00SYd5FkpP"
        amount={order.ticket.price * 100}
        email= {currentUser.email}
        />            
        {errors}
        </div>;
};

OrderShow.getInitialProps = async( context, client) => {
    const {orderId} = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return {order: data}

}

export default OrderShow;