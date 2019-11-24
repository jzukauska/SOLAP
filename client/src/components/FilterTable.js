import React from 'react'
import {
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
            return (
              <TableRow key={name}>
                <TableCell scope="row">{obj.value}</TableCell>
                <TableCell>
                  <Button label="X" hidden
                    onClick={() => clearFilter(name)}
                  />
                </TableCell>
              </TableRow>)
          }
            )
        }
      </TableBody>

    </Table>
  )
}

export default FilterTable
