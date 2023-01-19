import { useRef, useState, useEffect } from "react";
import { errorsObject } from "../../constants/input-constants";
import "./CustomInput.css";

const CustomInput = ({
  type = "text",
  label = "You forgot the label property",
  control,
  onChange,
  labelAsPlaceholder = true,
  allowSpecialCharacters = true,
  allowNumeric = true,
  numbersOnly = false,
  required = false,
  maxLength,
  minLength,
  maxValue,
  minValue,
  rows,
  columns,
}) => {
  // Regex
  const specialCharactersRegex = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
  const numericRegex = /[0-9]/;
  const numbersOnlyRegex = /^-?([0-9]*)(\.?)[0-9]*$/;

  // References
  const inputRef = useRef(null);

  // State hooks
  const [_type, setType] = useState("text");
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inFocus, setInFocus] = useState(false);

  const setControl = (control) => {
    setValue(control.value);
    setErrors(control.errors);
    setIsValid(control.isValid);
    setTouched(control.touched);
  };

  useEffect(() => {
    setControl(control);
    setType(type);
    const { value, errors, touched } = control;
    if (required && !value.length && !errors.includes("requiredError")) {
      onChange({
        value,
        isValid: false,
        errors: errors.concat("requiredError"),
        touched,
      });
    }
  }, []);

  useEffect(() => {
    setControl(control);
    if (control.value.length) setInFocus(true);
  }, [control]);

  useEffect(() => {
    setType(type);
  }, [type]);

  // Basically not update the value if any of the conditions are true
  const doNotUpdateValueCheck = (newValue, isValid, errors) => {
    if (
      (!allowNumeric && numericRegex.test(newValue)) ||
      (!allowSpecialCharacters && specialCharactersRegex.test(newValue)) ||
      (numbersOnly && !numbersOnlyRegex.test(newValue))
    ) {
      return true;
    }
    return false;
  };

  const handleOnFocus = (event) => {
    setInFocus(true);
  };

  const handleOnBlur = (event) => {
    if (!event.target.value) setInFocus(false);
    handleChange(event);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    let _isValid = true;
    let _errors = [];

    if (required && !newValue.length) {
      _errors.push("requiredError");
    }
    if (
      (maxLength !== null || maxLength !== undefined) &&
      newValue.length > maxLength
    ) {
      _errors.push("maxLengthError");
    }
    if (
      (minLength !== null || minLength !== undefined) &&
      newValue.length < minLength
    ) {
      _errors.push("minLengthError");
    }
    if (
      numbersOnly &&
      (maxValue !== null || maxValue !== undefined) &&
      Number(newValue) > maxValue
    ) {
      _errors.push("maxValueError");
    }
    if (
      numbersOnly &&
      (minValue !== null || minValue !== undefined) &&
      Number(newValue) < minValue
    ) {
      _errors.push("minValueError");
    }

    if (_errors.length > 0) _isValid = false;

    if (doNotUpdateValueCheck(newValue, _isValid, _errors)) {
      return;
    }

    setControl({
      value: newValue,
      isValid: _isValid,
      errors: _errors,
      touched: true,
    });

    onChange({
      value: newValue,
      isValid: _isValid,
      errors: _errors,
      touched: true,
    });
  };

  const handleLabelClick = () => {
    if (labelAsPlaceholder) inputRef.current.focus();
  };

  const getErrorMessage = () => {
    return touched && errors && errors.length
      ? typeof errorsObject[errors[0]] === "function"
        ? errorsObject[errors[0]]({ maxLength, minLength, maxValue, minValue })
        : errorsObject[errors[0]]
      : "";
  };

  return (
    <div>
      <div>
        <div className="d-flex justify-content-between">
          {type === "textarea" ? (
            <textarea
              ref={inputRef}
              type={_type}
              value={value}
              onChange={handleChange}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
              placeholder=" "
              rows={rows}
              cols={columns}
              className={`form-control input-style ${
                labelAsPlaceholder ? "" : "mt-3"
              } ${touched && !isValid ? "input-error" : ""} ${
                type === "password" ? "input-style-password" : ""
              }`}
            />
          ) : (
            <input
              ref={inputRef}
              type={_type}
              value={value}
              onChange={handleChange}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
              placeholder=" "
              className={`form-control input-style ${
                labelAsPlaceholder ? "" : "mt-3"
              } ${touched && !isValid ? "input-error" : ""} ${
                type === "password" ? "input-style-password" : ""
              }`}
            ></input>
          )}
          {type === "password" ? (
            <div
              onClick={() => {
                !showPassword ? setType("text") : setType("password");
                setShowPassword(!showPassword);
              }}
              className="show-hide"
            >
              <span className="show-hide-text">
                {" "}
                {showPassword ? "hide" : "show"}
              </span>
            </div>
          ) : (
            <></>
          )}
          <label
            htmlFor="value"
            onClick={handleLabelClick}
            className={`form-label label-style ${
              labelAsPlaceholder ? "label-as-placeholder" : "label-above-input"
            } ${inFocus ? "label-on-input-focus" : ""}`}
          >
            {label}
            {required ? <span>*</span> : <span></span>}
          </label>
        </div>
      </div>
      <div className="error-style">
        <span className="form-text">{getErrorMessage()}</span>
      </div>
    </div>
  );
};

export default CustomInput;
