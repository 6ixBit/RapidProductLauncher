import 'server-only'
import {Database} from '@/lib/database.types'
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
// Outstanding bug
//https://github.com/vercel/next.js/issues/45371
export const supabaseUserRouteHandlerClient = createRouteHandlerClient<Database>(
   {
      cookies,
   },
   {
      options: {
         global: {
            fetch,
         },
      },
   }
)
