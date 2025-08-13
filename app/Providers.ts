"use client";

import { axiosClient } from "@/utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "@/utils/localStorageManager";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function Providers() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const getToken = async () => {
      try {
        if (status === "authenticated" && session.user) {
          const res = await axiosClient.post("/api/auth/google", {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
          });

          setItem(KEY_ACCESS_TOKEN, res.data.result.accessToken);
        }
      } catch (e) {
        console.log("error generating token: ", e);
      }
    };
    getToken();
  }, [status, session]);

  return null;
}

export default Providers;
