"use client";

import { useSession } from "next-auth/react"
import axios from "../axios";

export const useRefreshToken = () => {
    const {data:session} = useSession();


    // Passando refreshToken pelo header oara verificação
    
    const refreshToken = async () => {
        const res = await axios.get("/api/auth/refresh",
            {
                headers: {
                    Authorization: `Bearer ${session?.user.refreshToken}`
                }
            }
        )
    
        if (session) {
            
            session.user.accessToken = res.data.accessToken;
        }

    }

    return refreshToken;

} 