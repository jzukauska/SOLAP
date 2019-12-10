
import React from 'react';
import { Box, RangeSelector, Stack, Text } from 'grommet';

const RangeSlider = (props) => {

  let { value, onChange, name, groups } = props

  const propGroups = groups || [{
    value: 0,
    label: "0"
  }]

  const adjustValues = (newValue) => {

    var ageDistance = {};
    var counter = 0;
    propGroups.forEach(function (arrayItem) {
      var varDistance1 = arrayItem.value - newValue[1];
      var varDistance2 = arrayItem.value - newValue[0];
      ageDistance[counter] = {
        ageGroup: arrayItem.value,
        distance1: varDistance1,
        distance2: varDistance2
      };
      counter = counter + 1;
    });
    var aDistance = 1000;
    var bDistance = 1000;
    var maxCategory = newValue[1];
    var minCategory = newValue[0];
    Object.keys(ageDistance).forEach(function (key) {
      var ageObj = ageDistance[key];
      var itemDistance1 = Math.abs(ageObj.distance1);
      var itemDistance2 = Math.abs(ageObj.distance2);
      if (itemDistance1 < aDistance) {
        aDistance = itemDistance1;
        minCategory = ageObj.ageGroup;
      }
      if (itemDistance2 < bDistance) {

        bDistance = itemDistance2;
        maxCategory = ageObj.ageGroup;
      }

    });

    onChange({ value: [maxCategory, minCategory], name })
  }

  return (
    <Stack >
      <Box direction='row' justify='between'>
        {[0, 10, 20, 30, 40, 50, 60, 70, 85].map(value => (
          <Box key={value} pad='small' border={false}>
            <Text style={{ fontFamily: 'monospace' }}>{value}</Text>
          </Box>
        ))}
      </Box>
      <RangeSelector
        name="helloworld"
        direction='horizontal'
        invert={false}
        min={0}
        max={85}
        size='full'
        round='small'
        values={value || [0, 25]}
        onChange={nextValues => adjustValues(nextValues)} //this.setState({ values: nextValues })
      />
    </Stack >
  )
}
export default RangeSlider