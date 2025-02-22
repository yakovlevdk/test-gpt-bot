import "./App.css";
import { RootState } from "./app/providers/StoreProvider/store";
import { AuthForm } from "./features/auth/ui/auth-form";
import { useSelector } from "react-redux";
import { Chat } from "./features/chat/chat";

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <div className="app-container">
      {!isAuthenticated && (
        <div className="auth-container">
          <AuthForm />
        </div>
      )}
      {isAuthenticated && <Chat />}
    </div>
  );
}

export default App;
