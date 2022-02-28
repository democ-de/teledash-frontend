import { Checkbox, TextInputGroup } from "components/Form";
import { FormGroup } from "components/Form/FormGroup";
import { useFormContext } from "react-hook-form";
import { SearchFormInputs } from "..";

const userFlags: {
  [key: string]: string;
  name: keyof SearchFormInputs["users"];
}[] = [
  {
    id: "is-deleted-field",
    name: "is_deleted",
    label: "Is deleted",
    hint: "Users that are deleted.",
  },
  {
    id: "is-bot-field",
    name: "is_bot",
    label: "Is bot",
    hint: "Users that are bots.",
  },
  {
    id: "is-verified-field",
    name: "is_verified",
    label: "Is verified",
    hint: "Users that have been verified by Telegram.",
  },
  {
    id: "is-restricted-field",
    name: "is_restricted",
    label: "Is restricted",
    hint: "Users that have been restricted. Bots only. See restriction_reason for details.",
  },
  {
    id: "is-scam-field",
    name: "is_scam",
    label: "Is scam",
    hint: "Users that have been flagged for scam.",
  },
  {
    id: "is-fake-field",
    name: "is_fake",
    label: "Is fake",
    hint: "Users that have been flagged for impersonation.",
  },
  {
    id: "is-support-field",
    name: "is_support",
    label: "Is support",
    hint: "Users that are part of the Telegram support team.",
  },
];

export function UserFilter({ className }: { className?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SearchFormInputs>();

  return (
    <div className={`space-y-5 divide-y divide-gray-200 ${className}`}>
      <TextInputGroup
        id="phone-number-field"
        layout="row"
        type="tel"
        label="Phone number"
        registration={register("users.phone_number")}
        error={errors["users"]?.phone_number}
      />
      <FormGroup label="Flags" layout="row" className="pt-5">
        <div className="space-y-4">
          {userFlags.map(({ id, name, label, hint }) => (
            <Checkbox
              key={id}
              id={id}
              label={label}
              hint={hint}
              defaultChecked={false}
              registration={register(`users.${name}`)}
            />
          ))}
        </div>
      </FormGroup>
    </div>
  );
}
