
import React from 'react';
import { Box, RangeSelector, Stack, Text } from 'grommet';

const RangeSlider = (props) => {

  let { value, onChange, name } = props


  const adjustValues = (newValue) => {
    const ageGroups = [
      {
        value: 0,
        label: "0",
        field: "person_under_5_years"
      },
      {
        value: 5,
        label: "5",
        field: "person_5_to_9_years"
      },
      {
        value: 10,
        label: "10",
        field: "person_10_to_14_years"
      },
      {
        value: 15,
        label: "15",
        field: "person_15_to_17_years"

      },
      {
        value: 18,
        label: "18",
        field: "person_18_and_19_years"

      },
      {
        value: 20,
        label: "20",
        field: "person_20_years"
      },
      {
        value: 21,
        label: "21",
        field: "person_21_years"
      },
      {
        value: 22,
        label: "22",
        field: "person_22_to_24_years"
      },
      {
        value: 25,
        label: "25",
        field: "person_25_to_29_years"
      },
      {
        value: 30,
        label: "30",
        field: "person_30_to_34_years"
      },
      {
        value: 35,
        label: "35",
        field: "person_35_to_44_years"
      },
      {
        value: 45,
        label: "45",
        field: "person_45_to_54_years"
      },
      {
        value: 55,
        label: "55",
        field: "person_55_to_59_years"
      },
      {
        value: 60,
        label: "60",
        field: "person_60_to_61_years"
      },
      {
        value: 62,
        label: "62",
        field: "person_62_to_64_years"
      },
      {
        value: 65,
        lable: "65",
        field: "person_65_to_74_years"
      },
      {
        value: 75,
        lable: "75",
        field: "person_75_to_84_years"
      },
      {
        value: 85,
        lable: "85",
        field: "person_85_years_and_over" 
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
        values={value || [0, 5]}
        onChange={nextValues => adjustValues(nextValues)} //this.setState({ values: nextValues })
      />
    </Stack >
  )
}
export default RangeSlider