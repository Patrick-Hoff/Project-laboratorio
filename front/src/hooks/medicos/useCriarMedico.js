import api from "../../services/api";

import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

export function useCriarMedico() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (medico) => {

            const response = await api.post(
                '/medicos',
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