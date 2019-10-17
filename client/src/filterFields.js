const filterFields = [
  {
    name: 'Boundary',
    options: [
      {
        name: 'year',
        min: 2000,
        max: 2010,
        step: 1,
        type: 'range'
      },
      {
        name: 'area',
        type: 'select',
        placeholder: 'Select an area',
        fieldOptions: ['National', 'States', 'PUMAs/Country groups']
      }
    ]
  },
  {
    name: 'population',
    options: [
      {
        name: 'demographic',
        options: [
          {
            name: 'populationBySex',
            type: 'radio',
            fieldOptions: ['Total Females', 'Total Males']
          },
          {
            name: 'populationByAge',
            type: 'rangeSelector',
            min: 0,
            max: 80
          },
          {
            name: 'MartialStatus',
            type: 'select',
            placeholder: 'Select a martial status',
            fieldOptions: ['Married', 'Single', 'Widowed', 'Divorced']
          }
        ]
      }
    ]
  }
]

export default filterFields
