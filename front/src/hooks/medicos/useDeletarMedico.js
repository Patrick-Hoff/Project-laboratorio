import api from "../../services/api";

import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

export function useDeletarMedico() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (id) => {

            const response = await api.delete(
                `/medicos/${id}`,
                {
                    withCredentials: true
                }
            )

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['medicos']
            })
        }
    })
}