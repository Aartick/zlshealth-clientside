/**
 * ToastHandler Component
 * 
 * This component listens for toast notification data from the Redux store.
 * When a success or failure toast event is triggered, it displays a 
 * toast message using react-hot-toast.
 * The component does not render any UI.
 */

'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import toast from 'react-hot-toast';

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";

export default function ToastHandler() {
    // Get toast data from Redux store
    const toastData = useAppSelector((state) => state.appConfig.toastData);

    useEffect(() => {
        // Show toast notification based on type
        switch (toastData.type) {
            case TOAST_SUCCESS:
                // Show success toast
                toast.success(toastData.message);
                break;
            case TOAST_FAILURE:
                // Show error toast
                toast.error(toastData.message);
                break;
        }
    }, [toastData]);

    // No UI is rendered
    return null;
}
