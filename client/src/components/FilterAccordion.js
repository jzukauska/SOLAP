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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RangeSlider from "./RangeSlider";
import { capitalize } from "../helpers/utils";
import Slider from "@material-ui/core/Slider";

import { ageGroups } from "../constants/sliderValues"

import BarGraph from "./BarGraph";

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
          value={value || field.value}
          onChange={e => {
            const yearOptions = field.fieldOptions.find(
              option => option.value === e.target.value
            ).year;
            const fieldOptions = field.fieldOptions.find(
              option => option.value === e.target.value
            );
            const { ["fieldOptions"]: removedKey, ...groupOptions } = field;
            onChange({
              name: e.target.name,
              value: e.target.value,
              yearOptions,
              groupOptions,
              fieldOptions
            });
          }}
        />
      );
    case "rangeSelector":
      return (
        <Box pad="xsmall" background="light-2">
          <Stack>
            <RangeSlider value={value} onChange={onChange} name={field.name} groups={ageGroups} />
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
    <div style={{ padding: "0.5rem" }}>
      <React.Fragment key={field.name}>
        <div>
          {capitalize(field.name)}: {value === 0 ? "Pick a year" : value}
        </div>
        {renderFieldBasedOnType(field, value, onChange)}
      </React.Fragment>
    </div>
  );
};

const YearFilter = ({ field, value, onChange, filterValues }) => {
  const buildYearOptions = () => {
    let yearOptions = [];
    let yearOptionsFormatted = [];
    Object.values(filterValues).forEach(val => {
      if (val.yearOptions) {
        if (yearOptions.length === 0) {
          yearOptions = val.yearOptions;
        } else {
          yearOptions = yearOptions.filter(year =>
            val.yearOptions.includes(year)
          )
        }
      }
    });
    yearOptions.forEach(function (item, index) {
      yearOptionsFormatted.push({ value: item })
    })
    return yearOptionsFormatted;
  };
  return (
    <React.Fragment key={field.name}>
      <div style={{ paddingLeft: "0.5rem" }}>
        <Text style={{}}>
          {capitalize(field.name)}: {value === 0 ? "Pick a year" : value}
        </Text>
        <Slider
        name={field.name}
        value={value}
        valueLabelDisplay="auto"
        onChange={(e, newValue) => onChange({ name: field.name, value: newValue })}
        min={1999}
        max={2020}
        defaultValue={2000}
        marks={buildYearOptions()}
        step={null}
      />
      </div>
    </React.Fragment>
  );
};

const FilterAccordion = ({
  filterFields,
  filterValues,
  handleInputChange,
  tab
}) => {
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
      if (field.name === "MultiVarible Tab") {
        return (
          <Tabs
            value={tab.currentTab}
            onChange={tab.changeTab}
            indicatorColor="primary"
            textColor="primary"
            aria-label="variable tabs"
          >
            <Tab
              label="Variable 1"
              key="variable1"
              style={{ backgroundColor: "#EAF0CE" }}
            />
            <Tab
              label="Variable 2"
              key="variable2"
              style={{ backgroundColor: "#9AD1D4" }}
            />
          </Tabs>
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
