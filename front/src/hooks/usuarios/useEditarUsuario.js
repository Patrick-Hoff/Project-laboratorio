import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export function useEditarUsuario() {

    const queryClient = useQueryClient()

    return useMutation({

        mutationFn: async ({ id, usuario }) => {

            const response = await api.put(
                `/usuarios/edit/${id}`,
                usuario,
                {
                    withCredentials: true,
                }
            )

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['usuarios']
            })
        }
    })
}