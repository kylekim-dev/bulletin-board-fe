import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/slices/counterSlice';
import globalReducer from '@/slices/globalSlice';
import userReducer from '@/slices/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    global: globalReducer,
    user: userReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch