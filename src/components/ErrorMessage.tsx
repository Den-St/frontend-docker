interface ErrorMessageProps {
  error: unknown;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;

  let message = 'Сталася помилка.'; // Default error message

  // Handle different error structures
  if (typeof error === 'string') {
    message = error;
  } else if ((error as any)?.response?.data?.message) {
    message = (error as any).response.data.message;
  } else if ((error as any)?.message) {
    message = (error as any).message;
  }

  return (
    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
      <p>{message}</p>
    </div>
  );
};