import api from "../../services/api";

import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

export function useCriarUsuario() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (usuario) => {

            const response = await api.post(
                '/usuarios/register',
                usuario,
                {
                    withCredentials: true
                }
            )

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['usuarios']
            })
        }
    })
}