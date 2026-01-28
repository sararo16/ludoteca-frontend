import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Game } from "./pages/Game/Game";
import { Author } from "./pages/Author/Author";
import { Category } from "./pages/Category/Category";
import Client from "./pages/Client/Client";
import Prestamo  from "./pages/Prestamo/Prestamo";
import { Layout } from "./components/Layout";
import { Provider } from "react-redux";
import { LoaderProvider } from "./context/LoaderProvider";
import { store } from "./redux/store";
function App() {
  return (
    <LoaderProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index path="games" element={<Game />} />
              <Route path="categories" element={<Category />} />
              <Route path="authors" element={<Author />} />
              <Route path="clients" element ={<Client/>} />
              <Route path="prestamo" element ={<Prestamo/>} />
              <Route path="*" element={<Navigate to="/games" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
      </LoaderProvider>
  );
}

export default App;
