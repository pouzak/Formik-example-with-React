import React, { useState, useCallback, useRef } from "react";
import "./App.css";
// import produce from "immer";
import {
  TextField,
  Button,
  Checkbox,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  Menu
} from "@material-ui/core";
import {
  Formik,
  Field,
  Form,
  useField,
  FieldAttributes,
  FieldArray
} from "formik";
import * as yup from "yup";

type MyRadioProps = { label: string } & FieldAttributes<{}>;

const validationSchem = yup.object({
  firstName: yup
    .string()
    .required()
    .max(10),
  pets: yup.array().of(
    yup.object({
      name: yup.string().required()
    })
  )
});
const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);
  //field.name, filed,onChange...
  return <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const MyTextField: React.FC<FieldAttributes<{}>> = ({
  placeholder,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
    />
  );
};

const App: React.FC = () => {
  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          isStupid: false,
          cookies: [],
          Yoghurt: "kiwi",
          pets: [{ type: "cat", name: "Jimmy", id: "" + Math.random() }]
        }}
        validationSchema={validationSchem}
        // validate={values => {
        //   const errors: Record<string, string> = {};
        //   if (values.firstName.includes("bob")) {
        //     errors.firstName = "no bob allowed";
        //   }
        //   return errors;
        // }}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          setTimeout(() => {
            console.log(data);
            setSubmitting(false);
            resetForm();
          }, 1000);
        }}
      >
        {({
          values,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit
        }) => (
          <Form>
            {/* <TextField
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}
            {/* <Field
              placeholder="First name"
              name="firstName"
              type="input"
              as={TextField}
            /> */}
            <MyTextField
              placeholder="First name"
              name="firstName"
              type="input"
            />
            <br />
            {/* <TextField
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}
            <Field
              placeholder="Last name"
              name="lastName"
              type="input"
              as={TextField}
            />
            <br />
            <p>Are you stupid?</p>
            <Field name="isStupid" type="checkbox" as={Checkbox} />
            <br />
            <p> Select fav coockies:</p>
            <Field
              name="cookies"
              value="schocolate"
              type="checkbox"
              as={Checkbox}
            />
            <Field
              name="cookies"
              value="with razynkos"
              type="checkbox"
              as={Checkbox}
            />
            <Field name="cookies" value="selga" type="checkbox" as={Checkbox} />
            <br />
            Yoghurt:
            <br />
            <MyRadio name="Yoghurt" type="radio" value="peach" label="peach" />
            <MyRadio name="Yoghurt" type="radio" value="apple" label="apple" />
            <MyRadio name="Yoghurt" type="radio" value="kiwi" label="kiwi" />
            <br />
            <p>Pet you have:</p>
            <br />
            <FieldArray name="pets">
              {arrayHelpers => (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      arrayHelpers.push({
                        type: "fish",
                        name: "",
                        id: "" + Math.random()
                      })
                    }
                  >
                    add
                  </button>
                  {values.pets.map((pet, index) => {
                    // const name = `pets.${index}.name`;
                    return (
                      <div key={pet.id}>
                        <MyTextField
                          placeholder="pet name"
                          name={`pets.${index}.name`}
                        />
                        <Field
                          type="select"
                          as={Select}
                          name={`pets.${index}.type`}
                        >
                          <MenuItem value="cat">Cat</MenuItem>
                          <MenuItem value="dog">Dog</MenuItem>
                          <MenuItem value="fish">Fish</MenuItem>
                        </Field>
                        <Button
                          onClick={() => {
                            arrayHelpers.remove(index);
                          }}
                        >
                          x
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </FieldArray>
            <br />
            <Button
              disabled={isSubmitting}
              variant="contained"
              color={Object.keys(errors).length === 0 ? "primary" : "secondary"}
              type="submit"
            >
              submit
            </Button>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
