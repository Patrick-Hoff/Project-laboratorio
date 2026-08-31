import api from "../../services/api";
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeletarExame() {

    const useQuery = useQueryClient();

    return useMutation({

        mutationFn: async (id) => {

            const response = await api.delete(
                `/exames/${id}/remove`,
                {
                    withCredentials: true
                }
            )

            return response.data;
        },

        onSuccess: () => {
            useQuery.invalidateQueries({
                queryKey: ['exames']
            })
        }
    })
}