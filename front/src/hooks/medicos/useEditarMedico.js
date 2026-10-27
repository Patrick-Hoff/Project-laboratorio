import api from "../../services/api";

import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

export function useEditarMedico() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async ({ id, medico }) => {

            const response = await api.put(
                `/medicos/${id}`,
                medico,
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