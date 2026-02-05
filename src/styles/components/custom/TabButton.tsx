export function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-md text-sm font-medium transition
        ${
          active
            ? "bg-background text-foreground shadow"
            : "text-muted-foreground hover:bg-muted"
        }`}
    >
      {children}
    </button>
  );
}
