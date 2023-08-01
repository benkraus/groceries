import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGroceryList } from '@/hooks/useGroceryList.tsx'
import { AddItem } from '@/components/add-item.tsx'

export default function Groceries({
  session,
  setSession,
}: {
  session: string
  setSession: (session: string | null) => void
}) {
  const { items } = useGroceryList({ session })

  const signOut = async () => {
    localStorage.removeItem('session')
    setSession(null)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Button
        variant="ghost"
        className={cn('absolute left-4 top-4 md:left-8 md:top-8')}
        onClick={signOut}
      >
        <>
          <Icons.signOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      </Button>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item: any) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddItem session={session} />
      </div>
    </div>
  )
}
