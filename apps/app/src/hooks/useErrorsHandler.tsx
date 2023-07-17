const useErrorsHandler = () => {
  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    // TODO: Sentry report
    // TODO: Show notification
  };

  return { handleError };
};

export default useErrorsHandler;
