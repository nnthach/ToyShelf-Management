import { cn } from "@/src/styles/lib/utils";
import { ProductCategory } from "@/src/types";
import { Controller, useFormContext } from "react-hook-form";

function MultiSelectCategory({
  name,
  options,
}: {
  name: string;
  options: ProductCategory[];
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [], onChange }, fieldState }) => (
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-2">
            {options.map((cat) => {
              const isSelected = value.includes(cat.name);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    const newValue = isSelected
                      ? value.filter((name: string) => name !== cat.name)
                      : [...value, cat.name];

                    onChange(newValue);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300",
                    fieldState.error && "border-red-500",
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {fieldState.error && (
            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default MultiSelectCategory;
