import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '../../types';

export interface UserState {
  data: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk<UserData>(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return rejectWithValue('Sessão inválida ou sem permissão para acessar dados de usuário.');
        }
        return rejectWithValue('Falha ao buscar dados de usuário.');
      }
      const data = await response.json();
      return data;
    } catch {
      return rejectWithValue('Falha ao buscar dados de usuário.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;