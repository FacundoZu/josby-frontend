import { useQuery } from "@tanstack/react-query";
import { getUser } from "../API/authApi";

export const useAuth = () => {
    const {data, isError, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 0
    })

    return {data, isError, isLoading}
}