import "./globals.css";
import ChatWidget from './ChatWidget'

export const metadata = {
    title: "LikeHub",
    description: "Share ideas, get feedback",
};

export default function RootLayout({ children }) {
    return (
        <html lang="hy" style={{ colorScheme: 'light' }}>
        <body>
        {children}
        <ChatWidget />
        </body>
        </html>
    );
}