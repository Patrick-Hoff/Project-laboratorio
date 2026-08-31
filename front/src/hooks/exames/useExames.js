import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export function useExames({
    page,
    searchId,
    searchCod,
    searchNome
}) {

    return useQuery({

        queryKey: [
            'exames',
            page,
            searchId,
            searchCod,
            searchNome
        ],

        queryFn: async () => {
            const response = await api.get(
                '/exames', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchCod,
                    searchNome
                }
            })

            return response.data;

        }
    })
}