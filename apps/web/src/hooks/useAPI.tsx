export const useAPI = () => {
  return {
    apiUrl: `${
      import.meta.env.VITE_APP_API_URL ?? 'https://66kbun3t5h.execute-api.us-west-2.amazonaws.com'
    }`,
  }
}
