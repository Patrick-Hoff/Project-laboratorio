import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export function useEditarPaciente() {

    const queryClient = useQueryClient()

    return useMutation({

        mutationFn: async ({ id, paciente }) => {

            const response = await api.put(
                `/pacientes/${id}/edit`,
                paciente,
                {
                    withCredentials: true,
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