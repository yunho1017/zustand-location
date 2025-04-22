export const Logger = {
  warning: (...data: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...data);
    }
  },
};

