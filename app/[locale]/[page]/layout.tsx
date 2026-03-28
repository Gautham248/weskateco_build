import Footer from "components/layout/footer";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string; page: string }>;
}) {
  const params = await props.params;
  const { children } = props;
  return (
    <>
      <div className="w-full">
        <div className="mx-8 max-w-2xl py-20 sm:mx-auto">{children}</div>
      </div>
      <Footer />
    </>
  );
}
