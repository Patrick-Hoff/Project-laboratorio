import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export function useCriarConvenio() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (convenio) => {

            const response = await api.post(
                '/convenio',
                convenio,
                {
                    withCredentials: true
                }
            )

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['convenios']
            })
        }
    })
}