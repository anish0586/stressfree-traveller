export const dynamic = 'force-dynamic';

import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getSession } from '@/lib/auth';

export const metadata = {
  title: 'Stressfree Traveller',
  description: 'Explore cities the smart way with curated travel guides.'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <Link href="/"><strong>Stressfree Traveller</strong></Link>
            <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center' }}>
              <Link href="/saved">Saved</Link>
              <Link href="/admin/pages/new">Create Page</Link>
              {session ? (
                <form action="/api/auth/logout" method="post">
                  <button className="secondary" type="submit">Logout</button>
                </form>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/signup">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
