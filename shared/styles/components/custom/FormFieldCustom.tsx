import { Input } from "@/shared/styles/components/ui/input";
import { Textarea } from "@/shared/styles/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useFormContext } from "react-hook-form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { SelectOption } from "@/shared/types/SubType";

type RHFField = ControllerRenderProps<FieldValues, string>;

type FieldType = "text" | "number" | "textarea" | "select";

interface FormFieldProps {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  selectData?: SelectOption[];
}

const renderFieldByType = (
  type: FieldType,
  field: RHFField,
  placeholder?: string,
  selectData?: SelectOption[]
) => {
  switch (type) {
    case "textarea":
      return <Textarea {...field} id={field.name} placeholder={placeholder} />;

    case "select":
      return (
        <select
          {...field}
          id={field.name}
          className="border border-gray-300 rounded-md h-[36px] w-full px-2"
        >
          {selectData?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    default:
      return (
        <Input
          {...field}
          id={field.name}
          type={type}
          placeholder={placeholder}
        />
      );
  }
};

export function FormFieldCustom({
  name,
  label,
  type = "text",
  placeholder,
  selectData,
}: FormFieldProps) {
  const { control } = useFormContext();

  return (
    <FieldGroup>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1">
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            {renderFieldByType(type, field, placeholder, selectData)}

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
