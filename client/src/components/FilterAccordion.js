import React from 'react'
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
  CheckBox
} from 'grommet'

import { capitalize } from '../helpers/utils'

const renderFieldBasedOnType = (field, value, onChange) => {
  switch (field.type) {
    case 'range':
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
      )
    case 'select':
      return (
        <Select
          name={field.name}
          placeholder={field.placeholder}
          options={field.fieldOptions}
          value={value}
          onChange={e => onChange({ name: e.target.name, value: e.option })}
        />
      )
    case 'radio':
      return (
        <RadioButtonGroup
          name={field.name}
          options={field.fieldOptions}
          value={value}
          onChange={e =>{
            const yearOptions = field.fieldOptions.find(
                option => option.value === e.target.value
              ).year
              console.log(yearOptions, e.target.value)
            onChange({
              name: e.target.name,
              value: e.target.value,
              yearOptions
            })
          }
          }
        />
      )
    case 'rangeSelector':
      return (
        <Box pad="xsmall" background="light-2">
          <Stack>
            <Box direction="row" justify="between">
              {[0, 15, 30, 45, 60, 75].map(val => (
                <Box key={val} pad="xsmall" border={false}>
                  <Text style={{ fontFamily: 'monospace' }}>{val}</Text>
                </Box>
              ))}
            </Box>
            <RangeSelector
              name={field.name}
              min={field.min}
              max={field.max}
              step={field.step}
              size="full"
              round="small"
              values={value || [0, 5]}
              onChange={numArr => onChange({ value: numArr, name: field.name })}
            />
          </Stack>
        </Box>
      )
    case 'checkBox':
      return (
        <CheckBox
          name={field.name}
          checked={value}
          onChange={e =>
            onChange({ name: e.target.name, value: e.target.value })
          }
        />
      )
    default:
      throw new Error(`${field.type} is not a supported field type`)
  }
}

const Filter = ({ field, value, onChange }) => {
  return (
    <React.Fragment key={field.name}>
      <Text>
        {capitalize(field.name)}: {value === 0 ? 'Pick a year' : value}
      </Text>
      {renderFieldBasedOnType(field, value, onChange)}
    </React.Fragment>
  )
}

const YearFilter = ({field, value, onChange, filterValues}) => {
  const buildYearOptions = () => {
    
    return Object.values(filterValues).reduce((arr, val) => {
      if (arr.length === 0) return val.year
      return arr.filter(year => !val.year.includes(year))
    }, [])

  }
  return (
    <React.Fragment key={field.name}>
      <Text>
        {capitalize(field.name)}: {value === 0 ? 'Pick a year' : value}
      </Text>
      <Select
         name={field.name}
          placeholder={field.placeholder}
          options={buildYearOptions()}
          value={value}
          onChange={onChange}
        />
    </React.Fragment>
  )
}

const FilterAccordion = ({ filterFields, filterValues, handleInputChange }) => {
  console.log(filterValues)
  return filterFields.map(field => {
    // Base case for recursive component
    if (!field.options) {
      // Doesn't evaluate to boolean
      const value = filterValues[field.name] && filterValues[field.name].value
      if (field.name === "Time Period") {
        return (
        <YearFilter
        key={field.name}
        field={field}
        value={value}
        onChange={handleInputChange}
        filterValues={filterValues}
      />
      )}
      return (
        <Filter
          key={field.name}
          field={field}
          value={value}
          onChange={handleInputChange}
        />
      )
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
      )
    }
  })
}

export default FilterAccordion
