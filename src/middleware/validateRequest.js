export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      //   const errorMessage = result.error?.errors?.map((err) => err.message);
      //   const error = errorMessage?.join(", ");
      //   return res.status(400).json({ message: error });

      const formatted = result.error.format();
      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      console.log(flatErrors);
      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    next();
  };
};
