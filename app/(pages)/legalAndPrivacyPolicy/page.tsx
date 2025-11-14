import React from 'react'

function page() {
    return (
        <div className='mx-auto max-w-screen-2xl'>
            <div className='px-20 pb-20 pt-10 space-y-10 font-serif'>
                <p className='text-2xl font-bold'>
                    Legal & Privacy Policy
                </p>

                <p>
                    This Privacy Policy is meant to help you understand what
                    information we collect, why we collect it and how you can update
                    and delete your information.
                </p>

                <p>
                    This online privacy policy applies only to information collected
                    through our website and not to information collected offline.
                </p>

                <p>
                    We may collet personal identification informatino from users in a
                    variety of ways, including, but not limited to, when users visit our site,
                    register on the site place an order fill out a form respond to a survey
                    subscribe to the newsletter and in connection with other activities, services,
                    features or resources we make available on our site. Users may be asked for, as
                    appropriate, name, email address, mailing address, phone number, credit card information,
                    user may, however, visit our site anonymously.
                </p>

                <p>
                    We will collect personal indentification information from users only if
                    they voluntarily submit such information to us. Users can always refuse to supply
                    personally identification information, except that it may prevent them from engaging
                    in certain site related activities.
                </p>

                <p className='font-semibold'>
                    Zealous Health collects and uses Users Personal Information for
                    the following purpose:
                </p>

                <ul className='space-y-2.5 list-decimal ml-3'>
                    <li>
                        To improve customer service your information helps us to more
                        effectively respond to your requests and support needs.
                    </li>
                    <li>
                        To process transactions we may use the information users provide about
                        themselves when placing an order only to provide service to that order.
                    </li>
                    <li>
                        We do not share this information with outside parties except to the
                        extent necessary to provide the service. We do not store credit card
                        information. We do not store credit card information. It is stored separately
                        by the credit card service provider.
                    </li>
                    <li>
                        The email address users provide for order processing, will only be used
                        to send them information and updates pertaining to their order.
                    </li>
                </ul>


                <p className='font-semibold'>HOW WE PROTECT YOUR INFORMATION</p>

                <ul className='space-y-2.5 list-decimal'>
                    <li>
                        We adopt appropriate data collection, storage and processing practices
                        and security measures to protect against unauthorized access,
                        alteration, disclosure or destruction of your personal information,
                        username, password, transaction informatino and data stored on our site.
                    </li>
                    <li>
                        Sensitive and private data exchange between the site and its users happens over a SSL
                        secured communication channel and is encrypted and protected with digital signatures.
                    </li>
                </ul>

                <p className='font-semibold'>
                    SHARING YOUR PEROSNAL INFORMATION
                </p>

                <p>
                    We do not sell, trade, or rent users personal identification
                    information to others. We may share generic aggregated demographic
                    information not linked to any personal identification information regarding
                    visitors and users with our business partners, trusted affiliates and advertisers
                    for the purpose outlined above.
                </p>

                <p className="font-semibold">
                    YOUR ACCEPTANCE OF THESE TERMS
                </p>

                <p>
                    By using this site, you signify your acceptance of this policy and
                    terms of service. If you do not agree to this policy, please do not
                    use our site. Your continued use of the site following the posting of
                    changes to this policy will be deemed your acceptance of those changes.
                </p>

                <p className="font-semibold">
                    CONTACTING US
                </p>

                <p>
                    If you have any questions about this privacy policy, the practices
                    of this site, or your dealings with this site, please contact us at:
                </p>

                <a
                    href="mailto:info@zlshealth.com"
                    className='font-semibold'
                >
                    info@zlshealth.com
                </a>

            </div>
        </div>
    )
}

export default page