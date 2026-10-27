import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export function useConvenios({
    cod,
    nome,
    page,
    limit
}) {

    return useQuery({

        queryKey: [
            'convenios',
            cod,
            nome,
            page,
            limit
        ],

        queryFn: async () => {
            const response = await api.get(
                '/convenio', {
                params: {
                    cod,
                    nome,
                    page,
                    limit
                }
            })

            return response.data;

        }
    })
}