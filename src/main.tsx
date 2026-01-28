import { createRoot } from 'react-dom/client'
import { router } from '@/app/router'
import { Providers } from '@/app/providers'
import { queryClient } from '@/shared/api/query-client'


createRoot(document.getElementById('root')!).render(
  <Providers router={router} client={queryClient} />
)
