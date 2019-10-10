import React from 'react'
import {
  Accordion,
  AccordionPanel,
  Box,
  RangeInput,
  Select,
  RadioButtonGroup,
  Text
} from 'grommet'

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
          onChange={onChange}
        />
      )
    case 'select':
      return (
        <Select
          name={field.name}
          placeholder={field.placeholder}
          options={field.selectOptions}
          value={value}
          onChange={onChange}
        />
      )
    case 'radio':
      return (
        <RadioButtonGroup
          name={field.name}
          options={field.radioOptions}
          value={value}
          onChange={onChange}
        />
      )
    default:
      throw new Error(`${field.type} is not a supported field type`)
  }
}

const formatName = name => name.charAt(0).toUpperCase() + name.slice(1)

const Filter = ({ field, value, onChange }) => {
  return (
    <React.Fragment key={field.name}>
      <Text>
        {formatName(field.name)}: {value === 0 ? 'Pick a year' : value}
      </Text>
      {renderFieldBasedOnType(field, value, onChange)}
    </React.Fragment>
  )
}

const FilterAccordion = ({ filterFields, filterValues, handleInputChange }) => {
  return filterFields.map(field => {
    // Base case for recursive component
    if (!field.options) {
      const value = filterValues[field.name]
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
          <AccordionPanel key={field.name} label={formatName(field.name)}>
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
