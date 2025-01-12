import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, addItem, updateItem, deleteItem } from '../store/inventorySlice';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.inventory);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0 });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(addItem(newItem));
    setNewItem({ name: '', quantity: 0, price: 0 });
  };

  return (
    <div className="dashboard">
      <h1>Inventory Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} - ${item.price}
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default Dashboard;
