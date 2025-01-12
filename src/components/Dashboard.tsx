import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../store/inventorySlice';
import { RootState } from '../store';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return (
    <div className="dashboard">
      <h1>Inventory Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {items.map((item: InventoryItem) => (
          <li key={item._id}>
            {item.name} - {item.quantity} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
