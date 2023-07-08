import 'server-only'
import {Database} from '@/lib/database.types'
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'

export const supabaseUserServerComponentClient = createServerComponentClient<Database>(
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
