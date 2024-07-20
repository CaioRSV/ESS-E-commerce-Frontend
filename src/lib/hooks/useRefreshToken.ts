"use client";

import { useSession, signOut } from "next-auth/react"
import axios from "../axios";

export const useRefreshToken = () => {
    const {data:session} = useSession();
    // Passando refreshToken pelo header para verificação
    
    const refreshToken = async () => {
        try{
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
        } catch(error){
            signOut({
                redirect: true,
                callbackUrl: "/"
            });
        }
    }

    return refreshToken;

} 