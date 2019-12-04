
import React, { useState, useEffect } from 'react';
import { Box, RangeSelector, Stack, Text } from 'grommet';

const RangeSlider = (props) => {

  let { value, onChange, name } = props

  const [sliderValue, setSliderValue] = useState(value)

  useEffect(() => {
    setSliderValue(value)
  }, [value])

  const adjustValues = (newValue) => {
    const ageGroups = [
      {
        value: 0,
        label: "0"
      },
      {
        value: 5,
        label: "5"
      },
      {
        value: 10,
        label: "10"
      },
      {
        value: 15,
        label: "15"
      },
      {
        value: 17,
        label: "17"
      },
      {
        value: 19,
        label: "19"
      },
      {
        value: 20,
        label: "20"
      },
      {
        value: 21,
        label: "21"
      },
      {
        value: 24,
        label: "24"
      },
      {
        value: 30,
        label: "30"
      },
      {
        value: 34,
        label: "34"
      },
      {
        value: 39,
        label: "39"
      },
      {
        value: 44,
        label: "44"
      },
      {
        value: 54,
        label: "54"
      },
      {
        value: 59,
        label: "59"
      }
    ];
    var ageDistance = {};
    var counter = 0;
    ageGroups.forEach(function (arrayItem) {
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
        {[0, 10, 20, 30, 40, 50, 60, 70, 85, 100].map(value => (
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
        max={100}
        size='full'
        round='small'
        values={sliderValue || [0, 5]}
        onChange={nextValues => adjustValues(nextValues)} //this.setState({ values: nextValues })
      />
    </Stack >
  )
}
export default RangeSlider