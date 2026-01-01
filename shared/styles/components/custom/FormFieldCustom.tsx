import { Input } from "@/shared/styles/components/ui/input";
import { Textarea } from "@/shared/styles/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useFormContext } from "react-hook-form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { SelectOption } from "@/shared/types/SubType";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { Loader2 } from "lucide-react";

type RHFField = ControllerRenderProps<FieldValues, string>;

type FieldType = "text" | "number" | "textarea" | "select";

type CommonFieldProps =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>;

type FormFieldProps = CommonFieldProps & {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  selectData?: SelectOption[];
  loading?: boolean;
};
const renderFieldByType = (
  type: FieldType,
  field: RHFField,
  placeholder?: string,
  selectData?: SelectOption[],
  props?: CommonFieldProps
) => {
  switch (type) {
    case "textarea":
      return (
        <Textarea
          {...field}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={field.name}
          placeholder={placeholder}
        />
      );

    case "select":
      return (
        <select
          {...field}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          id={field.name}
          className={`border border-gray-300 rounded-md h-[36px] w-full px-2 ${
            props?.className ?? ""
          }`}
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
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
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
  loading,
  ...props
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

            {/* Wrapper để đặt spinner */}
            <div className="relative">
              {renderFieldByType(type, field, placeholder, selectData, {
                ...props,
                className: `${props.className ?? ""} ${loading ? "pr-10" : ""}`,
              })}

              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
