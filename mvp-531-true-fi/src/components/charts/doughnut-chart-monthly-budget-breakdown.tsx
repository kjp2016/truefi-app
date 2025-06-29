"use client"
import React, { useRef, useEffect, useState } from 'react';
import { chartColors } from './chartjs-config';
import {
  Chart, DoughnutController, ArcElement, TimeScale, Tooltip,
  ChartData,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { formatValue, tailwindConfig } from '@/lib/utils';
import { useTheme } from 'next-themes';

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip);

export const DoughnutChartMonthlyBudgetBreakdown = ({
  data,
  width,
  height
}: {data: ChartData, width: number, height: number}) => {

  const [chart, setChart] = useState<Chart | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const legend = useRef<HTMLUListElement | null>(null);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';  
  const { tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

  useEffect(() => {
    const ctx = canvas.current as HTMLCanvasElement;
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        ...(Chart.defaults['doughnut']), 
        cutout: '80%',
        layout: {
          padding: 24,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => '', // Disable tooltip title
              label: (context) => `${context.label}: ${formatValue(context.parsed)}`,
            },
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
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
              li.style.margin = tailwindConfig().theme.margin[1];
              // Button element
              const button = document.createElement('button');
              button.classList.add('btn-xs', 'text-gray-500', 'dark:text-gray-400', 'flex', 'items-center');
              button.style.opacity = item.hidden ? '.3' : '';
              button.onclick = () => {
                c.toggleDataVisibility(item.index!);
                c.update();
              };
              // Color box
              const box = document.createElement('span');
              box.style.display = 'block';
              box.style.width = tailwindConfig().theme.width[2];
              box.style.height = tailwindConfig().theme.height[2];
              box.style.backgroundColor = item.fillStyle as string;
              box.style.borderRadius = tailwindConfig().theme.borderRadius.sm;
              box.style.marginRight = tailwindConfig().theme.margin[1];
              box.style.pointerEvents = 'none';
              // Label
              const label = document.createElement('span');
              label.style.display = 'flex';
              label.style.alignItems = 'center';
              const labelText = document.createTextNode(item.text);
              label.appendChild(labelText);
              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(label);
              ul.appendChild(li);
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
      chart.options.plugins!.tooltip!.titleColor = tooltipTitleColor.dark;
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins!.tooltip!.titleColor = tooltipTitleColor.light;
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
      <div className="px-5 pt-2 pb-6">
        <ul ref={legend} className="flex flex-wrap justify-center -m-1"></ul>
      </div>
    </div>
  );
}