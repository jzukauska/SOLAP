import React, {useState} from 'react'

import { Box } from 'grommet'
import {Accordion,  Button, Text, AccordionPanel, RadioButtonGroup, RangeSelector, Stack, Select, RangeInput} from 'grommet'
import styled from 'styled-components'
import FilterTable from './FilterTable'

const StyledFilter = styled(Box)`
  overflow: auto;
`
const MapFilter = () => {


const [sexInput, setSexValue] = useState("")
const [values, setValues] = useState([0, 5])
const [areaInput, setAreaValue] = useState()
const [yearInput, setYearValue] = useState("2000")
const [agricultureTypeInput, setAgTypeValue] = useState("")
const [cerealInput, setCerealValue] = useState("")

const initialFormState = {id: null, val: ''}
const [data, setData] = useState(initialFormState)


const addTableData = data => {
  data.id = tblData.length +1
  setTblData([...tblData, data])
}

const deleteData = id =>{
  setTblData(tblData.filter(data=> data.id !== id))
}

const handleInputChange = event =>{
  const { val, value} = event.target
  setData({...data, [val]: value})
  addTableData(data)
  setData(initialFormState)
}

const tableData=[
  {id: 1, val: 'ex'},
  {id: 2, val: 'ex2'}
]

const [tblData, setTblData] = useState(tableData)


  return (
  //<StyledFilter pad="medium">Filter</StyledFilter>
  <div>
   <FilterTable tblData={tblData} deleteData = {deleteData}/>
    <Box pad="xsmall" background="light-2">
    <Text>{sexInput} </Text>
        
    </Box>
    
  <div>
<Accordion>

<AccordionPanel label="Boundaries">
    <Box pad="xsmall" background="light-2">
    <Text>Year: {yearInput} </Text>
  
    <RangeInput
      min = {2000}
      max = {2010}
      step = {10}
      value={data.val}
      onChange={handleInputChange}
    />
    <Text>Area</Text>
    <Select
      options={['National', 'States', 'PUMAs/Country groups']}
      value={data.val}
      onChange={handleInputChange}
      placeholder = "Select an Area"
    />
    </Box>
  </AccordionPanel>
  <AccordionPanel label="Population Data">
    <Box pad="xsmall" background="light-2">
    <Accordion>
  <Accordion>
  <AccordionPanel label="Demographic">
    <Box pad="xsmall" background="light-2">
      <Accordion>
    <AccordionPanel label="Population by Sex">
      <Box pad="xsmall" background="light-2">
          <RadioButtonGroup
          name="doc"
          options={['Total Females', 'Total Males']}
          value={sexInput}
          onChange ={ event  => setSexValue(event.target.value)}
        />
      </Box>
    </AccordionPanel>
    <AccordionPanel label="Population by Age">
      <Box pad="xsmall" background="light-2">
      <Stack>
      <Box direction="row" justify="between">
        {[0, 15, 30, 45, 60, 75].map(value => (
          <Box key={value} pad="xsmall" border={false}>
            <Text style={{ fontFamily: 'monospace' }}>
              {value}
            </Text>
          </Box>
        ))}
      </Box>
      <RangeSelector
        direction="horizontal"
        invert={false}
        min={0}
        max={80}
        size="full"
        round="small"
        step = {5}
        values={values}
        onChange ={ values  => setValues(values)}
      />
    </Stack>
      </Box>
    </AccordionPanel>
</Accordion>
    </Box>
  </AccordionPanel>
  <AccordionPanel label="Education">
    <Box pad="xxsmall" background="light-2">
      <Text>Education Placeholder</Text>
    </Box>
  </AccordionPanel>
  <AccordionPanel label="Employment">
    <Box pad="xxsmall" background="light-2">
      <Text>Employment Placeholder</Text>
    </Box>
  </AccordionPanel>
</Accordion>
</Accordion>
    </Box>
  </AccordionPanel>
  <AccordionPanel label="Environmental Data">
    <Box pad="xsmall" background="light-2">
    <Accordion>
  <AccordionPanel label="Agriculture">
    <Box pad="xsmall" background="light-2">
    <RadioButtonGroup
          name="doc"
          options={['Harvested Yield', 'Harvested Area']}
          value={agricultureTypeInput}
          onChange ={ event  => setAgTypeValue(event.target.value)}
        />
        <Accordion>
  <AccordionPanel label="Cereals">
    <Box pad="xsmall" background="light-2">
    <Select
      options={['Barley', 'Buckwheat', 'Canary Seed', 'Cereals', 'Fonio', 'Maize']}
      value={cerealInput}
      onChange={({ option }) => setCerealValue(option)}
      placeholder = "Select a Cereal"
    />
    </Box>
  </AccordionPanel>
  <AccordionPanel label="Fibers">
    <Box pad="xsmall" background="light-2">
      <Text>Fibers Placeholder</Text>
    </Box>
  </AccordionPanel>
</Accordion>
    </Box>
  </AccordionPanel>
  <AccordionPanel label="Land Cover">
    <Box pad="xsmall" background="light-2">
      <Text>Land Cover Placeholder</Text>
    </Box>
  </AccordionPanel>
</Accordion>
    </Box>
  </AccordionPanel>
</Accordion>
</div>

<Box
  background='light'
  pad='large'
  ustify='center'
  align='center'
  direction='row'
>
   <Button
      label = "Update Map"
      onClick={() => this.setState({ })}
    />
</Box>
</div>
  )
}

export default MapFilter
