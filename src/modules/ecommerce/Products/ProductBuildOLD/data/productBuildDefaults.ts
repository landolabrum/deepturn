export  const defaultProductBuild:any = {
  usage:{
    description:'Select the primary use for your backup system',
    data:[
      { label: 'Residential', name:'usage', value: 'residential',checked:false },
      { label: 'Commercial', name:'usage', value: 'commercial',checked:false },
      { label: 'Off-Grid', name:'usage', value: 'offgrid',checked:false },
    ],
  },
  build:{
    description:'',
    data: [
      { name:"refrigerator", label:"refrigerator",type:"checkbox",checked: false, value: 6 },
      { name:"freezer", label:"freezer",checked: false, value: 6 },
      { name:"tv", label:"tv",checked: false, value: 2 },
      { name:"dishwasher", label:"dishwasher",checked: false, value: 15 },
      { name:"space-heater", label:"space heater",checked: false, value: 15 },
      { name:"microwave", label:"microwave",checked: false, value: 10 },
      { name:"washing-machine", label:"washing machine",checked: false, value: 10 },
      { name:"dryer", label:"dryer",checked: false, value: 30 },
      { name:"oven", label:"oven",checked: false, value: 20 },
      { name:"air-conditioner", label:"air conditioner",checked: false, value: 15 },
      { name:"mini-split", label:"mini-split",checked: false, value: 20 },
      { name:"vacuum-cleaner", label:"vacuum cleaner",checked: false, value: 11 },
      { name:"toaster", label:"toaster",checked: false, value: 9 },
      { name:"blender", label:"blender",checked: false, value: 6 },
      { name:"coffee-maker", label:"coffee maker",checked: false, value: 10 },
      { name:"electric-kettle", label:"electric kettle",checked: false, value: 13 },
      { name:"hair-dryer", label:"hair dryer",checked: false, value: 13 },
      { name:"iron", label:"iron",checked: false, value: 10 },
      { name:"fan", label:"fan",checked: false, value: 3 },
      { name:"stove-top", label:"stove top",checked: false, value: 15 },
      { name:"air-fryer", label:"air fryer",checked: false, value: 15 },
      { name:"other", label:"other",checked: false, value: 10 },
    ],
  }
   
  };