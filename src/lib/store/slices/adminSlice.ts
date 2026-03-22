import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminData } from '../../types';

export interface AdminState {
  data: AdminData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAdminData = createAsyncThunk<AdminData>(
  'admin/fetchAdminData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin');
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return rejectWithValue('Sessão inválida ou sem permissão para acessar dados de admin.');
        }
        return rejectWithValue('Falha ao buscar dados de admin.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Falha ao buscar dados de admin.');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminData: (state, action: PayloadAction<AdminData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearAdmin: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action: PayloadAction<AdminData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAdminData, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;