export default function StockStats() {
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#fdc501]">
        <h3 className="text-gray-500 text-sm">Total Items</h3>
        <p className="text-2xl font-bold">1,234</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#fdc501]">
        <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
        <p className="text-2xl font-bold text-red-500">23</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#fdc501]">
        <h3 className="text-gray-500 text-sm">Categories</h3>
        <p className="text-2xl font-bold">8</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#fdc501]">
        <h3 className="text-gray-500 text-sm">Total Value</h3>
        <p className="text-2xl font-bold">$52,234</p>
      </div>
    </>
  );
}
