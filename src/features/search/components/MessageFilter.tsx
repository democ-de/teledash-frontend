import {
  Checkbox,
  FormGroup,
  Repeater,
  SelectInputGroup,
  TextInput,
} from "components/Form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SearchFormInputs } from "..";

const dateInputOptions = {
  setValueAs: (v: string) => {
    if (!v) {
      return undefined;
    }

    // convert to UTC date in ISO 8601 format
    return new Date(v).toISOString();
  },
  pattern: {
    value: /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/,
    message: "Please enter a date and time (YYYY-MM-DDThh:mm)",
  },
};

export function MessageFilter({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SearchFormInputs>();
  const from_user_ids = useFieldArray({
    name: "messages.from_user_ids",
    control,
  });
  const chat_ids = useFieldArray({
    name: "messages.chat_ids",
    control,
  });

  return (
    <div className={`space-y-5 divide-y divide-gray-200 ${className}`}>
      <FormGroup
        label="From user id(s)"
        layout="row"
        description="A numeric Telegram user id."
      >
        <Repeater
          inputType="number"
          fields={from_user_ids.fields}
          onRegister={(index) =>
            register(`messages.from_user_ids.${index}.value`, {
              valueAsNumber: true,
            })
          }
          onAppend={() => from_user_ids.append({ value: undefined })}
          onRemove={(index) => from_user_ids.remove(index)}
        />
      </FormGroup>
      <FormGroup
        label="In chat id(s)"
        layout="row"
        description="A numeric Telegram chat id."
        className="pt-5"
      >
        <Repeater
          inputType="number"
          fields={chat_ids.fields}
          onRegister={(index) =>
            register(`messages.chat_ids.${index}.value`, {
              valueAsNumber: true,
            })
          }
          onAppend={() => chat_ids.append({ value: undefined })}
          onRemove={(index) => chat_ids.remove(index)}
        />
      </FormGroup>
      <SelectInputGroup
        label="Attachment type"
        id="attachment-type-field"
        layout="row"
        className="pt-5"
        options={[
          { label: "All", value: "" },
          { label: "Audio", value: "audio" },
          { label: "Document", value: "document" },
          { label: "Photo", value: "photo" },
          { label: "Sticker", value: "sticker" },
          { label: "Video", value: "video" },
          { label: "Animation", value: "animation" },
          { label: "Voice", value: "voice" },
          { label: "Video_note", value: "video_note" },
          { label: "Contact", value: "contact" },
          { label: "Location", value: "location" },
          { label: "Venue", value: "venue" },
          { label: "Poll", value: "poll" },
          { label: "Web page", value: "web_page" },
          { label: "Dice", value: "dice" },
          { label: "Game", value: "game" },
        ]}
        defaultValue=""
        registration={register("messages.attachment_type")}
      />
      <FormGroup
        label="Time range"
        layout="row"
        description="Filter messages within a time range."
        className="pt-5"
      >
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <FormGroup label="From" layout="block">
            <TextInput
              type="datetime-local"
              registration={register("messages.date_from", dateInputOptions)}
              error={errors["messages"]?.date_from}
            />
          </FormGroup>
          <FormGroup label="To" layout="block">
            <TextInput
              type="datetime-local"
              registration={register("messages.date_to", dateInputOptions)}
              error={errors["messages"]?.date_to}
            />
          </FormGroup>
        </div>
      </FormGroup>
      <FormGroup
        id="is-empty-field"
        label="Flags"
        layout="row"
        className="pt-5"
      >
        <Checkbox
          id="is-empty-field"
          label="Is empty"
          hint='Messages that are "empty" are deleted messaged.'
          defaultChecked={false}
          registration={register("messages.is_empty")}
        />
      </FormGroup>
    </div>
  );
}
