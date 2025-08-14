'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import toast from 'react-hot-toast';

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";

export default function ToastHandler() {
    const toastData = useAppSelector((state) => state.appConfig.toastData);

    useEffect(() => {
        switch (toastData.type) {
            case TOAST_SUCCESS:
                toast.success(toastData.message);
                break;
            case TOAST_FAILURE:
                toast.error(toastData.message);
                break;
        }
    }, [toastData]);

    return null;
}
