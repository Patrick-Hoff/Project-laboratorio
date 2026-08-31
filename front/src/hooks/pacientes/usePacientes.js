import api from "../../services/api";
import { useQuery } from "@tanstack/react-query";

export function usePacientes({
    page,
    searchId,
    searchNome
}) {
    return useQuery({

        queryKey: [
            'pacientes',
            page,
            searchId,
            searchNome
        ],

        queryFn: async () => {
            const response = await api.get('/pacientes', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchNome
                }
            })

            return response.data;

        }
    })
}