"use client"
import React, { useRef, useEffect, useState } from 'react';
import { chartColors } from './chartjs-config';
import {
  Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend,
  ChartData,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { tailwindConfig } from '@/lib/utils';
import { useTheme } from 'next-themes';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export const  BarChart = ({
  data,
  width,
  height
}: {data: ChartData, width: number, height: number}) => {

  const [chart, setChart] = useState<Chart | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const legend = useRef<HTMLUListElement | null>(null);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';  
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;   

  useEffect(() => {

    // Calculate sum of values
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const values = data.datasets.map(x => x.data.reduce(reducer));
    const max = values.reduce(reducer) as number;

    const ctx = canvas.current as HTMLCanvasElement;
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        layout: {
          padding: {
            top: 12,
            bottom: 12,
            left: 20,
            right: 20,
          },
        },
        scales: {
          x: {
            stacked: true,
            display: false,
            max: max,
          },
          y: {
            stacked: true,
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => '', // Disable tooltip title
              label: (context) => context.parsed.x.toString(),
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: {
          duration: 500,
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: 'htmlLegend',
          afterUpdate(c) {
            const ul = legend.current;
            if (!ul) return;
            // Remove old legend items
            while (ul.firstChild) {
              ul.firstChild.remove();
            }
            // Reuse the built-in legendItems generator
            const items = c.options.plugins!.legend!.labels!.generateLabels!(c);
            items.forEach((item) => {
              const li = document.createElement('li');
              li.style.display = 'flex';
              li.style.justifyContent = 'space-between';
              li.style.alignItems = 'center';
              li.style.paddingTop = tailwindConfig().theme.padding[2.5];
              li.style.paddingBottom = tailwindConfig().theme.padding[2.5];
              const wrapper = document.createElement('div');
              wrapper.style.display = 'flex';
              wrapper.style.alignItems = 'center';
              const box = document.createElement('div');
              box.style.width = tailwindConfig().theme.width[3];
              box.style.height = tailwindConfig().theme.width[3];
              box.style.borderRadius = tailwindConfig().theme.borderRadius.sm;
              box.style.marginRight = tailwindConfig().theme.margin[3];
              box.style.backgroundColor = item.fillStyle as string;
              const label = document.createElement('div');
              const value = document.createElement('div');
              value.style.fontWeight = tailwindConfig().theme.fontWeight.medium;
              value.style.marginLeft = tailwindConfig().theme.margin[3];
              value.style.color = item.text === 'Other' ? tailwindConfig().theme.colors.gray[400] : item.fillStyle as string;
              // const theValue = c.data.datasets[item.datasetIndex].data.reduce((a, b) => a + b, 0);
              const theValue = c.data.datasets[item.datasetIndex].data
                .filter((value): value is number => typeof value === "number")
                .reduce((a, b) => a + b, 0);
              // const valueText = document.createTextNode(`${parseInt((theValue / max) * 100)}%`);
              const valueText = document.createTextNode(`${parseInt(String((Number(theValue) / Number(max)) * 100))}%`);             
              const labelText = document.createTextNode(item.text);
              value.appendChild(valueText);
              label.appendChild(labelText);
              ul.appendChild(li);
              li.appendChild(wrapper);
              li.appendChild(value);
              wrapper.appendChild(box);
              wrapper.appendChild(label);
            });
          },
        },
      ],
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.light;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.light;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [theme]);  

  return (
    <div className="grow flex flex-col justify-center">
      <div>
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-5 pt-2 pb-2">
        <ul ref={legend} className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60"></ul>
        <ul className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60"></ul>
      </div>
    </div>
  );
}