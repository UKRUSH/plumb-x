export const metadata = {
  title: "Inventory Management System",
  description: "System for managing inventory",
};

export default function InventoryLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 