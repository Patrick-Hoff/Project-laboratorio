import api from "../../services/api";
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeletarConvenio() {

    const useQuery = useQueryClient();

    return useMutation({

        mutationFn: async (id) => {

            const response = await api.delete(
                `/convenio/${id}`,
                {
                    withCredentials: true
                }
            )

            return response.data;
        },

        onSuccess: () => {
            useQuery.invalidateQueries({
                queryKey: ['convenios']
            })
        }
    })
}