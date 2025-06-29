"use client"
import React, { useRef, useEffect, useState } from 'react';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
  ChartData,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { formatValue } from '@/lib/utils';
import { chartColors } from './chartjs-config';
import { useTheme } from 'next-themes';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

export const LineChartHomePurchase = ({
  data,
  width,
  height
}: {data: ChartData, width: number, height: number}) => {

  const [chart, setChart] = useState<Chart | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';  
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;  

  useEffect(() => {
    const ctx = canvas.current as HTMLCanvasElement;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            max: 109000,
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatValue(value as number),
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY',
              unit: 'month',
              displayFormats: {
                month: 'MMM YY',
              },
            },
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
              color: darkMode ? textColor.dark : textColor.light,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => '', // Disable tooltip title
              label: (context) => formatValue(context.parsed.y),
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
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.scales!.x!.ticks!.color = textColor.dark;
      chart.options.scales!.y!.ticks!.color = textColor.dark;
      chart.options.scales!.y!.grid!.color = gridColor.dark;
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales!.x!.ticks!.color = textColor.light;
      chart.options.scales!.y!.ticks!.color = textColor.light;
      chart.options.scales!.y!.grid!.color = gridColor.light;
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.light;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.light;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [theme]);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex flex-wrap justify-between items-end gap-y-2 gap-x-4">
          <div className="flex items-start">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$109,000</div>
          </div>
        </div>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}