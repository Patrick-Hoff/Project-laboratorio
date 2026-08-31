import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export function useDeletarPaciente() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (id) => {

            const response = await api.delete(
                `/pacientes/${id}/remove`,
                {
                    withCredentials: true
                }
            )

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['pacientes']
            })
        }
    })
}