function Loading() {
  return (
    <div className="flex items-center justify-center w-full aspect-square">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default Loading;
