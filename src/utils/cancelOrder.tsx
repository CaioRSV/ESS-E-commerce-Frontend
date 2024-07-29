import { axiosAuth } from "@/lib/axios";

const cancelOrder = async (orderId:number) => {
        const data = await axiosAuth.delete(`/api/orders/${orderId}`);
}
