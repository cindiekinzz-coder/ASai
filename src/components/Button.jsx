// src/components/Button.jsx
export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium " +
        "bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-900 transition " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
