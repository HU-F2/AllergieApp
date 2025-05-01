import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

type UserType = {
    id: string;
    username: string;
    createdAt: string;
    lastLogin: string | null;
};

const fetchUsers = async (): Promise<UserType[]> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/users`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useFetchUsers = () =>
    useQuery({ queryKey: QUERY_KEYS.user.all, queryFn: fetchUsers });
