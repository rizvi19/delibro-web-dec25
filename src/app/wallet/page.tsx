import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function WalletPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single()
  const { data: txns } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">৳{Number(wallet?.balance || 0).toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {(txns || []).map((t: any) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm">{t.description || t.type}</div>
                  <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
                </div>
                <div className={t.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {t.type === 'credit' ? '+' : '-'}৳{Number(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {(!txns || txns.length === 0) && (
              <div className="text-sm text-muted-foreground py-6">No transactions yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

