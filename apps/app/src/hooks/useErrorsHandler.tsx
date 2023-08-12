const useErrorsHandler = () => {
  const handleError = (error: unknown, message?: string) => {
    console.error(message || (error as Error).message, error);
  };

  // TODO: make it to show a modal with an error

  return { handleError };
};

export default useErrorsHandler;
