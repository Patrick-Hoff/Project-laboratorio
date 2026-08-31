import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export function useCriarExame() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (exame) => {

            const response = await api.post(
                '/exames',
                exame,
                {
                    withCredentials: true
                }
            )

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exames']
            })
        }
    })
}