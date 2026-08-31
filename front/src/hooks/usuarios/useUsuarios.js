import api from '../../services/api'
import { useQuery } from '@tanstack/react-query'

export function useUsuarios({
    page,
    searchId,
    searchName,
    searchEmail
}) {

    return useQuery({

        queryKey: [
            'usuarios',
            page,
            searchId,
            searchName,
            searchEmail
        ],

        queryFn: async () => {

            const response = await api.get(
                '/usuarios/searchUsers', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchName,
                    searchEmail
                }
            }
            )

            return response.data;
        }
    })
}