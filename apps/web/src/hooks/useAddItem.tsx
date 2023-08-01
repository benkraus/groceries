import { useAPI } from '@/hooks/useAPI.tsx'
import { useMutation, useQueryClient } from 'react-query'

export const useAddItem = ({ session }: { session: string }) => {
  const { apiUrl } = useAPI()
  const queryClient = useQueryClient()

  const mutation = useMutation<void, unknown, { name: string }>(
    async ({ name }) => {
      await fetch(`${apiUrl}/groceries`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({ name }),
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groceries')
      },
    },
  )

  return {
    addItem: (name: string) => mutation.mutate({ name }),
  }
}
