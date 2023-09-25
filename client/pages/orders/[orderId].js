import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/useRequest";

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => console.log(payment)
    });
    useEffect(() => {
        const findTimeLeft = () => {
            const msgLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msgLeft / 1000));
        };

        findTimeLeft();
        const id = setInterval(findTimeLeft, 1000);
        return () => clearInterval(id);
    }, []);
    if (timeLeft < 0) {
        return (
            <div>Order has expired</div>
        );
    }
    return (
        <div>
            time left to pay {timeLeft} seconds.
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51NtqfPAmZ5l0OqhCAGxJJSvrpAmIDutgGt5rIRXA6VO5sovl9GCu7ErbS1EEouoeokbajueullTgRi6SMnqF7zVC001rrHujuu"
                amount={order?.ticket?.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};


OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};
export default OrderShow;