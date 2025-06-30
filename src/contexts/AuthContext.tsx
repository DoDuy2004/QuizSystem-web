import * as React from "react";
import {
  useEffect,
  useState,
  type ReactNode,
  createContext,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import jwtService from "../services/auth/jwtService";
import { showMessage } from "../components/FuseMessage/fuseMessageSlice";
import { type AppDispatch } from "../store/store";
import { selectUser, setUser, userLoggedOut } from "../store/slices/userSlice";
import { Box, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean | undefined;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [waitAuthCheck, setWaitAuthCheck] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const shouldNavigateToClass = (pathname: string): boolean => {
    const excludedRoutes = ["/my-account", "/workspace"];
    return !excludedRoutes.some((route) => pathname.startsWith(route));
  };

  useEffect(() => {
    let shouldRedirect = true;

    jwtService.on("onAutoLogin", () => {
      jwtService
        .signInWithToken()
        .then((user: any) => {
          success(user);
          shouldRedirect = false;
        })
        .catch((error: any) => {
          pass(error.message);
        });
      if (shouldNavigateToClass(location.pathname) && shouldRedirect) {
        user?.role !== "ADMIN"
          ? navigate("/workspace/class")
          : navigate("/manage/dashboard");
      }
    });

    jwtService.on("networkError", () => {
      dispatch(showMessage({ message: "Network Error" }));
    });

    jwtService.on("serverError", () => {
      dispatch(showMessage({ message: "Oops, something went wrong" }));
    });

    jwtService.on("badRequest", () => {
      dispatch(showMessage({ message: "Bad Request" }));
    });

    jwtService.on("onLogin", (user: any) => {
      success(user);
    });

    jwtService.on("onLogout", () => {
      dispatch(userLoggedOut());
      navigate("/auth/login");
    });

    jwtService.on("onAutoLogout", (message: string) => {
      pass(message);
      dispatch(userLoggedOut());
      navigate("/auth/login");
    });

    jwtService.on("onNoAccessToken", () => {
      pass();
      navigate("/");
    });

    jwtService.init();

    function success(user: any, message?: string): void {
      if (message) {
        dispatch(showMessage({ message }));
      }

      // console.log("user: ", user);

      Promise.all([dispatch(setUser(user))]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message?: string): void {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <CircularProgress />
    </Box>
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
