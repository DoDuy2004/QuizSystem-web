import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Layout from "./layouts/Layout";

function App() {
  // const AppContextValue = {
  //   routes,
  // };
  return (
    <StrictMode>
      {/* <AppContext> */}
      <Provider store={store}>
        <Layout />
      </Provider>
      {/* </AppContext> */}
    </StrictMode>
  );
}

export default App;
