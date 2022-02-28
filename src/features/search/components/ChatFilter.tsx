import { Checkbox, SelectInputGroup } from "components/Form";
import { FormGroup } from "components/Form/FormGroup";
import { useFormContext } from "react-hook-form";
import { SearchFormInputs } from "..";

export function ChatFilter({ className }: { className?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SearchFormInputs>();

  return (
    <div className={`space-y-5 divide-y divide-gray-200 ${className}`}>
      <SelectInputGroup
        id="chat-type-field"
        label="Chat type"
        layout="row"
        error={errors["chats"]?.type}
        options={[
          { label: "All", value: "" },
          { label: "Group", value: "group" },
          { label: "Supergroup", value: "supergroup" },
          { label: "Channel", value: "channel" },
        ]}
        defaultValue=""
        registration={register("chats.type")}
      />
      <FormGroup label="Flags" layout="row" className="pt-5">
        <div className="space-y-4">
          <Checkbox
            id="is-verified"
            label="Is verified"
            hint="Chats that have been verified by Telegram. Supergroups, channels and bots only."
            defaultChecked={false}
            registration={register("chats.is_verified")}
          />
          <Checkbox
            id="is-restricted"
            label="Is restricted"
            hint="Chats that have been restricted. Supergroups, channels and bots only."
            defaultChecked={false}
            registration={register("chats.is_restricted")}
          />
          <Checkbox
            id="is-scam"
            label="Is scam"
            hint="Chats that have flagged for scam."
            defaultChecked={false}
            registration={register("chats.is_scam")}
          />
          <Checkbox
            id="is-fake"
            label="Is fake"
            hint="Chats that have flagged for impersonation."
            defaultChecked={false}
            registration={register("chats.is_fake")}
          />
        </div>
      </FormGroup>
    </div>
  );
}
