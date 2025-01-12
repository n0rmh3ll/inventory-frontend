import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/inventory', {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  }
);

export const addItem = createAsyncThunk(
  'inventory/addItem',
  async (item: Omit<InventoryItem, '_id'>) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/api/inventory', item, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  }
);

export const updateItem = createAsyncThunk(
  'inventory/updateItem',
  async (item: InventoryItem) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5000/api/inventory/${item._id}`, item, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  }
);

export const deleteItem = createAsyncThunk(
  'inventory/deleteItem',
  async (id: string) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
      headers: { 'x-auth-token': token },
    });
    return id;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch inventory';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default inventorySlice.reducer;

