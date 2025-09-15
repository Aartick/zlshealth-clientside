import React from 'react'
import { FaGear, FaUser } from 'react-icons/fa6'
import { GoPlus } from 'react-icons/go'
import { HiOutlineUserCircle } from 'react-icons/hi2'
import { LuLogOut } from 'react-icons/lu'
import { RxCross2 } from 'react-icons/rx'

function page() {
    return (
        <div className='flex gap-8 p-8'>
            <div className="flex-1 space-y-4 border border-[#f4f4f4] rounded-[36px] p-[30px]">
                <div className="space-y-[60px]">
                    <p className="border-b border-[#e3e3e3] p-2.5 font-medium">Overview</p>

                    <div className="space-y-3 border-b border-[#e3e3e3] p-2.5  text-sm">
                        <p className="font-medium">Profile</p>
                        <p className="text-[#71BF45]">Edit Details</p>
                        <p className="text-[#848484]">Default Address</p>
                        <p className="text-[#848484]">Other Address</p>
                    </div>

                    <div className="space-y-3 border-b border-[#e3e3e3] p-2.5  text-sm">
                        <p className="font-medium">Orders & Returns</p>
                        <p className="text-[#848484]">All Orders</p>
                        <p className="text-[#848484]">Track Orders</p>
                    </div>

                    <div className="space-y-3 border-b border-[#e3e3e3] p-2.5  text-sm">
                        <p className="font-medium">Legal</p>
                        <p className="text-[#848484]">Terms of Use</p>
                        <p className="text-[#848484]">Privacy Policy</p>
                    </div>

                    <div className="space-y-3 border-b border-[#e3e3e3] p-2.5  text-sm">
                        <div className="flex items-center gap-2.5 text-[#848484] font-medium">
                            <FaGear />
                            <p>Settings</p>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#848484] font-medium">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.25C8.26941 1.25 6.57769 1.76318 5.13876 2.72464C3.69983 3.6861 2.57832 5.05267 1.91605 6.65152C1.25379 8.25037 1.08051 10.0097 1.41813 11.707C1.75575 13.4044 2.58911 14.9635 3.81282 16.1872C5.03653 17.4109 6.59563 18.2442 8.29296 18.5819C9.99029 18.9195 11.7496 18.7462 13.3485 18.0839C14.9473 17.4217 16.3139 16.3002 17.2754 14.8612C18.2368 13.4223 18.75 11.7306 18.75 10C18.75 7.67936 17.8281 5.45376 16.1872 3.81282C14.5462 2.17187 12.3206 1.25 10 1.25ZM10 17.5C8.51664 17.5 7.06659 17.0601 5.83322 16.236C4.59985 15.4119 3.63856 14.2406 3.0709 12.8701C2.50325 11.4997 2.35472 9.99168 2.64411 8.53682C2.9335 7.08197 3.64781 5.74559 4.6967 4.6967C5.74559 3.64781 7.08197 2.9335 8.53682 2.64411C9.99168 2.35472 11.4997 2.50325 12.8701 3.0709C14.2406 3.63856 15.4119 4.59985 16.236 5.83322C17.0601 7.06659 17.5 8.51664 17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5Z" fill="#848484" />
                                <path d="M10 15.625C10.5178 15.625 10.9375 15.2053 10.9375 14.6875C10.9375 14.1697 10.5178 13.75 10 13.75C9.48223 13.75 9.0625 14.1697 9.0625 14.6875C9.0625 15.2053 9.48223 15.625 10 15.625Z" fill="#848484" />
                                <path d="M10.625 5.00001H9.6875C9.31793 4.99918 8.95183 5.07137 8.61023 5.21242C8.26863 5.35347 7.95825 5.5606 7.69692 5.82193C7.4356 6.08326 7.22846 6.39364 7.08741 6.73524C6.94636 7.07684 6.87418 7.44293 6.875 7.81251V8.12501H8.125V7.81251C8.125 7.39811 8.28962 7.00068 8.58265 6.70765C8.87567 6.41463 9.2731 6.25001 9.6875 6.25001H10.625C11.0394 6.25001 11.4368 6.41463 11.7299 6.70765C12.0229 7.00068 12.1875 7.39811 12.1875 7.81251C12.1875 8.22691 12.0229 8.62434 11.7299 8.91736C11.4368 9.21039 11.0394 9.37501 10.625 9.37501H9.375V12.1875H10.625V10.625C11.3709 10.625 12.0863 10.3287 12.6137 9.80124C13.1412 9.2738 13.4375 8.55843 13.4375 7.81251C13.4375 7.06659 13.1412 6.35122 12.6137 5.82377C12.0863 5.29632 11.3709 5.00001 10.625 5.00001Z" fill="#848484" />
                            </svg>

                            <p>Help & Feedback</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-[#093C16]">
                    <LuLogOut />
                    <p className="font-medium text-sm">Sign out</p>
                </div>
            </div>
            <div className="flex-4 space-y-4 border border-[#f4f4f4] rounded-[36px] p-[30px]">
                <div className="space-y-4">
                    {/* CARDS */}
                    <div className="flex items-center gap-3">
                        {/* PROFILE CARD */}
                        <div className="border border-[#71BF45] bg-[#F4FAF0] p-5 space-y-3 rounded-3xl">
                            <div className="bg-[#71BF45] p-2.5 rounded-[30px] text-white w-fit">
                                <HiOutlineUserCircle />
                            </div>
                            <p className="text-sm font-medium">
                                Profile
                            </p>
                            <p className="text-xs text-[#848484]">
                                Manage your personal details, addresses,
                                and saved payment options in one place.
                            </p>
                        </div>

                        {/* ORDERS & RETURNS CARD */}
                        <div className="border border-[#e3e3e3] p-5 space-y-3 rounded-3xl">
                            <div className="border border-[#71BF45] p-2.5 rounded-[30px] w-fit">
                                <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 3.5H2.5C1.94772 3.5 1.5 3.94772 1.5 4.5V20.5C1.5 21.0523 1.94772 21.5 2.5 21.5H15.5C16.0523 21.5 16.5 21.0523 16.5 20.5V4.5C16.5 3.94772 16.0523 3.5 15.5 3.5Z" stroke="#71BF45" stroke-width="2" stroke-linejoin="round" />
                                    <path d="M6 1.5V4.5M12 1.5V4.5M5 9H13M5 13H11M5 17H9" stroke="#71BF45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium">
                                Orders & Return
                            </p>
                            <div className="text-xs text-[#848484]">
                                Track your purchases, check delivery status,
                                and manage returns or exchanges easily.
                            </div>
                        </div>

                        {/* LEGAL CARD */}
                        <div className="border border-[#e3e3e3] p-5 space-y-3 rounded-3xl">
                            <div className="border border-[#71BF45] p-2.5 rounded-[30px] w-fit">
                                <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.833 11.667C10.888 12.722 12.278 13.794 12.278 13.794L14.183 11.889C14.183 11.889 13.111 10.499 12.056 9.444C11.001 8.389 9.611 7.317 9.611 7.317L7.706 9.222C7.706 9.222 8.778 10.612 9.833 11.667ZM9.833 11.667L6.5 15M14.5 11.571L11.96 14.111M9.93 7L7.39 9.54" stroke="#71BF45" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M19 10.683V7.78C19 6.14 19 5.32 18.596 4.785C18.192 4.25 17.278 3.991 15.451 3.471C14.349 3.1545 13.2702 2.76258 12.222 2.298C11.023 1.766 10.424 1.5 10 1.5C9.576 1.5 8.977 1.766 7.778 2.298C6.898 2.688 5.798 3.116 4.549 3.471C2.722 3.991 1.809 4.251 1.404 4.785C1 5.32 1 6.14 1 7.78V10.683C1 16.308 6.063 19.683 8.594 21.019C9.201 21.339 9.504 21.5 10 21.5C10.496 21.5 10.799 21.34 11.406 21.02C13.937 19.682 19 16.308 19 10.683Z" stroke="#71BF45" stroke-width="1.5" stroke-linecap="round" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium">
                                Legal
                            </p>
                            <div className="text-xs text-[#848484]">
                                Review our terms, policies, and privacy guidelines
                                to understand your rights and security.
                            </div>
                        </div>
                    </div>

                    {/* EDIT DETAILS */}
                    <div className="space-y-4 p-2.5">
                        <p className="font-semibold text-[#093C16]">
                            Edit Details
                        </p>

                        <div className="flex justify-between">
                            {/* FORM */}
                            <div className="flex gap-6">
                                {/* FIRST COLUMN */}
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor='fullName' className="text-sm font-medium">Full Name *</label>
                                        <input type="text" id="fullName" className="p-2.5 border border-[#CDCDCD] rounded-[6px] text-xs text-[#848484]" placeholder='Enter Full Name' />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor='mobildNumber' className="text-sm font-medium">Mobile Number *</label>
                                        <input type="text" id="mobileNumber" className="p-2.5 border border-[#CDCDCD] rounded-[6px] text-xs text-[#848484]" placeholder='(+91)-' />
                                        <p className='text-xs text-[#676767]'>*You will receive an OTP for confirmation.</p>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor='email' className="text-sm font-medium">Mobile Number <span className='text-[#71BF45]'>(for order updates)</span></label>
                                        <div className="flex justify-between items-center p-2.5 border border-[#CDCDCD] rounded-[6px] text-xs text-[#848484]">
                                            <input type="email" id="email" className="" placeholder='Enter Email' />
                                            <p id='email'>@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECOND COLUMN */}
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor='dob' className="text-sm font-medium">DOB</label>
                                        <input type="date" id="dob" className="p-2.5 border border-[#CDCDCD] rounded-[6px] text-xs text-[#848484]" placeholder='(dd/mm/yy)' />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor='gender' className="text-sm font-medium">Gender</label>
                                        <select id="gender" className="p-2.5 border border-[#CDCDCD] rounded-[6px] text-xs text-[#848484]">
                                            <option>(Select Option)</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* PROFILE PICTURE */}
                            <label htmlFor="img" className='relative flex items-center justify-center p-5 bg-[#E3E3E3] w-[150px] h-[150px] rounded-full'>
                                <FaUser size={75} className='text-white' />
                                <div className="absolute top-1 -right-2 p-2.5 border-3 border-[#E3E3E3] rounded-full bg-white">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM0.5 15.5V11.9583L11.5 0.979167C11.6667 0.826389 11.8508 0.708333 12.0525 0.625C12.2542 0.541667 12.4658 0.5 12.6875 0.5C12.9092 0.5 13.1244 0.541667 13.3333 0.625C13.5422 0.708333 13.7228 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.3092 2.5 15.3858 2.70833C15.4625 2.91667 15.5006 3.125 15.5 3.33333C15.5 3.55556 15.4619 3.7675 15.3858 3.96917C15.3097 4.17083 15.1881 4.35472 15.0208 4.52083L4.04167 15.5H0.5ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z" fill="#71BF45" />
                                    </svg>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTIONS */}
                <div className="border-b border- space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#093C16]">Default Address</p>
                        <button className='p-2.5 border border-[#71BF45] rounded-[6px] flex items-center gap-1.5 text-[#71BF45] text-sm font-medium'>
                            <GoPlus /> Add New Address
                        </button>
                    </div>

                    {/* DEFAULT ADDRESS */}
                    <div className="border-b border-[#e3e3e3] p-2.5 space-y-3">
                        <p className="font-medium text-sm">Harshita</p>
                        <div className="flex gap-1.5">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_125_504)">
                                    <path d="M15.8333 19.9998H4.16667C1.86917 19.9998 0 18.1307 0 15.8332V8.10318C0 6.71568 0.686667 5.42401 1.83667 4.64901L7.66917 0.712344C9.085 -0.242656 10.915 -0.242656 12.3308 0.712344L18.1642 4.64901C19.3133 5.42401 20 6.71484 20 8.10318V15.8332C20 18.1307 18.1308 19.9998 15.8333 19.9998Z" fill="#71BF45" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_125_504">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p className="flex flex-col text-[#848484] text-xs">
                                Plot No. 45, House No.: 3-7-112/5, Near Shanti Gardens, Suryapet, Hyderabad, Telangana - 508206.
                                <span>Suryapet</span>
                                <span>Hyderabad - 508206</span>
                                <span>TELANGANA</span>
                            </p>
                        </div>
                        <div className='flex items-center gap-2 text-sm font-medium'>
                            <p>Phone:</p>
                            <p className='text-[#848484]'>+91-9876543210</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center justify-between border-[0.5px] border-[#848484] p-10 rounded-[6px]">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM0.5 15.5V11.9583L11.5 0.979167C11.6667 0.826389 11.8508 0.708333 12.0525 0.625C12.2542 0.541667 12.4658 0.5 12.6875 0.5C12.9092 0.5 13.1244 0.541667 13.3333 0.625C13.5422 0.708333 13.7228 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.3092 2.5 15.3858 2.70833C15.4625 2.91667 15.5006 3.125 15.5 3.33333C15.5 3.55556 15.4619 3.7675 15.3858 3.96917C15.3097 4.17083 15.1881 4.35472 15.0208 4.52083L4.04167 15.5H0.5ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z" fill="#848484" />
                                </svg>
                                <p className="text-[#848484] font-medium text-sm">Edit</p>
                            </div>
                            <div className="flex items-center justify-between border-[0.5px] border-[#848484] p-10 rounded-[6px] text-[#848484]">
                                <RxCross2 />
                                <p className="font-medium text-sm">Remove</p>
                            </div>
                        </div>
                    </div>

                    {/* OTHER ADDRESS */}
                    <p className="font-semibold text-[#093C16]">Other Address</p>

                    <div className="border-b border-[#e3e3e3] p-2.5 space-y-3">
                        <p className="font-medium text-sm">Prem</p>
                        <div className="flex gap-1.5">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_125_504)">
                                    <path d="M15.8333 19.9998H4.16667C1.86917 19.9998 0 18.1307 0 15.8332V8.10318C0 6.71568 0.686667 5.42401 1.83667 4.64901L7.66917 0.712344C9.085 -0.242656 10.915 -0.242656 12.3308 0.712344L18.1642 4.64901C19.3133 5.42401 20 6.71484 20 8.10318V15.8332C20 18.1307 18.1308 19.9998 15.8333 19.9998Z" fill="#71BF45" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_125_504">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p className="flex flex-col text-[#848484] text-xs">
                                Plot No. 45, House No.: 3-7-112/5, Near Shanti Gardens, Suryapet, Hyderabad, Telangana - 508206.
                                <span>Suryapet</span>
                                <span>Hyderabad - 508206</span>
                                <span>TELANGANA</span>
                            </p>
                        </div>
                        <div className='flex items-center gap-2 text-sm font-medium'>
                            <p>Phone:</p>
                            <p className='text-[#848484]'>+91-9876543210</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center justify-between border-[0.5px] border-[#848484] p-10 rounded-[6px]">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM0.5 15.5V11.9583L11.5 0.979167C11.6667 0.826389 11.8508 0.708333 12.0525 0.625C12.2542 0.541667 12.4658 0.5 12.6875 0.5C12.9092 0.5 13.1244 0.541667 13.3333 0.625C13.5422 0.708333 13.7228 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.3092 2.5 15.3858 2.70833C15.4625 2.91667 15.5006 3.125 15.5 3.33333C15.5 3.55556 15.4619 3.7675 15.3858 3.96917C15.3097 4.17083 15.1881 4.35472 15.0208 4.52083L4.04167 15.5H0.5ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z" fill="#848484" />
                                </svg>
                                <p className="text-[#848484] font-medium text-sm">Edit</p>
                            </div>
                            <div className="flex items-center justify-between border-[0.5px] border-[#848484] p-10 rounded-[6px] text-[#848484]">
                                <RxCross2 />
                                <p className="font-medium text-sm">Remove</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page