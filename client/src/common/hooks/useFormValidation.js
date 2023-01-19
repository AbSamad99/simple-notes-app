import useNotification from "./useNotification";

const useFormValidation = () => {
  const { addNotification } = useNotification();

  const validateForm = (form) => {
    const keys = Object.keys(form);
    const valid = keys.every((key) => form[key].control.isValid);
    if (!valid) {
      Object.keys(form).forEach((key) => {
        const requiredObj = form[key];
        requiredObj.set({
          ...requiredObj.control,
          touched: true,
        });
      });
      addNotification(["E00_05"]);
      return false;
    }
    return true;
  };

  return { validateForm };
};

export default useFormValidation;
