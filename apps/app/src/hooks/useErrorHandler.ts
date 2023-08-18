const useErrorHandler = () => {
  const handleError = (error: unknown, message?: string) => {
    console.log(message ?? (error as Error).message);
    console.trace(error);
  };

  return {
    handleError,
  };
};

export default useErrorHandler;
