import '../globals.css';
import { Poppins } from 'next/font/google';



const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['300', '400', '500'],
})


export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <html lang='en'>

        <head>
            <meta name='theme-color' content='#B726B2' />
        </head>

            <body className='font-poppins'>

                {children}

            </body>
        </html>
    )
}
