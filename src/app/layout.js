export const metadata = {
  title: 'Central de Inteligência de Mídia | DATAFIL',
  description: 'Plataforma de inteligência competitiva e análise de campanhas de mídia (Google & Meta Ads)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
