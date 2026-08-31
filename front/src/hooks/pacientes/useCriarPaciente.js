import api from "../../services/api";

import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

export function useCriarPaciente() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (paciente) => {

            const response = await api.post(
                '/pacientes',
                paciente,
                {
                    withCredentials: true
                }
            )

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['pacientes']
            })
        }
    })
}