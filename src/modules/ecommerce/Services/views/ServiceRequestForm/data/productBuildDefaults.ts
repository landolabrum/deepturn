export  const defaultProductBuild:any = {
  usage:{
    description:'Select the primary use for your backup system',
    data:[
      { type: "radio",label: 'Residential', name:'usage', value: 'residential',checked:false },
      { type: "radio",label: 'Commercial', name:'usage', value: 'commercial',checked:false },
      { type: "radio", label: 'Off-Grid', name:'usage', value: 'offgrid',checked:false },
    ],
  },
  build:{
    description:'',
    data: [
      { name:"refrigerator", label:"refrigerator",type:"checkbox",checked: false, value: 6 },
      { type: "checkbox",name:"freezer", label:"freezer",checked: false, value: 6 },
      { type: "checkbox", name:"tv", label:"tv",checked: false, value: 2 },
      { type: "checkbox", name:"dishwasher", label:"dishwasher",checked: false, value: 15 },
      { type: "checkbox", name:"space-heater", label:"space heater",checked: false, value: 15 },
      { type: "checkbox", name:"microwave", label:"microwave",checked: false, value: 10 },
      { type: "checkbox", name:"washing-machine", label:"washing machine",checked: false, value: 10 },
      { type: "checkbox", name:"dryer", label:"dryer",checked: false, value: 30 },
      { type: "checkbox", name:"oven", label:"oven",checked: false, value: 20 },
      { type: "checkbox", name:"air-conditioner", label:"air conditioner",checked: false, value: 15 },
      { type: "checkbox", name:"mini-split", label:"mini-split",checked: false, value: 20 },
      { type: "checkbox", name:"vacuum-cleaner", label:"vacuum cleaner",checked: false, value: 11 },
      { type: "checkbox", name:"toaster", label:"toaster",checked: false, value: 9 },
      { type: "checkbox", name:"blender", label:"blender",checked: false, value: 6 },
      { type: "checkbox", name:"coffee-maker", label:"coffee maker",checked: false, value: 10 },
      { type: "checkbox", name:"electric-kettle", label:"electric kettle",checked: false, value: 13 },
      { type: "checkbox", name:"hair-dryer", label:"hair dryer",checked: false, value: 13 },
      { type: "checkbox", name:"iron", label:"iron",checked: false, value: 10 },
      { type: "checkbox", name:"fan", label:"fan",checked: false, value: 3 },
      { type: "checkbox", name:"stove-top", label:"stove top",checked: false, value: 15 },
      { type: "checkbox", name:"air-fryer", label:"air fryer",checked: false, value: 15 },
      { type: "checkbox", name:"other", label:"other",checked: false, value: 10 },
    ],
  }
   
  };