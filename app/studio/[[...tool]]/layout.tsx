export function generateStaticParams() {
  return [{ tool: [] }];
}

export const metadata = {
  title: "WeSkate Co — Content Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
