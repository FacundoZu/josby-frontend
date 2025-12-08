import { useQuery } from "@tanstack/react-query";
import { getUser } from "../API/authApi";

export const useAuth = () => {
    const {data, isError, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 0,
        stateTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    return {data, isError, isLoading}
}