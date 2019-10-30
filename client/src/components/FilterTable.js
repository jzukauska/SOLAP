import React from 'react'

import { Box } from 'grommet'
import { SwatchesPicker } from 'react-color'
import {
  DropButton,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button
} from 'grommet'

const FilterTable = ({
  filterValues,
  handleColorChange,
  clearFilter
}) => {

  return (
    <Table>
      <TableBody>
        {Object.entries(filterValues).map(([name, obj]) => {
          if (obj !== null) {
            return (
              <TableRow key={name}>
                <TableCell scope="row">{obj.value}</TableCell>
                <TableCell scope="row">
                  <DropButton
                    label="Settings"
                    dropContent={
                      <Box pad="small">
                        <Box direction="row" justify="between" align="center">
                          <Heading level={4} margin="small">
                            Edit Symbology for {name}
                          </Heading>
                        </Box>
                        <Box direction="row" justify="between" align="center">
                        </Box>
                        < SwatchesPicker color={obj.colors} onChangeComplete={(e) => handleColorChange(name, e)} />
                      </Box>
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button label="X" hidden
                    onClick={() => clearFilter(name)}
                  />
                </TableCell>
              </TableRow>)
          }
          else
            return (
              null
            )
        })}
      </TableBody>

    </Table>
  )
}

export default FilterTable
