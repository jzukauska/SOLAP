const filterFields = [
    {
    name: 'population',
    options: [
      {
        name: 'demographic',
        options: [
          {
            name: 'totalPopulation',
            type: 'checkBox'
          },
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
  },
  {
    name: 'Health',
    options:[

    ]
  },
  {
    name: 'Income',
    options:[
      
    ]
  },
  {

    name: 'Time Period',
    type: 'select',
    placeholder: 'Select Available Time Period',
    fieldOptions: ['2000', '2005', '2010']
  },


  {
    name: 'Geographic Area',
    type: 'select',
    placeholder: 'Select a Geographic Area',
    fieldOptions: ['National', 'States', 'PUMAs/Country groups']
  }
]

export default filterFields
