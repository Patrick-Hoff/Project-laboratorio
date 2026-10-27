import api from '../../services/api'
import { useQuery } from '@tanstack/react-query'

export function useMedicos({
    page,
    nome,
    crm
}) {

    return useQuery({

        queryKey: [
            'medicos',
            page,
            nome,
            crm
        ],

        queryFn: async () => {

            const response = await api.get(
                '/medicos?', {
                params: {
                    page,
                    limit: 5,
                    nome,
                    crm
                }
            }
            )

            return response.data;
        }
    })
}   