import React from 'react'
import {Line,Doughnut} from 'react-chartjs-2'

import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  Filler,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  plugins,
  scales
} from "chart.js";
import { purple,orange, purplelight,orangelight } from '../layout/constants/color';
import { getlast7days } from '../../lib/features';

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  Filler,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive : true,
  plugins:{
    legend:{
      display : false,
    },
    title : {
      display : false,
    }
  },

  scales : {
    x : {
      grid : {
        display : false,
      },
    },
    y : {
       beginAtZero : true,
      grid :{
        display : false,
      },
    },
  },
};

const labels = getlast7days();

const  LineChart = ({value=[]}) => {

  const data = {
    labels,
    datasets : [{
      label : "Revenue",
      data : value,
      fill : true,
      borderColor : purple,
      backgroundColor : purplelight,
    } 
  ]
  }

  return <Line data={data} options={lineChartOptions} />
}


const doughnutchartOptions = {
  responsive : true,
  plugins:{
    legend:{
      display : false,
    },
  
  },
  cutout: 120

}

const DoughnutChart = ({value=[],labels}) => {

  const data = {
    labels,
    datasets : [{
      data : value,

       backgroundColor : [purplelight,orangelight],
        hoverBackgroundColor : [purple,orange],
        borderColor : [purple,orange],
        offset : 40
    }]
  }

  return <Doughnut style={{zIndex : 10}} data={data} options={doughnutchartOptions} />
}

export {LineChart,DoughnutChart}

