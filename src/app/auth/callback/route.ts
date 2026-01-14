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

                const isLocalEnv = process.env.NODE_ENV === 'development';
                // In local dev, origin is usually http://localhost:3000. In prod, use request.url origin or trusted header
                // Simplifying to use the request origin which Next.js usually handles correctly
                const originUrl = origin;

                // 1. Check if Profile is Incomplete (New Logic)
                if (!profile?.cedula || !profile?.phone) {
                    return NextResponse.redirect(`${originUrl}/auth/complete-profile`)
                }

                // 2. Redirect based on Role (Optional but good)
                if (profile?.role === 'admin') {
                    return NextResponse.redirect(`${originUrl}/admin/dashboard`)
                } else {
                    return NextResponse.redirect(`${originUrl}/dashboard/client`) // Default for complete users
                }
            }
        }
    }

    // return the user to an error page with instructions
    // Forward existing error params if any
    const errorParams = new URLSearchParams();
    if (searchParams.get('error')) errorParams.set('error', searchParams.get('error')!);
    if (searchParams.get('error_code')) errorParams.set('error_code', searchParams.get('error_code')!);
    if (searchParams.get('error_description')) errorParams.set('error_description', searchParams.get('error_description')!);

    return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
}
