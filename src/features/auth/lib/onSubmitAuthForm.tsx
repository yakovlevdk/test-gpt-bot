import { useDispatch } from "react-redux";
import { login, logout, setError } from "../model/userSlice";

export const useAuthActions = () => {
  const dispatch = useDispatch();

  const onSubmitAuthForm = ({ email, password }: { email: string; password: string }) => {
    try {
      if (email && password) {
        dispatch(login({ email, password }));
        console.log("Успешный вход");
      } else {
        throw new Error("Ошибка входа");
      }
    } catch (error) {
     dispatch(setError((error as Error).message));
    }
  };
  const onLogout = () => {
    dispatch(logout());
    console.log("Выход из аккаунта");
  };
  return { onSubmitAuthForm, onLogout};
};
