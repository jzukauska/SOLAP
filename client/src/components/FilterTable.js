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
          if (obj !== null && name !== "Time Period" && name !== "Geographic Unit") {
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
