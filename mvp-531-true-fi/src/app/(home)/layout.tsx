const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="px-4 sm:px-8 container">{children}</main>
    </>
  );
};

export default LandingLayout;
