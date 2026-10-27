import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../services/api";

export function useEditarConvenio() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async ({ id, convenio }) => {

            const response = await api.put(
                `/convenio/${id}`,
                convenio,
                {
                    withCredentials: true
                }
            )

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['convenios']
            })
        }
    })
}