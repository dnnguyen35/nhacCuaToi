import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import themeConfigs from "./configs/theme.configs";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import routes from "./routes/routes";
import PageWrapper from "./components/PageWrapper";
import AdminPage from "./pages/Admin/AdminPage";
import AudioPlayer from "./components/AudioPlayer";

import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./components/PageNotFound";

const App = () => {
  const { themeMode } = useSelector((state) => state.themeMode);

  return (
    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
      <AudioPlayer />

      {/* config toastify */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme={themeMode}
        style={{ top: "7rem" }}
      />
      {/* mui reset css */}
      <CssBaseline />
      {/* mui reset css */}

      {/* app routes */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {routes.map((route, index) =>
              route.index ? (
                <Route
                  index
                  key={index}
                  element={
                    route.state ? (
                      <PageWrapper state={route.state}>
                        {route.element}
                      </PageWrapper>
                    ) : (
                      route.element
                    )
                  }
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={
                    route.state ? (
                      <PageWrapper state={route.state}>
                        {route.element}
                      </PageWrapper>
                    ) : (
                      route.element
                    )
                  }
                />
              )
            )}

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
      {/* app routes */}
    </ThemeProvider>
  );
};

export default App;
