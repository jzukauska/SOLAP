import React from "react";
import {
  Accordion,
  AccordionPanel,
  Box,
  RangeInput,
  Select,
  RadioButtonGroup,
  Text,
  RangeSelector,
  Stack,
  CheckBox,
  TextInput
} from "grommet";

import RangeSlider from './RangeSlider'
import { capitalize } from "../helpers/utils";

const renderFieldBasedOnType = (field, value, onChange) => {
  switch (field.type) {
    case "textInput":
      return (
        <TextInput
          name={field.name}
          placeholder={field.placeholder}
          value={value}
        //onChange={onChange}
        />
      );
    case "range":
      return (
        <RangeInput
          name={field.name}
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={e =>
            onChange({ name: e.target.name, value: e.target.value })
          }
        />
      );
    case "select":
      return (
        <Select
          name={field.name}
          placeholder={field.placeholder}
          options={field.fieldOptions}
          value={value}
          onChange={e => onChange({ name: e.target.name, value: e.option })}
        />
      );
    case "radio":
      return (
        <RadioButtonGroup
          name={field.name}
          options={field.fieldOptions}
          value={value}
          onChange={e => {
            const yearOptions = field.fieldOptions.find(
              option => option.value === e.target.value
            ).year;
            onChange({
              name: e.target.name,
              value: e.target.value,
              yearOptions
            });
          }}
        />
      );
    case "rangeSelector":
      return (
        <Box pad="xsmall" background="light-2">
          <Stack>
            <RangeSlider value={value} onChange={onChange} name={field.name} />
          </Stack>
        </Box>
      );
    case "checkBox":
      return (
        <CheckBox
          name={field.name}
          checked={value}
          onChange={e =>
            onChange({ name: e.target.name, value: e.target.value })
          }
        />
      );
    default:
      throw new Error(`${field.type} is not a supported field type`);
  }
};

const Filter = ({ field, value, onChange }) => {
  return (
    <React.Fragment key={field.name}>
      <div>
        {capitalize(field.name)}: {value === 0 ? "Pick a year" : value}
      </div>
      {renderFieldBasedOnType(field, value, onChange)}
    </React.Fragment>
  );
};

const YearFilter = ({ field, value, onChange, filterValues }) => {
  const buildYearOptions = () => {
    let yearOptions = [];
    Object.values(filterValues).forEach(val => {
      if (val.yearOptions) {
        if (yearOptions.length === 0) {
          yearOptions = val.yearOptions;
        } else {
          yearOptions = yearOptions.filter(year =>
            val.yearOptions.includes(year)
          );
        }
      }
    });
    return yearOptions;
  };
  return (
    <React.Fragment key={field.name}>
      <Text>
        {capitalize(field.name)}: {value === 0 ? "Pick a year" : value}
      </Text>
      <Select
        name={field.name}
        placeholder={field.placeholder}
        options={buildYearOptions()}
        value={value}
        onChange={e => onChange({ name: e.target.name, value: e.option })}
      />
    </React.Fragment>
  );
};

const FilterAccordion = ({ filterFields, filterValues, handleInputChange }) => {
  return filterFields.map(field => {
    // Base case for recursive component
    if (!field.options) {
      // Doesn't evaluate to boolean
      const value = filterValues[field.name] && filterValues[field.name].value;
      if (field.name === "Time Period") {
        return (
          <YearFilter
            key={field.name}
            field={field}
            value={value}
            onChange={handleInputChange}
            filterValues={filterValues}
          />
        );
      }
      return (
        <Filter
          key={field.name}
          field={field}
          value={value}
          onChange={handleInputChange}
        />
      );
    } else {
      // Add an accordion and recursively call this component again
      return (
        <Accordion key={field.name}>
          <AccordionPanel key={field.name} label={capitalize(field.name)}>
            <Box pad="xsmall" background="light-2">
              <FilterAccordion
                filterFields={field.options}
                filterValues={filterValues}
                handleInputChange={handleInputChange}
              />
            </Box>
          </AccordionPanel>
        </Accordion>
      );
    }
  });
};

export default FilterAccordion;
