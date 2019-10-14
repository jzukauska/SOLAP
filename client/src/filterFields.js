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
            type: 'radio',
            fieldOptions: ['0-18', '19-26', '26-49', '50+']
          }
        ]
      }
    ]
  }
]

export default filterFields
