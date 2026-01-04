"use client";

import React, { useEffect, useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { isEmpty, isNull } from "lodash";
import { useDebouncedText } from "@/utill/useDebouncedText";

export interface AsyncAutocompleteProps<T> {
  options: T[];
  value: T | null;
  loading: boolean;
  fullWidth: boolean;
  error?: string;
  disabled?: boolean;
  searchDelay?: number;
  optionsMaxHeight?: number;
  placeHolder: string;
  onChange: (value: T | null) => void;
  onSearch: (searchKey?: string) => void;
  onFetchOptions: () => void;
  displayKey: keyof T; // Key that will be displayed in the dropdown
}

export default function AsyncSingleAutocomplete<T>(
  props: AsyncAutocompleteProps<T>
) {
  const {
    options,
    value,
    loading,
    fullWidth,
    error,
    disabled,
    searchDelay = 300,
    optionsMaxHeight = 250,
    onChange,
    onSearch,
    onFetchOptions,
    placeHolder,
    displayKey
  } = props;

  const [formatValidationSearchText, setFormatValidationSearchText] = useState<
    string | null
  >(null);
  const [open, setOpen] = useState(false);

  const debouncedFormatValidationSearchText = useDebouncedText(
    formatValidationSearchText || "",
    searchDelay
  );

  useEffect(() => {
    if (!isNull(formatValidationSearchText)) {
      onSearch(debouncedFormatValidationSearchText.trim());
    }
  }, [debouncedFormatValidationSearchText]);

  return (
    <Autocomplete
      fullWidth={fullWidth}
      loading={loading}
      open={open}
      onOpen={(e) => setOpen(true)}
      onClose={(e) => setOpen(false)}
      // freeSolo
      clearOnBlur
      // TODO: should update onInputChange as below when MUI issue fixed.
      // onInputChange={(_, __, reason) => reason === 'clear' && onSearchFormatValidation()}
      onInputChange={(_, inputValue, reason) =>
        (reason === "clear" || (reason === "reset" && isEmpty(inputValue))) &&
        onSearch()
      }
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          placeholder={placeHolder}
          helperText={error}
          onChange={(e) => setFormatValidationSearchText(e.target.value)}
          // InputProps={{
          //   ...params.InputProps,
          //   endAdornment: (
          //     <>
          //       {loading ? (
          //         <Tooltip title="Fetching options">
          //           <CircularProgress color="inherit" size={20} />
          //         </Tooltip>
          //       ) : (
          //         <InputAdornment position="end">
          //           <ArrowDropDownIcon
          //             onClick={(e) => setOpen(!open)}
          //             style={{
          //               transform: open ? "rotate(180deg)" : "none",
          //               color: "#A5ACBA",
          //             }}
          //           />
          //         </InputAdornment>
          //       )}
          //       {params.InputProps.endAdornment}
          //     </>
          //   ),
          // }}
        />
      )}
      options={options}
      ListboxProps={{
        onScroll: (event: React.SyntheticEvent) => {
          const listBoxNode = event.currentTarget;
          if (
            Math.abs(
              listBoxNode.scrollHeight -
                (listBoxNode.scrollTop + listBoxNode.clientHeight)
            ) <= 1
          ) {
            onFetchOptions();
          }
        },
        style: {
          maxHeight: `${optionsMaxHeight}px`,
        },
      }}
      disabled={disabled}
      value={value}
      getOptionLabel={(option) => {
        // Type assertion to ensure `option` is of type `T`
        return String((option as any)[displayKey]) || "";  // Handle as `any` for dynamic property access
      }}
      isOptionEqualToValue={(option, optionValue) =>
        option === optionValue
      }
      
      onChange={(_, newValue) =>
        onChange(typeof newValue === "string" ? null : newValue)
      }
      size="small"
    />
  );
}
