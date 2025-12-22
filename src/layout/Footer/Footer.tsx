export function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="mt-8 py-4 text-center text-muted text-sm">
      {children}
      <div className="mt-2 mb-1">© {new Date().getFullYear()} Atlaset</div>
      <a href="https://github.com/eloritzkovitz/atlaset">View on GitHub</a>
    </footer>
  );
}
