import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "../store/store";
import AppLayout from "../layouts/AppLayout";
import { AuthProvider } from "../contexts/AuthContext";

function App() {
  // const AppContextValue = {
  //   routes,
  // };
  return (
    <>
      <StrictMode>
        {/* <AppContext> */}
        <Provider store={store}>
          <AuthProvider>
            <AppLayout />
          </AuthProvider>
        </Provider>
        {/* </AppContext> */}
      </StrictMode>
    </>
  );
}

export default App;
