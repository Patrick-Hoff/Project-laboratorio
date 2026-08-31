import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../services/api";

export function useEditarExame() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async ({ id, exame }) => {

            const response = await api.put(
                `/exames/${id}/edit`,
                exame,
                {
                    withCredentials: true
                }
            )

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exames']
            })
        }
    })
}