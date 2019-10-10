import React, { useState } from 'react'

import { Box } from 'grommet'
import {
  DropButton,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Select
} from 'grommet'

const FilterTable = ({ tblData, deleteData, filterData }) => {
  const [value, setValue] = useState('')

  // filterData.map(data => {
  // then map over data.options
  // check if value !== null
  // return value
  // else return null
  // })

  return (
    <Table>
      <TableBody>
        {tblData.length > 0 ? (
          tblData.map(data => (
            <TableRow key={data.id}>
              <TableCell scope="row">{data.val}</TableCell>
              <TableCell scope="row">
                <DropButton
                  label="Settings"
                  dropContent={
                    <Box pad="small">
                      <Box direction="row" justify="between" align="center">
                        <Heading level={4} margin="small">
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
              <TableCell>
                <Button label="X" hidden onClick={() => deleteData(data.id)} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow></TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default FilterTable
