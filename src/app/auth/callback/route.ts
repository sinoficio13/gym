import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const supabase = await createClient()

            // Check Profile Status
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('cedula, phone, role')
                    .eq('id', user.id)
                    .single()

                const forwardedHost = request.headers.get('x-forwarded-host')
                const isLocalEnv = process.env.NODE_ENV === 'development'
                const originUrl = isLocalEnv ? origin : `https://${forwardedHost}`

                // 1. Check if Profile is Incomplete (New Logic)
                if (!profile?.cedula || !profile?.phone) {
                    return NextResponse.redirect(`${originUrl}/auth/complete-profile`)
                }

                // 2. Redirect based on Role (Optional but good)
                if (profile?.role === 'admin') {
                    return NextResponse.redirect(`${originUrl}/admin/dashboard`)
                } else {
                    return NextResponse.redirect(`${originUrl}/booking`) // Default for complete users
                }
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
