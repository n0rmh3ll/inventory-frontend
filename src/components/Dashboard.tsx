import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, addItem, updateItem, deleteItem } from '../store/inventorySlice';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.inventory);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0 });
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addItem(newItem));
    setNewItem({ name: '', quantity: 0, price: 0 });
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateItem(editingItem));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    dispatch(deleteItem(id));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Inventory Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleAddItem} className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
            Add Item
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white shadow rounded-lg p-4">
            {editingItem && editingItem._id === item._id ? (
              <form onSubmit={handleUpdateItem}>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

