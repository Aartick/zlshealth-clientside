import React from 'react'

function page() {
    return (
        <div className='mx-auto container'>
            <div className='px-20 pb-20 pt-10 space-y-10 font-serif'>
                <p className='text-2xl font-bold'>
                    Cancellation And Refund
                </p>

                <p>
                    ZEALOUS HEALTH PRIVATE LIMITED believes in helping its customers as
                    far as possible, and has therefore a liberal cancellation policy. Under
                    this policy:
                </p>

                <p>
                    Cancellations will be considered only if the request is made within 2-3
                    working days of placing the order. However, the cancellation request may
                    not be enteretained if the orders have been communicated to the
                    vendors/merchants and they have initiated the process of shipping them.
                </p>

                <p>
                    In case of receipt of damaged or defective items please report the same
                    to our Customer Service Team. The request will, however, be entertained once
                    the merchant has checked and determined the same at his own end. This should
                    be reported within 2-3 days of receipt of the products.
                </p>

                <p>
                    In case you feel that the product received is not as shown on the site or as per
                    your expectations, you must bring it to the notice of our customer service within
                    2-3 working days of receiving the product. The Customer Service Team after looking
                    into your complaint will take an appropriate decision.
                </p>

                <p>
                    In case of complaints regarding products that come with a warranty from manufacturers,
                    please refer the issue to them.
                </p>

                <p>
                    In case of any Refunds approved by the ZEALOUS HEALTH PRIVATE LIMITED, it&apos;ll take 3-4
                    working days for the refund to be processed to the end customer.
                </p>

                <p className="font-semibold text-lg">
                    Returns Policy
                </p>

                <p>
                    We offer a refund or exchange within the first <span className='font-semibold'>2 working days</span>{" "}
                    from the date of your purchase. If <span className="font-semibold">2 working days</span> have passed since
                    your purchase, you will not be offered a return, exchange, or refund of any kind.
                </p>

                <div className='space-y-2.5'>
                    <p>
                        To be eligible for a return or exchange:
                    </p>

                    <ul className='list-decimal ml-4'>
                        <li>The purchase item must be unused and in the same condition as you received it.</li>
                        <li>The item must have its original packaging.</li>
                        <li>If the item you purchased was on sale, it may not be eligible for a return or exchange.</li>
                    </ul>
                </div>

                <p>
                    We only replace items (based on an exchange request) if they are found
                    to be defective or damaged.
                </p>

                <p>
                    To initiate a return or exchange request for an eligible product, please send {" "}
                    <a
                        href="mailto:info@zlshealth.com"
                        className='font-semibold'
                    >
                        info@zlshealth.com
                    </a>
                </p>

                <p>
                    Please note that certain categories of products/items may be exempt
                    from returns or refunds. These categories will be identified to you at the
                    time of purchase.
                </p>

                <p>
                    For accepted exchange/return requests, once we receive and inspect
                    your returned product/item, we will send you an email to notify you
                    about the receipt of the returned/exchanged product. If approved after
                    the quality check at our end, you request (i.e., return/exchange) will be
                    processed in accordance with our policies.
                </p>

                <p className='font-mono font-semibold'>
                    Last updated on Oct 7, 2024
                </p>

            </div>
        </div>
    )
}

export default page