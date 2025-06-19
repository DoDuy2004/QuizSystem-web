import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "../store/store";
import AppLayout from "../layouts/AppLayout";

function App() {
  // const AppContextValue = {
  //   routes,
  // };
  return (
    <StrictMode>
      {/* <AppContext> */}
      <Provider store={store}>
        <AppLayout />
      </Provider>
      {/* </AppContext> */}
    </StrictMode>
  );
}

export default App;
