import { useQuery } from 'react-query'
import { useAPI } from '@/hooks/useAPI.tsx'

export const useGroceryList = ({ session }: { session: string }) => {
  const { apiUrl } = useAPI()

  const query = useQuery('groceries', async () => {
    const response = await fetch(`${apiUrl}/groceries`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })
    return await response.json()
  })

  return { items: query.data ?? [] }
}
