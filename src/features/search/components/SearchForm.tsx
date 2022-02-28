import clsx from "clsx";
import { TextInputGroup } from "components/Form";
import { RadioGroup } from "components/Form/RadioGroup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ChatFilter } from "./ChatFilter";
import { Button } from "components/Elements";
import { Transition } from "@headlessui/react";
import { mdiCloseCircle, mdiFilter, mdiMagnify } from "@mdi/js";
import { debounce, isBoolean, startCase } from "lodash";
import { MessageFilter } from "./MessageFilter";
import { GetChatsParams, GetMessagesParams, GetUsersParams } from "types";
import { UserFilter } from "./UserFilter";
import {
  ActiveFilterBadges,
  FilterKeys,
  SearchFormInputs,
  UpdateFiltersOptions,
} from "..";
import { FilterOptions } from "../stores";

const parseOutgoingValues = (params?: {
  [key: string]: any;
}): GetChatsParams | GetMessagesParams | GetUsersParams | undefined => {
  if (!params) {
    return params;
  }

  const sanitizeRecursive = (obj: { [key: string]: any }) => {
    const result: {
      [key: string]: string | number | true | number[] | string[];
    } = {};
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let value = obj[key];

      // skip falsy values
      if (
        value === undefined ||
        value === "" ||
        (isBoolean(value) && value === false) ||
        Number.isNaN(value)
      ) {
        return;
      }

      // recursivly remove falsy values
      if (Array.isArray(value)) {
        const recursiveResult = value
          .map((v) => sanitizeRecursive(v))
          .filter((v) => Object.keys(v).length)
          .map((v) => (typeof v.value !== "undefined" ? v.value : v)); // make array flat

        if (!recursiveResult.length) {
          return;
        }

        value = recursiveResult;
      }

      result[key] = value;
    });
    return result;
  };

  return sanitizeRecursive(params);
};

type SearchFormProps = {
  filterKey: FilterKeys;
  onFilterKeyChange: (key: FilterKeys) => void;
  filterOptions: FilterOptions;
  onFilterUpdate: (options: UpdateFiltersOptions) => void;
};

export const SearchForm = ({
  filterKey,
  onFilterKeyChange,
  filterOptions,
  onFilterUpdate,
}: SearchFormProps) => {
  const methods = useForm<SearchFormInputs>({
    mode: "onChange",
  });
  const {
    watch,
    register,
    setValue,
    getValues,
    resetField,
    formState: { errors, isValid },
  } = methods;
  const [isShowingFilterPanel, setIsShowingFilterPanel] = useState(false);
  const handleFilterChange = useCallback(
    (key) => {
      if (!isValid) {
        return;
      }

      onFilterUpdate({
        key,
        params: parseOutgoingValues(getValues(key)),
      } as UpdateFiltersOptions); // TODO: improve generic type hintsexport * from "./Button";
    },
    [getValues, isValid, onFilterUpdate]
  );
  const handleFilterChangeDebounced = useMemo(
    () => debounce(() => handleFilterChange(filterKey), 300),
    [filterKey, handleFilterChange]
  );

  // watch input change and update params
  useEffect(() => {
    const subscription = watch(handleFilterChangeDebounced);
    return () => subscription.unsubscribe();
  }, [handleFilterChangeDebounced, watch]);

  // set values on mount if there are any in filterOptions
  useEffect(() => {
    const parseIncomingValues = () => {
      for (let [filterKey, filterValues] of Object.entries(filterOptions)) {
        if (filterValues) {
          for (let [optionKey, optionValue] of Object.entries(filterValues)) {
            const value = Array.isArray(optionValue)
              ? optionValue.map((v) => ({ value: v }))
              : optionValue;
            setValue(`${filterKey}.${optionKey}` as any, value);
          }
        }
      }
    };

    parseIncomingValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // destroy debounce handler on unmount
  useEffect(() => {
    return () => handleFilterChangeDebounced.cancel();
  }, [handleFilterChangeDebounced]);

  return (
    <div>
      <div className="space-y-4 lg:space-y-0 lg:space-x-4 lg:flex">
        <div className="flex w-full">
          {(Object.keys(filterOptions) as Array<FilterKeys>).map((key) => (
            <TextInputGroup
              key={key}
              id={`search-field-${key}`}
              className={clsx("w-full lg:justify-end", {
                hidden: key !== filterKey,
              })}
              hiddenLabel
              type="search"
              label="Search text"
              startIcon={mdiMagnify}
              placeholder={`Type to search for ${key}…`}
              registration={register(`${key}.search`, {
                minLength: 2,
              })}
              error={errors[key]?.search}
            />
          ))}
        </div>
        <div className="space-y-4 divide-y divide-gray-200 sm:divide-x-0 sm:space-y-0 sm:divide-y-0 sm:flex sm:items-end sm:justify-between lg:justify-start lg:space-x-4">
          <RadioGroup
            label="Search for"
            hiddenLabel
            value={filterKey}
            onChange={(val: FilterKeys) => {
              onFilterKeyChange(val);
              handleFilterChange(val);
            }}
            options={Object.keys(filterOptions).map((key) => ({
              label: startCase(key),
              value: key,
            }))}
          />
          <div className="pt-4 sm:pt-0">
            <Button
              startIcon={isShowingFilterPanel ? mdiCloseCircle : mdiFilter}
              variant={isShowingFilterPanel ? "secondaryActive" : "secondary"}
              onClick={() => setIsShowingFilterPanel((isShowing) => !isShowing)}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="mt-4">
        <Transition
          show={isShowingFilterPanel}
          unmount={false}
          as="div"
          className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <FormProvider {...methods}>
            <h2 className="text-lg sm:text-xl font-bold mb-6">Filter</h2>
            <ChatFilter
              className={clsx(filterKey === "chats" ? "block" : "hidden")}
            />
            <MessageFilter
              className={clsx(filterKey === "messages" ? "block" : "hidden")}
            />
            <UserFilter
              className={clsx(filterKey === "users" ? "block" : "hidden")}
            />
          </FormProvider>
        </Transition>
      </div>

      <ActiveFilterBadges
        activeOptions={filterOptions[filterKey]}
        onRemoveFilter={(key) => {
          resetField(`${filterKey}.${key}` as any);
        }}
      />
    </div>
  );
};
