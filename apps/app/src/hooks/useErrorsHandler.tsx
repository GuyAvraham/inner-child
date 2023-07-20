import Toast from "react-native-root-toast";

const useErrorsHandler = () => {
  const handleError = (error: unknown, message?: string) => {
    console.error(message || (error as Error).message, error);

    Toast.show((error as Error).message, {
      duration: Toast.durations.SHORT,
      animation: true,
    });
    // TODO: Sentry report
    // TODO: Show notification
  };

  return { handleError };
};

export default useErrorsHandler;
