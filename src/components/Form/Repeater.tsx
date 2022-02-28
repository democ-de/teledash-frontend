import { Button } from "components/Elements";
import { FieldArrayWithId, UseFormRegisterReturn } from "react-hook-form";
import { TextInput, TextInputProps } from "./TextInput";

type RepeaterProps = {
  fields: FieldArrayWithId[];
  inputType: TextInputProps["type"];
  onRegister: (index: number) => Partial<UseFormRegisterReturn>;
  onAppend: () => void;
  onRemove: (index: number) => void;
};

export const Repeater = ({
  fields,
  inputType,
  onRegister,
  onAppend,
  onRemove,
}: RepeaterProps) => {
  return (
    <div className="space-y-4">
      {!fields.length && (
        <Button variant="secondary" onClick={onAppend}>
          Add
        </Button>
      )}
      {fields.map((item, index) => (
        <div key={item.id} className="flex space-x-2">
          <TextInput
            type={inputType}
            className="flex-grow"
            registration={onRegister(index)}
          />
          <Button variant="secondary" onClick={() => onRemove(index)}>
            -
          </Button>
          {index === fields.length - 1 && (
            <Button variant="secondary" onClick={onAppend}>
              +
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
