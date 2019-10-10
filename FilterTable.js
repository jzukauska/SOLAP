import React, {useState} from 'react'

import { Box } from 'grommet'
import {DropButton, Heading, Table, TableBody, TableCell, TableRow, Button, Text, AccordionPanel, RadioButtonGroup, RangeSelector, Stack, Select, RangeInput} from 'grommet'

const FilterTable = props => {

  const [value, setValue] = useState('');

  return(
    <Table>
    <TableBody>
    {props.tblData.length > 0? (
            props.tblData.map(data=>(
      <TableRow key = {data.id}>
        <TableCell scope="row">
        {data.val}
        </TableCell>
        <TableCell scope="row">
        <DropButton
          label='Settings'
          dropContent={
            <Box pad='small'>
              <Box direction='row' justify='between' align='center'>
                <Heading level={4} margin='small'>
                  Edit Symbology
                </Heading>
              </Box>
              <Select
              options={['color 1', 'color 2', 'color 3']}
              value={value}
              onChange={({ option }) => setValue(option)}
            />
            </Box>
          }
          />
        </TableCell>
        <TableCell><Button
       
    label="X"
    hidden = "true"
    onClick={() => props.deleteData(data.id)}
  /></TableCell>
      </TableRow>
      ))):(
      <TableRow>
        
      </TableRow>
      )}
    </TableBody>
  </Table>
)}

export default FilterTable